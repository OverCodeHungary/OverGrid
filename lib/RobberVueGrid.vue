<template>
  
  <div class="flex flex-col">
    <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
      {{ props.config.title }}
    </h2>

    <div class="flex flex-row justify-between">
      <RVGFiltering 
        :config="props.config"
        :gridRefreshFn="gridRefresh"
        />

      <div class="flex flex-row items-center gap-2">
        <!-- REFRESH INDICATOR -->
        <span class="text-xs text-slate-400 dark:text-navy-300 gridRefreshedIndicator mr-3" v-if="state.refreshNeeded">
          <SpinnerLoader sizeClasses="w-5 h-5" />
        </span>
        <!-- REFRESH INDICATOR -->

        <!-- BULK OPERATION -->
        <span v-if="props.config.bulkOperation && props.config.bulkOperation.active">
          <select :disabled="state.checkedRows.length <= 0" v-model="state.bulkMethod" @change="onBulkMethod" class="disabled:opacity-40 form-select mt-1 h-8 pr-8 w-48 rounded-lg border border-slate-300 bg-white px-2.5 text-xs+ hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
            <option v-if="state.checkedRows.length <= 0" value="null">Tömeges művelet</option>
            <option v-else value="null">{{ state.checkedRows.length }} sor kiválasztva</option>
            <option v-for="method in props.config.bulkOperation.methods" :value="method.key" :key="method.key">{{ method.title }}</option>
          </select>
        </span>
        <!-- BULK OPERATION -->

        <!-- MANUAL REFRESH -->
        <button v-if="props.config.refreshable && props.config.refreshable.manualActive" title="Lista frissítése" @click="state.refreshNeeded = true" class="bg-slate-200 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <!-- MANUAL REFRESH -->

        <DropDown ref="operationsDropdown">
          <button class="bg-slate-200 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <template #content>

            <div class="flex flex-col">
              <!-- MENU:COLUMN SELECTOR -->
              <ul v-if="props.config.columnSelector && props.config.columnSelector.active">
                <li>
                  <h3 class="font-bold">
                    {{ i18n.l('column_selector_menu_title') }}
                  </h3>
                </li>
                <li>
                  <a href="javascript:void(null)" @click="() => { state.showColumnSelectorModal = true; operationsDropdown.close()  }" class="flex flex-row gap-1 items-center ml-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span class="">{{ i18n.l('rvg-select-columns') }}</span>
                  </a>
                </li>
              </ul>
              <!-- MENU:COLUMN SELECTOR -->

              <!-- MENU:AUTO REFRESH -->
              <ul class="mt-4" v-if="props.config.refreshable && props.config.refreshable.autoActive && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length > 0">
                <li class="px-3">
                  <h3 class="font-bold">
                    {{ i18n.l('auto_refresh_menu_title') }}
                  </h3>
                </li>
                <li v-if="props.config.refreshable && props.config.refreshable.autoCanBeDisabled">
                  <a href="javascript:void(null)" @click="changeAutoRefreshValue('disabled')" class="flex flex-row gap-1 items-center ml-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-slate-600" :class="[{ '!text-red-500': state.autoRefresh == 'disabled' }]" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="">{{ i18n.l('automatic-list-update-disabled') }}</span>
                  </a>
                </li>
                <li v-for="(value) in props.config.refreshable.autoValues" :key="value.key" >
                  <a href="javascript:void(null)" @click="changeAutoRefreshValue(value.key)" class="flex flex-row gap-1 items-center ml-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg"  class="h-5 w-5 mr-1 text-slate-600" :class="[{ '!text-red-500': state.autoRefresh == value.key }]" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="">{{ value.title }}</span>
                  </a>
                </li>
              </ul>
              <!-- MENU:AUTO REFRESH -->

              <!-- MENU:PAGE SIZE -->
              <ul class="mt-4" v-if="props.config.pagination && props.config.pagination.possiblePageSizes">
                <li class="px-3">
                  <h3 class="text-base font-medium tracking-wide text-slate-700 dark:text-slate-300 line-clamp-1">{{ i18n.l('rvg-page-size') }}</h3>
                </li>
                <li v-for="(possiblePageSize, key) in props.config.pagination.possiblePageSizes" :key="key">
                  <a href="javascript:void(null)" @click="changePageSize(possiblePageSize)" class="flex flex-row gap-1 items-center ml-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" :class="[{ '!text-red-500': state.pagination.size == possiblePageSize }]" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ i18n.l('rvg-rows-per-page', { possiblePageSize }) }}</span>
                  </a>
                </li>
              </ul>
              <!-- MENU:PAGE SIZE -->

              <!-- MENU:XLSX EXPORT-->
              <ul v-if="props.config.xlsxExport && props.config.xlsxExport.active && state.records.length > 0" class="mt-4">
                <li class="pt-1">
                  <a href="javascript:void(null)" @click="() => { state.showXlsxExportModal = true; }" class="flex flex-row gap-1 items-center ml-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <span>{{ i18n.l('rvg-export-records-link-text') }}</span>
                  </a>
                </li>
              </ul>
              <!-- MENU:XLSX EXPORT-->

            </div>

          </template>
        </DropDown>
      </div>

      <RVGColumnSelector 
        v-if="props.config.columnSelector && props.config.columnSelector.active"
        :showModal="state.showColumnSelectorModal" 
        :hideModal="() => { state.showColumnSelectorModal = false }" 
        data-test="RVGColumnSelector" 
        :dataMapping="props.config.mapping" 
        :gridUniqueId="props.config.gridUniqueId"
        :rerender="gridRefresh" />

      <RVGXlsxExport 
        :showModal="state.showXlsxExportModal" 
        :hideModal="() => { state.showXlsxExportModal = false }" 
        data-test="RVGXlxsExport" 
        v-if="props.config.xlsxExport && props.config.xlsxExport.active" 
        :xlsxExportConfig="props.config.xlsxExport" 
        :dataMapping="props.config.mapping" 
        :records="state.records" />
    </div>

    <!-- GRID -->
    <div class="overflow-visible w-full card scrollbar scrollbar-h-5 scrollbar-thumb-slate-300 scrollbar-track-slate-200 dark:scrollbar-track-navy-800 dark:scrollbar-thumb-navy-500 scrollbar-thumb-rounded-full">
      <div class="overflow-x-scroll rounded-lg">
        <table class="w-full text-left">
          <thead>
            <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-3" width="30px" v-if="isExtraRowEnabled"></th>
              <th class="whitespace-nowrap bg-slate-200 dark:bg-navy-800" width="30px" v-if="(props.config.bulkOperation && props.config.bulkOperation.active) || (props.config.singleRowSelection && props.config.singleRowSelection.active)">
                <label class="inline-flex items-center space-x-2">
                </label>
              </th>
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-2" v-for="(value, index) in titlesVisible" :key="index" :width="value.width">
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
              <tr data-test="RobberVueGridRow" :data-rowid="record[props.config.idkey]" :class="[{ 'extraRowOpened': state.openedRow.includes(record[props.config.idkey]) }, 'RobberVueGridRow border-y border-transparent border-b-slate-200 dark:border-b-navy-500 dark:hover:bg-slate-700 hover:bg-slate-100', { 'bg-error/10': props.config.rowHightlighter && props.config.rowHightlighter.active && props.config.rowHightlighter.fn(record) }]" >
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="isExtraRowEnabled">
                  <button variant="link" class="RVGExtraRowOpenLink" v-if="(!state.openedRow.includes(record[props.config.idkey]))" @click="() => { mainRowClick(record[props.config.idkey]) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button variant="link" class="RVGExtraRowCloseLink" v-if="(state.openedRow.includes(record[props.config.idkey]))" @click="() => { mainRowClick(record[props.config.idkey]) }">
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
                    <component v-bind:is="'RVG' + value.formatter.type" :data="value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody]" :config="value" :rowid="record[props.config.idkey]" :field="cmNameBody" :record="record" @refreshGrid="state.refreshNeeded=true" :openExtraRow="(recordId) => { mainRowClick(recordId) }" />
                  </span>
                  <span v-else-if="value.formatter && typeof value.formatter == 'function'" v-html="value.formatter(value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody], () => { state.refreshNeeded=true }, record[props.config.idkey], record)" />
                  <span v-else>
                    {{ value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody] }}
                  </span>
                </td>
              </tr>
              <tr class="RVGExtraRow" v-if="isRowOpened(record[props.config.idkey])">
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
    <div class="mt-3 w-full flex items-center justify-center" v-if="props.config.pagination && props.config.pagination.active && state.pagination.totalPages > 1">

      <ol class="flex flex-row items-center gap-3">
        <li>
          <button :disabled="isPaginationBackDisabled" @click="paginationBack" data-test="RVGPaginationBack" class="disabled:opacity-50 flex h-8 w-8 items-center justify-center !rounded-full bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
        </li>
        <li>
          <div class="paginationNumbers">
            {{ state.pagination.page*state.pagination.size }} - {{ paginationEnd }} / {{ state.pagination.totalElements }}
          </div>
          <!-- <a href="#" class="flex h-8 min-w-[2rem] items-center justify-center !rounded-full bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">1</a> -->
        </li>
        <li>
          <button :disabled="isPaginationNextDisabled" @click="paginationNext" data-test="RVGPaginationNext" class="disabled:opacity-50 flex h-8 w-8 items-center justify-center !rounded-full bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewbox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </li>
      </ol>
      <SpinnerLoader v-if="refreshNeeded" />
    </div>
    <!-- PAGINATION -->

  </div>
