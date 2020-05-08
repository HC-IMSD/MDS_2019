import {FormArray, FormGroup} from '@angular/forms';
import {ExpanderComponent} from './common/expander/expander.component';
import {ErrorSummaryComponent} from './error-msg/error-summary/error-summary.component';
import {ViewChild} from '@angular/core';
import {IMasterDetails} from './master-details';


export abstract class ListOperations {

  public prevRow: number;
  protected showErrorSummary: boolean;
  public newRecordIndicator: boolean;

  @ViewChild(ExpanderComponent, {static: true}) expander: ExpanderComponent;
  private errorSummary: ErrorSummaryComponent;

  /**
   * Used to create address ids
   * @type {number}
   * @private
   */

  constructor() {
    this.prevRow = -1;
    this.showErrorSummary = false;
    this.newRecordIndicator = false;
  }


  /**
   * Sets an ErrorSummary object (optional)
   * @param {ErrorSummaryComponent} errorSummaryInstance
   */
  public setErrorSummary(errorSummaryInstance: ErrorSummaryComponent) {
    this.errorSummary = errorSummaryInstance; // TODO dont think this does anything
  }

  /**
   * Sets a reference to an expander instance
   * @param {ExpanderComponent} expanderInstance
   */
 /* public setExpander(expanderInstance: ExpanderComponent) {
    this.expander = expanderInstance;
  }
*/
  /**
   * Synchs the currently expanded row with the appropriate reactive form recortd
   * @param {FormArray} reactiveFormList -list of UI records
   * @returns {FormGroup} the record that matchs the currently open row
   */
  public syncCurrentExpandedRow(reactiveFormList: FormArray): FormGroup {

    if (!this.expander) {
      console.warn('ListOperations-syncCurrentExpandedRow: There is no expander');
      return;
    }
    const rowNum = this.expander.getExpandedRow();
    // used to sync the expander with the details
    if (rowNum > -1 && this.prevRow !== rowNum) {
      this.prevRow = rowNum;
      // console.log('Prev control does not equal current row');
      return <FormGroup> reactiveFormList.controls[rowNum];
    } else {
      // do nothing?
      return null;
    }
  }

  /**
   * Colllapses all the expander rows. Just a wrapper to the expander
   */
  private collapseExpanderRows() {
    if (this.expander) {
      this.expander.collapseTableRows();
    }

  }

  /**
   * Saves a record to the form model using the passed in service
   * @param {FormGroup} record
   * @param service
   * @returns {number}
   */
  public saveRecord(record: FormGroup, service: IMasterDetails): number {
    //  Case 1 no record, just show error summary, shoud never happen
    if (!record) {
      this.showErrorSummary = true;
      return -1;
    }
    // console.log(record);
    let recordId = service.saveRecord(record);
    this.showErrorSummary = false;
    this.newRecordIndicator = false; // in case this was a new record
    // this.collapseExpanderRows();
    return recordId;
  }

  /**
   * Adds a  new reoord. Exposes the new record ui
   * @param {FormGroup} formRecord
   * @param {FormArray} formList
   */
  public addRecord(formRecord: FormGroup, formList: FormArray) {
    this.collapseExpanderRows(); // if you don't do this view will not look right
    formList.push(formRecord);
    // console.log(formList);
    this.newRecordIndicator = true; // TODO why does superclass variable not update
  }

  /**
   * Deletes a form record of a given id
   * @param {number} id
   * @param {FormArray} recordList
   * @param service
   */
  public deleteRecord(id: number, recordList: FormArray, service: IMasterDetails) {
    const serviceResult = service.deleteModelRecord(id);
    for (let i = 0; i < recordList.controls.length; i++) {
      const temp = <FormGroup> recordList.controls[i];
      if (temp.controls.id.value === id) {
        recordList.removeAt(i);
        if (id === service.getCurrentIndex()) {
          service.setIndex(id - 1);
        }
        break;
      }
    }
    this.collapseExpanderRows();
    this.newRecordIndicator = false;
    this.prevRow = -1;
  }

  /**
   * Gets a recond of a given id, provided the list
   * @param {number} id
   * @param recordList
   * @returns {any}
   */
  public getRecord(id: number, recordList) {
    for (let i = 0; i < recordList.controls.length; i++) {
      let temp = <FormGroup> recordList.controls[i];
      if (temp.controls.id.value === id) {
        return temp;
      }
    }
    return null;
  }

  public getExpandedRow(): number {
     return this.expander.getExpandedRow();

  }
}
