<template>
  <q-page class="q-pa-md">
    <component :is="sDocuments.currentModule" />
  </q-page>
</template>

<script setup lang="ts">
//import { useI18n } from 'vue-i18n';
//import { useComponentI18n } from 'src/core/composables/useComponentI18n';
import { onMounted } from 'vue';
import Core from 'src/core';

//useComponentI18n('documents');

//const { t } = useI18n();

const sApp = Core.Stores.useAppStore();
const sDocuments = Core.Stores.useDocumentsStore();
const sGui = Core.Stores.useGuiStore();

onMounted(() => {
  sApp.setApp('documents');
  sGui.leftDrawerOpen = false;
  sGui.rightDrawerOpen = true;
});
</script>
