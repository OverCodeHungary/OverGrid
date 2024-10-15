<template>
  <ul class="mt-1.5">
    <li>
      <a href="javascript:void(null)" @click="() => { state.modalShown = true; }" class="flex flex-row gap-1 items-center ml-1 mt-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <span class="og-text-compact">{{ i18n.l('export_records') }}</span>
      </a>
    </li>
  </ul>
  <CustomContentModal
    :show="state.modalShown" 
    :title="i18n.l('export_records')" 
    :disableButtons="true"
    :close="() => { state.modalShown = false; }" 
    :ok="download">
    <template #content>
      <div class="flex flex-col mt-1">

        <h3 class="font-bold mb-2">
          {{ i18n.l('export_fields') }}
        </h3>
        <div class="grid grid-cols-2 gap-2 mb-5">
          <label class="block" v-for="(output, index) in checkboxOptions" :key="index">
            <label class="inline-flex items-center space-x-2">
              <input v-model="state.selected" :value="output.value" class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400" type="checkbox">
              <span>{{ output.text }}</span>
            </label>
          </label>
        </div>

        <h3 class="font-bold mb-2">
          {{ i18n.l('export_format') }}
        </h3>
        <div class="flex flex-col items-start gap-1">
          <div class="flex flex-row items-center gap-1">
            <input id="ogExportRadioXlsx" name="ogExportRadio" type="radio" v-model="state.format" value="xlsx" class="form-radio h-5 w-5 !rounded-full border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400">
            <label class="inline-flex items-center space-x-2" for="ogExportRadioXlsx">XLSX</label>
          </div>
          <div class="flex flex-row items-center gap-1">
            <input id="ogExportRadioCsv" name="ogExportRadio" type="radio" v-model="state.format" value="csv" class="form-radio h-5 w-5 !rounded-full border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400">
            <label class="inline-flex items-center space-x-2" for="ogExportRadioCsv">CSV</label>
          </div>
        </div>

        <div class="flex flex-row justify-end gap-2">
          <button @click="() => { state.modalShown = false; }" class="disabled:opacity-60 btn min-w-[7rem] !rounded-full h-9 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80">
            {{ i18n.l('cancel') }}
          </button>
          <jsonExcel
            :data="sheetData"
            :name="'data-export-' + moment().unix() + '.' + state.format"
            :type="state.format"
            @click="finishDownload"
            >
            <button class="disabled:opacity-60 uppercase min-w-[7rem] h-9 !rounded-full bg-teal-400 font-medium text-white hover:bg-primary-focus focus:bg-teal-500 active:bg-teal-500">
              <span>{{ i18n.l('ok') }}</span>
            </button>
          </jsonExcel>
        </div>


      </div>
    </template>
  </CustomContentModal>
</template>

<script setup>
  import useI18n from '../../composables/useI18n.js';
  import CustomContentModal from '../CustomContentModal.vue';
  import moment from 'moment';
  import JsonExcel from "vue-json-excel3";
  import { reactive, onMounted, computed, watch } from 'vue';
  const i18n = useI18n();

  const props = defineProps({
    xlsxExportConfig: Object,
    dataMapping: Object,
    records: Array
  })

  const state = reactive({
    selected: [],
    format: 'xlsx',
    loading: false,
    modalShown: false
  })

  watch(() => props.modalShown, (value) => {
    state.modalShown = value;
  })

  onMounted(() => {
    for(var i in props.dataMapping) { 
      if(!props.dataMapping[i].exportable) {
        continue;
      }

      state.selected.push(i)
    }
  })

  function finishDownload() {
    props.hideModal();
  }

  const checkboxOptions = computed(() => {
    var result = [];

    for(var i in props.dataMapping) {
      var cData = props.dataMapping[i];

      if(!props.dataMapping[i].exportable) {
        continue;
      }

      result.push({
        text: cData.title,
        value: i
      });
    }

    if(props.xlsxExportConfig.additionalExportFields && props.xlsxExportConfig.additionalExportFields.columnsFn) {
      result = [ ...result, ...props.xlsxExportConfig.additionalExportFields.columnsFn(props.records) ];
    }

    return result;
  });

  function download() {
    console.log(jsonExcel.value)
  }

  function getHeaderMapping() {
    let headerMapping = {};
    for(let i in props.dataMapping) { 
      if(!props.dataMapping[i].exportable) {
        continue;
      }

      headerMapping[i] = props.dataMapping[i].title;
    }
    return headerMapping;
  }

  const sheetData = computed(() => {
    var sheetData = [];
    const headerMapping = getHeaderMapping();

    if(props.records && props.records.length > 0 && state.selected.length > 0) {
      for(var i in props.records) {
        var cSheetData = {};
        for(var j in state.selected) {
          if(props.records[i][state.selected[j]] != undefined) {
            let rawContent = props.records[i][state.selected[j]];
            if(props.dataMapping[state.selected[j]] && props.dataMapping[state.selected[j]].middleware) {
              rawContent = props.dataMapping[state.selected[j]].middleware(rawContent, props.records[i]);
            }
            let formatterConfig = props.dataMapping[state.selected[j]]?.formatter;

            if(formatterConfig) {
              switch(formatterConfig.type) {
                case 'Date':
                  if(rawContent) {
                    if(formatterConfig.outputFormatExport) {
                      rawContent = moment(rawContent).format(formatterConfig.outputFormatExport);
                    }
                    else {
                      rawContent = moment(rawContent).format(formatterConfig.outputFormat);
                    }
                  }
                  break;
                case 'DateTime':
                  if(rawContent) {
                    if(formatterConfig.outputFormatExport) {
                      rawContent = moment(rawContent*1000).format(formatterConfig.outputFormatExport);
                    }
                    else {
                      rawContent = moment(rawContent*1000).format(formatterConfig.outputFormat);
                    }
                  }
                  break;
                case 'Boolean':
                  rawContent = rawContent ? 'Igen' : 'Nem';
                  break;
                case 'Status':
                  rawContent = formatterConfig.mapping[rawContent].title;
                  break;
              }
            }

            cSheetData[headerMapping[state.selected[j]]] = rawContent;
          }
          else {
            if(props.dataMapping[state.selected[j]] && props.dataMapping[state.selected[j]].middleware) {
              cSheetData[headerMapping[state.selected[j]]] = props.dataMapping[state.selected[j]].middleware(undefined, props.records[i]);
            }
            else {
              cSheetData[headerMapping[state.selected[j]]] = "";
            }
          }
        }
        sheetData.push(cSheetData);
      }
    }

    if(sheetData.length <= 0) {
      return [{}];
    }

    return sheetData;
  });


</script>
