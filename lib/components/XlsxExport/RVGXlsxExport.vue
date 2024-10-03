<template>
  <RVGModal :showModal="showModal" :onClose="hideModal">
    <template #head>
      <div class=" flex flex-col">
        <h3 class="text-base font-medium text-slate-700 dark:text-navy-100">
          {{ getLang('xlsx-export-modal-title') }}
        </h3>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col mt-1">

        <div class="grid grid-cols-2 gap-2 mb-5">
          <label class="block" v-for="(output, index) in checkboxOptions" :key="index">
            <label class="inline-flex items-center space-x-2">
              <input v-model="selected" :value="output.value" class="form-checkbox is-basic h-5 w-5 !rounded-full border-slate-400/70 checked:!border-info checked:bg-info hover:!border-info focus:!border-info dark:border-navy-400" type="checkbox">
              <span>{{ output.text }}</span>
            </label>
          </label>
        </div>

        <xlsx-workbook>
          <xlsx-sheet
            :collection="sheetData"
            sheet-name="XLSX Export"
          />
          <div class="flex flex-row items-center justify-end gap-3">
            <button class="btn min-w-[7rem] !rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90" @click="hideModal">
              {{ getLang('cancel') }}
            </button>
            <xlsx-download v-if="format == 'xlsx'" @click="() => { hideModal() }">
              <button :disabled="selected.length <= 0" class="btn min-w-[7rem] !rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                {{ getLang('xlsx-export-modal-submit-button') }}
              </button>
            </xlsx-download>
          </div>
        </xlsx-workbook>
      </div>
    </template>
  </RVGModal>
</template>

<script>
import l from '../../helpers/lang.js'
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue3-xlsx';
import RVGModal from '../../RobberVueGridModal.vue'
import moment from 'moment';

export default {
  name: 'RobberVueGridXlsxExport',
  props: ['xlsxExportConfig', 'dataMapping', 'records', 'showModal', 'hideModal'],
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
    RVGModal
  },
  data() {
    return {
      selected: [],
      format: 'xlsx',
      formLayoutConfig: {
        labelMd: 3,
        formGroupMd: 5,
        descriptionMd: 4
      },
      inLoading: false,
      modalShown: false
    }
  },
  mounted() {
    for(var i in this.dataMapping) { 
      if(!this.dataMapping[i].exportable) {
        continue;
      }

      this.selected.push(i)
    }
  },
  computed: {
    sheetData() {
      var sheetData = [];
      const headerMapping = this.getHeaderMapping();

      if(this.records && this.records.length > 0 && this.selected.length > 0) {
        for(var i in this.records) {
          var cSheetData = {};
          for(var j in this.selected) {
            if(this.selected[j].customExportFn) {
              //console.log(this.selected[j])
              // @TODO or not @TODO. This is the question.
            }
            else {
              if(this.records[i][this.selected[j]] != undefined) {
                let rawContent = this.records[i][this.selected[j]];
                if(this.dataMapping[this.selected[j]] && this.dataMapping[this.selected[j]].middleware) {
                  rawContent = this.dataMapping[this.selected[j]].middleware(rawContent, this.records[i]);
                }
                let formatterConfig = this.dataMapping[this.selected[j]]?.formatter;

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

                cSheetData[headerMapping[this.selected[j]]] = rawContent;
              }
              else {
                if(this.dataMapping[this.selected[j]] && this.dataMapping[this.selected[j]].middleware) {
                  cSheetData[headerMapping[this.selected[j]]] = this.dataMapping[this.selected[j]].middleware(undefined, this.records[i]);
                }
                else {
                  cSheetData[headerMapping[this.selected[j]]] = "";
                }
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
    },
    checkboxOptions() {
      var result = [];

      for(var i in this.dataMapping) {
        var cData = this.dataMapping[i];

        if(!this.dataMapping[i].exportable) {
          continue;
        }

        result.push({
          text: cData.title,
          value: i
        });
      }

      if(this.xlsxExportConfig.additionalExportFields && this.xlsxExportConfig.additionalExportFields.columnsFn) {
        result = [ ...result, ...this.xlsxExportConfig.additionalExportFields.columnsFn(this.records) ];
      }

      return result;
    }
  },
  watch: {
  },
  methods: {
    getLang(key) {
      return l(key);
    },
    getHeaderMapping() {
      var headerMapping = {};
      for(var i in this.dataMapping) { 
        if(!this.dataMapping[i].exportable) {
          continue;
        }

        headerMapping[i] = this.dataMapping[i].title;
      }
      return headerMapping;
    }
  }
}
</script>

<style scoped>

  .sectionCheckboxHolder {
    padding: 10px;
    border-radius: 30px;
    display: inline-block;
    width: calc(50% - 10px);
    margin: 5px;
    background: #434243;
    /* -webkit-transition: background-color .2s linear;
    -ms-transition: background-color .2s linear;
    transition: background-color .2s linear; */
  }

  .sectionCheckboxHolder:hover {
    background: #242424;
  }

  .sectionCheckboxHolder[disabled=disabled]:deep(.custom-control label) {
    color: #6c757d !important;
  }

  .sectionCheckboxHolder:deep(.custom-control) {
    display: inline-block;
    width: 100%;
    cursor: pointer;
    text-align: left;
    padding-left: 40px;
  }

  .sectionCheckboxHolder:deep(.custom-control label) {
    width: 100%;
    cursor: pointer;
  }
</style>