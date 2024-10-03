<template>
  <div data-test="RobberVueGridHolder">
    <div class="!overflow-y-visible mb-3 flex flex-row sm:h-8 items-center justify-between">
      <div class="flex-1 flex flex-row items-center" v-if="needsToShowTopFiltersBar">
        <h2 class="font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
          {{ config.title }}
        </h2>
        <RVGFiltering data-test="RVGFiltering" v-if="config.filtering && config.filtering.active && !config.filtering.simple" :filteringConfig="config.filtering" :dataMapping="config.mapping" :pushFilter="pushFilter" :removeFilter="removeFilter" :changeFilterOperator="changeFilterOperator" :filters="filters" :filterOperator="filterOperator" />
        <RVGFilteringSimple :config="config" :setFilter="setSimpleFilter" data-test="RVGFilteringSimple" v-if="config.filtering && config.filtering.active && config.filtering.simple" :filteringConfig="config.filtering" :dataMapping="config.mapping" />
      </div>
      <div class="!overflow-y-visible flex-0 flex flex-row items-center">
        <span class="text-xs text-slate-400 dark:text-navy-300 gridRefreshedIndicator mr-3" :_active="refreshNeeded">
          <SpinnerLoader sizeClasses="w-5 h-5" />
        </span>
        <span v-if="config.bulkOperation && config.bulkOperation.active">
          <select :disabled="checkedRows.length <= 0" v-model="bulkMethod" @change="onBulkMethod" class="disabled:opacity-40 form-select mt-1 h-8 pr-8 w-48 rounded-lg border border-slate-300 bg-white px-2.5 text-xs+ hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
            <option v-if="checkedRows.length <= 0" value="null">Tömeges művelet</option>
            <option v-else value="null">{{ checkedRows.length }} sor kiválasztva</option>
            <option v-for="method in config.bulkOperation.methods" :value="method.key" :key="method.key">{{ method.title }}</option>
          </select>
        </span>
        <button v-if="config.refreshable && config.refreshable.manualActive" title="Lista frissítése" @click="refreshNeeded = true" class="ml-1 darkmode-toggle btn h-10 w-10 !rounded-full !p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <DropDown v-if="needsToShowAdditionalOperationsDropdown">
          <button class="ml-1 darkmode-toggle btn h-10 w-10 !rounded-full !p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          <template #content>
            <div ref="popperBox" class="popper-box !rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
              <ul class=" mt-2" v-if="config.columnSelector && config.columnSelector.active">
                <li class="px-3 mb-2">
                  <h3 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">{{ getLang('rvg-list-options-title') }}</h3>
                </li>
                <li>
                  <a href="javascript:void(null)" @click="() => { showColumnSelectorModal = true }" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span class="">{{ getLang('rvg-select-columns') }}</span>
                  </a>
                </li>
              </ul>
              <ul class="mt-4" v-if="config.refreshable && config.refreshable.autoActive && config.refreshable.autoValues && config.refreshable.autoValues.length > 0">
                <li class="px-3">
                  <h3 class="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">{{ getLang('rvg-automatic-list-update') }}</h3>
                </li>
                <li v-if="config.refreshable && config.refreshable.autoCanBeDisabled">
                  <a href="javascript:void(null)" @click="changeAutoRefreshValue('disabled')" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg"  :class="getRefreshableIconClass('disabled') + ' h-5 w-5 mr-1'" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="">{{ getLang('rvg-automatic-list-update-disabled') }}</span>
                  </a>
                </li>
                <li v-for="(value) in config.refreshable.autoValues" :key="value.key" >
                  <a href="javascript:void(null)" @click="changeAutoRefreshValue(value.key)" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg"  :class="getRefreshableIconClass(value.key) + ' h-5 w-5 mr-1'" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="">{{ value.title }}</span>
                  </a>
                </li>
              </ul>
              <ul class="mt-4" v-if="config.pagination && config.pagination.possiblePageSizes">
                <li class="px-3">
                  <h3 class="text-base font-medium tracking-wide text-slate-700 dark:text-slate-300 line-clamp-1">{{ getLang('rvg-page-size') }}</h3>
                </li>
                <li v-for="(possiblePageSize, key) in config.pagination.possiblePageSizes" :key="key">
                  <a href="javascript:void(null)" @click="changePageSize(possiblePageSize)" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg"  :class="getPagesizeIconClass(possiblePageSize) + ' h-5 w-5 mr-1'" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ getLang('rvg-rows-per-page', { possiblePageSize }) }}</span>
                  </a>
                </li>
              </ul>
              <ul v-if="config.xlsxExport && config.xlsxExport.active && records.length > 0" class="border-t-[1px] border-slate-700">
                <li class="pt-1">
                  <a href="javascript:void(null)" @click="() => { showXlsxExportModal = true; }" class="flex text-slate-700 dark:text-slate-300  w-full items-center px-3 py-2 font-medium tracking-wide outline-none transition-all hover:bg-primary hover:text-white focus:bg-primary focus:text-white dark:hover:bg-accent dark:focus:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <span>{{ getLang('rvg-export-records-link-text') }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </DropDown>
      </div>
    </div>

    <RVGColumnSelector :showModal="showColumnSelectorModal" :hideModal="() => { showColumnSelectorModal = false }" data-test="RVGColumnSelector" v-if="config.columnSelector && config.columnSelector.active" :columnSelectorConfig="config.columnSelector" :dataMapping="config.mapping" :rerender="reloadPage" />
    <RVGXlxsExport :showModal="showXlsxExportModal" :hideModal="() => { showXlsxExportModal = false }" data-test="RVGXlxsExport" v-if="config.xlsxExport && config.xlsxExport.active" :xlsxExportConfig="config.xlsxExport" :dataMapping="config.mapping" :records="records" />

    <div class="overflow-visible w-full card scrollbar scrollbar-h-5 scrollbar-thumb-slate-300 scrollbar-track-slate-200 dark:scrollbar-track-navy-800 dark:scrollbar-thumb-navy-500 scrollbar-thumb-rounded-full">
      <div class="overflow-x-scroll rounded-lg" id="RVGHeightConfiguration">
        <table class="w-full text-left">
          <thead>
            <tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-3" width="30px" v-if="isExtraRowEnabled"></th>
              <th class="whitespace-nowrap bg-slate-200 dark:bg-navy-800" width="30px" v-if="(config.bulkOperation && config.bulkOperation.active) || (config.singleRowSelection && config.singleRowSelection.active)">
                <label class="inline-flex items-center space-x-2">
                </label>
              </th>
              <th class="whitespace-nowrap bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-2" v-for="(value, index) in titlesVisible" :key="index" align="left" :width="value.width">
                <div class="flex flex-row gap-2 items-center">
                  <span class="text-xs">{{ value.title }}</span>
                  <button v-if="value.orderable == true" :title="(order.active && order.field == value.key && order.direction == 'desc') ? 'Csökkenő sorrend' : 'Növekvő sorrend'" :class="['btn !p-0', {'h-4 w-4 !rounded-full bg-secondary font-medium text-white hover:bg-secondary-focus focus:bg-secondary-focus active:bg-secondary-focus/90': order.active && order.field == value.key}]" @click="orderChange($event, value.key)">
                    <svg v-if="order.active && order.field == value.key && order.direction == 'asc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                    </svg>
                    <svg v-if="order.active && order.field == value.key && order.direction == 'desc'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                    <svg v-if="!order.active" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                  </button>
                  <button title="Rendezés törlése" class="btn btn-order removeOrder" v-if="order.active && order.field == value.key" @click="removeOrder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="records.length > 0">
            <template v-for="(record, index) in filteredOrderedRecords" :key="index">
              <tr data-test="RobberVueGridRow" :data-rowid="record[config.idkey]" :class="[{ 'extraRowOpened': openedRow.includes(record[config.idkey]) }, 'RobberVueGridRow border-y border-transparent border-b-slate-200 dark:border-b-navy-500 dark:hover:bg-slate-700 hover:bg-slate-100', { 'bg-error/10': config.rowHightlighter && config.rowHightlighter.active && config.rowHightlighter.fn(record) }]" >
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="isExtraRowEnabled">
                  <button variant="link" class="RVGExtraRowOpenLink" v-if="(!openedRow.includes(record[config.idkey]))" @click="() => { mainRowClick(record[config.idkey]) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button variant="link" class="RVGExtraRowCloseLink" v-if="(openedRow.includes(record[config.idkey]))" @click="() => { mainRowClick(record[config.idkey]) }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="(config.bulkOperation && config.bulkOperation.active)">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      :value="record[config.idkey]" v-model="checkedRows"
                      class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:bg-secondary checked:border-secondary hover:border-secondary focus:border-secondary dark:border-navy-400 dark:checked:bg-secondary-light dark:checked:border-secondary-light dark:hover:border-secondary-light dark:focus:border-secondary-light"
                      type="checkbox"
                    />
                  </label>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" width="30px" v-if="(config.singleRowSelection && config.singleRowSelection.active)">
                  <label class="inline-flex items-center space-x-2">
                    <input
                      :value="record[config.idkey]" v-model="checkedRow"
                      class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:bg-secondary checked:border-secondary hover:border-secondary focus:border-secondary dark:border-navy-400 dark:checked:bg-secondary-light dark:checked:border-secondary-light dark:hover:border-secondary-light dark:focus:border-secondary-light"
                      type="radio"
                    />
                  </label>
                </td>
                <td class="whitespace-nowrap px-2 py-1.5 text-xs" :class="[{ 'sticky': value.sticky }]" v-for="(value, cmNameBody) in mappingVisible" :key="cmNameBody">
                  <span v-if="value.formatter && typeof value.formatter == 'object' && value.formatter.type">
                    <component v-bind:is="'RVG' + value.formatter.type" :data="value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody]" :config="value" :rowid="record[config.idkey]" :field="cmNameBody" :record="record" @refreshGrid="refreshNeeded=true" :openExtraRow="(recordId) => { mainRowClick(recordId) }" />
                  </span>
                  <span v-else-if="value.formatter && typeof value.formatter == 'function'" v-html="value.formatter(value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody], () => { refreshNeeded=true }, record[config.idkey], record)" />
                  <span v-else>
                    {{ value.middleware ? value.middleware(record[cmNameBody], record) : record[cmNameBody] }}
                  </span>
                </td>
              </tr>
              <tr class="RVGExtraRow">
                <td :colspan="colNumber">

                    <slot v-if="isRowOpened(record[config.idkey])" v-bind:record="record" v-bind:extraParams="config.extraRow.extraParams" name="extraRow"></slot>

                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr v-if="!refreshNeeded">
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
  </div>
  <div class="paginationHolder mt-3" v-if="config.pagination && config.pagination.active && pagination.totalPages > 1">

    <ol class="pagination space-x-1.5">
      <li>
        <button :disabled="isPaginationBackDisabled" @click="paginationBack" data-test="RVGPaginationBack" class="disabled:opacity-50 flex h-8 w-8 items-center justify-center !rounded-full bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewbox="0 0 24 24" stroke="currentColor" stroke-width="2" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </li>
      <li>
        <div class="paginationNumbers">
          {{ pagination.page*pagination.size }} - {{ paginationEnd }} / {{ pagination.totalElements }}
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
    
    <div class="pagination">
      
    </div>
  </div>
