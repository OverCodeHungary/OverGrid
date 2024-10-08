<template>
  
  <div class="flex flex-col">
    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
      {{ props.config.title }}
    </h2>

    <div class="flex flex-row justify-between" v-if="needsToShowTopFiltersBar">
      <Filtering 
        :config="props.config"
        :setNewFiltersAndRefresh="(newFilters) => { state.filters = newFilters.filters; state.filterOperator = newFilters.filterOperator; state.simpleFilter = newFilters.simpleFilter; gridRefresh(); }"
        />

      <div class="flex flex-row items-center gap-2">
        <!-- REFRESH INDICATOR -->
        <span class="text-xs text-slate-400 dark:text-navy-300 gridRefreshedIndicator mr-3" v-if="state.refreshNeeded">
          <SpinnerLoader sizeClasses="w-5 h-5" />
        </span>
        <!-- REFRESH INDICATOR -->

        <!-- BULK OPERATION -->
          <BulkOperations
            :config="props.config"
            :checkedRows="state.checkedRows"
            :changeCheckedRows="(checkedRows) => { state.checkedRows = checkedRows; }"
            v-if="props.config.bulkOperation && props.config.bulkOperation.active" />
        <!-- BULK OPERATION -->

        <!-- MANUAL REFRESH -->
        <button v-if="props.config.refreshable && props.config.refreshable.manualActive" title="Lista frissítése" @click="state.refreshNeeded = true" class="bg-slate-200 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <!-- MANUAL REFRESH -->

        <DropDown ref="operationsDropdown" v-if="needsToShowAdditionalOperationsDropdown">
          <button class="bg-slate-200 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <template #content>
            <div class="flex flex-col">
              <ul>
                <li>
                  <h3 class="font-bold">
                    {{ i18n.l('operations') }}
                  </h3>
                </li>
              </ul>
              <ColumnSelector 
                v-if="props.config.columnSelector && props.config.columnSelector.active"
                :dataMapping="props.config.mapping" 
                :gridUniqueId="props.config.gridUniqueId"
                :rerender="gridRefresh" />

              <XlsxExport 
                v-if="props.config.xlsxExport && props.config.xlsxExport.active && state.records.length > 0"
                :xlsxExportConfig="props.config.xlsxExport" 
                :dataMapping="props.config.mapping" 
                :records="state.records" />

              <AutoRefresh
                class="mt-3"
                v-if="props.config.refreshable && props.config.refreshable.autoActive && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length > 0"
                :gridRefresh="gridRefresh"
                :currentValue="state.autoRefresh"
                :config="props.config" />

              <ChangePageSize
                class="mt-3"
                v-if="props.config.pagination && props.config.pagination.possiblePageSizes"
                :config="props.config"
                :changePageSize="(newPageSize) => { state.pagination.size = newPageSize; gridRefresh(); }" />

            </div>
          </template>
        </DropDown>
      </div>
    </div>

    <!-- GRID -->
    <div :key="state.updateKey" class="overflow-visible w-full card scrollbar scrollbar-h-5 scrollbar-thumb-slate-300 scrollbar-track-slate-200 dark:scrollbar-track-navy-800 dark:scrollbar-thumb-navy-500 scrollbar-thumb-rounded-full">
      <div class="overflow-x-scroll rounded-lg">
        <table class="w-full text-left">
          <thead>
            <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-3" width="30px" v-if="isExtraRowEnabled"></th>
              <th class="whitespace-nowrap bg-slate-200 dark:bg-navy-800" width="30px" v-if="(props.config.bulkOperation && props.config.bulkOperation.active) || (props.config.singleRowSelection && props.config.singleRowSelection.active)">
                <label class="inline-flex items-center space-x-2">
                </label>
              </th>
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-2" v-for="(value, index) in titlesVisible" :key="'tvbl_' + index" :width="value.width">
                <div class="flex flex-row gap-2 items-center">
                  <span class="text-xs">{{ value.title }}</span>
                  <button v-if="value.orderable == true" :title="(state.order.active && state.order.field == value.key && state.order.direction == 'desc') ? 'Csökkenő sorrend' : 'Növekvő sorrend'" :class="['btn !p-0', {'h-4 w-4 !rounded-full bg-secondary font-medium text-white hover:bg-secondary-focus focus:bg-secondary-focus active:bg-secondary-focus/90': state.order.active && state.order.field == value.key}]" @click="orderChange($event, value.key)">
                    <svg v-if="state.order.active && state.order.field == value.key && state.order.direction == 'asc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                    </svg>
                    <svg v-if="state.order.active && state.order.field == value.key && state.order.direction == 'desc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                    <svg v-if="!state.order.active" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                  </button>
                  <button title="Rendezés törlése" class="btn btn-order removeOrder" v-if="state.order.active && state.order.field == value.key" @click="removeOrder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="state.records.length > 0">
            <template v-for="(record, index) in filteredOrderedRecords" :key="index">
              <tr data-test="OverGridRow" :data-rowid="record[props.config.idkey]" :class="[{ 'extraRowOpened': state.openedRow.includes(record[props.config.idkey]) }, 'OverGridRow border-y border-transparent border-b-slate-200 dark:border-b-navy-500 dark:hover:bg-slate-700 hover:bg-slate-100', { 'bg-error/10': props.config.rowHightlighter && props.config.rowHightlighter.active && props.config.rowHightlighter.fn(record) }]" >
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="isExtraRowEnabled">
                  <button variant="link" v-if="(!state.openedRow.includes(record[props.config.idkey]))" @click="() => { mainRowClick(record[props.config.idkey]) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button variant="link" v-if="(state.openedRow.includes(record[props.config.idkey]))" @click="() => { mainRowClick(record[props.config.idkey]) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="(props.config.bulkOperation && props.config.bulkOperation.active)">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      :value="record[props.config.idkey]" v-model="state.checkedRows"
                      class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:bg-secondary checked:border-secondary hover:border-secondary focus:border-secondary dark:border-navy-400 dark:checked:bg-secondary-light dark:checked:border-secondary-light dark:hover:border-secondary-light dark:focus:border-secondary-light"
                      type="checkbox"
                    />
                  </label>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="(props.config.singleRowSelection && props.config.singleRowSelection.active)">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      :value="record[props.config.idkey]" v-model="state.checkedRow"
                      class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:bg-secondary checked:border-secondary hover:border-secondary focus:border-secondary dark:border-navy-400 dark:checked:bg-secondary-light dark:checked:border-secondary-light dark:hover:border-secondary-light dark:focus:border-secondary-light"
                      type="radio"
                    />
                  </label>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" :class="[{ 'sticky': value.sticky }]" v-for="(value, cmNameBody) in mappingVisible" :key="cmNameBody">
                  <span v-if="value.formatter && typeof value.formatter == 'object' && value.formatter.type">
                    <RootFormatter 
                      :type="'OGFormatter' + value.formatter.type" 
                      :data="value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody]" 
                      :config="value" 
                      :rowid="record[props.config.idkey]" 
                      :field="cmNameBody" 
                      :record="record" 
                      :refreshGrid="() => { state.refreshNeeded=true }" 
                      :customFormatters="props.customFormatters"
                      :openExtraRow="(recordId) => { mainRowClick(recordId) }" />
                  </span>
                  <span v-else-if="value.formatter && typeof value.formatter == 'function'" v-html="value.formatter(value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody], () => { state.refreshNeeded=true }, record[props.config.idkey], record)" />
                  <span v-else>
                    {{ value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody] }}
                  </span>
                </td>
              </tr>
              <tr v-if="isRowOpened(record[props.config.idkey])">
                <td :colspan="colNumber">
                  <slot v-bind:record="record" v-bind:extraParams="props.config.extraRow.extraParams" name="extraRow"></slot>
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr v-if="!state.refreshNeeded">
              <td :colspan="Object.keys(titlesVisible).length" class="w-full text-left p-5">
                <div class="flex flex-row items-center justify-start gap-2">
                  <i class="fa-solid fa-ban dark:text-slate-500"></i>
                  <span class="whitespace-nowrap !p-0 ![clip:rect(0,0,0,0)] dark:text-slate-500">Ebben a nézetben nincs megjeleníthető adat...</span>
                </div>
              </td>
            </tr>
            <tr v-else>
              <td :colspan="Object.keys(titlesVisible).length" class="w-full max-w-xl !text-left p-5">
                <div class="flex flex-row items-start justify-start gap-2">
                  <div :class="'w-5 h-5 inline-block animate-spin !rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-slate-500'" role="status">
                  </div>
                  <span class="whitespace-nowrap !p-0 ![clip:rect(0,0,0,0)] dark:text-slate-500">Betöltés folyamatban...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- GRID -->

    <!-- PAGINATION -->
      <Pagination 
        v-model="state.pagination" 
        :config="props.config"
        :changePagination="(newPagination) => { state.pagination.active = newPagination.active; state.pagination.page = newPagination.page; state.refreshNeeded = true; }"
        v-if="props.config.pagination && props.config.pagination.active && state.pagination.totalPages > 1" />
    <!-- PAGINATION -->

  </div>
