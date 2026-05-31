<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import _App from 'src/core/app';

onMounted(() => {
  _App.startUp();
});
</script>
