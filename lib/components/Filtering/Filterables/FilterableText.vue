<template>
  <div class="flex flex-row gap-2 my-2 ">
    <div class="w-1/2">
      <label class="og-text-compact">{{ props.l('operation') }}</label>
      <select @change="changeValue" v-model="state.operation" class="og-form-select og-text-compact">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>
    <div class="w-1/2">
      <label class="og-text-compact">{{ props.l('value') }}:</label>
      <input :state="validation" v-model="state.currentValue" type="text" :placeholder="props.l('please_enter_value')" class="og-form-input og-text-compact" :class="[{'!border-error': !validation}]" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Config from './FilterableText.config'
  import { computed, reactive, watch } from 'vue';

  const emit = defineEmits(['changeValue']);

  const props = defineProps<{
    data: Object,
    l: Function,
    config: {
      filterKey: String
    },
    id: String | Number
  }>();

  const state = reactive({
    currentValue: null,
    operation: 'eq'
  });

  const possibleOperations = computed(() => {
    return Config.possibleOperations(props.l)
  });

  const validation = computed(() => {
    return state.currentValue !== null && state.currentValue !== ''
  });

  watch(() => state.currentValue, () => {
    changeValue();
  });

  function changeValue() {
    emit('changeValue', props.id, {
      field: props.id,
      filterKey: props.config.filterKey ? props.config.filterKey : props.id,
      type: 'text',
      operation: state.operation,
      value: state.currentValue,
      isValid: validation,
      textual: Config.getTextual(props.l, state.operation, state.currentValue)
    })
  }
</script>
