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
  middleware?: (data: any) => any,
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

  /**
   * Theme code for the OverGrid.
   */
  theme?: string,

  /**
   * The root key of the server's response object. For example, if your server returns an object like this: { data: [{...}, {...}], count: 2 }, then the root key is 'data'. If null, the root key is the root object itself.
   */
  rootkey?: string,

  /**
   * The field that you use as unique ID in records. This field is used internally for row selection, bulk operations and "extra row".
   * For example, if your server returns an object like this: { data: [{ id: 1, name: 'Jane' }, { id: 2, name: 'Jack' }], count: 2 }, then the idKey is 'id'.
   * Not set this field leads to unexpected behavior and bugs.
   */
  idkey: string,
  //title?: string,

  /**
   * The default ordering key. If not set, the grid will not be ordered by default.
   */
  defaultOrderKey?: string,

  /**
   * The default ordering direction. If not set, the grid will not be ordered by default.
   */
  defaultOrderDirection?: OrderDirection,

  /**
   * If true, the grid will order the records locally, in which case, the order will work only the current page. If false, the grid will pass order parameters to the server.
   */
  orderLocal?: boolean,

  /**
   * The unique ID of the grid. This is used for the grid's internal operations. It should be unique for each grid in the same domain.
   */
  gridUniqueId: string,

  /**
   * You can modify the server request parameters before sending to the server. This function is called before the request is sent. You can modify the ordering, pagination and filtering parameters in order to your needs. If not set, the grid will send the parameters as is.
   */
  serverTransformation?: (ordering: Ordering, pagination: PaginationClass, filtering: FilteringClass) => URLSearchParams,

  /**
   * The pagination configuration object for the grid.
   */
  pagination: {
    /**
     * If true, the pagination is active. If false, the pagination is disabled.
     */
    active: boolean,
    /**
     * The initial page number.
     */
    page: number,

    /**
     * The initial page size.
     */
    size: number,

    /**
     * The possible page sizes that the user can select/change in settins menu. If not set, the grid will not show the page size selector.
     */
    possiblePageSizes?: Array<number>
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