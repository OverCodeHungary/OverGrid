<template>
  <div class="flex flex-row gap-2 my-2 ">
    <div class="w-1/2">
      <label for="selectorOperationField" class="og-text-compact">{{ i18n.l('operation') }}:</label>
      <select @change="changeValue" v-model="state.operation" class="og-form-select og-text-compact">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>
    <div class="w-1/2">
      <label for="selectorNumberValue" class="og-text-compact">{{ i18n.l('value') }}:</label>
      <input id="selectorNumberValue" :state="validation" v-model="state.currentValue" type="number" :min="(!isNaN(props.config.min) ? props.config.min : '')" :max="(!isNaN(props.config.max) ? props.config.max : '')" :placeholder="i18n.l('please_enter_value')" class="og-form-input og-text-compact" :class="[{'!border-error': !validation}]" />
    </div>
  </div>
</template>

<script setup>
  import Config from './FilterableNumber.config.js'
  import { computed, reactive, watch } from 'vue';
  import useI18n from '../../../composables/useI18n.js';
  const i18n = useI18n('hu');

  const emit = defineEmits(['changeValue']);

  const state = reactive({
    currentValue: null,
    operation: 'eq'
  });

  const props = defineProps({
    data: Object,
    config: Object,
    id: String | Number
  });

  const possibleOperations = computed(() => {
    return Config.possibleOperations()
  });

  const validation = computed(() => {
    return state.currentValue !== null && state.currentValue !== '' && !isNaN(state.currentValue)
  });

  watch(() => state.currentValue, () => {
    changeValue();
  });

  function changeValue() {
    emit('changeValue', props.id, {
      field: props.id,
      filterKey: props.config.filterKey ? props.config.filterKey : props.id,
      type: 'number',
      operation: state.operation,
      value: state.currentValue,
      isValid: validation,
      textual: Config.getTextual(state.operation, state.currentValue)
    })
  }

</script>
