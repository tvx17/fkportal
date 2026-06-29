<template>
  <q-drawer v-model="guiStore.rightDrawerOpen" bordered side="right">
    <component :is="appStore.rightDrawerModule" v-if="appStore.rightDrawerModule" />
  </q-drawer>
</template>
<script setup lang="ts">
import Core from 'src/core';

//const drawerOpen = defineModel<boolean>({ default: false });

const guiStore = Core.Stores.useGuiStore();
const appStore = Core.Stores.useAppStore();
</script>
