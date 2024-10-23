import { AxiosResponse } from "axios";
import { FilteringClass } from "./Filtering";
import { OrderDirection, Ordering } from "./Ordering";
import { PaginationClass } from "./Pagination";

type OperatorButtonType = {
  title: string,
  tooltip: string,
  icon: string,
  testValueAttribute: string,
  classList: string,
  dropdowned: boolean,
  disabled: boolean,
  onClick: Function
}

/* FORMATTER CONFIGS */
type ConfiglessFormatterConfigType = {
  type: string
}

type DateFormatterConfigType = {
  type: string,
  inputFormat?: string,
  outputFormat?: string
}

type HighlightFormatterConfigType = {
  type: string,
  maxLength?: number,
  highlights: Array<{
    regexp: RegExp,
    style: string
  }>
}

type LongTextFormatterConfigType = {
  type: string,
  title?: string
}

type OperationsFormatterConfigType = {
  type: string,
  config?: {
    dropdownOrientation: 'right' | 'left',
    buttons: (vm: any, callMeToRefreshTheGrid: Function, rowid: any, record: any) => Array<OperatorButtonType>
  }
}

type StatusFormatterConfigType = {
  type: string,
  dataType: string,
  mapping: Record<string, {
    classList: string,
    title: string
  }>
}

type TailwindClassFormatterConfigType = {
  type: string,
  hideWhenEmpty: boolean,
  classList: string
}

type AllFormatterConfigTypes = ConfiglessFormatterConfigType | DateFormatterConfigType | HighlightFormatterConfigType | LongTextFormatterConfigType | OperationsFormatterConfigType | StatusFormatterConfigType | TailwindClassFormatterConfigType;

/* FORMATTER CONFIGS */

type MappingRecordType = {
  title: string,
  visible?: boolean,
  filterable?: {
    active: boolean,
    type: string,
    filterKey?: string,
    titleOverride?: string
  },
  selectable?: boolean,
  orderable?: boolean,
  orderKey?: string,
  exportable?: boolean,
  width?: string,
  formatter?: AllFormatterConfigTypes
}

/**
 * The full configuration object for the OverGrid
 */
type OverGridConfig = {
  /**
   * The endpoint of the API
   */
  endpoint: string,
  theme?: string,
  rootkey?: string,
  idkey: string,
  //title?: string,
  defaultOrderKey?: string,
  defaultOrderDirection?: OrderDirection,
  orderLocal?: boolean,
  gridUniqueId: string,
  serverTransformation?: (ordering: Ordering, pagination: PaginationClass, filtering: FilteringClass) => URLSearchParams,
  pagination: {
    active: boolean,
    page: number,
    size: number,
    possiblePageSizes: Array<number>
  },
  rowHighlighter?: {
    active: boolean,
    fn: (record: any) => boolean
  },
  filtering?: {
    allRecordsCountKey: string,
    active: boolean,
    simple?: boolean,
    local?: boolean,
    simpleHelpText?: string,
    simpleFilterTemplate?: string,
    simplePlaceholder?: string,
  },
  singleRowSelection?: {
    active: boolean
  },
  extraRow?: {
    active: boolean,
    multiOpen: boolean,
    extraParams: object
  },
  bulkOperation?: {
    active: boolean,
    methods: Array<{
      title: string,
      key: string,
      action: (checkedRows: Array<any>, clearRows: () => void) => void
    }>
  },
  events?: {
    onDataLoad?: (data: Array<any>) => Array<any>,
    onDataLoadWithFullResponse?: (response: AxiosResponse) => Array<any>,
    readyAfterRefresh?: () => void,
    onBulkSelectChanges?: (checkedRows: Array<any>) => void
  },
  columnSelector?: {
    active: boolean
  },
  xlsxExport?: {
    active: boolean,
    additionalExportFields?: {
      columnsFn?: Function
    }
  },
  refreshable: {
    manualActive: boolean,
    autoActive: boolean,
    autoCanBeDisabled: boolean,
    autoValues: Array<{
      key: string,
      refreshInterval: number,
      title: string,
      default?: boolean
    }>
  },
  mapping: Record<string, MappingRecordType>
}

export type {
  OperatorButtonType,
  ConfiglessFormatterConfigType,
  DateFormatterConfigType,
  HighlightFormatterConfigType,
  LongTextFormatterConfigType,
  OperationsFormatterConfigType,
  StatusFormatterConfigType,
  TailwindClassFormatterConfigType,
  AllFormatterConfigTypes,
  MappingRecordType,
  OverGridConfig
}