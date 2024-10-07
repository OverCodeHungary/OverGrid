<template>
  <div class="flex flex-row gap-1 items-center"> 
    <button title="Szűrőfeltétel hozzáadása" class="bg-slate-200 rounded-full p-2" @click="() => { state.filteringModalShown = true }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-4 h-4" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      </svg>
    </button>
    <div class="filtersSection">
      <div class="currentFiltersHolder">
        <span class="noFilterMessage" v-if="props.filters.length <= 0">
          Nincs beállított szűrőfeltétel...
        </span>
        <span class="flex flex-row items-center gap-2" v-if="props.filters.length > 0">
          <span v-for="filter in tweakedFilters" :key="filter.field">
            <ul class=" mb-0" v-if="!filter._opselector">
              <li>
                <a
                  @click="removeFilter(filter.field)"
                  :title="filter.textual"
                  :disabled="false"
                  class="bg-teal-400 px-2 text-white hover:bg-teal-500 focus:bg-teal-500 active:bg-teal-500/80 flex flex-row items-center cursor-pointer rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg> 
                  <span>{{ filter.textual }}</span>
                </a>
              </li>
            </ul>
            <ul class="mb-0 ml-2 mr-2" v-else>
              <li>
                <select class="h-7 w-full rounded-lg px-2.5 text-xs+ border-2" data-test="filterOperatorSelector" v-model="state.operator">
                  <option value="OR">VAGY</option>
                  <option value="AND">ÉS</option>
                </select>
              </li>
            </ul>
          </span>
        </span>
      </div>
    </div>

    <!-- :disabled="!currentFilterValue || !currentFilterValue.isValid" -->
    <CustomContentModal 
      :show="state.filteringModalShown" 
      title="Szűrőfeltétel hozzáadása" 
      cancelButtonTitle="Mégse" 
      okButtonTitle="OK" 
      :close="() => { state.filteringModalShown = false }" 
      :ok="addFiltering">
      <template #content>
        <div class="pb-2">
          <label class="pull-left" for="selectorField">Mező kiválasztása:</label>
          <select class="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent" v-model="state.selectorField">
            <option v-for="(text, key) in selectorFieldOptions" :key="key" :value="key">{{ text }}</option>
          </select>
          <component
            :is="Filterables['Filterable' + currentFilterableConfig.type]" 
            v-if="state.selectorField != 'null' && currentFilterableConfig" 
            @changeValue="changeFilterValue" 
            v-bind:is="'Filterable' + currentFilterableConfig.type" 
            :config="currentFilterableConfig" 
            :id="state.selectorField" 
            :formatterConfig="formatterConfig" />
        </div>
      </template>
    </CustomContentModal>

  </div>
</template>

<script setup>

// filterables
import FilterableNumber from './Filterables/FilterableNumber.vue'
import FilterableNumberConfig from './Filterables/FilterableNumber.config.js'
import FilterableText from './Filterables/FilterableText.vue'
import FilterableTextConfig from './Filterables/FilterableText.config.js'
import FilterableDate from './Filterables/FilterableDate.vue'
import FilterableDateConfig from './Filterables/FilterableDate.config.js'
import FilterableStatus from './Filterables/FilterableStatus.vue'
import FilterableStatusConfig from './Filterables/FilterableStatus.config.js'
//import FilterableLookup from './Filterables/FilterableLookup.vue'
import CustomContentModal from '../CustomContentModal.vue'
import { reactive, onMounted, watch, computed } from 'vue'

const Filterables = {
  FilterableNumber,
  FilterableText,
  FilterableDate,
  FilterableStatus,
  //FilterableLookup
}

const props = defineProps({
  filteringConfig: Object,
  dataMapping: Object,
  pushFilter: Function,
  removeFilter: Function,
  filters: Array,
  filterOperator: String,
  changeFilterOperator: Function
});

const state = reactive({
  selectorField: null,
  currentFilterValue: null,
  operator: 'OR',
  filteringModalShown: false
});

onMounted(() => {
  state.operator = state.filterOperator;
});

