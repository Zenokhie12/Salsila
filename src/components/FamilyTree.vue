<template>
  <div class="relative overflow-x-auto pb-8">
    <div ref="treeContainer" class="relative flex flex-col items-center gap-6 min-w-max px-8 pb-8">
      <svg v-if="lines.length > 0" class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 0;">
        <path v-for="(line, i) in lines" :key="i" :d="line.d" fill="none" stroke="transparent" stroke-width="1.5" />
      </svg>

      <!-- Great-Grandparents Row -->
      <div v-if="fatherSideGGP.length > 0 || motherSideGGP.length > 0" class="flex items-start gap-8 relative z-[1]">
        <!-- Father's Side -->
        <div v-if="fatherSideGGP.length > 0"
          class="section rounded-2xl p-6 flex flex-col items-center gap-3"
          :style="{ backgroundColor: colors.ggp.bg }"
          data-section="GGP-Father">
          <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.ggp.label }">Great-Grandparents (Father's Side)</span>
          <div class="flex items-center justify-center gap-6">
            <div v-for="person in fatherSideGGP" :key="person.id" class="flex flex-col items-center" data-section-person="GGP-Father">
              <FamilyTreePersonCard :person="person" />
            </div>
          </div>
        </div>
        <!-- Mother's Side -->
        <div v-if="motherSideGGP.length > 0"
          class="section rounded-2xl p-6 flex flex-col items-center gap-3"
          :style="{ backgroundColor: colors.ggp.bg }"
          data-section="GGP-Mother">
          <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.ggp.label }">Great-Grandparents (Mother's Side)</span>
          <div class="flex items-center justify-center gap-6">
            <div v-for="person in motherSideGGP" :key="person.id" class="flex flex-col items-center" data-section-person="GGP-Mother">
              <FamilyTreePersonCard :person="person" />
            </div>
          </div>
        </div>
      </div>

      <!-- Grandparents Row -->
      <div v-if="fatherSideGP.length > 0 || motherSideGP.length > 0" class="flex items-start gap-8 relative z-[1]">
        <!-- Father's Side -->
        <div v-if="fatherSideGP.length > 0"
          class="section rounded-2xl p-6 flex flex-col items-center gap-3"
          :style="{ backgroundColor: colors.gp.bg }"
          data-section="GP-Father">
          <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.gp.label }">Grandparents (Father's Side)</span>
          <div class="flex items-center justify-center gap-6">
            <div v-for="person in fatherSideGP" :key="person.id" class="flex flex-col items-center" data-section-person="GP-Father">
              <FamilyTreePersonCard :person="person" />
            </div>
          </div>
        </div>
        <!-- Mother's Side -->
        <div v-if="motherSideGP.length > 0"
          class="section rounded-2xl p-6 flex flex-col items-center gap-3"
          :style="{ backgroundColor: colors.gp.bg }"
          data-section="GP-Mother">
          <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.gp.label }">Grandparents (Mother's Side)</span>
          <div class="flex items-center justify-center gap-6">
            <div v-for="person in motherSideGP" :key="person.id" class="flex flex-col items-center" data-section-person="GP-Mother">
              <FamilyTreePersonCard :person="person" />
            </div>
          </div>
        </div>
      </div>

      <!-- Parents -->
      <div v-if="parents.length > 0"
        class="section rounded-2xl p-6 flex flex-col items-center gap-3 relative z-[1]"
        :style="{ backgroundColor: colors.parents.bg }"
        data-section="Parents">
        <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.parents.label }">Parents</span>
        <div class="flex items-center justify-center gap-6">
          <div v-for="person in parents" :key="person.id" class="flex flex-col items-center" data-section-person="Parents">
            <FamilyTreePersonCard :person="person" />
          </div>
        </div>
      </div>

      <!-- Center Person -->
      <div v-if="centerPerson"
        class="section rounded-2xl p-8 flex flex-col items-center gap-3 relative z-[1]"
        :style="{ backgroundColor: colors.person.bg }"
        data-section="You">
        <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.person.label }">You</span>
        <FamilyTreePersonCard :person="centerPerson" />
      </div>

      <!-- Siblings -->
      <div v-if="siblings.length > 0"
        class="section rounded-2xl p-6 flex flex-col items-center gap-3 relative z-[1]"
        :style="{ backgroundColor: colors.siblings.bg }"
        data-section="Siblings">
        <span class="text-xs font-semibold uppercase tracking-wider opacity-60" :style="{ color: colors.siblings.label }">Siblings</span>
        <div class="flex items-center justify-center gap-6">
          <div v-for="person in siblings" :key="person.id" class="flex flex-col items-center" data-section-person="Siblings">
            <FamilyTreePersonCard :person="person" />
          </div>
        </div>
      </div>
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

