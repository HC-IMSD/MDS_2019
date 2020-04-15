import {AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges} from '@angular/core';
import {GlobalsService} from '../../globals/globals.service';
import {ExpanderComponent} from '../../common/expander/expander.component';
import {ErrorSummaryObject} from './error-summary-object';
import {ValidationService} from '../../validation.service';

@Component({
  selector: 'error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.css']
})
export class ErrorSummaryComponent implements AfterViewInit {
  @Input() headingPreamble: string;
  @Input() errorList;
  @Input() hiddenSummary;
  @Input() compId = 'error-summary-';
  @Input() label: string;
  @Input() headingLevel: string;
  public validService: ValidationService;
  public type: string;

  public errors = {};
  public componentId = '';
  public tableId = '';
  public hdingLevel = 'h1';
  public index: number;
  public expander: ExpanderComponent ;

  constructor(private cdr: ChangeDetectorRef) {
    this.type = GlobalsService.errorSummClassName;
    this.index = -1;
    this.expander = null;
  }

  ngAfterViewInit() {
    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorList']) {
      this.processErrors(changes['errorList'].currentValue);
      // console.log("........process errors in error summary ");
      // console.log(changes['errorList'].currentValue)
    }
    if (changes['compId']) {
      this.componentId = changes['compId'].currentValue;
    }
    if (changes['headingLevel']) {
      this.hdingLevel = changes['headingLevel'].currentValue;
    }
  }

  /**
   * Creates an array of error elements based on the incoming error objects
   * Currently groups the errors by parent. Not doing anything with parent right now.
   * But could display errors groupded by the parent and parent label
   * @param errorList
   */
  public processErrors(errorList): void {
    this.errors = {};
    if (!errorList) {
      return;
    }
    // console.log(errorList);
    for (let err of errorList) {
      if (!err) { continue; }
      let controlError = this.getEmptyError();
      controlError.index = 1;
      controlError.label = err.label;
      controlError.controlId = err.controlId;
      controlError.error = err.currentError;
      controlError.type = err.type;
      controlError.tabSet = err.tabSet;
      controlError.tabId = err.tabId;
      controlError.componentId = err.componentId; // error summary only uses this
      controlError.expander = err.expander; // error summary only uses
      controlError.compRef = err;
      if (err.controlId === 'hasMaterial') {
        err.type = GlobalsService.errorSummleastOneRcd;
        err.tableId = 'materialListTable';
      }
      // Case 1: an error summary Component
      if (err.hasOwnProperty('type') &&
        (err.type === GlobalsService.errorSummClassName || err.type === GlobalsService.errorSummleastOneRcd)) {
        if (err.tableId) { // replace componentId with table ID
          controlError.tableId = err.tableId;
        }
        let parentError = {parentLabel: '', index: -1, controls: []};
        parentError.parentLabel = err.componentId;
        parentError.index = err.index;
        parentError.controls.push(controlError); //TODO needed for eerror summary
        this.errors[err.componentId] = parentError;
      } else {
        // Case 2 Not an error summary. If has a parentId gourp the errors
        if (this.errors.hasOwnProperty(err.parentId)) {
          let id = err.parentId;
          this.errors[id].controls.push(controlError);
        } else {
          // create a parent tag and put errors under the controls list
          let parentError = {parentLabel: '', controls: []};
          parentError.parentLabel = err.parentLabel;
          parentError.controls.push(controlError);
          this.errors[err.parentId] = parentError;
        }
      }
    }
    // console.log(this.errors);
  }

  /**
   * Selects thje tab from an ngbTabset
   * @param error- the error object created by the summary component
   */
  public processEvents(error) {
    //process tab Events first. Assunming rhere are no tabs inside an expander
    if (error && error.tabSet && error.tabId) {
      error.tabSet.select(error.tabId);
    }
    //expander if needed
    if (error && error.expander && error.index > -1) {
      if (!error.expander.getExpandedState(error.index)) {
        error.expander.selectTableRow(error.index);
      }
    }
  }

  /**
   * Creates a flat json object for the error summary component UI
   * @returns {object}
   */
  public getEmptyError(): ErrorSummaryObject {
    let controlError = {

      index: -1,
      label: '',
      controlId: '',
      error: '',
      type: '',
      tabSet: null,
      tabId: -1,
      componentId: '',
      tableId: '',
      expander: null,
      compRef: null
    };
    return (controlError);
  }

}