</template>

<script>
import Methods from './RobberVueGrid.Methods.js'
import Watchers from './RobberVueGrid.Watchers.js'
import Computed from './RobberVueGrid.Computed.js'
import RVGFiltering from './components/Filtering/FilteringDefault.vue'
import RVGFilteringSimple from './components/Filtering/FilteringSimple.vue'
import RVGColumnSelector from './RobberVueGridColumnSelector.vue'
import SpinnerLoader from './components/SpinnerLoader.vue'
import RVGXlxsExport from './components/XlsxExport/RVGXlsxExport.vue'

// formatters
import RVGUser from './Formatters/RVGUser.vue'
import RVGStatus from './Formatters/RVGStatus.vue'
import RVGDate from './Formatters/RVGDate.vue'
import RVGDateTime from './Formatters/RVGDateTime.vue'
import RVGOperations from './Formatters/RVGOperations.vue'
import RVGStrong from './Formatters/RVGStrong.vue'
import RVGClickableStrong from './Formatters/RVGClickableStrong.vue'
import RVGOpenableList from './Formatters/RVGOpenableList.vue'
import RVGQuestionParamStats from './Formatters/RVGQuestionParamStats.vue'
import RVGFileDownloadButton from './Formatters/RVGFileDownloadButton.vue'
import RVGReportAlias from './Formatters/RVGReportAlias.vue'
import RVGFile from './Formatters/RVGFile.vue'
import RVGReportTypeName from './Formatters/RVGReportTypeName.vue'
import RVGBoolean from './Formatters/RVGBoolean.vue'
import RVGBooleanCheckable from './Formatters/RVGBooleanCheckable.vue'
import RVGConditionalBoolean from './Formatters/RVGConditionalBoolean.vue'
import RVGTitleAndSub from './Formatters/RVGTitleAndSub.vue'
import RVGHighlighter from './Formatters/RVGHighlighter.vue'
import RVGHTML from './Formatters/RVGHTML.vue'
import RVGRoles from './Formatters/RVGRoles.vue'
import RVGLongText from './Formatters/RVGLongText.vue'
import RVGDownloadAsTxt from './Formatters/RVGDownloadAsTxt.vue'
import RVGReservationHistory from './Formatters/RVGReservationHistory.vue'
import RVGLocalStorageService from './RobberVueGrid.LocalStorage.js'
import RVGTailwindFormatter from './Formatters/RVGTailwindFormatter.vue'
import RVGLevel from './Formatters/RVGLevel.vue'
import Utils from './RobberVueGridUtils.js'
import DropDown from "./components/DropDown.vue";
//import TransitionExpand from './TransitionExpand.vue';

