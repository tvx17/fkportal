<template>
  <q-list dense>
    <q-item-label header> NT: Modules </q-item-label>
    <q-item clickable v-ripple @click="onSelectModule('findDocuments')">
      <q-item-section avatar>
        <q-icon name="fa-solid fa-magnifying-glass-plus" />
      </q-item-section>
      <q-item-section> NT: Find new documents </q-item-section>
    </q-item>
    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="fa-solid fa-plus" />
      </q-item-section>
      <q-item-section> NT: Add document </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="onSelectModule('displayDocuments')">
      <q-item-section avatar>
        <q-icon name="fa-solid fa-eye" />
      </q-item-section>
      <q-item-section> NT: Display </q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="onSelectModule('admin')">
      <q-item-section avatar>
        <q-icon name="fa-solid fa-screwdriver-wrench" />
      </q-item-section>
      <q-item-section> NT: Admin </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import Core from 'src/core';

function onSelectModule(module: string) {
  Core.Stores.useGuiStore().leftDrawerOpen = false;
  Core.Stores.useGuiStore().rightDrawerOpen = false;
  switch (module) {
    case 'findDocuments':
      Core.Stores.useDocumentsStore().setModule('findDocuments');
      Core.Stores.useAppStore().addModuleName('NT: Find new documents');
      break;
    case 'displayDocuments':
      Core.Stores.useDocumentsStore().setModule('displayDocuments');
      Core.Stores.useAppStore().addModuleName('NT: Display');
      break;
    case 'admin':
      Core.Stores.useDocumentsStore().setModule('admin');
      Core.Stores.useAppStore().addModuleName('NT: Admin');
      break;
  }
}
</script>

<style lang="scss"></style>
