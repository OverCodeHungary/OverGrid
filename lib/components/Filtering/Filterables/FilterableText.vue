<template>
  <div class="flex flex-row gap-2 my-2 ">
    <div class="w-1/2">
      <label>{{ i18n.l('operation') }}</label>
      <select @change="changeValue" v-model="state.operation" class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>
    <div class="w-1/2">
      <label>{{ i18n.l('value') }}:</label>
      <input :state="validation" v-model="state.currentValue" type="text" :placeholder="i18n.l('please_enter_value')" @change="changeValue" class=" mt-1.5 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" :class="[{'!border-error': !validation}]" />
    </div>
  </div>
</template>

<script setup>
  import Config from './FilterableText.config.js'
  import { computed, reactive } from 'vue';
  import useI18n from '../../../composables/useI18n.js';
  const i18n = useI18n('hu');

  const emit = defineEmits(['changeValue']);

  const props = defineProps({
    data: Object,
    config: Object,
    id: String | Number
  });

  const state = reactive({
    currentValue: null,
    operation: 'eq'
  });

  const possibleOperations = computed(() => {
    return Config.possibleOperations()
  });

  const validation = computed(() => {
    return state.currentValue !== null && state.currentValue !== ''
  });

  function changeValue() {
    emit('changeValue', props.id, {
      field: props.id,
      filterKey: props.config.filterKey ? props.config.filterKey : props.id,
      type: 'text',
      operation: state.operation,
      value: state.currentValue,
      isValid: validation,
      textual: Config.getTextual(state.operation, state.currentValue)
    })
  }
</script>
