<template>
  <div class="relative overflow-x-auto pb-8">
    <div ref="treeContainer" class="relative flex flex-col items-center gap-16 min-w-max px-8">
      <div v-for="(gen, genIndex) in generations" :key="genIndex" class="generation-row flex items-start justify-center gap-8 relative" :data-gen="genIndex">
        <div v-for="(unit, unitIndex) in gen" :key="unit.id" class="family-unit flex flex-col items-center" :data-unit-id="unit.id">
          <div class="parents flex items-center relative" :data-parent-id="unit.id">
            <FamilyTreePersonCard v-if="unit.father" :person="unit.father" />
            <div v-if="!unit.father && unit.mother" class="w-44 h-16 rounded-xl border border-dashed border-warm-300 flex items-center justify-center">
              <span class="text-xs text-warm-400">Unknown</span>
            </div>
            <div v-if="unit.father && unit.mother" class="w-4 h-0.5 bg-warm-300 shrink-0"></div>
            <div v-if="!unit.father && unit.mother" class="w-4 h-0.5 bg-warm-300 shrink-0"></div>
            <FamilyTreePersonCard v-if="unit.mother" :person="unit.mother" />
            <div v-if="unit.mother && !unit.father" class="w-44 h-16 rounded-xl border border-dashed border-warm-300 flex items-center justify-center">
              <span class="text-xs text-warm-400">Unknown</span>
            </div>
            <FamilyTreePersonCard v-if="!unit.father && !unit.mother && unit.solo" :person="unit.solo" />
          </div>
        </div>
      </div>
      <svg v-if="lines.length > 0" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
        <path v-for="(line, i) in lines" :key="i" :d="line.d" fill="none" stroke="#C9C0AD" stroke-width="1.5" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue"
import { useFamilyStore } from "../store/family"
import FamilyTreePersonCard from "./FamilyTreePersonCard.vue"

const store = useFamilyStore()
const people = computed(() => store.people)
const treeContainer = ref(null)
const lines = ref([])

function buildFamilyUnits(allPeople) {
  const personMap = new Map()
  allPeople.forEach(p => personMap.set(p.id, p))

  // Group children by parent pair
  const coupleChildren = new Map()
  // Track all children per person
  const personChildren = new Map()

  allPeople.forEach(p => {
    if (p.fatherId || p.motherId) {
      const fk = p.fatherId || "__unknown__"
      const mk = p.motherId || "__unknown__"
      const ck = [fk, mk].sort().join("|")
      if (!coupleChildren.has(ck)) {
        coupleChildren.set(ck, { fatherId: p.fatherId, motherId: p.motherId, children: [] })
      }
      const c = coupleChildren.get(ck)
      if (!c.children.includes(p.id)) c.children.push(p.id)
      if (p.fatherId) {
        if (!personChildren.has(p.fatherId)) personChildren.set(p.fatherId, new Set())
        personChildren.get(p.fatherId).add(p.id)
      }
      if (p.motherId) {
        if (!personChildren.has(p.motherId)) personChildren.set(p.motherId, new Set())
        personChildren.get(p.motherId).add(p.id)
      }
    }
  })

  // Build units - process ALL people once
  const units = []
  const assignedAsParent = new Set()
  const assignedAsChild = new Set()
  let cid = 0

  allPeople.forEach(p => {
    if (assignedAsParent.has(p.id)) return

    const childIds = personChildren.has(p.id)
      ? Array.from(personChildren.get(p.id))
      : []

    if (childIds.length === 0) {
      // Leaf person - solo unit, no children
      if (!assignedAsChild.has(p.id)) {
        units.push({
          id: "unit-" + cid++,
          father: null, mother: null, solo: p,
          children: [],
          parentIds: [p.id],
        })
        assignedAsParent.add(p.id)
      }
      return
    }

    // Check if any child has a complete couple (both parents exist in system)
    let partnerId = null
    for (const cid2 of childIds) {
      const child = personMap.get(cid2)
      if (!child) continue
      const otherParentId = child.fatherId === p.id ? child.motherId : child.fatherId
      if (otherParentId && personMap.has(otherParentId)) {
        partnerId = otherParentId
        break
      }
    }

    if (partnerId && !assignedAsParent.has(partnerId)) {
      // Couple unit
      const father = p.fatherId !== undefined && p.id !== partnerId ? null : p
      // Determine who is father and who is mother from the children
      let fatherPerson = null
      let motherPerson = null
      for (const cid2 of childIds) {
        const child = personMap.get(cid2)
        if (!child) continue
        if (child.fatherId && child.motherId && personMap.has(child.fatherId) && personMap.has(child.motherId)) {
          fatherPerson = personMap.get(child.fatherId)
          motherPerson = personMap.get(child.motherId)
          break
        }
      }

      if (fatherPerson && motherPerson) {
        // Get children that belong to this couple
        const ck = [fatherPerson.id, motherPerson.id].sort().join("|")
        const coupleData = coupleChildren.get(ck)
        const coupleChildIds = coupleData ? coupleData.children : []
        const ch = coupleChildIds.map(id => personMap.get(id)).filter(Boolean)

        units.push({
          id: "unit-" + cid++,
          father: fatherPerson,
          mother: motherPerson,
          solo: null,
          children: ch,
          parentIds: [fatherPerson.id, motherPerson.id],
        })
        assignedAsParent.add(fatherPerson.id)
        assignedAsParent.add(motherPerson.id)
        ch.forEach(c => assignedAsChild.add(c.id))
      }
    } else {
      // Solo parent unit - only include children not in a complete couple
      const validChildren = childIds.filter(cid2 => {
        const child = personMap.get(cid2)
        if (!child) return false
        if (child.fatherId && child.motherId &&
            personMap.has(child.fatherId) && personMap.has(child.motherId)) {
          return false // child has both parents, will be in a couple unit
        }
        return true
      })

      const ch = validChildren.map(id => personMap.get(id)).filter(Boolean)
      units.push({
        id: "unit-" + cid++,
        father: null, mother: null, solo: p,
        children: ch,
        parentIds: [p.id],
      })
      assignedAsParent.add(p.id)
      ch.forEach(c => assignedAsChild.add(c.id))
    }
  })

  return units
}

