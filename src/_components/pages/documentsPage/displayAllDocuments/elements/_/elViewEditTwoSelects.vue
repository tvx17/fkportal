<template>
  <tr>
    <td>
      {{ props.title }}
    </td>
    <td>
      <div v-for="(element, eIndex) in modelValue" v-bind:key="eIndex">
        <el-select
          v-model="element[firstSelectElement['name']]"
          :title="firstSelectElement['title']"
          :options-restriction="firstSelectElement['restriction']"
          :options-source="firstSelectElement['source']"
          :options-source-pure="firstSelectElement['pure']"
        />
        <el-select
          v-model="party.contact"
          title="NT: Contact"
          options-source="con_contacts"
          :options-source-pure="true"
        />
        <q-separator />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import elSelect from './elViewEditSelect.vue';

// Definition des v-model für Vue 3 / Quasar
const props = defineProps<{
  modelValue: string;
  title: string;
  firstSelectElement: object;
  secondSelectElement: object;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
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
