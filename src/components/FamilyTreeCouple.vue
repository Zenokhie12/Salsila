<template>
  <div class="flex items-center gap-2">
    <FamilyTreePersonCard v-if="father" :person="father" />
    <FamilyTreePersonCard v-if="mother" :person="mother" />
    <div v-if="!father && !mother" class="w-44 h-16 rounded-xl border border-dashed border-warm-300 flex items-center justify-center">
      <span class="text-xs text-warm-400">Unknown</span>
    </div>
  </div>
</template>

<script setup>
import FamilyTreePersonCard from './FamilyTreePersonCard.vue'

defineProps({
  father: { type: Object, default: null },
  mother: { type: Object, default: null },
})
</script>