const colors = {
  ggp: { bg: '#FFF3E0', label: '#E65100' },
  gp: { bg: '#FFF8E1', label: '#F9A825' },
  parents: { bg: '#FFFDE7', label: '#FBC02D' },
  person: { bg: '#F5F0E8', label: '#5D4037' },
  siblings: { bg: '#E8F5E9', label: '#2E7D32' },
}

function getPerson(id) {
  return people.value.find(p => p.id === id)
}

function findChildren(personId) {
  return people.value.filter(p => p.fatherId === personId || p.motherId === personId)
}

const centerPerson = computed(() => {
  if (people.value.length === 0) return null
  // Prefer person who has parents
  const withParents = people.value.filter(p => p.fatherId || p.motherId)
  if (withParents.length > 0) return withParents[0]
  return people.value[0]
})

const father = computed(() => {
  if (!centerPerson.value?.fatherId) return null
  return getPerson(centerPerson.value.fatherId)
})

const mother = computed(() => {
  if (!centerPerson.value?.motherId) return null
  return getPerson(centerPerson.value.motherId)
})

const parents = computed(() => {
  return [father.value, mother.value].filter(Boolean)
})

const fatherSideGP = computed(() => {
  if (!father.value) return []
  const gp = []
  if (father.value.fatherId) { const p = getPerson(father.value.fatherId); if (p) gp.push(p) }
  if (father.value.motherId) { const p = getPerson(father.value.motherId); if (p) gp.push(p) }
  return gp
})

const motherSideGP = computed(() => {
  if (!mother.value) return []
  const gp = []
  if (mother.value.fatherId) { const p = getPerson(mother.value.fatherId); if (p) gp.push(p) }
  if (mother.value.motherId) { const p = getPerson(mother.value.motherId); if (p) gp.push(p) }
  return gp
})

const fatherSideGGP = computed(() => {
  const ggp = []
  for (const gp of fatherSideGP.value) {
    if (gp.fatherId) { const p = getPerson(gp.fatherId); if (p) ggp.push(p) }
    if (gp.motherId) { const p = getPerson(gp.motherId); if (p) ggp.push(p) }
  }
  return ggp
})

const motherSideGGP = computed(() => {
  const ggp = []
  for (const gp of motherSideGP.value) {
    if (gp.fatherId) { const p = getPerson(gp.fatherId); if (p) ggp.push(p) }
    if (gp.motherId) { const p = getPerson(gp.motherId); if (p) ggp.push(p) }
  }
  return ggp
})

const siblings = computed(() => {
  if (!centerPerson.value) return []
  const me = centerPerson.value
  return people.value.filter(p => {
    if (p.id === me.id) return false
    // Same father
    if (me.fatherId && p.fatherId && me.fatherId === p.fatherId) return true
    // Same mother
    if (me.motherId && p.motherId && me.motherId === p.motherId) return true
    // Explicit sibling link
    if (me.siblingIds && me.siblingIds.includes(p.id)) return true
    return false
  })
})