</template>

<script setup>
  import { reactive, ref, computed, watch, nextTick, onMounted } from 'vue';
  import Filtering from './components/Filtering/Filtering.vue'
  import './default.css'
  import SpinnerLoader from './components/SpinnerLoader.vue';
  import DropDown from './components/DropDown.vue';
  import useAxios from './composables/useAxios';
  import useColumnsVisible from './composables/useColumnsVisible';
  import useLocalSortAndFilter from './composables/useLocalSortAndFilter';
  import ColumnSelector from './components/ColumnSelector/ColumnSelector.vue';
  import XlsxExport from './components/XlsxExport/XlsxExport.vue';
  import RootFormatter from './Formatters/RootFormatter.vue';
  import Pagination from './components/Pagination/Pagination.vue';
  import ChangePageSize from './components/Pagination/ChangePageSize.vue';
  import AutoRefresh from './components/AutoRefresh/AutoRefresh.vue';
  import BulkOperations from './components/BulkOperations/BulkOperations.vue';
  const columnsVisible = useColumnsVisible();
  const Axios = useAxios();
  const localSortAndFilter = useLocalSortAndFilter();
  import useI18n from './composables/useI18n';
  const i18n = useI18n('hu');

  const operationsDropdown = ref(null);

  const props = defineProps({
    config: Object,
    customFormatters: {
      type: Array,
      required: false,
      default: () => []
    }
  });

  const state = reactive({
    refreshNeeded: false,
    updateKey: 0,
    records: [],
    registeredEvents: {},

    /* EXTRA ROW */
    openedRow: [],
    /* EXTRA ROW */

    /* FILTERING */
    filters: {},
    filterOperator: 'AND',
    simpleFilter: '',
    /* FILTERING */

    /* BULK OPERATIONS */
    checkedRows: [],
    checkedRow: null,
    //bulkMethod: 'null',
    /* BULK OPERATIONS */

    /* COLUMN SELECTOR */
    //showColumnSelectorModal: false,
    /* COLUMN SELECTOR */

    /* AUTO REFRESH */
    // autoRefresh: 'disabled',
    // autoRefreshInterval: null,
    /* AUTO REFRESH */

    /* PAGINATION */
    pagination: {
      active: false,
      page: 0,
      size: 10,
      totalPages: null,
      totalElements: null
    },
    /* PAGINATION */

    /* ORDER */
    order: {
      active: false,
      field: null,
      direction: 'asc'
    },
    /* ORDER */

    /* XLSX EXPORT */
    showXlsxExportModal: false,
    /* XLSX EXPORT */
  });

  /* EXTRA ROW */
  const isExtraRowEnabled = computed(() => {
    if(props.config && props.config.extraRow && props.config.extraRow.active) {
      return true;
    }
    else {
      return false;
    }
  })

  function isRowOpened(recordId) {
    return state.openedRow.includes(recordId);
  }
  /* EXTRA ROW */

  /* ORDER */
  function removeOrder() {
    state.order.active = false;
    state.order.field = null;
    state.order.direction = 'asc';
    if(!props.config.orderLocal) {
      state.refreshNeeded = true
    }
  }

  function orderChange(event, field) {
    if (!state.order.active) {
      state.order.active = true
      state.order.field = field
    }
    else {
      if (state.order.field == field) {
        if (state.order.direction == "asc") {
          state.order.direction = "desc"
        }
        else {
          state.order.direction = "asc"
        }
      }
      else {
        state.order.field = field
        state.order.direction = "asc"
      }
    }

    if(!props.config.orderLocal) {
      state.refreshNeeded = true
    }
  }
  /* ORDER */

  function gridRefresh(withPaginationReset = false) {
    if(withPaginationReset) {
      state.pagination.page = 1;
    }

    nextTick(() => {
      state.refreshNeeded = true;
      state.updateKey++;
    })
  }

  const visibleColumnsNumber = computed(() => {
    var num = 0;
    for(var i in props.config.mapping) {
      if(props.config.mapping[i].visible) {
        ++num;
      }
    }
    return num;
  })

  const colNumber = computed(() => {
    var colNumber = visibleColumnsNumber.value;

    if(props.config.bulkOperation && props.config.bulkOperation.active) {
      ++colNumber;
    }

    if(props.config && props.config.extraRow && props.config.extraRow.active) {
      ++colNumber;
    }

    return colNumber
  });

  const titlesVisible = computed(() => {
    state.updateKey; // to trigger the reactivity when updateKey changes
    return columnsVisible.titlesVisible(props.config);
  });

  const mappingVisible = computed(() => {
    state.updateKey; // to trigger the reactivity when updateKey changes
    return columnsVisible.mappingVisible(props.config);
  })

  const needsToShowAdditionalOperationsDropdown = computed(() => {
    return (props.config.columnSelector && props.config.columnSelector.active) 
    || (props.config.refreshable && props.config.refreshable.autoActive && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length)
    || (props.config.pagination && props.config.pagination.possiblePageSizes)
    || (props.config.xlsxExport && props.config.xlsxExport.active)
    || (props.config.bulkOperation && props.config.bulkOperation.active)
  })

  const needsToShowTopFiltersBar = computed(() => {
    return (props.config.filtering && props.config.filtering.active) || needsToShowAdditionalOperationsDropdown;
  })

  function isRecordMatchTheCurrentFiltering(record) {
    return localSortAndFilter.isRecordMatchTheCurrentFiltering(record, state.filters, state.filterOperator);
  }

  function sortRecords(recArray, field, direction) {
    return localSortAndFilter.sortRecords(recArray, field, direction, props.config.mapping[field]);
  }

  const filteredOrderedRecords = computed(() => {
    var filteredRecords = [];
    if(props.config.filtering && props.config.filtering.local) {
      for(var i in state.records) {
        if(isRecordMatchTheCurrentFiltering(state.records[i])) {
          filteredRecords.push(state.records[i]);
        }
      }
    }
    else {
      filteredRecords = state.records;
    }

    if(props.config.orderLocal) {
      if(state.order.active) {
        filteredRecords = sortRecords(filteredRecords, state.order.field, state.order.direction);
      }
      else {
        if(props.config.defaultOrderKey && props.config.defaultOrderDirection) {
          filteredRecords = sortRecords(filteredRecords, props.config.defaultOrderKey, props.config.defaultOrderDirection);
        }
      }
    }

    return filteredRecords;
  })

  const axiosParams = computed(() => {
    const params = new URLSearchParams();

    if(!props.config.orderLocal) {
      if(state.order.active) {
        if(props.config.mapping[state.order.field].orderKey) {
          params.append('OrderBy', [props.config.mapping[state.order.field].orderKey + " " + state.order.direction]);
        }
        else {
          params.append('OrderBy', [state.order.field + " " + state.order.direction]);
        }
      }
      else {
        if(props.config.defaultOrderKey && props.config.defaultOrderDirection) {
          params.append('OrderBy', [props.config.defaultOrderKey + " " + props.config.defaultOrderDirection]);
        }
      }
    }

    if(state.pagination.active) {
      params.append('Page', state.pagination.page + 1);
      params.append('PageSize', state.pagination.size);
    }

    if(!props.config.filtering.local) {
      if(state.filters && state.filters.length > 1) {
        params.append('filter_operator', state.filterOperator);
      }

      var newFilters = [];

      for(var i in state.filters) { // @TODO: refactor this part to a separate function and make support for multiple type of filters
        if(state.filters[i].type == "text") {
          if(state.filters[i].operation == "eq") {
            newFilters.push(state.filters[i].filterKey + "=" + state.filters[i].value);
          }
          if(state.filters[i].operation == "cn") {
            newFilters.push(state.filters[i].filterKey + "=*" + state.filters[i].value);
          }
          if(state.filters[i].operation == "bw") {
            newFilters.push(state.filters[i].filterKey + "^" + state.filters[i].value);
          }
          if(state.filters[i].operation == "ew") {
            newFilters.push(state.filters[i].filterKey + "$" + state.filters[i].value);
          }
        }
        if(state.filters[i].type == "date") {
          if(state.filters[i].operation == "eq") {
            newFilters.push('(' + state.filters[i].filterKey + ">=" + state.filters[i].value+'T00:00:00Z' + ',' + state.filters[i].filterKey + "<=" + state.filters[i].value+'T23:59:59Z' + ')');
          }
          if(state.filters[i].operation == "bw") {
            newFilters.push('(' + state.filters[i].filterKey + ">=" + state.filters[i].value.start+'T00:00:00Z' + ',' + state.filters[i].filterKey + "<=" + state.filters[i].value.end+'T23:59:59Z' + ')');
            //newFilters.push(state.filters[i].filterKey + "=*" + state.filters[i].value);
          }
        }
        if(state.filters[i].type == "number") {
          if(state.filters[i].operation == "eq") {
            newFilters.push(state.filters[i].filterKey + "=" + state.filters[i].value);
          }
          if(state.filters[i].operation == "lt") {
            newFilters.push(state.filters[i].filterKey + "<" + state.filters[i].value);
          }
          if(state.filters[i].operation == "le") {
            newFilters.push(state.filters[i].filterKey + "<=" + state.filters[i].value);
          }
          if(state.filters[i].operation == "gt") {
            newFilters.push(state.filters[i].filterKey + ">" + state.filters[i].value);
          }
          if(state.filters[i].operation == "ge") {
            newFilters.push(state.filters[i].filterKey + ">=" + state.filters[i].value);
          }
          if(state.filters[i].operation == "ne") {
            newFilters.push(state.filters[i].filterKey + "!=" + state.filters[i].value);
          }
        }
        if(state.filters[i].type == "status" && state.filters[i].value && state.filters[i].value.length > 0) {
          let cFilters = [];
          for(let l in state.filters[i].value) {
            cFilters.push(state.filters[i].filterKey + "=" + state.filters[i].value[l]);
          }
          newFilters.push("(" + cFilters.join('|') + ")");
        }
        // var cFilter = JSON.parse(JSON.stringify(state.filters[i]));
        // if(cFilter.type == "date") {
        //   cFilter.field = cFilter.field + "Date"
        // }
        // newFilters.push(cFilter);
      }

      if(newFilters.length > 0) {
        let filterOper = '|';
        if(params.get('filter_operator')) {
          if(params.get('filter_operator').toLowerCase() == 'and') {
            filterOper = ',';
          }
        }

        if(props.config.filtering && props.config.filtering.defaultFilter) {
          params.append('Filter', '(' + props.config.filtering.defaultFilter + '),(' + newFilters.join(filterOper) + ')')
        }
        else {
          params.append('Filter', newFilters.join(filterOper))
        }
        
      }
      else {
        let finalFilters = [];

        if(props.config.filtering && props.config.filtering.defaultFilter) {
          finalFilters.push(props.config.filtering.defaultFilter);
        }

        if(props.config.filtering && props.config.filtering.simple && state.simpleFilter) {
          finalFilters.push(props.config.filtering.simpleFilterTemplate.replaceAll('{data}', state.simpleFilter));
        }

        if(finalFilters.length > 0) {
          params.append('Filter', '(' + finalFilters.join('),(') + ')')
        }
      }
    }

    return params;
  })

  async function refetchData() {
    try {
      if (!state.refreshNeeded) {
        return;
      }

      const response = await Axios.get(props.config.endpoint, {
        params: axiosParams.value,
        onTokenRefreshed: () => {
          refetchData();
        }
      });

      let resData = response.data;
      if(typeof resData == "string") {
        resData = JSON.parse(resData);
      }

      var rec = null;
      if (props.config.rootkey) {
        rec = resData[props.config.rootkey];
      }
      else {
        rec = resData;
      }

      if(props.config.events && props.config.events.onDataLoad) {
        var eventResult = props.config.events.onDataLoad(rec);
        if(typeof eventResult == "object") {
          rec = eventResult;
        }
      }

      if(props.config.events && props.config.events.onDataLoadWithFullResponse) {
        props.config.events.onDataLoadWithFullResponse(response);
      }

      if(state.registeredEvents && state.registeredEvents.onDataLoad) {
        state.registeredEvents.onDataLoad(rec);
      }

      state.records = rec;

      if(props.config.pagination && props.config.pagination.active) {
        state.pagination.totalPages = Math.ceil(resData.count / state.pagination.size); // @TODO: Refactor to configurate response data
        state.pagination.totalElements = resData.count
      }

      if(props.config.events && props.config.events.readyAfterRefresh) {
        nextTick(function () {
          props.config.events.readyAfterRefresh();
        });
      }

      state.refreshNeeded = false;
    } catch (error) {
      //console.log(error);
    }
  }

  watch(() => state.refreshNeeded, () => {
    refetchData()
  })

  function isExtraRowMultiOpenEnable() {
    if(props.config && props.config.extraRow && props.config.extraRow.multiOpen) {
      return true;
    }
    else {
      return false;
    }
  }

  function mainRowClick(recordId) {
    if(!isExtraRowEnabled) {
      return;
    }

    if(state.openedRow.includes(recordId)) {
      state.openedRow.splice(state.openedRow.indexOf(recordId), 1)
    }
    else {
      if(isExtraRowMultiOpenEnable) {
        state.openedRow.push(recordId);
      }
      else {
        state.openedRow = [recordId];
      }
    }
  }

  onMounted(() => {


    // if(this.route.query && this.route.query.filters) { // @TODO: Refactor this to not depend on the vue-router
    //   try {
    //     this.filters = JSON.parse(Utils.atob_utf8(this.route.query.filters));
    //   }
    //   catch(e) {
    //     console.log("Invalid query filters, BASE64 parse or JSON decode failed...");
    //   }
    // }

    // if(this.route.query && this.route.query.filter_operator && (this.route.query.filter_operator == "OR" || this.route.query.filter_operator == "AND")) { // @TODO: Refactor this to not depend on the vue-router
    //   this.filterOperator = this.route.query.filter_operator;
    // }


    // if(this.route.hash) { // @TODO: Refactor this to not depend on the vue-router
    //   var hashParts = this.route.hash.split("-");
    //   const id = parseInt(hashParts[1]);
    //   this.mainRowClick(id)
    // }

    nextTick(() => {
      gridRefresh();
    })

    // var changeTableHeight = function() {
    //   const element = document.getElementById('RVGHeightConfiguration')
    //   element.style.height = (window.innerHeight - 250)+"px";
    // }
    // window.addEventListener('resize', changeTableHeight);

    //changeTableHeight()
  })
</script>