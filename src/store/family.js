import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'salsila-family-data'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useFamilyStore = defineStore('family', () => {
  const people = ref(loadFromStorage())

  watch(
    people,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true }
  )

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  function addPerson({ name, birthDate = null, fatherId = null, motherId = null, siblingIds = [] }) {
    const person = {
      id: generateId(),
      name,
      birthDate,
      fatherId,
      motherId,
      siblingIds: [...siblingIds],
    }
    people.value.push(person)
    return person
  }

  function getPersonById(id) {
    return people.value.find((p) => p.id === id) || null
  }

  function linkFather(personId, fatherId) {
    const person = getPersonById(personId)
    if (person) {
      person.fatherId = fatherId
    }
  }

  function linkMother(personId, motherId) {
    const person = getPersonById(personId)
    if (person) {
      person.motherId = motherId
    }
  }

  function linkSibling(personId, siblingId) {
    const person = getPersonById(personId)
    const sibling = getPersonById(siblingId)
    if (person && sibling && personId !== siblingId) {
      if (!person.siblingIds.includes(siblingId)) {
        person.siblingIds.push(siblingId)
      }
      if (!sibling.siblingIds.includes(personId)) {
        sibling.siblingIds.push(personId)
      }
    }
  }

  function linkRelative(personId, relativeId, relationType) {
    switch (relationType) {
      case 'father':
        linkFather(personId, relativeId)
        break
      case 'mother':
        linkMother(personId, relativeId)
        break
      case 'sibling':
        linkSibling(personId, relativeId)
        break
    }
  }

  function getFather(person) {
    return person.fatherId ? getPersonById(person.fatherId) : null
  }

  function getMother(person) {
    return person.motherId ? getPersonById(person.motherId) : null
  }

  function getSiblings(person) {
    return person.siblingIds.map((id) => getPersonById(id)).filter(Boolean)
  }

  return {
    people,
    addPerson,
    getPersonById,
    linkFather,
    linkMother,
    linkSibling,
    linkRelative,
    getFather,
    getMother,
    getSiblings,
  }
})
