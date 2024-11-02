<template>
  <div class="flex flex-row" v-if="props.config?.filtering && props.config.filtering.active">
    <FilteringDefault 
      :l="props.l"
      v-if="!props.config?.filtering.simple"
      data-test="FilteringDefault" 
      :filteringConfig="props.config?.filtering" 
      :dataMapping="props.config?.mapping" 
      :pushFilter="pushFilter" 
      :removeFilter="removeFilter" 
      :changeFilterOperator="changeFilterOperator" 
      :filters="state.filters" 
      :filterOperator="state.filterOperator" />
    <FilteringSimple 
      :l="props.l"
      :config="props.config" 
      :setFilter="setSimpleFilter" 
      data-test="FilteringSimple" 
      v-else 
      :filteringConfig="props.config.filtering" :dataMapping="props.config.mapping" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted, nextTick } from 'vue';
  import { FilteringFilter, FilteringOperator } from '../model/Filtering'
  import FilteringDefault from './FilteringDefault.vue'
  import FilteringSimple from './FilteringSimple.vue'

  const props = defineProps({
    config: Object,
    setNewFiltersAndRefresh: Function,
    l: {
      type: Function,
      required: true
    },
  });

  const state = reactive({
    filters: Array<FilteringFilter>(),
    filterOperator: FilteringOperator.and,
    simpleFilter: ''
  });

  function pushFilter(filter: FilteringFilter) {
    if(isFilterAlreadyExists(filter.field)) {
      removeFilter(filter.field)
    }

    state.filters.push(filter);
    if(props.setNewFiltersAndRefresh) {
      props.setNewFiltersAndRefresh({
        filters: state.filters,
        filterOperator: state.filterOperator,
        simpleFilter: state.simpleFilter
      });
    }
    updateFilterParametersInURL();
  }

  function isFilterAlreadyExists(field: string) {
    for(var i in state.filters) {
      if(state.filters[i].field == field) {
        return true;
      }
    }

    return false;
  }

  function removeFilter(field: string) {
    let ind: number = -1;
    for(var i in state.filters) {
      if(state.filters[i].field == field) {
        ind = parseInt(i);
        break;
      }
    }
    
    state.filters.splice(ind, 1);
    if(props.setNewFiltersAndRefresh) {
      props.setNewFiltersAndRefresh({
        filters: state.filters,
        filterOperator: state.filterOperator,
        simpleFilter: state.simpleFilter
      });
    }
    updateFilterParametersInURL();
  }

  function updateFilterParametersInURL() {
    // @TODO: implement
  }

  function changeFilterOperator(op: FilteringOperator) {
    state.filterOperator = op;

    if(props.setNewFiltersAndRefresh) { 
      props.setNewFiltersAndRefresh({
        filters: state.filters,
        filterOperator: state.filterOperator,
        simpleFilter: state.simpleFilter
      });
    }
    updateFilterParametersInURL();
  }

  function setSimpleFilter(filter: string) {
    state.simpleFilter = filter; 
    if(props.setNewFiltersAndRefresh) {
      props.setNewFiltersAndRefresh({
        filters: state.filters,
        filterOperator: state.filterOperator,
        simpleFilter: state.simpleFilter
      });
    }
  }

  onMounted(() => {
    nextTick(() => {
      if(props.setNewFiltersAndRefresh) {
        props.setNewFiltersAndRefresh({
          filters: state.filters,
          filterOperator: state.filterOperator,
          simpleFilter: state.simpleFilter
        });
      }
    })
  })
</script>