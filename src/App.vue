<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import LegacyPage from './components/LegacyPage.vue';

const pageByPath = {
  '/': 'home',
  '/index.html': 'home',
  '/ayomasak-dapur.html': 'kitchen',
  '/ayomasak-destinasi.html': 'destination',
  '/ayomasak-index-masakan.html': 'recipes',
  '/ayomasak-pengaturan.html': 'settings'
};

const page = ref(pageByPath[window.location.pathname] || 'home');
const storageError = ref('');

function handleHistoryNavigation() {
  page.value = pageByPath[window.location.pathname] || 'home';
}

function handleStorageError(event) {
  storageError.value = event.detail?.message || 'Perubahan data belum tersimpan.';
}

onMounted(() => {
  window.addEventListener('popstate', handleHistoryNavigation);
  window.addEventListener('ayo-storage-error', handleStorageError);
});

onUnmounted(() => {
  window.removeEventListener('popstate', handleHistoryNavigation);
  window.removeEventListener('ayo-storage-error', handleStorageError);
});
</script>

<template>
  <LegacyPage :key="page" :page="page" />
  <p v-if="storageError" class="application-storage-error" role="alert">
    {{ storageError }}
  </p>
</template>

<style>
.application-error,
.application-storage-error{
  position: fixed;
  z-index: 30000;
  left: 50%;
  width: min(92vw, 420px);
  padding: 18px 22px;
  border: 3px solid #78320f;
  border-radius: 18px;
  background: #fff2cf;
  box-shadow: 0 8px 0 #54240f;
  color: #78320f;
  font-family: "Fredoka", system-ui, sans-serif;
  text-align: center;
  transform: translateX(-50%);
}

.application-error{
  top: 50%;
  transform: translate(-50%, -50%);
}

.application-storage-error{
  bottom: max(16px, env(safe-area-inset-bottom));
}
</style>
