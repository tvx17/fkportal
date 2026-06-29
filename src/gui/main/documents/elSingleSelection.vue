<template>
  <q-select
    clearable
    v-model="selectedValue"
    :options="options"
    option-label="name"
    option-value="id"
    emit-value
    map-options
    :label="props.label"
    dense
    @update:model-value="onSelected"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';

const props = defineProps({
  what: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

interface Item {
  id: number;
  name: string;
}

const emits = defineEmits(['onSelected']);

const selectedValue = defineModel<Item[]>({ default: () => [] });
const options = ref([]);

function onSelected() {
  emits('onSelected', selectedValue.value);
}

function init() {
  api
    .get('/misc/get/' + props.what + '/documents')
    .then((response) => {
      options.value = response.data.values;
    })
    .catch((error) => {
      console.log(error);
    });
}

onMounted(() => {
  init();
});
</script>
