<template>
  <q-card v-if="documents.length > 0">
    <q-card-section>
      <q-toolbar>
        <q-toolbar-title>NT: Documents failed to add</q-toolbar-title>
        <q-space />
        <q-btn dense unelevated icon="fa-solid fa-xmark" @click="emits('igonre-failed-documents')">
          <q-tooltip>NT: ignore failed documents</q-tooltip>
        </q-btn>
        <q-btn dense unelevated icon="fa-solid fa-repeat" @click="emits('retry-selected')">
          <q-tooltip>NT: retry failed documents</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-card-section>
    <q-card-section>
      <q-list dense>
        <q-item v-for="document in documents" :key="document.file_name">
          <q-item-section avatar> <q-checkbox v-model="document.checked" dense /></q-item-section>
          <q-item-section>
            <q-item-label>{{ document.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
interface DocumentItem {
  file_name: string;
  title: string;
  checked: boolean;
}

const emits = defineEmits(['igonre-failed-documents', 'retry-selected']);

const documents = defineModel<DocumentItem[]>({ default: () => [] });
</script>
