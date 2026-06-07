<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>{{ t('documents.title') }}</q-toolbar-title>
      <q-space />
      <q-btn flat dense icon="fa-solid fa-magnifying-glass-plus" @click="m.onFindNewDocuments">
        <q-tooltip>{{ t('documents.findNewDocuments') }}</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="fa-solid fa-plus">
        <q-tooltip>{{ t('documents.addDocument') }}</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="fa-solid fa-filter">
        <q-tooltip>{{ t('documents.filterDocuments') }}</q-tooltip>
      </q-btn>
      <q-btn flat dense icon="fa-solid fa-magnifying-glass">
        <q-tooltip>{{ t('documents.searchDocuments') }}</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-separator />
    <q-toolbar v-if="r.documents.value.length > 0">
      <q-toolbar-title
        >NT: New found documents ({{ r.documents.value.length }} items)</q-toolbar-title
      >
      <q-space />
      <q-btn icon="fa-regular fa-square-check" unelevated dense @click="m.onSelectAll">
        <q-tooltip>{{ t('documents.selectAll') }}</q-tooltip>
      </q-btn>
      <q-btn icon="fa-regular fa-square" unelevated dense @click="m.onSelectNone">
        <q-tooltip>{{ t('documents.selectNone') }}</q-tooltip>
      </q-btn>
      <q-btn icon="fa-solid fa-plus" unelevated dense @click="m.onAddSelected">
        <q-tooltip>{{ t('documents.addSelected') }}</q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-separator />
    <q-list v-if="r.documents.value.length > 0" dense>
      <q-item v-for="document in r.documents.value" :key="document.file_name">
        <q-item-section avatar> <q-checkbox v-model="document.checked" dense /></q-item-section>
        <q-item-section>
          <q-item-label>{{ document.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/composables/useComponentI18n';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

useComponentI18n('documents');

const { t } = useI18n();

const r = {
  documents: ref([]),
};

const m = {
  onAddSelected() {
    const selectedDocuments = r.documents.value
      .filter((doc) => doc.checked)
      .map((doc) => doc.relative_path);
    api
      .post('/documents/add', { documents: selectedDocuments })
      .then((response) => {
        console.log('Documents added successfully:', response.data);
        r.documents.value = [];
      })
      .catch((error) => {
        console.error('Error adding documents:', error);
      });
  },
  onSelectAll() {
    r.documents.value.forEach((doc) => (doc.checked = true));
  },
  onSelectNone() {
    r.documents.value.forEach((doc) => (doc.checked = false));
  },
  onFindNewDocuments() {
    console.log('Find new documents');
    api
      .get('/documents/findNew')
      .then((response) => {
        console.log('New documents:', response.data);
        r.documents.value = response.data.documents;
        console.log('Updated documents list:', r.documents.value);
      })
      .catch((error) => {
        console.error('Error fetching new documents:', error);
      });
  },
};
</script>
