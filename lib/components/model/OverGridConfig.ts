import { AxiosResponse } from "axios";
import { FilteringClass } from "./Filtering";
import { OrderDirection, Ordering } from "./Ordering";
import { PaginationClass } from "./Pagination";

/**
 * The OperatorButtonType is a type for the operator buttons in the Operations formatter.
 */
type OperatorButtonType = {
  /**
   * The title of the button.
   */
  title?: string,

  /**
   * The tooltip of the button.
   */
  tooltip?: string,

  /**
   * The icon of the button. You can use any valid FontAwesome icon class here. For example, 'fas fa-edit'.
   */
  icon?: string,

  /**
   * The test value attribute of the button. If set, the button will have a test value attribute with this value to make e2e testing easier.
   */
  testValueAttribute?: string,

  /**
   * The class list of the button. You can set multiple classes here. For example, 'btn btn-primary'.
   */
  classList?: string,

  /**
   * If true, the button is a dropdown button. If false, the button is a normal button.
   */
  dropdowned?: boolean,

  /**
   * If true, the button is disabled. If false, the button is enabled.
   */
  disabled?: boolean,

  /**
   * The function that is called when the button is clicked. You can access the full record object while you define buttons in the OperationsFormatterConfigType.buttons function.
   */
  onClick: Function
}

/**
 * The PossibleLanguages enum is used to set the possible languages that the grid can use. If not set, the grid will use the default language, which is 'en'.
 */
enum PossibleLanguages {
  en = 'en',
  hu = 'hu'
}

/* FORMATTER CONFIGS */
/**
 * The configuration object for all the formatters that have no configurations (e.g.: Strong).
 */
type ConfiglessFormatterConfigType = {
  /**
   * The type of the formatter.
   */
  type: string
}

/**
 * The configuration object for the DateFormatter formatter.
 */
type DateFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'DateTime'.
   */
  type: string,
  /**
   * The input format of the date. If not set, the input format is 'YYYY-MM-DD HH:mm:ss'. Under the hood, OverGrid uses the moment.js library to parse the date. You can set any format that moment.js supports. For more information, see the moment.js documentation: https://momentjs.com/docs/#/parsing/string-format/.
   */
  inputFormat?: string,

  /**
   * The output format of the date. If not set, the output format is 'YYYY-MM-DD HH:mm:ss'. Under the hood, OverGrid uses the moment.js library to format the date. You can set any format that moment.js supports. For more information, see the moment.js documentation: https://momentjs.com/docs/#/displaying/format/.
   */
  outputFormat?: string
}


/**
 * The configuration object for the Highlighter formatter.
 */
type HighlightFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'Highlighter'.
   */
  type: string,
  /**
   * The maximum length of the text. If the text is longer than this value, the text will be cut off and an ellipsis will be added. If not set, the text will not be cut off.
   */
  maxLength?: number,

  /**
   * The highlighter configuration object. The highlighter is a special component to highlight text in the cell. You can set multiple highlighters here. Each highlighter has a regular expression and a style. The regular expression is used to match the text, and the style is used to highlight the text. For example, you can set a highlighter to highlight all the occurrences of the word 'important' in the cell with a bold style. The 'style' should be a valid CSS style string.
   */
  highlights: Array<{
    regexp: RegExp,
    style: string
  }>
}

/**
 * The configuration object for the LongText formatter. LongText formatter shows a modal with the full text when the user clicks on the button in the cell.
 */
type LongTextFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'LongText'.
   */
  type: string,

  /**
   * The title of the modal window. If not set, the title is 'Long text'.
   */
  title?: string
}

/**
 * The configuration object for the Operations formatter. 
 * Operations formatter shows operation buttons in the cell. 
 * For example, if you want to show an 'Edit' and a 'Delete' button in the cell, you can use the Operations formatter.
 */
type OperationsFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'Operations'.
   */
  type: string,
  /**
   * The configuration object for the Operations formatter. The configuration object has two keys: 'dropdownOrientation' and 'buttons'.
   */
  config?: {
    /**
     * The orientation of the dropdown. The possible values are 'right' and 'left'. If not set, the dropdown orientation is 'right'.
     */
    dropdownOrientation: 'right' | 'left',

    /**
     * 
     * @param vm the vue object
     * @param callMeToRefreshTheGrid a Function that you can call to refresh the grid. The function has no parameters.
     * @param rowid the unique ID of the row
     * @param record the full record object
     * @returns an array of OperatorButtonType objects. Each OperatorButtonType object represents a button in the cell. The OperatorButtonType object has the following keys: 'title', 'tooltip', 'icon', 'testValueAttribute', 'classList', 'dropdowned', 'disabled' and 'onClick'. The 'title' key is the title of the button. The 'tooltip' key is the tooltip of the button. The 'icon' key is the icon of the button. The 'testValueAttribute' key is the test value attribute of the button. The 'classList' key is the class list of the button. The 'dropdowned' key is a boolean value. If true, the button is a dropdown button. The 'disabled' key is a boolean value. If true, the button is disabled. The 'onClick' key is the function that is called when the button is clicked. The function gets the rowid and the record object as parameters.
     */
    buttons: (vm: any, callMeToRefreshTheGrid: Function, rowid: any, record: any) => Array<OperatorButtonType>
  }
}


