<template>
  <div class="mt-4 p-4 rounded-xl border-2 border-dashed bg-warm-50 border-warm-300">
    <div class="flex items-center justify-center gap-2 mb-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-warm-600">Siblings</span>
    </div>
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <FamilyTreePersonCard 
        v-for="person in siblings" 
        :key="person.id" 
        :person="person"
        :current-user-id="currentUserId"
        :show-sibling-toggle="showSiblingToggle"
      />
    </div>
  </div>
</template>

<script setup>
import FamilyTreePersonCard from './FamilyTreePersonCard.vue'

const props = defineProps({
  siblings: { type: Array, required: true },
  currentUserId: { type: String, default: null },
  showSiblingToggle: { type: Boolean, default: true },
})
</script>