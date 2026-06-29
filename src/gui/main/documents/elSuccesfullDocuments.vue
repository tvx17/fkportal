<template>
  <q-card v-if="documents.length > 0">
    <q-card-section>
      <q-toolbar>
        <q-toolbar-title>NT: Documents successfully added</q-toolbar-title>
        <q-space />
        <q-btn dense unelevated icon="fa-solid fa-check" @click="emits('clear-succesfully-added')">
          <q-tooltip>NT: clear successful documents</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-card-section>

    <q-card-section>
      <q-list dense>
        <q-item v-for="document in documents" :key="document.file_name">
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

const emits = defineEmits(['clear-succesfully-added']);

const documents = defineModel<DocumentItem[]>({ default: () => [] });
</script>