</template>

<script setup>
  import { reactive, ref, computed, watch, nextTick, onMounted } from 'vue';
  import RVGFiltering from './components/Filtering/RVGFiltering.vue'
  import './default.css'
  import SpinnerLoader from './components/SpinnerLoader.vue';
  import DropDown from './components/DropDown.vue';
  import useI18n from './composables/useI18n';
  import useAxios from './composables/useAxios';
  import RVGColumnSelector from './components/ColumnSelector/RVGColumnSelector.vue';
  import RVGXlsxExport from './components/XlsxExport/RVGXlsxExport.vue';
  import RVGFilterableNumberConfig from './Filterables/RVGFilterableNumber.config.js';
  import RVGFilterableDateConfig from './Filterables/RVGFilterableDate.config.js';
  import RVGFilterableStatusConfig from './Filterables/RVGFilterableStatus.config.js';
  import RVGFilterableTextConfig from './Filterables/RVGFilterableText.config.js';
  const i18n = useI18n('hu');
  const Axios = useAxios();

  const operationsDropdown = ref(null);

  const props = defineProps({
    config: Object,
  });

  const state = reactive({
    refreshNeeded: false,
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
    bulkMethod: 'null',
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
      direction: 'asc'
    },
    /* ORDER */

    /* XLSX EXPORT */
    showXlsxExportModal: false,
    /* XLSX EXPORT */
  });

  /* BULK OPERATIONS */
    function onBulkMethod() {
      var actionFn;
      for(var i in props.config.bulkOperation.methods) {
        if(props.config.bulkOperation.methods[i].key == state.bulkMethod) {
          actionFn = props.config.bulkOperation.methods[i].action;
          break;
        }
      }
      
      if(actionFn) {
        var that = this;
        actionFn(state.checkedRows, () => {
          that.bulkMethod = "null";
          that.checkedRows = [];
        });
      }
    }

    watch(() => state.checkedRows, () => {
      if(props.config.events && props.config.events.onBulkSelectChanges) {
        props.config.events.onBulkSelectChanges(state.checkedRows);
      }
    })
  /* BULK OPERATIONS */

  /* AUTO REFRESH */
    function setAutoRefreshIntervalIfAny() {
      if(state.autoRefreshInterval) { // clearing the current interval, if any
        clearInterval(state.autoRefreshInterval);
        state.autoRefreshInterval = null;
      }

      if(!state.autoRefresh || state.autoRefresh == "disabled") { // if autoRefresh is not exists or its disabled, we should not start any interval task
        return ;
      }

      // finding the new refresh type, because we need the interval value
      var newRefreshType = null;
      if(props.config.refreshable && props.config.refreshable.autoValues && props.config.refreshable.autoValues.length > 0) {
        for(var i in props.config.refreshable.autoValues) {
          if(props.config.refreshable.autoValues[i].key == state.autoRefresh) {
            newRefreshType = props.config.refreshable.autoValues[i];
            break;
          }
        }
      }

      if(newRefreshType) {
        state.autoRefreshInterval = setInterval(() => {
          state.refreshNeeded = true;
        }, newRefreshType.refreshInterval * 1000);
      }
    }

    function changeAutoRefreshValue(key) {
      state.autoRefresh = key;
      if(props.config.refreshable && props.config.gridUniqueId) {
        localStorage.setItem('autorefreshvalue_' + props.config.gridUniqueId, state.autoRefresh)
      }
      setAutoRefreshIntervalIfAny();
    }
  /* AUTO REFRESH */

  /* PAGINATION */
  function changePageSize(size) {
    state.pagination.size = size;
    if(state.config.pagination && state.config.gridUniqueId) {
      localStorage.setItem('pagesizevalue_' + props.config.pagination.gridUniqueId, size)
    }
    refresh();
  }

  const isPaginationBackDisabled = computed(() => {
    if(state.pagination.page <= 0 || state.refreshNeeded) {
      return true;
    }

    return false;
  })

  const isPaginationNextDisabled = computed(() => {
    if((state.pagination.page+1) >= state.pagination.totalPages || state.refreshNeeded) {
      return true;
    }

    return false;
  })

  const paginationStart = computed(() => {
    return state.pagination.page * state.pagination.size;
  })

  const paginationEnd = computed(() => {
    var p = (state.pagination.page+1) * state.pagination.size;
    if(p > state.pagination.totalElements) {
      p = state.pagination.totalElements
    }

    return p
  })

  function paginationBack() {
    if (state.pagination.page > 0) {
      state.pagination.page = state.pagination.page - 1;
      state.refreshNeeded = true;
    }
  }

  function paginationNext() {
    if (state.pagination.page < state.pagination.totalPages) {
      state.pagination.page = state.pagination.page + 1;
      state.refreshNeeded = true;
    }
  }
  /* PAGINATION */

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
    state.refreshNeeded = true;
  }

  function refresh() {
    state.refreshNeeded = true;
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
    var enabledColumns = false;
    if(props.config.columnSelector && props.config.columnSelector.active) {
      enabledColumns = localStorage.getItem('columns_' + props.config.gridUniqueId);

      if(enabledColumns) {
        enabledColumns = enabledColumns.split(',');
      }
    }

    var titles = {};
    for(var i in props.config.mapping) {
      if(props.config.mapping[i].visible) {
        if(!enabledColumns || (typeof enabledColumns == "object" && enabledColumns.indexOf(i) > -1)) {
          titles[i] = {
            key: i,
            title: props.config.mapping[i].title,
            orderable: props.config.mapping[i].orderable,
            filterable: props.config.mapping[i].filterable,
            filterable_config: props.config.mapping[i].filterable_config,
            width: props.config.mapping[i].width
          };
        }
      }
    }

    return titles;
  });

  const mappingVisible = computed(() => {
    var enabledColumns = false;
    if(props.config.columnSelector && props.config.columnSelector.active) {
      enabledColumns = localStorage.getItem('columns_' + props.config.gridUniqueId);
      
      if(enabledColumns) {
        enabledColumns = enabledColumns.split(',');
      }
    }

    var mapping = {};
    for(var i in props.config.mapping) {
      if(props.config.mapping[i].visible) {
        if(!enabledColumns || (typeof enabledColumns == "object" && enabledColumns.indexOf(i) > -1)) {
          mapping[i] = props.config.mapping[i];
        }
      }
    }

    return mapping;
  })

  function isRecordMatchTheCurrentFiltering(record) {
    if(state.filters.length <= 0) {
      return true;
    }

    var matchBools = [];
    for(var i in state.filters) {
      var cFilter = state.filters[i];
      if(cFilter.type == "number") {
        matchBools.push(RVGFilterableNumberConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
      }
      if(cFilter.type == "date") {
        matchBools.push(RVGFilterableDateConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
      }
      if(cFilter.type == "status") {
        matchBools.push(RVGFilterableStatusConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
      }
      if(cFilter.type == "text") {
        matchBools.push(RVGFilterableTextConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
      }
    }

    if(matchBools.length <= 0) {
      return true;
    }

    if(state.filterOperator.toLowerCase() == "and") {
      return matchBools.includes(false) ? false : true;
    }

    if(state.filterOperator.toLowerCase() == "or") {
      return matchBools.includes(true) ? true : false;
    }
  }

  function sortRecords(recArray, field, direction) {
    var fieldMappingConfig = props.config.mapping[field];
    return recArray.sort(function(first, second) {
      var a;
      var b;

      if(fieldMappingConfig && fieldMappingConfig.formatter && fieldMappingConfig.formatter.type && fieldMappingConfig.formatter.type.toLowerCase() == "status" && fieldMappingConfig.formatter.mapping) {
        a = fieldMappingConfig.formatter.mapping[first[field]].title.toLowerCase();
        b = fieldMappingConfig.formatter.mapping[second[field]].title.toLowerCase();        
      }
      else {
        if(first[field] && typeof first[field] == "string") { a = first[field].toLowerCase(); } else { a = ""; }
        if(second[field] && typeof second[field] == "string") { b = second[field].toLowerCase(); } else { b = ""; }

        if(typeof first[field] == "number") { a = first[field] }
        if(typeof second[field] == "number") { b = second[field] }
      }

      if(direction == "asc") {
        if(a < b) { return -1; }
        else if(a > b) { return 1; }
        else { return 0;}
      }
      else {
        if(a > b) { return -1; }
        else if(a < b) { return 1; }
        else { return 0; }
      }
    });
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
    if(props.config.pagination && props.config.pagination.active) {
      state.pagination.active = true;
      state.pagination.page = props.config.pagination.page;
      state.pagination.size = props.config.pagination.size;
    }

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

    // autorefresh if enabled
    if(props.config.refreshable && props.config.refreshable.gridUniqueId) {
      var currentAutoRefreshValue = localStorage.getItem('autorefreshvalue_' + props.config.gridUniqueId)
      if(currentAutoRefreshValue) {
        state.autoRefresh = currentAutoRefreshValue;
        setAutoRefreshIntervalIfAny();
      }
      else {
        if(props.config.refreshable.defaultValue) {
          state.autoRefresh = props.config.refreshable.defaultValue;
          setAutoRefreshIntervalIfAny();
        }
      }
    }

    // pagesize if enabled
    if(props.config.pagination && props.config.pagination.possiblePageSizes) {
      var currentPageSizeValue = localStorage.getItem('pagesizevalue_' + props.config.gridUniqueId)
      if(currentPageSizeValue) {
        state.pagination.size = currentPageSizeValue;
      }
    }

    // if(this.route.hash) { // @TODO: Refactor this to not depend on the vue-router
    //   var hashParts = this.route.hash.split("-");
    //   const id = parseInt(hashParts[1]);
    //   this.mainRowClick(id)
    // }

    nextTick(() => {
      state.refreshNeeded = true;
    })

    // var changeTableHeight = function() {
    //   const element = document.getElementById('RVGHeightConfiguration')
    //   element.style.height = (window.innerHeight - 250)+"px";
    // }
    // window.addEventListener('resize', changeTableHeight);

    //changeTableHeight()
  })

</script>