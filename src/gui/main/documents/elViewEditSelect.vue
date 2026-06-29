<template>
  <tr>
    <td>{{ props.title }}</td>
    <td>
      <div class="inline-edit-container inline-block full-width">
        <div v-if="isEditing" class="row items-center q-gutter-sm no-wrap full-width">
          <q-select
            :loading="options.length === 0"
            :disable="options.length === 0"
            class="full-width"
            clearable
            v-model="editValue"
            :options="options"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            dense
          >
            <template v-slot:before>
              <q-btn icon="fa-solid fa-check" dense unelevated @click="saveEdit" />
              <q-btn icon="fa-solid fa-xmark" dense unelevated @click="cancelEdit" />
            </template>
            <template v-slot:after>
              <q-btn icon="fa-solid fa-eye" dense unelevated @click="dialogVisible = true">
                <q-tooltip>NT: Overview</q-tooltip>
              </q-btn>
            </template>
          </q-select>
        </div>

        <span v-else class="cursor-pointer text-underline-dashed" @click="startEdit">
          {{ modelValue?.name || 'NT: No value' }}
        </span>
      </div>
    </td>
  </tr>
  <q-dialog v-if="dialogVisible">
    <q-card>
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>NT: Overview</q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref } from 'vue';
//import Core from 'src/core';

import type { EditModel } from 'src/core/interfaces/mainDocuments';

//const userStore = Core.Stores.useUserStore();

const props = withDefaults(
  defineProps<{
    modelValue?: EditModel | null;
    title: string;
    optionsSource: string;
    optionsSourcePure?: boolean;
    optionsRestriction?: string | null;
    documentId: number;
    fieldName: string;
    addNewItemName?: string;
  }>(),
  {
    optionsRestriction: 'none',
    optionsSourcePure: false,
    addNewItemName: 'Item',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: EditModel | null): void;
}>();

const isEditing = ref<boolean>(false);
const editValue = ref<string | number | null>(null);
const options = ref<EditModel[]>([]);
const dialogVisible = ref<boolean>(false);

const startEdit = (): void => {
  editValue.value = props.modelValue ? props.modelValue.id : null;
  isEditing.value = true;

  let url = '/misc/get/' + props.optionsSource;
  url += props.optionsRestriction != null ? '/' + props.optionsRestriction : '';
  console.log(url);
  const params: Record<string, unknown> = {};
  if (props.optionsSourcePure) {
    params['pureTableName'] = true;
  }

  api
    .get(url, {
      params: params,
    })
    .then((response) => {
      options.value = response.data.results;
    })
    .catch((error) => {
      console.error(error);
    });
};

const saveEdit = (): void => {
  if (editValue.value === null || editValue.value === '') {
    if (props.modelValue !== null) {
      emit('update:modelValue', null);
    }
    isEditing.value = false;
    return;
  }

  const selectedOption = options.value.find((opt) => opt.id === editValue.value);

  if (selectedOption) {
    if (!props.modelValue || selectedOption.id !== props.modelValue.id) {
      emit('update:modelValue', {
        id: selectedOption.id,
        name: selectedOption.name,
      });
      api
        .post('/documents/set/single/' + props.documentId, {
          value: selectedOption.id,
          field: props.fieldName,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  isEditing.value = false;
};

const cancelEdit = (): void => {
  isEditing.value = false;
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