function calculateLines() {
  if (!treeContainer.value || !centerPerson.value) return
  const newLines = []
  const container = treeContainer.value
  const containerRect = container.getBoundingClientRect()

  const meEl = container.querySelector('[data-section="You"] [data-person-id]')
  if (!meEl) return
  const meRect = meEl.getBoundingClientRect()
  const meX = meRect.left + meRect.width / 2 - containerRect.left
  const meTop = meRect.top - containerRect.top
  const meBottom = meRect.bottom - containerRect.top

  // Person → Parents
  const parentEls = container.querySelectorAll('[data-section-person="Parents"] [data-person-id]')
  parentEls.forEach(parentEl => {
    const rect = parentEl.getBoundingClientRect()
    const px = rect.left + rect.width / 2 - containerRect.left
    const pBottom = rect.bottom - containerRect.top
    const midY = pBottom + (meTop - pBottom) / 2
    newLines.push({ d: `M ${px} ${pBottom} L ${px} ${midY} L ${meX} ${midY} L ${meX} ${meTop}` })
  })

  // Father's GP → Father
  if (father.value) {
    const fatherEl = container.querySelector('[data-section-person="Parents"] [data-person-id="' + father.value.id + '"]')
    if (fatherEl) {
      const fRect = fatherEl.getBoundingClientRect()
      const fX = fRect.left + fRect.width / 2 - containerRect.left
      const fTop = fRect.top - containerRect.top
      container.querySelectorAll('[data-section-person="GP-Father"] [data-person-id]').forEach(gpEl => {
        const gpRect = gpEl.getBoundingClientRect()
        const gpX = gpRect.left + gpRect.width / 2 - containerRect.left
        const gpBottom = gpRect.bottom - containerRect.top
        const midY = gpBottom + (fTop - gpBottom) / 2
        newLines.push({ d: `M ${gpX} ${gpBottom} L ${gpX} ${midY} L ${fX} ${midY} L ${fX} ${fTop}` })
      })
    }
  }

  // Mother's GP → Mother
  if (mother.value) {
    const motherEl = container.querySelector('[data-section-person="Parents"] [data-person-id="' + mother.value.id + '"]')
    if (motherEl) {
      const mRect = motherEl.getBoundingClientRect()
      const mX = mRect.left + mRect.width / 2 - containerRect.left
      const mTop = mRect.top - containerRect.top
      container.querySelectorAll('[data-section-person="GP-Mother"] [data-person-id]').forEach(gpEl => {
        const gpRect = gpEl.getBoundingClientRect()
        const gpX = gpRect.left + gpRect.width / 2 - containerRect.left
        const gpBottom = gpRect.bottom - containerRect.top
        const midY = gpBottom + (mTop - gpBottom) / 2
        newLines.push({ d: `M ${gpX} ${gpBottom} L ${gpX} ${midY} L ${mX} ${midY} L ${mX} ${mTop}` })
      })
    }
  }

  // Father's GGP → Father's GP
  const gpFatherEls = container.querySelectorAll('[data-section-person="GP-Father"] [data-person-id]')
  const gpFatherMap = new Map()
  gpFatherEls.forEach(el => gpFatherMap.set(el.getAttribute('data-person-id'), el))
  container.querySelectorAll('[data-section-person="GGP-Father"] [data-person-id]').forEach(ggpEl => {
    const ggpRect = ggpEl.getBoundingClientRect()
    const ggpX = ggpRect.left + ggpRect.width / 2 - containerRect.left
    const ggpBottom = ggpRect.bottom - containerRect.top
    const ggpId = ggpEl.getAttribute('data-person-id')
    // Find which GP is the child of this GGP
    for (const [gpId, gpEl] of gpFatherMap) {
      const gp = getPerson(gpId)
      if (gp && (gp.fatherId === ggpId || gp.motherId === ggpId)) {
        const gpRect = gpEl.getBoundingClientRect()
        const gpX = gpRect.left + gpRect.width / 2 - containerRect.left
        const gpTop = gpRect.top - containerRect.top
        const midY = ggpBottom + (gpTop - ggpBottom) / 2
        newLines.push({ d: `M ${ggpX} ${ggpBottom} L ${ggpX} ${midY} L ${gpX} ${midY} L ${gpX} ${gpTop}` })
      }
    }
  })

  // Mother's GGP → Mother's GP
  const gpMotherEls = container.querySelectorAll('[data-section-person="GP-Mother"] [data-person-id]')
  const gpMotherMap = new Map()
  gpMotherEls.forEach(el => gpMotherMap.set(el.getAttribute('data-person-id'), el))
  container.querySelectorAll('[data-section-person="GGP-Mother"] [data-person-id]').forEach(ggpEl => {
    const ggpRect = ggpEl.getBoundingClientRect()
    const ggpX = ggpRect.left + ggpRect.width / 2 - containerRect.left
    const ggpBottom = ggpRect.bottom - containerRect.top
    const ggpId = ggpEl.getAttribute('data-person-id')
    for (const [gpId, gpEl] of gpMotherMap) {
      const gp = getPerson(gpId)
      if (gp && (gp.fatherId === ggpId || gp.motherId === ggpId)) {
        const gpRect = gpEl.getBoundingClientRect()
        const gpX = gpRect.left + gpRect.width / 2 - containerRect.left
        const gpTop = gpRect.top - containerRect.top
        const midY = ggpBottom + (gpTop - ggpBottom) / 2
        newLines.push({ d: `M ${ggpX} ${ggpBottom} L ${ggpX} ${midY} L ${gpX} ${midY} L ${gpX} ${gpTop}` })
      }
    }
  })

  // Siblings
  const siblingEls = container.querySelectorAll('[data-section-person="Siblings"] [data-person-id]')
  if (siblingEls.length > 0) {
    const sibSection = container.querySelector('[data-section="Siblings"]')
    if (sibSection) {
      const sibRect = sibSection.getBoundingClientRect()
      const sibTop = sibRect.top - containerRect.top
      const midY = meBottom + (sibTop - meBottom) / 2

      newLines.push({ d: `M ${meX} ${meBottom} L ${meX} ${midY}` })

      const allXs = Array.from(siblingEls).map(el => {
        const rect = el.getBoundingClientRect()
        return rect.left + rect.width / 2 - containerRect.left
      })
      if (allXs.length > 1) {
        newLines.push({ d: `M ${Math.min(...allXs)} ${midY} L ${Math.max(...allXs)} ${midY}` })
      }

      siblingEls.forEach(el => {
        const rect = el.getBoundingClientRect()
        const sx = rect.left + rect.width / 2 - containerRect.left
        const sTop = rect.top - containerRect.top
        newLines.push({ d: `M ${sx} ${midY} L ${sx} ${sTop}` })
      })
    }
  }

  lines.value = newLines
}

watch([people, centerPerson], async () => {
  await nextTick()
  await nextTick()
  calculateLines()
}, { immediate: true })

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => { calculateLines() })
}
</script>
