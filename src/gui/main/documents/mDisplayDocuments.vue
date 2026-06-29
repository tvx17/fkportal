<template>
  <c-overview @on-selected="displayDetails" />
  <c-edit @on-close="closeDetails" :id="detailsDocumentId" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import cOverview from 'src/gui/main/documents/cOverview.vue';
import cEdit from 'src/gui/main/documents/cEdit.vue';

const detailsDocumentId = ref(0);

function displayDetails(documentId: number) {
  detailsDocumentId.value = documentId;
}
function closeDetails() {
  detailsDocumentId.value = 0;
}

/*function openFile(row: RowData): void {
  console.log('Datei für:', row);
}*/
</script>

<style lang="scss"></style>
