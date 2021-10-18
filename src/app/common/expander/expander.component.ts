import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import {GlobalsService} from '../../globals/globals.service';

@Component({
  selector: 'expander-component',
  templateUrl: './expander.component.html',
  encapsulation: ViewEncapsulation.None

})

/**
 * Sample component is used for nothing
 */
export class ExpanderComponent implements OnChanges {
  /**
   * Disable expand
   */
  @Input() disableExpand = false;

  /**
   * When set to true, disables collapse of a details section that is in error
   * @type {boolean}
   */
 // @Input() disableCollapse = true;
  /**
   * sets if the details form is valid. Controls collapses state
   * @type {boolean}
   */
  @Input() isValid: boolean;

  /**
   * The list of records to display in the expander component
   */
  @Input('group') itemsList;

  /**
   * Signal to indicate a record has been added
   * @type {number}
   */
  @Input() addRecord: number;
  /**
   * Expands a record when it has been added. Default is false
   */
  @Input() expandOnAdd = false;
  @Input() deleteRecord: number;
  @Input() collapseAll: number;
  @Input() loadFileIndicator: boolean;
  @Input() xmlStatus;

  @Output() expandedRow = new EventEmitter();

  private tableRowIndexCurrExpanded = -1;
  private tableRowIndexPreExpanded = -1;
  private _expandAdd: boolean;

  /**
   * for each table row, stores the state i.e. collapsed or expanded
   * @type {boolean[]}
   * @private
   */
  private _expanderTable: boolean[] = [];

  /**
   * an array of JSON objects to define the column labels, widths and bindings
   * @type {any[]}
   */
  @Input() columnDefinitions = [];

  /**
   * The number of columns for this expander. Used to determine columnSpan
   * @type {number}
   */
  private numberColSpan = 1;
  public dataItems = [];
  private _expanderValid: boolean;

  constructor() {
    this._expanderValid = true;
    this._expandAdd = false;
  }

  ngOnInit() {
  }

  /**
   * Looks for and reacts to changes in the expander component
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefinitions']) {
      this.numberColSpan = (changes['columnDefinitions'].currentValue).length + 1;
    }
    if (changes['expandOnAdd']) {
      this._expandAdd = changes['expandOnAdd'].currentValue;
    }

    if (changes['itemsList']) {
      this.updateDataRows(changes['itemsList'].currentValue);
      this.dataItems = changes['itemsList'].currentValue;
      if (!Array.isArray(this.dataItems)) {
        this.dataItems = [];
      } else if (this.dataItems.length > 0 && this.loadFileIndicator) {
        this.tableRowIndexPreExpanded = this.tableRowIndexCurrExpanded;
        this.tableRowIndexCurrExpanded = 0;
      }
    }
    if (changes['isValid']) {
      this._expanderValid = changes['isValid'].currentValue;
    }
    if (changes['addRecord']) {
      this.collapseTableRows();
      this.updateDataRows(this.itemsList);
      if (this._expandAdd) {
        // expands the table on the additon of a new record
        this.selectTableRowNoCheck(this._expanderTable.length - 1);
      } else if ( !this.isValid ) {
        if ( this.tableRowIndexPreExpanded + 1 < this._expanderTable.length ) {
          this.tableRowIndexCurrExpanded = this.tableRowIndexPreExpanded + 1;
        } else {
          this.tableRowIndexCurrExpanded = 0;
        }
        this.selectTableRowNoCheck( this.tableRowIndexCurrExpanded );
      }
    }
    if (changes['deleteRecord']) {
      this.updateDataRows(this.itemsList);
    }
    if (changes['collapseAll']) {
      this.collapseTableRows();
    }
    if (changes['xmlStatus']) {
      if (changes['xmlStatus'].currentValue === GlobalsService.FINAL) {
        this.collapseTableRows();
      }
    }
  }

  /**
   * Adds an additional row to the expander UI state tracking array
   */
  public updateDataRows(srcList) {
    if (!srcList) {
      return;
    }
    if (srcList.length !== this._expanderTable.length) {
      this._expanderTable = new Array<boolean>(srcList.length);
    }
  }

  /**
   * For a given row denoted by a zero based index, returns if a row is collapsed or expanded
   * @param {number} index
   * @returns {boolean}
   */
  public getExpandedState(index: number) {
    return <boolean>(this._expanderTable)[index];
  }

  /**
   *  Checks if a given zero based row denoted by index is expanded
   * @param {number} index
   * @returns {boolean}
   */
  public isExpanded(index: number) {
    if (this.tableRowIndexCurrExpanded < 0) return false;
    this.tableRowIndexPreExpanded = this.tableRowIndexCurrExpanded;
    return this.tableRowIndexCurrExpanded === index;
  };

  /**
   *  Checks if a given zero based row denoted by index is collapsed
   * @param {number} index
   * @returns {boolean}
   */
  public isCollapsed(index: number) {
    return !this.isExpanded(index);
  }


  public broadcastExpandedRow() {
    // return this.tableRowIndexCurrExpanded;
    this.expandedRow.emit(this.tableRowIndexCurrExpanded);
  }
  public getExpandedRow() {
    return this.tableRowIndexCurrExpanded;
  }

  /**
   * Selects the table row to expand or collapse. If disable expand is enabled, will not collapse a row if it is in error
   * @param {number} index
   */
  public selectTableRow(index: number) {
    // if (!this._expanderValid) {
    //    console.warn('select table row did not meet conditions');
    //   return;
    // }
    if ( ! this.disableExpand ) { // && this.isValid
      this.selectTableRowNoCheck(index);
    }
  }


  public selectTableRowNoCheck(index: number) {
    if (this._expanderTable.length > index) {
      const temp = this._expanderTable[index];
      this.collapseTableRows();
      this._expanderTable[index] = !temp;
      this.tableRowIndexPreExpanded = this.tableRowIndexCurrExpanded;
      if (this._expanderTable[index]) {
        this.tableRowIndexCurrExpanded = index;
      } else {
        this.tableRowIndexCurrExpanded = -1;
      }
    } else {
      console.warn('The index is greater than the table length ' + index + ' ' + this._expanderTable.length);
    }
  }

  /**
   * Collapses all the table rows. Ignores any error states in the details.
   */
  public collapseTableRows() {
    for ( let rec of this._expanderTable) {
      rec = false;
    }
    this.tableRowIndexPreExpanded = this.tableRowIndexCurrExpanded;
    this.tableRowIndexCurrExpanded = -1;
  }

  /**
   * Get the row title dynamic according to the expand/collapse status
   */
 public getRowTitle(i) {
   if (this.isCollapsed(i)) {
     return 'Expand Row ' + (i + 1);
   } else if (this.isExpanded(i)) {
     return 'Collapse Row ' + (i + 1);
   }
  }
}
