<template>
  <div class="relative group/card" :data-person-id="person.id">
    <router-link
      :to="`/person/${person.id}`"
      class="group block bg-white rounded-xl border border-warm-200 px-4 py-3 hover:shadow-md hover:border-warm-300 transition-all w-44"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center shrink-0 group-hover:bg-warm-200 transition-colors">
          <span class="font-serif text-sm font-semibold text-warm-600">
            {{ person.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div class="min-w-0">
          <h3 class="font-serif text-sm font-semibold text-warm-900 truncate">
            {{ person.name }}
          </h3>
          <p class="text-xs text-warm-500 mt-0.5 truncate">
            {{ person.birthDate || 'Date unknown' }}
          </p>
        </div>
      </div>
    </router-link>

    <!-- Action buttons (visible on hover) -->
    <div class="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
      <router-link
        :to="`/edit/${person.id}`"
        class="w-7 h-7 rounded-full bg-warm-700 text-white flex items-center justify-center hover:bg-warm-800 transition-colors shadow-sm"
        @click.stop
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </router-link>
      <button
        @click.stop="showDeleteConfirm = true"
        class="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Delete confirmation modal -->
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
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useFamilyStore } from '../store/family'

const props = defineProps({
  person: { type: Object, required: true },
})

const store = useFamilyStore()
const toast = inject('toast')
const showDeleteConfirm = ref(false)

function confirmDelete() {
  const name = props.person.name
  store.deletePerson(props.person.id)
  showDeleteConfirm.value = false
  toast(`${name} deleted.`)
}
</script>