/**
 * The configuration object for the Status formatter.
 */
type StatusFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'Status'.
   */
  type: string,
  /**
   * The field's data type in the server's response DTO. The possible values are 'integer', 'boolean', 'text'.
   * It the data type is 'integer', that means the field type in the response is numeric. 
   * If the data type is 'boolean', that means the field type in the response is boolean (true/false).
   * If the data type is 'text', that means the field type in the response is text.
   */
  dataType: string,

  /**
   * The object mapping for the status formatter.
   * @example 
   * dataType: 'text',
   * mapping: {
   *  'active': {
   *    classList: 'bg-green-500 text-white',
   *    title: 'Active'
   *   },
   *  'inactive': {
   *    classList: 'bg-red-500 text-white',
   *    title: 'Inactive'
   *   }
   * }
   * 
   * @example 
   * dataType: 'boolean',
   * mapping: {
   *  'true': {
   *    classList: 'bg-green-500 text-white',
   *    title: 'Yes'
   *   },
   *  'false': {
   *    classList: 'bg-red-500 text-white',
   *    title: 'No'
   *   }
   * }
   * 
   * @example 
   * dataType: 'integer',
   * mapping: {
   *  '1': {
   *    classList: 'bg-green-500 text-white',
   *    title: 'First'
   *   },
   *  '2': {
   *    classList: 'bg-red-500 text-white',
   *    title: 'Second'
   *   }
   * }
   */
  mapping: Record<string, {
    classList: string,
    title: string
  }>
}

/**
 * The configuration object for the TailwindClass formatter.
 */
type TailwindClassFormatterConfigType = {
  /**
   * The type of the formatter. In this case, it should be 'Tailwind'.
   */
  type: string,

  /**
   * If true and the cell is empty, the data in the cell will be hidden. If false, the data will be shown no matter if its empty or not.
   */
  hideWhenEmpty: boolean,

  /**
   * The class list of the cell. You can set multiple classes here. For example, 'bg-green-500 text-white'.
   */
  classList: string
}

type AllFormatterConfigTypes = ConfiglessFormatterConfigType | DateFormatterConfigType | HighlightFormatterConfigType | LongTextFormatterConfigType | OperationsFormatterConfigType | StatusFormatterConfigType | TailwindClassFormatterConfigType;

/* FORMATTER CONFIGS */

