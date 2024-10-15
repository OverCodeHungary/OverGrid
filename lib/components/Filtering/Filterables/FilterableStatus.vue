<template>
  <div class="flex flex-row gap-2 my-2 ">
    <div class="w-1/2">
      <label class="og-text-compact">{{ i18n.l('operation') }}:</label>
      <select @change="changeValue" v-model="state.operation" class="og-form-select og-text-compact">
        <option v-for="(option, key) in possibleOperations" :value="key" :key="key">{{ option }}</option>
      </select>
    </div>
    <div class="w-1/2">
      <label class="og-text-compact">{{ i18n.l('values') }}</label>
      <select :disabled="availableOptions.length === 0" @change="(e) => { addTag(e.target.value) }" v-model="state.currentSelectedValue" class="og-form-select og-text-compact">
        <option value="null">{{ i18n.l('please_choose_values') }}</option>
        <option v-for="(option, key) in availableOptions" :value="key" :key="key">{{ option }}</option>
      </select>

      <div v-if="state.currentValue.length > 0" class="flex flex-row whitespace-normal overflow-auto flex-wrap gap-2 mt-2">
        <div v-for="tag in state.currentValue" :key="tag.id" class="cursor-pointer">
          <div class="!og-text-compact" :class="tag.classList"
            @click="removeTag(tag.id)"
          >{{ tag.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Config from './FilterableStatus.config.js'
  import { computed, reactive } from 'vue';
  import useI18n from '../../../composables/useI18n.js';
  const i18n = useI18n('hu');

  const emit = defineEmits(['changeValue']);

  const state = reactive({
    currentValue: [],
    operation: 'in',
    currentSelectedValue: "null"
  });

  const props = defineProps({
    data: Object,
    config: Object,
    id: String | Number,
    formatterConfig: Object
  });

  const possibleOperations = computed(() => {
    return Config.possibleOperations()
  });

  const validation = computed(() => {
    return state.currentValue.length > 0
  });

  const availableOptions = computed(() => {
    var opts = {}
    for(var i in props.formatterConfig.mapping) {
      var f = false;
      for(var j in state.currentValue) {
        if(state.currentValue[j].id == i) {
          f = true
        }
      }

      if(!f) {
        opts[i] = props.formatterConfig.mapping[i].title
      }
    }

    return opts
  });

  function getOptionById(optId) {
    for(var i in props.formatterConfig.mapping) {
      if(i == optId) {
        return props.formatterConfig.mapping[i]
      }
    }

    return null;
  }

  function addTag(optId) {
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

  function removeTag(optId) {
    var ind = -1;
    for(var i in state.currentValue) {
      if(state.currentValue[i].id == optId) {
        ind = i
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
        ids.push(window.parseInt(state.currentValue[i].id))
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
      textual: Config.getTextual(state.operation, titles)
    })
  }
</script>

