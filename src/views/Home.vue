<template>
  <div class="min-h-screen bg-cream py-10 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="font-serif text-4xl font-bold text-warm-900 mb-2">Salsila</h1>
        <p class="text-warm-600 text-sm tracking-wide">Your Family Tree</p>
      </div>

      <div v-if="people.length === 0" class="text-center py-20">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-warm-200 flex items-center justify-center">
          <svg class="w-10 h-10 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 class="font-serif text-2xl text-warm-800 mb-3">Start Your Family Tree</h2>
        <p class="text-warm-500 mb-8 max-w-sm mx-auto">
          Add your first family member to begin building your genealogy.
        </p>
        <router-link
          to="/add"
          class="inline-flex items-center gap-2 bg-warm-800 text-cream px-6 py-3 rounded-lg font-medium hover:bg-warm-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add First Member
        </router-link>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-8">
          <h2 class="font-serif text-2xl text-warm-800">Family Members</h2>
          <router-link
            to="/add"
            class="inline-flex items-center gap-2 bg-warm-800 text-cream px-4 py-2 rounded-lg text-sm font-medium hover:bg-warm-900 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </router-link>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <router-link
            v-for="person in people"
            :key="person.id"
            :to="`/person/${person.id}`"
            class="group block bg-white rounded-xl border border-warm-200 p-5 hover:shadow-md hover:border-warm-300 transition-all"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center shrink-0 group-hover:bg-warm-200 transition-colors">
                <span class="font-serif text-lg font-semibold text-warm-600">
                  {{ person.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0">
                <h3 class="font-serif text-lg font-semibold text-warm-900 truncate">
                  {{ person.name }}
                </h3>
                <p class="text-sm text-warm-500 mt-0.5">
                  {{ person.birthDate || 'Date unknown' }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFamilyStore } from '../store/family'

const store = useFamilyStore()
const people = computed(() => store.people)
</script>
