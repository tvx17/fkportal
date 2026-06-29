<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="min-width: 75%" v-if="details">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>{{ details.title }}</q-toolbar-title>
          <q-spacer />
          <q-btn label="delete" @click="onCloseDialog" dense />
          <q-btn label="save" @click="onCloseDialog" dense />
          <q-btn label="close" @click="onCloseDialog" dense />
        </q-toolbar>
      </q-card-section>

      <q-card-section>
        <div class="column q-gutter-y-sm">
          <el-input
            v-model="details.title"
            title="NT: Title"
            :document-id="details.id"
            field-name="title"
          />
          <el-editor
            v-model="details.description"
            title="NT Description"
            :document-id="details.id"
            field-name="description"
          />
          <el-view title="NT: Created" :value="details.created" />
          <el-view title="NT: Updated" :value="details.updated" />
          <el-view title="NT: Imported via" :value="details.imported" />
          <el-select
            title="NT: Category"
            v-model="details.category"
            options-source="categories"
            options-restriction="documents"
            :document-id="details.id"
            field-name="misc_category_id"
          />
          <el-select
            title="NT: Type"
            v-model="details.documentType"
            options-source="types"
            options-restriction="documents"
            :document-id="details.id"
            field-name="misc_types_id"
          />
          <el-select
            title="NT: Subtype"
            v-model="details.documentSubtype"
            options-source="types"
            options-restriction="documents"
            :document-id="details.id"
            field-name="misc_subtypes_id"
          />
          <el-select
            title="NT: Lifecycle status"
            v-model="details.lifecycleStatus"
            options-source="lifecycle_statuses"
            options-restriction="documents"
            :document-id="details.id"
            field-name="misc_lifecycle_statuses_id"
          />
          <el-select
            title="NT: Review status"
            v-model="details.reviewStatus"
            options-source="review_statuses"
            options-restriction="documents"
            :document-id="details.id"
            field-name="misc_review_statuses_id"
          />
          <el-view title="NT: Textsource" :value="details.textSource.sourceName" />

          <el-tags
            title="NT: Tags"
            v-model="details.tags"
            options-source="tags"
            options-restriction="documents"
            :document-id="details.id"
            table-name="misc_links_tags"
            table-column="misc_tags_id"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { api } from 'src/boot/axios';

import type { Detail } from 'src/core/interfaces/mainDocuments';

import elInput from 'src/gui/main/documents/elViewEditInput.vue';
import elEditor from 'src/gui/main/documents/elViewEditEditor.vue';
import elSelect from 'src/gui/main/documents/elViewEditSelect.vue';
import elView from 'src/gui/main/documents/elViewText.vue';
import elTags from 'src/gui/main/documents/elViewEditTags.vue';

const props = defineProps<{
  id: number;
}>();

const emits = defineEmits(['onClose']);

const dialogVisible = ref(false);

// Typisierung als Detail oder null, um den Ladezustand korrekt abzubilden
const details = ref<Detail | null>(null);

function onCloseDialog() {
  dialogVisible.value = false;
  emits('onClose');
}

function loadData(documentId: number) {
  api
    .get('/documents/get/' + documentId)
    .then((response) => {
      details.value = response.data.results;
      dialogVisible.value = true;
    })
    .catch((error) => {
      console.error(error);
    });
}

watch(
  () => props.id,
  (value) => {
    if (value !== 0) {
      loadData(value);
    }
  },
);
</script>
<style lang="scss"></style>
