<template>
  <div class="flex flex-row gap-2 my-2 ">
    <div class="w-1/2">
      <label class="og-text-compact">{{ props.l('operation') }}:</label>
      <select @change="changeValue" v-model="state.operation" class="og-form-select og-text-compact">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>
    <div class="w-1/2">
      <label class="og-text-compact">{{ props.l('values') }}</label>
      <select :disabled="availableOptions.length == 0" @change="(e) => { if(e && e.target && e.target) { addTag(e.target) } }" v-model="state.currentSelectedValue" class="og-form-select og-text-compact">
        <option value="null">{{ props.l('please_choose_values') }}</option>
        <option v-for="(option, key) in availableOptions" :value="key" :key="key">{{ option }}</option>
      </select>

      <div v-if="state.currentValue.length > 0" class="flex flex-row whitespace-normal overflow-auto flex-wrap gap-2 mt-2">
        <div v-for="tag in state.currentValue" :key="tag.id.toString()" class="cursor-pointer">
          <div class="!og-text-compact" :class="tag.classList"
            @click="removeTag(tag.id.toString())"
          >{{ tag.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Config from './FilterableStatus.config'
  import { computed, reactive } from 'vue';

  const emit = defineEmits(['changeValue']);

  const state = reactive<{
    currentValue: Array<{ id: String, title: String, classList: String }>,
    operation: String,
    currentSelectedValue: String
  }>({
    currentValue: [],
    operation: 'in',
    currentSelectedValue: "null"
  });

  const props = defineProps<{
    data: Object,
    l: Function,
    config: {
      filterKey: String
    },
    id: String | Number,
    formatterConfig: {
      mapping: {
        [key: string]: {
          title: string,
          classList: string
        }
      },
      dataType: string
    }
  }>();

  const possibleOperations = computed(() => {
    return Config.possibleOperations(props.l)
  });

  const validation = computed(() => {
    return state.currentValue.length > 0
  });

  const availableOptions = computed(() => {
    var opts: Array<string> = []

    for(var i in props.formatterConfig.mapping) {
      var f = false;
      for(var j in state.currentValue) {
        if(state.currentValue[j].id == i) {
          f = true
        }
      }

      if(!f) {
        opts.push(props.formatterConfig.mapping[i].title)
      }
    }

    return opts
  });

  function getOptionById(optId: string) {
    for(var i in props.formatterConfig.mapping) {
      if(i == optId) {
        return props.formatterConfig.mapping[i]
      }
    }

    return null;
  }

  function addTag(eventTarget?: EventTarget) {
    let optId = eventTarget ? (eventTarget as HTMLSelectElement).value : null;

    if(!optId || optId == "null") {
      return
    }

    var opt = getOptionById(optId)
    if(!opt) {
      return 
    }

    state.currentValue.push({
      id: optId,
      title: opt.title,
      classList: opt.classList
    })

    state.currentSelectedValue = "null";
    changeValue()
  }

  function removeTag(optId: string) {
    var ind: number = -1;
    for(var i in state.currentValue) {
      if(state.currentValue[i].id == optId) {
        ind = parseInt(i);
        break;
      }
    }

    if(ind > -1) {
      state.currentValue.splice(ind, 1)
    }

    state.currentSelectedValue = "null";
    changeValue()
  }

  function changeValue() {
    var ids = [];
    var titles = [];

    for(var i in state.currentValue) {
      if(props.formatterConfig.dataType == "integer") {
        ids.push(window.parseInt(state.currentValue[i].id.toString()))
      }
      if(props.formatterConfig.dataType == "boolean") {
        var bValue = state.currentValue[i].id == "true" ? true : false;
        ids.push(bValue)
      }
      if(props.formatterConfig.dataType == "text") {
        ids.push(state.currentValue[i].id)
      }

      titles.push(state.currentValue[i].title)
    }

    emit('changeValue', props.id, {
      field: props.id,
      filterKey: props.config.filterKey ? props.config.filterKey : props.id,
      type: 'status',
      operation: state.operation,
      value: ids,
      isValid: validation,
      textual: Config.getTextual(props.l, state.operation, titles)
    })
  }
</script>