/*
* The configuration object for one column in the grid.
*/
type MappingRecordType = {
  /**
   * The title of the column shown in the thead.
   */
  title: string,

  /**
   * If true, the column is visible. If false, the column is hidden in grid.
   */
  visible?: boolean,

  /**
   * If set, the column is filterable. If false, the column is not filterable.
   */
  filterable?: {
    /**
     * If true, the filter is active. If false, the filter is disabled for the field.
     */
    active: boolean,

    /**
     * The filter type. The filter type is used to determine the filter input field. The possible values are 'text', 'number', 'date', 'status'.
     */
    type?: string,

    /**
     * The key to send to the server. If not set, the key is the same as the field name. If set, the key is the value of the key. Useful when the server expects a different key as it serves in the DTO.
     */
    filterKey?: string,

    /**
     * If set, this title will be shown in the Search Panel. If not set, the title is the same as the field title defined in "title" key.
     */
    titleOverride?: string
  },
  /**
   * A function to modify the data after it gets from the server but before showing in the cell. This function is called before the data is shown in the cell. You can modify the data here. For example, you can format a date, or you can show a different value based on the raw data.
   * @param data The raw data of the cell
   * @returns The modified/formatted/tweaked data to show in the cell
   */
  middleware?: (data: any) => any,

  /**
   * If true, the column is selectable in the Column Selector Panel. If false, the column is not selectable.
   */
  selectable?: boolean,

  /**
   * If true, the column is orderable/sortable. If false, the column is not orderable/sortable. 
  */
  orderable?: boolean,

  /**
   * You can set a custom order key for the column. If not set, the order key is the same as the field name. Useful when the server expects a different key as it serves in the DTO.
   */
  orderKey?: string,

  /**
   * If its true or not set, the column is exportable and will be added in the export file. If false, the column is not exportable.
  */
  exportable?: boolean,

  /**
   * Sets the width of the column. If not set, the column width is auto. Example values: '100px', '10%'.
   */
  width?: string,

  /**
   * The formatter configuration object for the column. The formatter is a special component to format the data in the cell. 
   * There are 9 types of formatters built-in: 'Boolean', 'DateTime', 'Highlighter', 'HTML', 'LongText', 'Operations', 'Status', 'Strong', 'Tailwind'.
   * You can set the formatter type and the configuration object for the formatter. For example, a 'Strong' type of formatter makes the text bold in cell, and a 'DateTime' type of formatter formats the date.
   * You can define your own custom formatter as well. Check the documentation 'Custom formatters' section for more information.
   */
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
   * If true, the grid will show the about window. Otherwise the grid will not show the about window.
   */
  hideAboutWindow?: boolean,

  /**
   * You can modify the server request parameters before sending to the server. This function is called before the request is sent. You can modify the ordering, pagination and filtering parameters in order to your needs. If not set, the grid will send the parameters as is.
   * @param ordering The ordering object.
   * @param pagination The pagination object.
   * @param filtering The filtering object.
   * @returns The modified URLSearchParams object.
   */
  serverTransformation?: (ordering: Ordering, pagination: PaginationClass, filtering: FilteringClass) => URLSearchParams,

  /**
   * You can modify the axios instance before sending the request to the server. This function is called before the request is sent. You can modify the axios instance in order to your needs. If not set, the grid will use the default axios instance. 
   * @param axios The default axios instance.
   * @returns The modified axios instance.
   */
  axiosConfigurator?: (axios: any) => any,

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
  /* 
  * The extra row configuration object for the grid.
  */
  extraRow?: {
    /**
     * If true, the extra row is active. If false, the extra row is disabled.
     */
    active: boolean,
    /**
     * Determines the user can open more than one extra row at the same time. If false, the user can open only one extra row at a time (close the other when open a new one).
     */
    multiOpen: boolean,
    /**
     * Ths extraRow slot gets the full record object of the "parent". You can define extra fields here that you want to pass to the slot.
     */
    extraParams: object
  },
  /*
  * The column selector/bulk operation configuration object for the grid.
  */
  bulkOperation?: {
    /**
     * If true, the column selector/bulk operation is active. If false, the column selector/bulk operation is disabled.
     */
    active: boolean,
    /**
     * The bulk operation methods. You can define multiple methods here. Each method has a title, a key (must be unique) and an action function. The action function gets the checked rows and a function to clear the checked rows.
     */
    methods: Array<{
      title: string,
      key: string,
      action: (checkedRows: Array<any>, clearRows: () => void) => void
    }>
  },
  /* 
  * The events configuration object for the grid.
  */
  events?: {
    /**
     * The event is fired when the grid is ready. The grid is ready when the first data load is finished.
     */
    onDataLoad?: (data: Array<any>) => Array<any>,
    /* 
    * Same as the onDataLoad event, but this event gets the full response object, not just the data.
    */
    onDataLoadWithFullResponse?: (response: AxiosResponse) => Array<any>,
    /**
     * The event is fired when the grid is ready after a refresh. The grid is ready when the first data load is finished.
     */
    readyAfterRefresh?: () => void,
    /**
     * The event is fired when the selected records on the current pages are changed. The function gets the selected rows.
     */
    onBulkSelectChanges?: (checkedRows: Array<any>) => void
  },
  /* 
  * The column selector configuration object for the grid.
  */
  columnSelector?: {
    /**
     * If true, the column selector is active. If false, the column selector is disabled.
     */
    active: boolean
  },
  /*
  * The XLSX/CSV export configuration object for the grid.
  */
  xlsxExport?: {
    /**
     * If true, the XLSX/CSV export is active. If false, the XLSX/CSV export is disabled.
     */
    active: boolean,
    /**
     * @TBD
     */
    additionalExportFields?: {
      /**
       * User-defined function to append additional fields for the export. The function gets the record object and should return an array.
       */
      columnsFn?: Function
    }
  },
  /*
  * The refreshable configuration object for the grid.
  */
  refreshable: {
    /**
     * If true, the refresh button is active. If false, the refresh button is hidden.
     */
    manualActive: boolean,

    /**
     * If true, the auto refresh is active in the grid's menu. If false, the auto refresh is disabled.
     */
    autoActive: boolean,

    /**
     * If true, the auto refresh can be disabled in the grid's menu by the user. If false, the auto refresh cannot be disabled.
     */
    autoCanBeDisabled: boolean,

    /**
     * The auto refresh values. You can set multiple values here. Each value has a key (must be unique), a refresh interval in milliseconds and a title. The default value is the value that is selected by default in the grid's menu.
     */
    autoValues: Array<{
      /**
       * The key of the value. This key is used in the grid's menu to identify the value. It must be unique in the array.
       */
      key: string,

      /**
       * The refresh interval in milliseconds.
       */
      refreshInterval: number,

      /**
       * The title of the value. This title is shown in the grid's menu.
       */
      title: string,

      /**
       * If true, the value is the default value. If false, the value is not the default value.
       */
      default?: boolean
    }>
  },

  /**
   * The columns configuration object for the grid. The key of the object is the field name in the server's response. The value is the configuration object for the column. See the MappingRecordType for more information.
   */
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