<template>
  <div class="p-8">
    <OverGrid ref="grid" :config="config" :customFormatters="[{
      name: 'CustomFormatter',
      component: CustomFormatter
    }]">
      <template #title>
        <div class="w-full text-left sm:text-center">
          <span class="text-2xl font-bold text-center flex flex-row items-center sm:justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-8 h-8 text-[#61b1a6]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
            </svg>
            <span>
              OverGrid Demo
            </span>
          </span>
        </div>
      </template>
      <template #extraRow="{ record }">
        <div>
          {{ record }}
        </div>
      </template>
    </OverGrid>
  </div>
</template>

<script setup lang="ts">
  import './index.css'
  import OverGrid from '../lib/OverGrid.vue'
  import CustomFormatter from './CustomFormatter.vue';
  import '../lib/themes/default.css'
  import { OverGridConfig, OperatorButtonType, PossibleLanguages } from '../lib/components/model/OverGridConfig'
  import { OrderDirection } from '../lib/components/model/Ordering';
  import { onMounted, ref } from 'vue'

  const grid = ref<InstanceType<typeof OverGrid>>()

  onMounted(() => {
    console.log('App mounted', grid.value)
  })

  // const customi18n: Record<string, string> = {
  //   'auto_refresh_menu_title': 'Automatikus frissítés222',
  //   'automatic-list-update-disabled': 'Kikapcsolva222',
  //   'bulk_method': 'Tömeges művelet222',
  //   'selected_rows': '{selectedCount} sor kiválasztva',
  //   'operations': 'Műveletek',
  //   'select_columns': 'Oszlopok kiválasztása',
  //   'ok': 'OK222',
  //   'cancel': 'Mégse222',
  //   'no_filters_added': 'Nincs beállított szűrőfeltétel...',
  //   'rows_per_page': '{possiblePageSize} sor oldalanként',
  //   'page_size': 'Oldalméret',
  //   'export_records': 'Aktuális oldal exportálása',
  //   'export_format': 'Formátum',
  //   'export_fields': 'Mezők',
  //   'add_filter': 'Szűrő hozzáadása',
  //   'select_field': 'Mező kiválasztása',
  //   'text': 'Szöveg',
  //   'whole_number': 'Szám',
  //   'date': 'Dátum',
  //   'status': 'Státusz',
  //   'operation': 'Művelet',
  //   'equals': 'egyenlő ezzel',
  //   'contains': 'tartalmazza ezt',
  //   'starts_with': 'ezzel kezdődik',
  //   'ends_with': 'ezzel végződik',
  //   'value': 'Érték',
  //   'please_enter_value': 'Érték megadása',
  //   'less_than': 'kisebb, mint',
  //   'less_than_equals': 'kisebb vagy egyenlő, mint',
  //   'greater_than': 'nagyobb, mint',
  //   'greater_than_equals': 'nagyobb, vagy egyenlő, mint',
  //   'not_equals': 'nem egyenlő ezzel',
  //   'on_this_day': 'ezen a napon',
  //   'in_this_interval': 'ebben az intervallumban',
  //   'choose_date': 'válassz dátumot',
  //   'one_of_the_following': 'az alábbiak valamelyike',
  //   'values': 'Értékek',
  //   'please_choose_values': 'Értékek kiválasztása',
  //   'yes': 'Igen',
  //   'no': 'Nem',
  //   'no_data': 'Nincs adat',
  //   'there_is_no_data_here': 'Nincs megjeleníthető adat...',
  //   'loading_data': 'Adatok betöltése...',
  //   'or': 'vagy',
  //   'and': 'és',
  //   'search': 'Keresés',
  //   'ascending': 'Növekvő sorrend',
  //   'descending': 'Csökkenő sorrend',
  //   'remove_order': 'Rendezés törlése',
  // }

  const gridUniqueId = 'ogSampleGrid'

  const config: OverGridConfig = {
    endpoint: 'http://localhost/overgrid-demo-api.php',
    rootkey: "data",
    idkey: "id",
    hideAboutWindow: false,
    defaultOrderKey: 'id',
    defaultOrderDirection: OrderDirection.asc,
    orderLocal: false,
    locale: PossibleLanguages.en,
    gridUniqueId: gridUniqueId,
    // serverTransformation: (ordering: Ordering, pagination: Pagination, filtering: Filtering): URLSearchParams => {
    //   const params = new URLSearchParams();

    //   params.append("type", "user-defined");

    //   if(ordering.active) {
    //     params.append('myOrderKey', ordering.key);
    //     params.append('myOrderDirection', ordering.direction.toString());
    //   }

    //   if(pagination.active) {
    //     params.append('myPage', pagination.page.toString());
    //     params.append('mySize', pagination.size.toString());
    //   }

    //   if(filtering.active) {
    //     if(!filtering.isSimpleFilter) {
    //       params.append('myFilter', JSON.stringify(filtering.filters));
    //     }
    //     else {
    //       params.append('myFilter', filtering.simpleFilterValue);
    //     }
    //   }

    //   return params;
    // },
    axiosConfigurator: (axios) => {
      const token = localStorage.getItem('og_token');
      axios.interceptors.request.use((config) => {
        if(!config.headers['Authorization']) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
      }, (error) => {
        Promise.reject(error)
      });
      return axios;
    },
    pagination: {
      active: true,
      page: 0,
      size: 10,
      possiblePageSizes: [10, 20, 50, 100, 200]
    },
    filtering: {
      allRecordsCountKey: 'totalRecords',
      active: true,
      simple: true,
      local: false,
      simpleFilterTemplate: 'workName=*{data}/i|workNumberCustom=*{data}/i|orderNumber=*{data}/i|attentionTo=*{data}/i',
      simplePlaceholder: 'Search...',
    },
    singleRowSelection: {
      active: false
    },
    extraRow: {
      active: true,
      multiOpen: true,
      extraParams: {}
    },
    bulkOperation: {
      active: true,
      methods: [{
        title: 'Kiválasztás törlése',
        key: 'select',
        action: (checkedRows, clearRows) => {
          clearRows();
        }
      }]
    },
    columnSelector: {
      active: true
    },
    xlsxExport: {
      active: true
    },
    refreshable: {
      manualActive: true,
      autoActive: true,
      autoCanBeDisabled: true,
      autoValues: [{
        key: '30sec',
        refreshInterval: 30,
        title: "30 seconds",
        default: true
      }, {
        key: '1min',
        refreshInterval: 60,
        title: "1 minute"
      }, {
        key: '5min',
        refreshInterval: 300,
        title: "5 minutes"
      }]
    },
    mapping: {
      "$operations": {
        title: "Műveletek",
        visible: true,
        filterable: {
          active: false
        },
        selectable: false, // non-optional, must be selected
        orderable: false,
        width: '50px',
        formatter: {
          type: 'Operations',
          config: {
            dropdownOrientation: 'right', // optional, default is left
            buttons: (vm, callMeToRefreshTheGrid, rowid, record) => {
              var buttons: Array<OperatorButtonType> = [];

              buttons.push({
                title: '',
                tooltip: 'Letöltés',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>',
                testValueAttribute: 'deleteButton',
                classList: 'bg-slate-200 p-3 rounded-full text-black/60 h-8 w-8 items-center text-center flex justify-center',
                dropdowned: false,
                disabled: false,
                onClick: () => {
                  console.log("Download")
                }
              })
              
              buttons.push({
                title: '',
                tooltip: 'Törlés',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>',
                testValueAttribute: 'deleteButton',
                dropdowned: false,
                disabled: false,
                onClick: () => {
                  console.log("Delete")
                }
              })

              buttons.push({
                title: 'valami más',
                tooltip: 'valami más',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>',
                testValueAttribute: 'deleteButton',
                dropdowned: true,
                disabled: false,
                onClick: () => {
                  console.log("valami más")
                }
              })

              return buttons;
            }
          }
        }
      },
      "title": {
        title: "Title",
        visible: true,
        selectable: true,
        exportable: true,
        orderable: true,
        formatter: {
          type: 'CustomFormatter'
        }
      },
      "name": {
        title: "Név",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Text'
        },
        exportable: true,
        orderable: true,
        width: '300px'
      },
      "age": {
        title: "Kor",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Number'
        },
        formatter: {
          type: 'Strong'
        },
        exportable: true,
        orderable: true
      },
      "address": {
        title: "Cím",
        visible: true,
        orderKey: 'address.zip',
        selectable: true,
        filterable: {
          active: true,
          type: 'Text'
        },
        middleware: (value) => {
          if(!value) return '';
          return value.city + ', Magyarország / ' + value.zip + ' ' + value.street;
        },
        formatter: {
          type: 'TailwindFormatter',
          hideWhenEmpty: true,
          classList: 'text-sm font-bold'
        },
        exportable: true,
        orderable: true
      },
      "birthDate": {
        title: "Születési dátum",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Date'
        },
        formatter: {
          type: 'DateTime',
          inputFormat: 'YYYY-MM-DD',
          outputFormat: 'YYYY. MMM. DD.'
        },
        exportable: true,
        orderable: true
      },
      "gender": {
        title: "Nem",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Status'
        },
        formatter: {
          type: 'Status',
          dataType: 'text',
          mapping: {
            "male": {
              classList: 'p-2 py-1 rounded-md bg-slate-700 text-white text-center',
              title: 'Férfi'
            },
            "female": {
              classList: 'p-2 py-1 rounded-md bg-slate-200 text-black text-center',
              title: 'Nő'
            }
          }
        },
        exportable: true,
        orderable: true
      },
      "email": {
        title: "E-mail",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Text'
        },
        formatter: {
          type: 'Highlighter',
          maxLength: 20,
          highlights: [{
            regexp: /([a-zA-Z0-9._%+-]+@)/g,
            style: 'font-weight: bold;'
          }]
        },
        exportable: true,
        orderable: true,
      },
      "isActive": {
        title: "Aktív?",
        visible: true,
        selectable: true,
        exportable: true,
        orderable: true,
        formatter: {
          type: 'Boolean'
        }
      },
      "phoneNumbers": {
        title: "Telefonszámok",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Text'
        },
        formatter: {
          type: 'HTML',
        },
        middleware: (value) => {
          if(!value) return '';
          return value.join('<br /> ')
        },
        exportable: true,
        orderable: true,
      },
      "introduction": {
        title: "Bemutatkozás",
        visible: true,
        selectable: true,
        exportable: true,
        orderable: true,
        formatter: {
          type: 'LongText',
          title: 'Bemutatkozás'
        }
      },
    }
  }
</script>