export default {
  name: "RobberVueGrid",
  components: {
    RVGFiltering,
    RVGFilteringSimple,
    RVGColumnSelector,
    RVGXlxsExport,

    // formatters
    RVGUser,
    RVGStatus,
    RVGDate,
    RVGDateTime,
    RVGOperations,
    RVGStrong,
    RVGClickableStrong,
    RVGOpenableList,
    RVGQuestionParamStats,
    RVGFileDownloadButton,
    RVGReportAlias,
    RVGFile,
    RVGReportTypeName,
    RVGBoolean,
    RVGBooleanCheckable,
    RVGConditionalBoolean,
    RVGTitleAndSub,
    RVGHighlighter,
    RVGHTML,
    RVGRoles,
    RVGLongText,
    RVGDownloadAsTxt,
    RVGReservationHistory,
    RVGTailwindFormatter,
    RVGLevel,
    
    //TransitionExpand,
    DropDown,
    SpinnerLoader
  },
  props: ['config'],
  data() {
    return {
      records: [],
      refreshNeeded: false,
      order: {
        active: false,
        field: null,
        direction: 'asc'
      },
      pagination: {
        active: false,
        page: 0,
        size: 10,
        totalPages: null,
        totalElements: null
      },
      autoRefresh: "disabled",
      autoRefreshInterval: null,
      filters: [],
      filterOperator: 'OR',
      checkedRows: [],
      checkedRow: null,
      openedRow: [],
      showColumnSelectorModal: false,
      showXlsxExportModal: false,
      bulkMethod: 'null',
      simpleFilter: '',
      registeredEvents: {},
      route: {},
    }
  },
  computed: Computed,
  methods: Methods,
  watch: Watchers,
  
};
</script>
