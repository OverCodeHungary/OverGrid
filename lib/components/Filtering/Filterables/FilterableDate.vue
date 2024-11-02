<template>
  <div class="flex flex-col gap-2 my-2 ">

    <div>
      <label for="selectorOperationField" class="og-text-compact">{{ props.l('operation') }}:</label>
      <select @change="changeValue" v-model="state.operation" class="og-form-select og-text-compact">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>

    <div class="flex flex-col" v-if="state.operation == 'eq'">
      <label class="og-text-compact">{{ props.l('value') }}:</label>
      <span class="relative mt-1.5 flex">
        <input 
          class="og-form-input"
          type="date"
          min="1000-01-01" 
          max="2999-12-31"
          v-model="state.currentValue"
          @change="changeValue"
        />
      </span>
      <span v-if="!validation" class="text-tiny+ text-error mt-1 text-red-500 text-sm og-text-compact">
        {{ props.l('choose_date') }}
      </span>
    </div>

    <div class="flex flex-row gap-2" v-if="state.operation == 'bw'">
      <div class="w-1/2 flex flex-col">
        <label for="selectorDateValueStart" class="og-text-compact">{{ props.l('start_date') }}</label>
        <span class="relative mt-1.5 flex">
          <input 
            class="og-form-input"
            type="date"
            min="1000-01-01" 
            max="2999-12-31"
            v-model="state.currentValue"
            @change="changeValue"
          />
        </span>
      </div>

      <div class="w-1/2 flex flex-col">
        <label for="selectorDateValueStart" class="og-text-compact">{{ props.l('end_date') }}</label>
        <span class="relative mt-1.5 flex">
          <input 
            class="og-form-input"
            type="date"
            min="1000-01-01" 
            max="2999-12-31"
            v-model="state.currentValueEnd"
            @change="changeValue"
          />
        </span>
      </div>
    </div>
      

  </div>
</template>

<script setup lang="ts">
  import Config from './FilterableDate.config'
  import moment from 'moment';
  import { computed, reactive } from 'vue';

  const emit = defineEmits(['changeValue']);

  const props = defineProps<{
    l: Function,
    data: Object,
    config: {
      filterKey: string
    },
    id: String
  }>();

  const state = reactive<{
    operation: string,
    currentValue: string | null,
    currentValueEnd: null | string
  }>({
    operation: 'eq',
    currentValue: null,
    currentValueEnd: null
  })

  const possibleOperations = computed(() => {
    return Config.possibleOperations(props.l);
  })

  const validation = computed(() => {
    if(state.operation == 'eq') {
      return !!(state.currentValue !== null && state.currentValue !== '' && state.currentValue.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g))
    }
    
    if(state.operation == "bw") {
      return (!!(state.currentValue !== null && state.currentValue !== '' && state.currentValue.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)) &&
        !!(state.currentValueEnd !== null && state.currentValueEnd !== '' && state.currentValueEnd.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)) && 
        state.currentValue < state.currentValueEnd)
    }

    return true;
  })

  function changeValue() {
    var value, textual;

    if(state.operation == "eq") {
      value = moment(state.currentValue).format('YYYY-MM-DD');
      textual = Config.getTextual(props.l, state.operation, value, true)
    }

    if(state.operation == "bw") {
      value = {
        start: moment(state.currentValue).format('YYYY-MM-DD'),
        end: moment(state.currentValueEnd).format('YYYY-MM-DD')
      };
      textual = Config.getTextual(props.l, state.operation, value, true)
    }

    emit('changeValue', props.id, {
      field: props.id,
      filterKey: props.config.filterKey ? props.config.filterKey : props.id,
      type: 'date',
      operation: state.operation,
      value: value,
      isValid: validation,
      textual: textual
    })
  }
</script>
