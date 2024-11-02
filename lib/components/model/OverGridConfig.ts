import { AxiosResponse } from "axios";
import { FilteringClass } from "./Filtering";
import { OrderDirection, Ordering } from "./Ordering";
import { PaginationClass } from "./Pagination";

type OperatorButtonType = {
  title?: string,
  tooltip?: string,
  icon?: string,
  testValueAttribute?: string,
  classList?: string,
  dropdowned?: boolean,
  disabled?: boolean,
  onClick: Function
}

enum PossibleLanguages {
  en = 'en',
  hu = 'hu'
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
    type?: string,
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
   * The possible languages that the grid can use. If not set, the grid will use the default language, which is 'en'.
   * Currently, the possible languages are 'en' and 'hu'.
   * If you set the locale to an object, you can pass a custom locale to the grid. See the 'i18n' section for more information.
   */
  locale?: PossibleLanguages | Record<string, string>,

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
    /**
     * Row highlighter: You can highlight any row in the grid (e.g. you can set a slightly darker background color). For example you can set background color based on a priority value in record.
     * If true, the row highlighter is active. If false, the row highlighter is disabled.
     */
    active: boolean,

    /**
     * Define the highlighter function. This function should return a boolean value. If the function returns true, the row will be highlighted. 
     * @param record The current record with all fields.
     */
    fn: (record: any) => boolean
  },

  /**
   * The filtering configuration object for the grid.
   */
  filtering?: {
    /**
     * Define the field that you use in the server's response to store the total number of records. This field is used for pagination. For example, if your server returns an object like this: { data: [{...}, {...}], count: 2 }, then the allRecordsCountKey is 'count'.
     */
    allRecordsCountKey: string,

    /**
     * If true, the filtering is active. If false, the filtering is disabled.
     */
    active: boolean,

    /**
     * If true, the filtering is 'simple' mode. If false, the filtering is 'advanced' mode.
     * In 'simple' mode, the grid will show an input field where the user can type the filter text. The server gets only this text as a filtering value.
     * In 'advanced' mode, the grid will show a filter panel where the user can set multiple filters. The server gets all filters as an object and gets an operator between filters. The operator can be 'and' or 'or', and it is set in the filter panel.
     */
    simple?: boolean,

    /**
     * If true, the filtering set to local mode. If false, the filtering is server-side.
     * Please be aware that the local filtering is working only on the current page.
     */
    local?: boolean,

    /**
     * If the filtering is 'simple' mode, you can set a help text for the filtering. This text will be shown after the input field.
     */
    simpleHelpText?: string,

    /**
     * If the filtering is 'simple' mode, you can set the filter template string. Use the {data} placeholder to insert the filter text.
     * For example: 'name like "{data}", description like {data}'.
     * This is useful when you have a filtering framework on server side, such as gridify (https://alirezanet.github.io/Gridify/guide/filtering.html#conditional-operators).
     * If not set, the grid will send the filter text as is.
     * FYI: You can modify the filtering parameters in the serverTransformation function as well.
     */
    simpleFilterTemplate?: string,

    /**
     * If the filtering is 'simple' mode, you can set the placeholder text for the input field.
     */
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

export {
  PossibleLanguages
}