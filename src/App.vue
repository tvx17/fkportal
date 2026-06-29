<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Core from 'src/core';

onMounted(() => {
  Core.App.startUp().catch((e) => {
    Core.App.Logger.error(e);
  });
});
</script>
