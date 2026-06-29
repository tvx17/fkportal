<template>
  <q-select
    dense
    v-model="selectedValue"
    multiple
    :options="options"
    use-chips
    stack-label
    :label="props.label"
    option-label="name"
    option-value="id"
    emit-value
    map-options
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
  searchFieldLabel: {
    type: String,
    required: true,
  },
});

interface Item {
  id: number;
  name: string;
}

//const emits = defineEmits(['onSelected']);

//const searchQuery = ref<string>('');
const options = ref<Item[]>([]); // Typisierung für das Options-Array ergänzt

// Die Computed Property für die gefilterte Liste (auf Item[] angepasst)
/*const filteredOptions = computed<Item[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();

  // Wenn das Suchfeld leer ist, gib alle Optionen zurück
  if (!query) {
    return options.value;
  }

  // Filtere das options-Array nach ID oder Name
  return options.value.filter((option) => {
    const matchesId = option.id.toString().includes(query);
    const matchesName = option.name.toLowerCase().includes(query);

    return matchesId || matchesName;
  });
});*/

const selectedValue = defineModel<Item[]>({ default: () => [] });

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