watch(() => props.filterOperator, () => {
  state.operator = props.filterOperator;
});

watch(() => state.operator, () => {
  if(props.changeFilterOperator) {
    props.changeFilterOperator(state.operator);
  }
});

const tweakedFilters = computed(() => {
  var newFilters = [];
  var firstOne = true;
  var opCounter = 0;
  for(var i in props.filters) {
    if(!firstOne) {
      newFilters.push({
        _opselector: true,
        field: 'op' + opCounter,
        textual: ''
      });
      ++opCounter;
    }

    var cNewFilter = {
      field: props.filters[i].field,
      operation: props.filters[i].operation,
      type: props.filters[i].type,
      value: props.filters[i].value
    }

    switch(props.filters[i].type) {
      case "number":
        cNewFilter.textual = FilterableNumberConfig.getTextual(props.filters[i].operation, props.filters[i].value).replace("%%fieldname%%", props.dataMapping[props.filters[i].field].title)
        break;
      case "text":
        cNewFilter.textual = FilterableTextConfig.getTextual(props.filters[i].operation, props.filters[i].value).replace("%%fieldname%%", props.dataMapping[props.filters[i].field].title)
        break;
      case "date":
        cNewFilter.textual = FilterableDateConfig.getTextual(props.filters[i].operation, props.filters[i].value, true).replace("%%fieldname%%", props.dataMapping[props.filters[i].field].title)
        break;
      case "status":
        cNewFilter.textual = FilterableStatusConfig.getTextual(props.filters[i].operation, props.filters[i].value, props.dataMapping[props.filters[i].field].formatter).replace("%%fieldname%%", props.dataMapping[props.filters[i].field].title)
        break;
    }
    
    newFilters.push(cNewFilter);

    firstOne = false;
  }

  return newFilters;
})

const selectorFieldOptions = computed(() => {
  var options = {
    null: "-- Mező kiválasztása --"
  };
  for(var i in props.dataMapping) {
    if(props.dataMapping[i].filterable && props.dataMapping[i].filterable.active) {
      var title = props.dataMapping[i].title;
      if(props.dataMapping[i].filterable.titleOverride) {
        title = props.dataMapping[i].filterable.titleOverride;
      }

      options[i] = title + " (" + translateTypeToHumanType(props.dataMapping[i].filterable.type) + ")";
    }
  }

  return options
})

const currentFilterableConfig = computed(() => {
  if(!state.selectorField || !props.dataMapping[state.selectorField] || !props.dataMapping[state.selectorField].filterable) {
    return null;
  }
  return props.dataMapping[state.selectorField].filterable;
})

const formatterConfig = computed(() => {
  if(!state.selectorField || !props.dataMapping[state.selectorField] || !props.dataMapping[state.selectorField].formatter) {
    return null;
  }
  return props.dataMapping[state.selectorField].formatter
})

// const needOperatorSelector = computed(() => {
//   if(!this.filters) {
//     return false;
//   }

//   return this.filters.length > 1;
// })

function translateTypeToHumanType(type) {
  switch(type.toLowerCase()) {
    case "number":
      return "Egész szám"
    case "text":
      return "Szöveges"
    case "date":
      return "Dátum"
    case "user":
      return "Felhasználó"
    case "status":
      return "Státusz"
    case "lookup":
      return "Elem"
    default:
      return "Szöveges"
  }
}

function changeFilterValue(field, obj) {
  state.currentFilterValue = obj
}

function addFiltering() {
  if(!state.currentFilterValue || !state.currentFilterValue.isValid) {
    return;
  }

  props.pushFilter({
    field: state.currentFilterValue.field,
    filterKey: state.currentFilterValue.filterKey,
    type: state.currentFilterValue.type,
    operation: state.currentFilterValue.operation,
    value: state.currentFilterValue.value,
    textual: state.currentFilterValue.textual.replace("%%fieldname%%", props.dataMapping[state.currentFilterValue.field].title)
  });

  state.filteringModalShown = false;

  state.selectorField = null;

}
</script>
