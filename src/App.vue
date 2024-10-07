<template>
  <OverGrid :config="config" :customFormatters="[{
    name: 'CustomFormatter',
    component: CustomFormatter
  }]">
    <template #extraRow="{ record }">
      <div>
        {{ record }}
      </div>
    </template>
  </OverGrid>
</template>

<script setup lang="ts">
  import './index.css'
  import OverGrid from '../lib/OverGrid.vue'
  import CustomFormatter from './CustomFormatter.vue';

  const gridUniqueId = 'rvgSampleGrid'

  const config = {
    endpoint: 'http://localhost:3000',
    idkey: "id",
    title: "Hello World",
    defaultOrderKey: 'id',
    defaultOrderDirection: 'desc',
    orderLocal: false,
    rootkey: "data",
    gridUniqueId: gridUniqueId,
    pagination: {
      active: true,
      page: 0,
      size: 10,
      possiblePageSizes: [10, 20, 50, 100, 200]
    },
    filtering: {
      active: true,
      local: true
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
    events: {
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
        title: "30 másodperc",
        default: true
      }, {
        key: '1min',
        refreshInterval: 60,
        title: "1 perc"
      }, {
        key: '5min',
        refreshInterval: 300,
        title: "5 perc"
      }]
    },
    mapping: {
      "$operations": {
        title: "Műveletek",
        visible: true,
        filterable: false,
        selectable: false, // non-optional, must be selected
        orderable: false,
        width: '50px',
        formatter: {
          type: 'Operations',
          config: {
            buttons: (vm, callMeToRefreshTheGrid, rowid, record) => {
              var buttons = [];

              buttons.push({
                title: '',
                tooltip: 'Letöltés',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>',
                classList: 'btn mask is-hexagon h-9 w-9 !p-0 font-medium text-white bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90',
                testValueAttribute: 'deleteButton',
                dropdowned: false,
                disabled: false,
                onClick: () => {
                  downloadFunction(record.name)
                }
              })
              
              buttons.push({
                title: '',
                tooltip: 'Törlés',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>',
                classList: 'btn mask is-hexagon h-9 w-9 !p-0 font-medium text-white bg-error hover:bg-error-focus',
                testValueAttribute: 'deleteButton',
                dropdowned: false,
                disabled: false,
                onClick: () => {
                  deleteFunction(record.name)
                }
              })

              return buttons;
            }
          }
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
        formatter: {
          type: 'CustomFormatter'
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
              classList: 'px-2 rounded-md bg-teal-400 text-white',
              title: 'Férfi'
            },
            "female": {
              classList: 'px-2 rounded-md bg-red-400 text-white',
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
        exportable: true,
        orderable: true,
      },
      "phoneNumbers": {
        title: "Telefonszámok",
        visible: true,
        selectable: true,
        filterable: {
          active: true,
          type: 'Text'
        },
        middleware: (value) => {
          if(!value) return '';
          return value.join(', ')
        },
        exportable: true,
        orderable: true,
      },
    }
  }
</script>