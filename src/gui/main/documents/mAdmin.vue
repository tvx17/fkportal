<template>
  <q-btn-toggle
    class="q-ma-sm"
    v-model="action"
    dense
    spread
    push
    toggle-color="primary"
    :options="[
      { label: 'NT: Set imported documents to uploaded', value: 'reset' },
      { label: 'NT: Update sha256', value: 'sha256' },
      { label: 'Update size', value: 'size' },
      { label: 'NT: Find differences', value: 'differences' },
      { label: 'NT: Create a backup', value: 'backup' },
      { label: 'NT: Export from database', value: 'export' },
    ]"
  />

  <q-select
    class="q-ma-sm"
    dense
    label="NT: Folder"
    v-model="folder"
    :options="folders"
    option-label="path"
    option-value="value"
    emit-value
    map-options
  />
  <q-select
    class="q-ma-sm"
    dense
    label="NT: New lifecycle status"
    v-model="lifecycleStatus"
    :options="lifecycleStatuses"
    v-if="action === 'reset'"
    option-label="name"
    option-value="id"
    emit-value
    map-options
  />
  <q-select
    class="q-ma-sm"
    dense
    label="NT: New review status"
    v-model="reviewStatus"
    v-if="action === 'reset'"
    :options="reviewStatuses"
    option-label="name"
    option-value="id"
    emit-value
    map-options
  />

  <q-btn label="NT: Start" class="full-width q-ma-sm" @click="executeAction" dense />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Core from 'src/core';

//import { api } from 'src/boot/axios';
//import notifies from 'src/core/app/notifies';

const defaultLifecycle = 3;
const defaultReview = 3;

const action = ref('reset');
const folder = ref('all');
const folders = ref<unknown[]>([]);
const lifecycleStatus = ref(defaultLifecycle);
const lifecycleStatuses = ref([]);
const reviewStatus = ref(defaultReview);
const reviewStatuses = ref([]);

function executeAction() {
  Core.Api.get('/documents/admin/' + action.value, { params: { path: folder.value } })
    .then((response) => {
      Core.Gui.Notifies.info(
        'NT: Executed action ' + action.value + ' with result: ' + response.data.message,
      );
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
}

function getAvailableFolders() {
  Core.Api.get('/documents/admin/getFolders')
    .then((response) => {
      folders.value = response.data.data;
      folders.value.unshift({ path: 'NT: All documents', value: 'all' });
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
  Core.Api.get('/misc/get/lifecycle_statuses/documents')
    .then((response) => {
      lifecycleStatuses.value = response.data.results;
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
  Core.Api.get('/misc/get/review_statuses/documents')
    .then((response) => {
      reviewStatuses.value = response.data.results;
    })
    .catch((e) => {
      Core.Gui.Notifies.error(e);
    });
}

onMounted(() => {
  getAvailableFolders();
});
</script>

<style lang="scss"></style>
