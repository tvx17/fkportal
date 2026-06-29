<template>
  <tr>
    <td>{{ props.title }}</td>
    <td>
      <div class="inline-edit-container inline-block full-width">
        <div v-if="isEditing" class="row items-center q-gutter-sm no-wrap full-width">
          <q-input
            v-model="editValue"
            dense
            autofocus
            class="col"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="saveEdit"
          >
            <template v-slot:before>
              <q-btn icon="fa-solid fa-check" dense unelevated @click="saveEdit" />
              <q-btn icon="fa-solid fa-xmark" dense unelevated @click="cancelEdit" />
            </template>
          </q-input>
        </div>

        <span v-else class="cursor-pointer text-underline-dashed" @click="startEdit">
          {{ modelValue || 'NT: No value' }}
        </span>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'src/boot/axios';

const props = defineProps<{
  modelValue: string;
  title: string;
  documentId: number;
  fieldName: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isEditing = ref<boolean>(false);
const editValue = ref<string>('');

const startEdit = (): void => {
  editValue.value = props.modelValue;
  isEditing.value = true;
};

const saveEdit = (): void => {
  if (editValue.value.trim() !== props.modelValue) {
    emit('update:modelValue', editValue.value.trim());
    api
      .post('/documents/set/single/' + props.documentId, {
        value: editValue.value,
        field: props.fieldName,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
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
