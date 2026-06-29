<template>
  <tr>
    <td>
      {{ props.title }}
    </td>
    <td>
      {{ props.modelValue }}
      <div v-for="(element, eIndex) in modelValue" v-bind:key="eIndex">
        {{ element }}
        <el-select
          v-model="element['name']"
          :title="firstSelectElement['title']"
          :options-restriction="firstSelectElement['restriction']"
          :options-source="firstSelectElement['source']"
          :options-source-pure="firstSelectElement['pure']"
        />
        <!--<q-input filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>-->
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
