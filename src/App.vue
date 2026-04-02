<template>
  <div class="min-h-screen">
    <router-view />
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import Toast from './components/Toast.vue'

const toastRef = ref(null)

function showToast(message, type = 'success') {
  toastRef.value?.show(message, type)
}

provide('toast', showToast)
</script>