function assignGenerations(units, allPeople) {
  const personMap = new Map()
  allPeople.forEach(p => personMap.set(p.id, p))
  const personGen = new Map()

  const roots = allPeople.filter(p => {
    const hf = p.fatherId && personMap.has(p.fatherId)
    const hm = p.motherId && personMap.has(p.motherId)
    return !hf && !hm
  })

  const queue = roots.map(p => ({ person: p, gen: 0 }))
  const visited = new Set()
  while (queue.length > 0) {
    const { person, gen } = queue.shift()
    if (visited.has(person.id)) continue
    visited.add(person.id)
    if (!personGen.has(person.id) || personGen.get(person.id) < gen) {
      personGen.set(person.id, gen)
    }
    allPeople.forEach(p => {
      if ((p.fatherId === person.id || p.motherId === person.id) && !visited.has(p.id)) {
        queue.push({ person: p, gen: gen + 1 })
      }
    })
  }

  allPeople.forEach(p => {
    if (!personGen.has(p.id)) personGen.set(p.id, 0)
  })

  const unitGen = new Map()
  units.forEach(unit => {
    let gen = 0
    if (unit.father && personGen.has(unit.father.id)) {
      gen = personGen.get(unit.father.id)
    } else if (unit.mother && personGen.has(unit.mother.id)) {
      gen = personGen.get(unit.mother.id)
    } else if (unit.solo && personGen.has(unit.solo.id)) {
      gen = personGen.get(unit.solo.id)
    }
    unitGen.set(unit.id, gen)
  })

  const genMap = new Map()
  units.forEach(unit => {
    const gen = unitGen.get(unit.id) || 0
    if (!genMap.has(gen)) genMap.set(gen, [])
    genMap.get(gen).push(unit)
  })

  return Array.from(genMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([g, u]) => u)
}

const generations = computed(() => {
  if (people.value.length === 0) return []
  const units = buildFamilyUnits(people.value)
  return assignGenerations(units, people.value)
})

function calculateLines() {
  if (!treeContainer.value) return
  const newLines = []
  const container = treeContainer.value
  const containerRect = container.getBoundingClientRect()

  for (let gi = 0; gi < generations.value.length - 1; gi++) {
    const currentGen = generations.value[gi]
    const nextGen = generations.value[gi + 1]

    currentGen.forEach(parentUnit => {
      if (!parentUnit.children || parentUnit.children.length === 0) return
      const parentEl = container.querySelector('[data-parent-id="' + parentUnit.id + '"]')
      if (!parentEl) return
      const parentRect = parentEl.getBoundingClientRect()
      const startX = parentRect.left + parentRect.width / 2 - containerRect.left
      const startY = parentRect.bottom - containerRect.top

      nextGen.forEach(childUnit => {
        const childParentIds = [childUnit.father?.id, childUnit.mother?.id].filter(Boolean)
        const unitChildIds = parentUnit.children.map(c => c.id)
        const isConnected = unitChildIds.some(cid => childParentIds.includes(cid))

        if (isConnected) {
          const childEl = container.querySelector('[data-unit-id="' + childUnit.id + '"] .parents')
          if (!childEl) return
          const childRect = childEl.getBoundingClientRect()
          const endX = childRect.left + childRect.width / 2 - containerRect.left
          const endY = childRect.top - containerRect.top
          const midY = startY + (endY - startY) / 2
          newLines.push({
            d: "M " + startX + " " + startY + " L " + startX + " " + midY + " L " + endX + " " + midY + " L " + endX + " " + endY,
          })
        }
      })
    })
  }
  lines.value = newLines
}

watch(generations, async () => {
  await nextTick()
  await nextTick()
  calculateLines()
}, { immediate: false })

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => { calculateLines() })
}
</script>
