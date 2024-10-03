<template>
  <div class="flex flex-row" v-if="props.config.filtering && props.config.filtering.active">
    <FilteringDefault 
      v-if="!props.config.filtering.simple"
      data-test="RVGFilteringDefault" 
      :filteringConfig="props.config.filtering" 
      :dataMapping="props.config.mapping" 
      :pushFilter="pushFilter" 
      :removeFilter="removeFilter" 
      :changeFilterOperator="changeFilterOperator" 
      :filters="state.filters" 
      :filterOperator="state.filterOperator" />
    <FilteringSimple 
      :config="props.config" 
      :setFilter="setSimpleFilter" 
      data-test="RVGFilteringSimple" 
      v-else 
      :filteringConfig="props.config.filtering" :dataMapping="props.config.mapping" />
  </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import FilteringDefault from './FilteringDefault.vue'
  import FilteringSimple from './FilteringSimple.vue'

  const props = defineProps({
    config: Object,
    gridRefreshFn: Function
  });

  const state = reactive({
    filters: [],
    filterOperator: 'AND',
    simpleFilter: ''
  });

  function pushFilter(filter) {
    if(isFilterAlreadyExists(filter.field)) {
      removeFilter(filter.field)
    }

    state.filters.push(filter);
    if(!props.config.filtering.local) {
      props.gridRefreshFn();
    }
    updateFilterParametersInURL();
  }

  function isFilterAlreadyExists(field) {
    for(var i in state.filters) {
      if(state.filters[i].field == field) {
        return true;
      }
    }

    return false;
  }

  function removeFilter(field) {
    var ind = -1;
    for(var i in state.filters) {
      if(state.filters[i].field == field) {
        ind = i;
        break;
      }
    }
    
    state.filters.splice(ind, 1);
    if(!props.config.filtering.local) {
      props.gridRefreshFn();
    }
    updateFilterParametersInURL();
  }

  function updateFilterParametersInURL() {
    // @TODO: implement
  }

  function changeFilterOperator(op) {
    state.filterOperator = op;
    if(!props.config.filtering.local) {
      props.gridRefreshFn();
    }
    updateFilterParametersInURL();
  }

  function setSimpleFilter(filter) {
    state.simpleFilter = filter; 
    props.gridRefreshFn(true);
  }
</script>