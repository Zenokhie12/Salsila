<template>
  <div class="min-h-screen bg-cream py-10 px-4">
    <div class="max-w-2xl mx-auto">
      <router-link
        to="/"
        class="inline-flex items-center gap-1 text-warm-500 hover:text-warm-700 text-sm mb-8 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        All Members
      </router-link>

      <div v-if="!person" class="text-center py-20">
        <p class="text-warm-500 text-lg">Person not found.</p>
        <router-link to="/" class="text-warm-700 underline mt-4 inline-block">Go home</router-link>
      </div>

<div v-else>
  <!-- Profile Header -->
  <div class="bg-white rounded-2xl border border-warm-200 p-8 shadow-sm mb-6">
    <div class="flex items-center gap-5">
      <div class="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center shrink-0">
        <span class="font-serif text-3xl font-bold text-warm-600">
          {{ person.name.charAt(0).toUpperCase() }}
        </span>
      </div>
      <div class="flex-1">
        <h1 class="font-serif text-3xl font-bold text-warm-900">{{ person.name }}</h1>
        <p class="text-warm-500 mt-1">
          <span v-if="person.birthDate">Born {{ formatDate(person.birthDate) }}</span>
          <span v-else class="italic">Date unknown</span>
        </p>
      </div>
      <div class="flex gap-2">
        <router-link
          :to="`/edit/${person.id}`"
          class="w-10 h-10 rounded-full bg-warm-100 text-warm-600 flex items-center justify-center hover:bg-warm-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </router-link>
        <button
          @click="showDeleteConfirm = true"
          class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <Teleport to="body">
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="showDeleteConfirm = false"></div>
      <div class="relative bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
        <h3 class="font-serif text-lg font-semibold text-warm-900 mb-2">Delete Member</h3>
        <p class="text-sm text-warm-500 mb-6">
          Are you sure you want to delete <strong>{{ person.name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 py-2.5 rounded-lg border border-warm-300 text-warm-600 font-medium hover:bg-warm-100 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Relationships -->
        <div class="space-y-4">
          <!-- Father -->
          <div class="bg-white rounded-xl border border-warm-200 p-5">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-warm-400 mb-3">Father</h3>
            <router-link
              v-if="father"
              :to="`/person/${father.id}`"
              class="flex items-center gap-3 group"
            >
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span class="font-serif text-sm font-semibold text-blue-600">
                  {{ father.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="font-serif font-semibold text-warm-900 group-hover:text-warm-700 transition-colors">
                  {{ father.name }}
                </p>
                <p class="text-xs text-warm-400">{{ father.birthDate || 'Date unknown' }}</p>
              </div>
            </router-link>
            <router-link
              v-else
              :to="`/add/${person.id}/father`"
              class="inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Father
            </router-link>
          </div>

          <!-- Mother -->
          <div class="bg-white rounded-xl border border-warm-200 p-5">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-warm-400 mb-3">Mother</h3>
            <router-link
              v-if="mother"
              :to="`/person/${mother.id}`"
              class="flex items-center gap-3 group"
            >
              <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                <span class="font-serif text-sm font-semibold text-pink-600">
                  {{ mother.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="font-serif font-semibold text-warm-900 group-hover:text-warm-700 transition-colors">
                  {{ mother.name }}
                </p>
                <p class="text-xs text-warm-400">{{ mother.birthDate || 'Date unknown' }}</p>
              </div>
            </router-link>
            <router-link
              v-else
              :to="`/add/${person.id}/mother`"
              class="inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Mother
            </router-link>
          </div>

          <!-- Siblings -->
          <div class="bg-white rounded-xl border border-warm-200 p-5">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-warm-400 mb-3">
              Siblings ({{ siblings.length }})
            </h3>
            <div class="space-y-3">
              <router-link
                v-for="sib in siblings"
                :key="sib.id"
                :to="`/person/${sib.id}`"
                class="flex items-center gap-3 group"
              >
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <span class="font-serif text-sm font-semibold text-green-600">
                    {{ sib.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-serif font-semibold text-warm-900 group-hover:text-warm-700 transition-colors">
                    {{ sib.name }}
                  </p>
                  <p class="text-xs text-warm-400">{{ sib.birthDate || 'Date unknown' }}</p>
                </div>
              </router-link>
            </div>
            <router-link
              :to="`/add/${person.id}/sibling`"
              class="inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition-colors mt-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Sibling
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '../store/family'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const store = useFamilyStore()
const toast = inject('toast')
const showDeleteConfirm = ref(false)

const person = computed(() => store.getPersonById(props.id))
const father = computed(() => (person.value ? store.getFather(person.value) : null))
const mother = computed(() => (person.value ? store.getMother(person.value) : null))
const siblings = computed(() => (person.value ? store.getSiblings(person.value) : []))

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function confirmDelete() {
  const name = person.value.name
  store.deletePerson(person.value.id)
  showDeleteConfirm.value = false
  toast(`${name} deleted.`)
  router.push('/')
}
</script>
