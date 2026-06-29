<template>
  <tr>
    <td class="text-left q-pa-sm">{{ props.title }}</td>
    <td>
      <div class="inline-edit-container inline-block full-width">
        <div v-if="rIsEditing" class="row items-center q-gutter-sm no-wrap full-width">
          <q-select
            v-model="rEditValue"
            multiple
            dense
            use-input
            use-chips
            :input-debounce="1500"
            :options="rOptions"
            option-value="misc_tags_id"
            option-label="name"
            @filter="filterFn"
            style="min-width: 250px"
            class="full-width"
            clearable
            autofocus
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">NT: Keine Ergebnisse</q-item-section>
              </q-item>
            </template>
            <template v-slot:before>
              <q-btn icon="fa-solid fa-check" dense unelevated @click="saveEdit" />
              <q-btn icon="fa-solid fa-xmark" dense unelevated @click="cancelEdit" />
            </template>
            <template v-slot:after>
              <q-btn icon="fa-solid fa-eye" dense unelevated @click="overview">
                <q-tooltip>NT: Overview</q-tooltip>
              </q-btn>
            </template>
          </q-select>
        </div>

        <div v-else class="cursor-pointer text-underline-dashed q-pa-sm" @click="startEdit">
          <template v-if="props.modelValue && props.modelValue.length > 0">
            {{ props.modelValue.map((t) => t.name).join(', ') }}
          </template>
          <span v-else class="text-grey-6">Keine Tags</span>
        </div>
      </div>
    </td>
  </tr>
  <q-dialog v-model="dialogVisible" eamless position="top">
    <q-card style="min-width: 70%">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>NT: Tags</q-toolbar-title>
          <q-btn icon="fa-solid fa-layer-group" dense unelevated> NT: Container (a-z) </q-btn>
          <q-btn icon="fa-solid fa-trash" dense unelevated> NT: Delete </q-btn>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        {{ rdisplayTags }}
        <q-chip
          clickable
          color="primary"
          text-color="white"
          icon="event"
          dense
          removable
          v-for="(tag, iTag) in rdisplayTags"
          v-bind:key="iTag"
        >
          {{ tag.name }}
        </q-chip>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import Core from 'src/core';

import type { Tag } from 'src/core/interfaces/mainDocuments.ts';

const props = withDefaults(
  defineProps<{
    modelValue: Tag[] | null;
    title: string;
    optionsSource: string;
    optionsRestriction?: string;
    documentId: number;
    tableName: string;
    tableColumn: string;
  }>(),
  {
    optionsRestriction: 'none',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: Tag[]): void;
}>();

const rIsEditing = ref<boolean>(false);
const rEditValue = ref<Tag[]>([]);
const rOptions = ref<Tag[]>([]);
const dialogVisible = ref<boolean>(false);
const rdisplayTags = ref<Tag[]>([]);

function overview() {
  dialogVisible.value = true;
  getData();
}

function getData() {
  api
    .get('/misc/get/' + props.optionsSource, {
      params: {
        restriction: props.optionsRestriction,
        max: 10,
      },
    })
    .then((response) => {
      rdisplayTags.value = response.data.results;
    })
    .catch((error) => {
      console.log(error);
    });
}

const filterFn = (
  searchValue: string,
  update: (callback: () => void) => void,
  abort: () => void,
) => {
  if (searchValue.trim() === '') {
    update(() => {
      rOptions.value = [];
    });
    return;
  }

  api
    .get(`/misc/get/${props.optionsSource}`, {
      params: {
        search: searchValue,
        pureTableName: false,
        restriction: props.optionsRestriction,
        max: 10,
      },
    })
    .then((response) => {
      update(() => {
        rOptions.value = response.data.results || [];
      });
    })
    .catch((error) => {
      Core.App.Logger.error(error);
      abort();
    });
};

const startEdit = (): void => {
  rEditValue.value = props.modelValue ? [...props.modelValue] : [];
  rIsEditing.value = true;
};

const saveEdit = (): void => {
  const currentIds = (props.modelValue || [])
    .map((t) => t.misc_tags_id)
    .sort()
    .join(',');
  const newIds = rEditValue.value
    .map((t) => t.misc_tags_id)
    .sort()
    .join(',');

  if (currentIds !== newIds) {
    emit('update:modelValue', rEditValue.value);
    api
      .post('/documents/set/multi/' + props.documentId, {
        value: newIds,
        table: props.tableName,
        column: props.tableColumn,
      })
      .then((response) => {
        //TODO: Mach etwas damit
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  rIsEditing.value = false;
};

const cancelEdit = (): void => {
  rIsEditing.value = false;
};
</script>

<style scoped>
.inline-block {
  display: inline-block;
}
.cursor-pointer {
  cursor: pointer;
}
.text-underline-dashed {
  border-bottom: 1px dashed #666;
}
</style>
