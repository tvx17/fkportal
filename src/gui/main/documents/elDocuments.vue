<template>
  <q-card v-if="documents.length > 0">
    <q-card-section>
      <q-toolbar>
        <q-toolbar-title> NT: New found documents ({{ documents.length }} items) </q-toolbar-title>
        <q-space />
        <q-btn icon="fa-solid fa-plus" unelevated dense @click="emits('add-selected')">
          <q-tooltip>NT: Add selected documents</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-card-section>

    <q-card-section>
      <q-list dense>
        <q-item>
          <q-item-section avatar>
            <q-checkbox v-model="selectAll" dense>
              <q-tooltip>
                <span>{{ selectAll ? 'NT: Deselect all' : 'NT: Select all' }}</span>
              </q-tooltip>
            </q-checkbox>
          </q-item-section>
        </q-item>

        <q-item v-for="document in documents" :key="document.file_name">
          <q-item-section avatar>
            <q-checkbox v-model="document.checked" dense />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ document.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface DocumentItem {
  file_name: string;
  title: string;
  checked: boolean;
}

const emits = defineEmits(['add-selected']);

const documents = defineModel<DocumentItem[]>({ default: () => [] });

const selectAll = computed({
  get() {
    return documents.value.length > 0 && documents.value.every((doc) => doc.checked);
  },
  set(value: boolean) {
    documents.value.forEach((doc) => {
      doc.checked = value;
    });
  },
});
</script>
