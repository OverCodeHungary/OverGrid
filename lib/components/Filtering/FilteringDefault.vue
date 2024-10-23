<template>
  <div class="flex flex-row gap-1 items-center"> 
    <button :title="i18n.l('add_filter')" class="og-btn og-btn-circle og-btn-primary" @click="() => { state.filteringModalShown = true }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="min-w-4 w-4 h-4" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      </svg>
    </button>
    <div class="filtersSection">
      <div class="currentFiltersHolder">
        <span class="og-text-compact" v-if="props.filters && props.filters.length <= 0">
          {{ i18n.l('no_filters_added') }}
        </span>
        <span class="flex flex-row flex-wrap items-center gap-0.5" v-if="props.filters && props.filters.length > 0">
          <span v-for="filter in tweakedFilters" :key="filter.field">
            <ul class=" mb-0" v-if="!filter._opselector">
              <li>
                <a
                  @click="removeFilter(filter.field)"
                  :title="filter.textual"
                  :disabled="false"
                  class="og-filtering-tag"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg> 
                  <span class="og-text-compact py-1">{{ filter.textual }}</span>
                </a>
              </li>
            </ul>
            <ul class="mb-0" v-else>
              <li>
                <select class="h-8 rounded-lg og-text-compact border-2" data-test="filterOperatorSelector" v-model="state.operator">
                  <option value="OR">{{ i18n.l('or') }}</option>
                  <option value="AND">{{ i18n.l('and') }}</option>
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
      :title="i18n.l('add_filter')" 
      :close="() => { closeFiltering() }" 
      :disableOkButton="!state.currentFilterValue || !state.currentFilterValue.isValid"
      :ok="() => { addFiltering() }">
      <template #content>
        <div class="pb-2">
          <label class="pull-left og-text-compact" for="selectorField">{{ i18n.l('select_field') }}</label>
          <select class="og-form-select og-text-compact" v-model="state.selectorField">
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

<script setup lang="ts">

// filterables
import FilterableNumber from './Filterables/FilterableNumber.vue'
import FilterableNumberConfig from './Filterables/FilterableNumber.config'
import FilterableText from './Filterables/FilterableText.vue'
import FilterableTextConfig from './Filterables/FilterableText.config'
import FilterableDate from './Filterables/FilterableDate.vue'
import FilterableDateConfig from './Filterables/FilterableDate.config'
import FilterableStatus from './Filterables/FilterableStatus.vue'
import FilterableStatusConfig from './Filterables/FilterableStatus.config'
//import FilterableLookup from './Filterables/FilterableLookup.vue'
import CustomContentModal from '../CustomContentModal.vue'
import { reactive, onMounted, watch, computed } from 'vue'
import { FilteringOperator, FilteringFilter } from '../model/Filtering'
import { MappingRecordType, StatusFormatterConfigType } from '../model/OGConfig'
import useI18n from '../../composables/useI18n';
const i18n = useI18n('hu');

const Filterables: Record<string, any> = {
  'FilterableNumber': FilterableNumber,
  'FilterableText': FilterableText,
  'FilterableDate': FilterableDate,
  'FilterableStatus': FilterableStatus,
  //FilterableLookup
}

const props = defineProps<{
  filteringConfig: object,
  dataMapping: Record<string, MappingRecordType>,
  pushFilter: Function,
  removeFilter: Function,
  filters: Array<FilteringFilter>,
  filterOperator: FilteringOperator,
  changeFilterOperator: Function
}>();

const state = reactive<{
  selectorField: string | null,
  currentFilterValue: any,
  operator: FilteringOperator,
  filteringModalShown: boolean
}>({
  selectorField: null,
  currentFilterValue: null,
  operator: FilteringOperator.or,
  filteringModalShown: false
});

onMounted(() => {
  state.operator = props.filterOperator;
});

watch(() => props.filterOperator, () => {
  state.operator = props.filterOperator;
});

watch(() => state.operator, () => {
  if(props.changeFilterOperator) {
    props.changeFilterOperator(state.operator);
  }
});

function resetFiltering() {
  state.selectorField = null;
  state.currentFilterValue = null;
}

function closeFiltering() {
  state.filteringModalShown = false;
  resetFiltering();
}

watch(() => state.selectorField, () => {
  state.currentFilterValue = null;
})

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

    let cNewFilter: FilteringFilter = {
      field: props.filters[i].field,
      operation: props.filters[i].operation,
      type: props.filters[i].type,
      value: props.filters[i].value,
      filterKey: '',
      textual: ''
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
        cNewFilter.textual = FilterableStatusConfig.getTextual(props.filters[i].operation, props.filters[i].value, props.dataMapping[props.filters[i].field].formatter as StatusFormatterConfigType).replace("%%fieldname%%", props.dataMapping[props.filters[i].field].title)
        break;
    }
    
    newFilters.push(cNewFilter);

    firstOne = false;
  }

  return newFilters;
})

const selectorFieldOptions = computed(() => {
  var options: Record<string, string> = {
    null: "-- " + i18n.l('select_field') + " --"
  };
  for(var i in props.dataMapping) {
    if(props.dataMapping[i].filterable && props.dataMapping[i].filterable?.active) {
      var title: string | undefined = props.dataMapping[i].title;
      if(props.dataMapping[i].filterable?.titleOverride) {
        title = props.dataMapping[i].filterable?.titleOverride;
      }

      if(props.dataMapping[i].filterable && props.dataMapping[i].filterable?.type) {
        options[i] = title + " (" + translateTypeToHumanType(props.dataMapping[i].filterable?.type) + ")";
      }
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

function translateTypeToHumanType(type?: string) {
  if(!type) {
    return i18n.l('text');
  }

  switch(type.toLowerCase()) {
    case "number":
      return i18n.l('whole_number')
    case "text":
      return i18n.l('text')
    case "date":
      return i18n.l('date')
    case "user":
      return i18n.l('user')
    case "status":
      return i18n.l('status')
    case "lookup":
      return i18n.l('lookup')
    default:
      return i18n.l('text')
  }
}

function changeFilterValue(field: string, obj: string) {
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

  closeFiltering();
}
</script>
