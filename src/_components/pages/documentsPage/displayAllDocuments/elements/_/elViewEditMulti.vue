<template>
  <div class="inline-edit-container inline-block">
    <div v-if="isEditing" class="row items-center q-gutter-sm no-wrap">
      <q-input
        v-model="editValue"
        dense
        autofocus
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
      />
    </div>

    <span v-else class="cursor-pointer text-underline-dashed" @click="startEdit">
      {{ modelValue || 'Leerer Wert' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Definition des v-model für Vue 3 / Quasar
const props = defineProps<{
  modelValue: string;
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
