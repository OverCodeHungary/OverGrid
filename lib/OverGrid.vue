<template>
  <div :class="'og-theme-' + theme">
    <div class="flex flex-col gap-3 overgrid">
      <slot name="title"></slot>

      <div class="flex flex-col gap-3 sm:!flex-row sm:gap-0 justify-between" v-if="needsToShowTopFiltersBar">
        <Filtering 
          :l="i18n.l"
          :config="props.config"
          :setNewFiltersAndRefresh="(newFilters: any) => { state.filters = newFilters.filters; state.filterOperator = newFilters.filterOperator; state.simpleFilter = newFilters.simpleFilter; gridRefresh(); }"
          />

        <div class="flex flex-row items-center gap-2">
          <!-- REFRESH INDICATOR -->
          <span class="" v-if="state.refreshNeeded">
            <SpinnerLoader sizeClasses="w-5 h-5" />
          </span>
          <!-- REFRESH INDICATOR -->

          <!-- BULK OPERATION -->
            <BulkOperations
              :l="i18n.l"
              :config="props.config"
              :checkedRows="state.checkedRows"
              :changeCheckedRows="(checkedRows: any) => { state.checkedRows = checkedRows; }"
              v-if="props.config?.bulkOperation && props.config.bulkOperation.active" />
          <!-- BULK OPERATION -->

          <!-- MANUAL REFRESH -->
          <button v-if="props.config.refreshable && props.config.refreshable.manualActive" title="Lista frissítése" @click="() => { state.refreshNeeded = true }" class="rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <!-- MANUAL REFRESH -->

          <DropDown ref="operationsDropdown" v-if="needsToShowAdditionalOperationsDropdown" :theme="theme">
            <button class="rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <template #content>
              <div class="flex flex-col p-1.5 w-full">
                <ul>
                  <li>
                    <h3 class="font-bold og-text-compact">
                      {{ i18n.l('operations') }}
                    </h3>
                  </li>
                </ul>
                <ul v-if="props.config.columnSelector && props.config.columnSelector.active">
                  <li>
                    <a href="javascript:void(null)" @click="() => { state.showColumnSelectorModal = true; }" class="flex flex-row gap-1 items-center ml-1 mt-1 og-operation-link">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span class="og-text-compact">{{ i18n.l('select_columns') }}</span>
                    </a>
                  </li>
                </ul>
                <ul class="mt-1.5" v-if="props.config.xlsxExport && props.config.xlsxExport.active && state.records.length > 0">
                  <li>
                    <a href="javascript:void(null)" @click="() => { state.showXlsxExportModal = true; }" class="flex flex-row gap-1 items-center ml-1 mt-0 og-operation-link">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                      <span class="og-text-compact">{{ i18n.l('export_records') }}</span>
                    </a>
                  </li>
                </ul>

                <AutoRefresh
                  :l="i18n.l"
                  class="mt-3"
                  v-if="props.config.refreshable && props.config.refreshable.autoActive && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length > 0"
                  :gridRefresh="() => { gridRefresh() }"
                  :config="props.config" />

                <ChangePageSize
                  :l="i18n.l"
                  class="mt-3"
                  v-if="props.config.pagination && props.config.pagination.possiblePageSizes"
                  :config="props.config"
                  :changePageSize="(newPageSize: any) => { state.pagination.size = newPageSize; gridRefresh(); }" />

                  <ul class="mt-4 border-t-[1px] border-slate-300" v-if="props.config.hideAboutWindow !== true">
                    <li class="pt-2">
                      <a class="flex flex-row gap-1 items-center ml-1 mt-1 og-text-compact og-operation-link" href="javascript:void(null)" @click="() => { state.showAboutWindow = true }">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 mr-1">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                        </svg>
                        <span>{{ i18n.l('about') }}</span>
                      </a>
                    </li>
                  </ul>

              </div>
            </template>
          </DropDown>

          <ColumnSelector 
            :l="i18n.l"
            v-if="props.config.columnSelector && props.config.columnSelector.active"
            :showModal="state.showColumnSelectorModal"
            :closeDropdown="closeOperationDropdown"
            :closeModal="() => { state.showColumnSelectorModal = false; }"
            :dataMapping="props.config.mapping" 
            :gridUniqueId="props.config.gridUniqueId"
            :rerender="() => { gridRefresh() }" />

          <XlsxExport 
            :l="i18n.l"
            v-if="props.config.xlsxExport && props.config.xlsxExport.active && state.records.length > 0"
            :showModal="state.showXlsxExportModal"
            :closeModal="() => { state.showXlsxExportModal = false; }"
            :closeDropdown="closeOperationDropdown"
            :xlsxExportConfig="props.config.xlsxExport" 
            :dataMapping="props.config.mapping" 
            :records="state.records" />

        </div>
      </div>

      <!-- GRID -->
      <div :key="state.updateKey" class="">
        <div class="overflow-x-scroll">
          <table class="w-full text-left">
            <thead class="og-table-thead">
              <tr class="">
                <th class="" width="30px" v-if="isExtraRowEnabled"></th>
                <th class="" width="30px" v-if="(props.config.bulkOperation && props.config.bulkOperation.active) || (props.config.singleRowSelection && props.config.singleRowSelection.active)">
                  <label class="">
                  </label>
                </th>
                <th class="" v-for="(value, index) in titlesVisible" :key="'tvbl_' + index" :width="value.width">
                  <div class="flex flex-row items-center gap-0.5">
                    <span class="whitespace-nowrap og-text-compact mr-1">{{ value.title }}</span>
                    <button v-if="value.orderable == true" v-show="(state.order.active && state.order.field == value.key) || !state.order.active" :title="(state.order.active && state.order.field == value.key && state.order.direction == OrderDirection.desc) ? i18n.l('descending') : i18n.l('ascending')" :class="['og-btn og-btn-secondary og-btn-circle og-btn-sm', {'': state.order.active && state.order.field == value.key}]" @click="orderChange($event, value.key)">
                      <svg v-if="state.order.active && state.order.field == value.key && state.order.direction == OrderDirection.asc" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                      </svg>
                      <svg v-if="state.order.active && state.order.field == value.key && state.order.direction == OrderDirection.desc" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                      </svg>
                      <svg v-if="!state.order.active" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                      </svg>
                    </button>
                    <button :title="i18n.l('remove_order')" class="og-btn og-btn-primary og-btn-circle og-btn-sm" v-if="state.order.active && state.order.field == value.key" @click="removeOrder">
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
                <tr data-test="OverGridRow" :data-rowid="record[props.config.idkey]" :class="[{ 'og-row-opened': state.openedRow.includes(record[props.config.idkey]) }, 'og-row', { 'bg-error/10': props.config.rowHighlighter && props.config.rowHighlighter.active && props.config.rowHighlighter.fn(record) }]" >
                  <td class="og-cell og-text-compact" width="30px" v-if="isExtraRowEnabled">
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
                  <td class="og-cell og-text-compact" width="30px" v-if="(props.config.bulkOperation && props.config.bulkOperation.active)">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        :value="record[props.config.idkey]" v-model="state.checkedRows"
                        class="og-checkbox"
                        type="checkbox"
                      />
                    </label>
                  </td>
                  <td class="og-cell og-text-compact" width="30px" v-if="(props.config.singleRowSelection && props.config.singleRowSelection.active)">
                    <label class="inline-flex items-center space-x-2">
                      <input
                        :value="record[props.config.idkey]" v-model="state.checkedRow"
                        class="og-radio"
                        type="radio"
                      />
                    </label>
                  </td>
                  <td class="og-cell og-text-compact" :class="[{ 'sticky': value.sticky }]" v-for="(value, cmNameBody) in mappingVisible" :key="cmNameBody">
                    <span v-if="value.formatter && typeof value.formatter == 'object' && value.formatter.type">
                      <RootFormatter 
                        :l="i18n.l"
                        :theme="props.config.theme ? props.config.theme : 'default'"
                        :type="'OGFormatter' + value.formatter.type" 
                        :data="value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody]" 
                        :formatter="value.formatter ? value.formatter : null" 
                        :rowid="record[props.config.idkey]" 
                        :field="cmNameBody.toString()" 
                        :record="record" 
                        :refreshGrid="() => { state.refreshNeeded=true }" 
                        :customFormatters="props.customFormatters"
                        :openExtraRow="(recordId: any) => { mainRowClick(recordId) }" />
                    </span>
                    <span v-else-if="value.formatter && typeof value.formatter == 'function'" v-html="value.formatter(value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody], () => { state.refreshNeeded=true }, record[props.config.idkey], record)" />
                    <span v-else>
                      {{ value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody] }}
                    </span>
                  </td>
                </tr>
                <Transition name="og-extra-row">
                  <tr v-show="isRowOpened(record[props.config.idkey])">
                    <td :colspan="colNumber">
                      <slot v-bind:record="record" v-bind:extraParams="props.config.extraRow?.extraParams" name="extraRow"></slot>
                    </td>
                  </tr>
                </Transition>
              </template>
            </tbody>
            <tbody v-else>
              <tr v-if="!state.refreshNeeded">
                <td :colspan="Object.keys(titlesVisible).length" class="w-full text-left p-5">
                  <div class="flex flex-row items-center justify-start gap-2">
                    <span class="whitespace-nowrap !p-0 ![clip:rect(0,0,0,0)]">
                      {{ i18n.l('there_is_no_data_here') }}
                    </span>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td :colspan="Object.keys(titlesVisible).length" class="w-full max-w-xl !text-left p-5">
                  <div class="flex flex-row items-start justify-start gap-2">
                    <span class="whitespace-nowrap !p-0 ![clip:rect(0,0,0,0)]">
                      {{ i18n.l('loading_data') }}
                    </span>
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
          :changePagination="(newPagination: any) => { state.pagination.active = newPagination.active; state.pagination.page = newPagination.page; }"
          :gridRefresh="() => { gridRefresh() }"
          v-if="props.config.pagination && props.config.pagination.active && state.pagination.totalPages && state.pagination.totalPages > 1" />
      <!-- PAGINATION -->

      <!-- ABOUT WINDOW -->
        <AboutWindow 
          :l="i18n.l"
          :showModal="state.showAboutWindow"
          :closeModal="() => { state.showAboutWindow = false }"
          :closeDropdown="closeOperationDropdown" />
      <!-- ABOUT WINDOW -->

    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, computed, watch, nextTick, onMounted } from 'vue';
  import Filtering from './components/Filtering/Filtering.vue';
  import SpinnerLoader from './components/SpinnerLoader.vue';
  import DropDown from './components/DropDown.vue';
  import useAxios from './composables/useAxios';
  import useColumnsVisible from './composables/useColumnsVisible';
  import useLocalSortAndFilter from './composables/useLocalSortAndFilter';
  import ColumnSelector from './components/ColumnSelector/ColumnSelector.vue';
  import XlsxExport from './components/XlsxExport/XlsxExport.vue';
  import RootFormatter from './formatter/RootFormatter.vue';
  import Pagination from './components/Pagination/Pagination.vue';
  import ChangePageSize from './components/Pagination/ChangePageSize.vue';
  import AutoRefresh from './components/AutoRefresh/AutoRefresh.vue';
  import BulkOperations from './components/BulkOperations/BulkOperations.vue';
  import DefaultTransformation from './integrations/DefaultTransformation';
  import { FilteringClass, FilteringFilter, FilteringOperator } from './components/model/Filtering';
  import { Ordering, OrderDirection } from './components/model/Ordering';
  import { PaginationClass } from './components/model/Pagination';
  import AboutWindow from './components/AboutWindow/AboutWindow.vue';
  const columnsVisible = useColumnsVisible();
  const localSortAndFilter = useLocalSortAndFilter();
  import useI18n from './composables/useI18n';
  
  import { OverGridConfig } from './components/model/OverGridConfig';
  import './themes/default.css'

  const operationsDropdown = ref<typeof DropDown>();

  const props = defineProps<{
    config: OverGridConfig,
    customFormatters: any[]
  }>();
  const i18n = useI18n(props.config.locale);
  const state = reactive<{
    refreshNeeded: boolean,
    updateKey: number,
    records: any[],
    registeredEvents: any,
    openedRow: any[],
    filters: any,
    filterOperator: FilteringOperator,
    simpleFilter: string,
    checkedRows: any[],
    checkedRow: any,
    showColumnSelectorModal: boolean,
    autoRefresh: string,
    autoRefreshInterval: any,
    showAboutWindow: boolean,
    pagination: {
      active: boolean,
      page: number,
      size: number,
      totalPages: number | null,
      totalElements: number | null
    },
    order: {
      active: boolean,
      field: string | null,
      direction: OrderDirection
    },
    showXlsxExportModal: boolean
  }>({
    refreshNeeded: false,
    updateKey: 0,
    records: [],
    registeredEvents: {},
    showAboutWindow: false,

    /* EXTRA ROW */
    openedRow: [] as any[],
    /* EXTRA ROW */

    /* FILTERING */
    filters: {},
    filterOperator: FilteringOperator.and,
    simpleFilter: '',
    /* FILTERING */

    /* BULK OPERATIONS */
    checkedRows: [],
    checkedRow: null,
    //bulkMethod: 'null',
    /* BULK OPERATIONS */

    /* COLUMN SELECTOR */
    showColumnSelectorModal: false,
    /* COLUMN SELECTOR */

    /* AUTO REFRESH */
    autoRefresh: 'disabled',
    autoRefreshInterval: null,
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
      direction: OrderDirection.asc
    },
    /* ORDER */

    /* XLSX EXPORT */
    showXlsxExportModal: false,
    /* XLSX EXPORT */
  });
  
  const Axios = useAxios(props.config.axiosConfigurator);

  const theme = computed(() => {
    return props.config.theme ? props.config.theme : 'default';
  })

  /* EXTRA ROW */
  const isExtraRowEnabled = computed(() => {
    if(props.config && props.config.extraRow && props.config.extraRow.active) {
      return true;
    }
    else {
      return false;
    }
  })

  function isRowOpened(recordId: any) {
    return state.openedRow.includes(recordId);
  }
  /* EXTRA ROW */

  /* ORDER */
  function removeOrder() {
    state.order.active = false;
    state.order.field = null;
    state.order.direction = OrderDirection.asc;
    if(!props.config.orderLocal) {
      state.refreshNeeded = true
    }
  }

  function closeOperationDropdown() {
    nextTick(() => {
      if (operationsDropdown.value) {
        operationsDropdown.value.close();
      }
    })
  }

  function orderChange(event: Event, field: string) {
    if (!state.order.active) {
      state.order.active = true
      state.order.field = field
    }
    else {
      if (state.order.field == field) {
        if (state.order.direction == OrderDirection.asc) {
          state.order.direction = OrderDirection.desc
        }
        else {
          state.order.direction = OrderDirection.asc
        }
      }
      else {
        state.order.field = field
        state.order.direction = OrderDirection.asc
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

  const mappingVisible = computed<{
    [key: string]: any
  }>(() => {
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

  function isRecordMatchTheCurrentFiltering(record: any) {
    return localSortAndFilter.isRecordMatchTheCurrentFiltering(record, state.filters, state.filterOperator);
  }

  function sortRecords(recArray: any, field: string, direction: OrderDirection) {
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
        filteredRecords = sortRecords(filteredRecords, state.order.field ? state.order.field : '', state.order.direction);
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
    //const params = new URLSearchParams();

    let filtering = new FilteringClass();
    let ordering = new Ordering();
    let pagination = new PaginationClass();

    let isOrderActive = false;
    let orderKey = null;
    let orderDirection: OrderDirection = OrderDirection.asc;
    if(!props.config?.orderLocal) {
      if(state.order.active && state.order.field) {
        isOrderActive = true;
        orderKey = props.config.mapping[state.order.field].orderKey ? props.config.mapping[state.order.field].orderKey : state.order.field;
        orderDirection = state.order.direction;
      }
      else {
        if(props.config.defaultOrderKey && props.config.defaultOrderDirection) {
          isOrderActive = true;
          orderKey = props.config.defaultOrderKey;
          orderDirection = props.config.defaultOrderDirection;
        }
      }
    }

    ordering.initByState(
      isOrderActive,
      orderKey !== null && orderKey !== undefined ? orderKey : undefined, 
      orderDirection
    );

    pagination.initByState(
      state.pagination.active, 
      state.pagination.page, 
      state.pagination.size
    );
    
    filtering.initByState(
      !!(props.config.filtering && props.config.filtering.active && !props.config.filtering.local && (state.filters.length > 0 || props.config.filtering.simple)),
      state.filters, 
      state.filterOperator, 
      !!(props.config.filtering && props.config.filtering.simple),
      state.simpleFilter
    );

    if(props.config && props.config.serverTransformation) {
      return props.config.serverTransformation(ordering, pagination, filtering);
    }
    else {
      return DefaultTransformation(ordering, pagination, filtering);
    }
  })

  async function refetchData() {
    try {
      if (!state.refreshNeeded) {
        return;
      }

      const response = await Axios.get(props.config.endpoint, {
        params: axiosParams.value,
        // onTokenRefreshed: () => {
        //   refetchData();
        // }
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

      let allRecordsCountKey = props.config.filtering?.allRecordsCountKey ? props.config.filtering?.allRecordsCountKey : 'count';
      if(props.config.pagination && props.config.pagination.active) {
        state.pagination.totalPages = Math.ceil(resData[allRecordsCountKey] / state.pagination.size);
        state.pagination.totalElements = resData[allRecordsCountKey]
      }

      nextTick(function () {
        if(props.config.events && props.config.events.readyAfterRefresh) {
        props.config.events?.readyAfterRefresh();
        }
      });

      state.refreshNeeded = false;
    } catch (error) {
      //console.log(error);
    }
  }

  watch(() => state.refreshNeeded, (newValue) => {
    if(newValue) {
      refetchData()
    }
  })

  function isExtraRowMultiOpenEnable() {
    if(props.config && props.config.extraRow && props.config.extraRow.multiOpen) {
      return true;
    }
    else {
      return false;
    }
  }

  function mainRowClick(recordId: any) {
    if(!isExtraRowEnabled) {
      return;
    }

    if(state.openedRow.includes(recordId)) {
      state.openedRow.splice(state.openedRow.indexOf(recordId), 1)
    }
    else {
      if(isExtraRowMultiOpenEnable()) {
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

    if(props.config.pagination && props.config.pagination.active) {
      state.pagination.active = true;
      state.pagination.page = props.config.pagination.page;
    }

    nextTick(() => {
      gridRefresh();
    })

  })

  defineExpose({
    FilteringClass,
    FilteringFilter,
    FilteringOperator,
    Ordering,
    OrderDirection,
    PaginationClass
  })
</script>

<style scoped>
  /* .og-extra-row-enter-active,
  .og-extra-row-leave-active {
    transform: scale3d(1, 1, 1);
    transform-origin: top;
    transition: ease 0.2s;
  }
  .og-extra-row-enter-from,
  .og-extra-row-leave-to {
    transform: scale3d(1, 0, 1);
  } */
</style>