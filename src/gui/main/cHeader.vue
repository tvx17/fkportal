<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="guiStore.leftDrawerOpen = !guiStore.leftDrawerOpen"
      />

      <q-toolbar-title>{{ appStore.currentAppName }}</q-toolbar-title>

      <q-btn
        flat
        dense
        round
        icon="fa-solid fa-ellipsis-vertical"
        @click="guiStore.rightDrawerOpen = !guiStore.rightDrawerOpen"
        v-if="appStore.hasOptions"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import Core from 'src/core';

const appStore = Core.Stores.useAppStore();
const guiStore = Core.Stores.useGuiStore();
</script>
