<template>
  <el-succesfull-documents
    v-model="rSuccessDocuments"
    @clear-succesfully-added="onClearSuccesfullyAdded"
  />
  <el-failed-documents
    v-model="rFailedDocuments"
    @igonre-failed-documents="onIgnoreFailedDocuments"
    @retry-selected="onRetrySelected"
  />
  <el-documents v-model="rDocuments" @add-selected="onAddSelected" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Core from 'src/core';

import elDocuments from 'src/gui/main/documents/elDocuments.vue';
import elSuccesfullDocuments from 'src/gui/main/documents/elSuccesfullDocuments.vue';
import elFailedDocuments from 'src/gui/main/documents/elFailedDocuments.vue';

// Interface erweitert, um den Anforderungen der Kindkomponenten zu entsprechen
interface Document {
  checked: boolean;
  relative_path: string;
  file_name: string;
  title: string;
}

const rDocuments = ref<Document[]>([]);
const rFailedDocuments = ref<Document[]>([]);
const rSuccessDocuments = ref<Document[]>([]);

function onClearSuccesfullyAdded() {
  rSuccessDocuments.value = [];
}

function onRetrySelected() {
  rDocuments.value.splice(0, 0, ...rFailedDocuments.value);
  rFailedDocuments.value = [];
}

function onFindNewDocuments() {
  rDocuments.value = [];
  rFailedDocuments.value = [];
  rSuccessDocuments.value = [];
  Core.Gui.Notifies.info('NT: Searching for new documents');
  Core.Api.get('/documents/findNew')
    .then((response) => {
      rDocuments.value = response.data.documents;
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
}

function onIgnoreFailedDocuments() {
  const selectedDocuments = rFailedDocuments.value.flatMap((doc, index) =>
    doc.checked ? [{ index, path: doc.relative_path }] : [],
  );
  rFailedDocuments.value = [];
  Core.Api.post('/documents/ignore', { documents: selectedDocuments })
    .then(() => {
      Core.Gui.Notifies.info('NT: Documents ignored');
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
}

function onAddSelected() {
  rSuccessDocuments.value = [];
  rFailedDocuments.value = [];
  const selectedDocuments = rDocuments.value.flatMap((doc, index) =>
    doc.checked ? [{ index, path: doc.relative_path }] : [],
  );
  Core.Gui.Notifies.info('NT: Adding selected documents');
  Core.Api.post('/documents/add', { documents: selectedDocuments })
    .then((response) => {
      const originalDocs = [...rDocuments.value];
      const results = response.data.results;

      const nextDocuments: Document[] = [];
      const nextSuccess: Document[] = [];
      const nextFailed: Document[] = [];

      // Verwendung von for...of mit entries(), um Index und Objekt sicher zu erhalten
      for (const [index, doc] of originalDocs.entries()) {
        const keyStr = index.toString();

        if (Object.hasOwn(results, keyStr)) {
          if (results[keyStr] === 'Success') {
            nextSuccess.push(doc);
          } else {
            nextFailed.push(doc);
          }
        } else {
          nextDocuments.push(doc);
        }
      }

      rDocuments.value = nextDocuments;
      rSuccessDocuments.value = nextSuccess;
      rFailedDocuments.value = nextFailed;
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
}

onMounted(() => {
  onFindNewDocuments();
});
</script>

<style lang="scss"></style>
