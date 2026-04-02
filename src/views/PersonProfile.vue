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
            <div>
              <h1 class="font-serif text-3xl font-bold text-warm-900">{{ person.name }}</h1>
              <p class="text-warm-500 mt-1">
                <span v-if="person.birthDate">Born {{ formatDate(person.birthDate) }}</span>
                <span v-else class="italic">Date unknown</span>
              </p>
            </div>
          </div>
        </div>

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
import { computed } from 'vue'
import { useFamilyStore } from '../store/family'

const props = defineProps({
  id: { type: String, required: true },
})

const store = useFamilyStore()

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
</script>
