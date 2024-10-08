<template>
  <div class="flex flex-row" v-if="props.config.filtering && props.config.filtering.active">
    <FilteringDefault 
      v-if="!props.config.filtering.simple"
      data-test="FilteringDefault" 
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
      data-test="FilteringSimple" 
      v-else 
      :filteringConfig="props.config.filtering" :dataMapping="props.config.mapping" />
  </div>
</template>

<script setup>
  import { reactive, onMounted, nextTick } from 'vue';
  import FilteringDefault from './FilteringDefault.vue'
  import FilteringSimple from './FilteringSimple.vue'

  const props = defineProps({
    config: Object,
    setNewFiltersAndRefresh: Function
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
    props.setNewFiltersAndRefresh({
      filters: state.filters,
      filterOperator: state.filterOperator,
      simpleFilter: state.simpleFilter
    });
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
    props.setNewFiltersAndRefresh({
      filters: state.filters,
      filterOperator: state.filterOperator,
      simpleFilter: state.simpleFilter
    });
    updateFilterParametersInURL();
  }

  function updateFilterParametersInURL() {
    // @TODO: implement
  }

  function changeFilterOperator(op) {
    state.filterOperator = op;
    props.setNewFiltersAndRefresh({
      filters: state.filters,
      filterOperator: state.filterOperator,
      simpleFilter: state.simpleFilter
    });
    updateFilterParametersInURL();
  }

  function setSimpleFilter(filter) {
    state.simpleFilter = filter; 
    props.setNewFiltersAndRefresh({
      filters: state.filters,
      filterOperator: state.filterOperator,
      simpleFilter: state.simpleFilter
    });
  }

  onMounted(() => {
    nextTick(() => {
      props.setNewFiltersAndRefresh({
        filters: state.filters,
        filterOperator: state.filterOperator,
        simpleFilter: state.simpleFilter
      });
    })
  })
</script>