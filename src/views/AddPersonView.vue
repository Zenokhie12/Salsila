<template>
  <div class="min-h-screen bg-cream py-10 px-4">
    <div class="max-w-xl mx-auto">
      <router-link
        to="/"
        class="inline-flex items-center gap-1 text-warm-500 hover:text-warm-700 text-sm mb-8 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </router-link>

      <div class="bg-white rounded-2xl border border-warm-200 p-8 shadow-sm">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 class="font-serif text-xl text-warm-800 mb-1">
            {{ isEditing ? 'Edit Member' : (step === 1 ? 'What is their name?' : 'When were they born?') }}
          </h2>
          <p class="text-sm text-warm-500">
            {{ isEditing ? 'Update the details below.' : (step === 1 ? 'Enter the full name of the family member.' : 'This is optional — skip if unknown.') }}
          </p>
        </div>

        <!-- Edit mode: show both fields -->
        <div v-if="isEditing">
          <label class="block text-sm font-medium text-warm-700 mb-2">Full Name *</label>
          <input
            ref="nameInput"
            v-model="name"
            type="text"
            placeholder="e.g. Ahmad bin Abdullah"
            class="w-full px-4 py-3 rounded-lg border border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition"
          />
          <p v-if="nameError" class="text-red-500 text-sm mt-2">Name is required.</p>

          <label class="block text-sm font-medium text-warm-700 mb-2 mt-4">Birth Date</label>
          <input
            v-model="birthDate"
            type="date"
            class="w-full px-4 py-3 rounded-lg border border-warm-300 bg-warm-50 text-warm-900 focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition"
          />

          <button
            @click="save"
            class="mt-6 w-full bg-warm-800 text-cream py-3 rounded-lg font-medium hover:bg-warm-900 transition-colors"
          >
            Save Changes
          </button>
        </div>

        <!-- Step 1: Name -->
        <div v-else-if="step === 1">
          <label class="block text-sm font-medium text-warm-700 mb-2">Full Name *</label>
          <input
            ref="nameInput"
            v-model="name"
            type="text"
            placeholder="e.g. Ahmad bin Abdullah"
            class="w-full px-4 py-3 rounded-lg border border-warm-300 bg-warm-50 text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition"
            @keydown.enter="nextStep"
          />
          <p v-if="nameError" class="text-red-500 text-sm mt-2">Name is required.</p>
          <button
            @click="nextStep"
            class="mt-6 w-full bg-warm-800 text-cream py-3 rounded-lg font-medium hover:bg-warm-900 transition-colors"
          >
            Continue
          </button>
        </div>

        <!-- Step 2: Birth Date -->
        <div v-if="step === 2">
          <label class="block text-sm font-medium text-warm-700 mb-2">Birth Date</label>
          <input
            v-model="birthDate"
            type="date"
            class="w-full px-4 py-3 rounded-lg border border-warm-300 bg-warm-50 text-warm-900 focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition"
          />
          <div class="flex gap-3 mt-6">
            <button
              @click="skipBirthDate"
              class="flex-1 py-3 rounded-lg border border-warm-300 text-warm-600 font-medium hover:bg-warm-100 transition-colors"
            >
              I don't know
            </button>
            <button
              @click="save"
              class="flex-1 bg-warm-800 text-cream py-3 rounded-lg font-medium hover:bg-warm-900 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '../store/family'

const props = defineProps({
  linkTo: { type: String, default: null },
  relationType: { type: String, default: null },
  id: { type: String, default: null },
})

const isEditing = computed(() => !!props.id)

const router = useRouter()
const store = useFamilyStore()
const toast = inject('toast')

const step = ref(1)
const name = ref('')
const birthDate = ref('')
const nameError = ref(false)
const nameInput = ref(null)

onMounted(() => {
  if (isEditing.value) {
    const person = store.getPersonById(props.id)
    if (person) {
      name.value = person.name
      birthDate.value = person.birthDate || ''
    }
    step.value = 2 // Show both fields for editing
  }
  nameInput.value?.focus()
})

function nextStep() {
  if (!name.value.trim()) {
    nameError.value = true
    return
  }
  nameError.value = false
  step.value = 2
}

function skipBirthDate() {
  birthDate.value = ''
  save()
}

function save() {
  if (!name.value.trim()) {
    step.value = 1
    nameError.value = true
    return
  }

  if (isEditing.value) {
    store.updatePerson(props.id, {
      name: name.value.trim(),
      birthDate: birthDate.value || null,
    })
    toast('Member updated!')
    router.push(`/person/${props.id}`)
    return
  }

  const person = store.addPerson({
    name: name.value.trim(),
    birthDate: birthDate.value || null,
  })

  if (props.linkTo && props.relationType) {
    store.linkRelative(props.linkTo, person.id, props.relationType)
    toast(`${person.name} linked as ${props.relationType}!`)
    router.push(`/person/${props.linkTo}`)
  } else {
    toast(`${person.name} added to your family tree!`)
    router.push(`/person/${person.id}`)
  }
}
</script>
