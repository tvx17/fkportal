<template>
  <q-expansion-item expand-separator :label="props.label" dense>
    <q-input v-model="searchQuery" :label="props.searchFieldLabel" dense class="q-mb-md" />

    <div class="row wrap q-gutter-md">
      <div class="col-auto" v-for="option in filteredOptions" :key="option.id">
        <span @click="onSelected(option.id)" style="cursor: pointer">{{ option.name }}</span>
      </div>
    </div>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
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

const emits = defineEmits(['onSelected']);

const searchQuery = ref<string>('');
const options = ref<Item[]>([]); // Typisierung für das Options-Array ergänzt

// Die Computed Property für die gefilterte Liste (auf Item[] angepasst)
const filteredOptions = computed<Item[]>(() => {
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
});

const selectedValue = defineModel<Item[]>({ default: () => [] });

function onSelected(id) {
  emits('onSelected', id);
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
