import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../../error-msg/control-messages.component/control-messages.component';
import {MaterialDetailsService} from './material.details.service';
import {isArray} from 'util';


@Component({
  selector: 'material-details',
  templateUrl: 'material.details.component.html'
})

/**
 * Material Details Component is used for Company form
 */
export class MaterialDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public materialFormLocalModel: FormGroup;
  @Input('group') public materialRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() countries = [];
  @Input() speciesFamilyList = [];
  @Input() tissueTypeList = [];
  @Input() derivativeList = [];
  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public showFieldErrors: boolean = false;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
  }

  ngOnInit() {
    if (!this.materialFormLocalModel) {
      this.materialFormLocalModel = MaterialDetailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;

  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);

      /* errorObjs.forEach(
         error => {
           temp.push(error);
         }
       );
       this.errorList.emit(temp);*/
    });
    this.msgList.notifyOnChanges();

  }

  private _updateErrorList(errorObjs) {
    let temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);

  }

  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.materialRecord) {
        this.setToLocalModel();

      } else {
        this.materialFormLocalModel = MaterialDetailsService.getReactiveModel(this._fb);
        this.materialFormLocalModel.markAsPristine();
      }

    }
    if (changes['showErrors']) {

      this.showFieldErrors = changes['showErrors'].currentValue;
      let temp = [];
      if (this.msgList) {
        this.msgList.forEach(item => {
          temp.push(item);
          // console.log(item);
        });
      }
      this.errorList.emit(temp);
    }

  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.materialFormLocalModel = this.materialRecord;
    if (!this.materialFormLocalModel.pristine) {
      this.materialFormLocalModel.markAsPristine();
    }
  }

  isOtherType() {
    if (this.materialFormLocalModel.controls.tissueType.value && this.materialFormLocalModel.controls.tissueType.value.length > 0) {
      if (this.materialFormLocalModel.controls.tissueType.value[0].id === 'other') {
        return true;
      } else {
        this.materialFormLocalModel.controls.tissueTypeOtherDetails.setValue(null);
        this.materialFormLocalModel.controls.tissueTypeOtherDetails.markAsUntouched();
      }
    }
    return false;
  }

  isOtherDerivative() {
    if (this.materialFormLocalModel.controls.derivative.value && this.materialFormLocalModel.controls.derivative.value.length > 0) {
      if (this.materialFormLocalModel.controls.derivative.value[0].id === 'other') {
        return true;
      } else {
        this.materialFormLocalModel.controls.derivativeOtherDetails.setValue(null);
        this.materialFormLocalModel.controls.derivativeOtherDetails.markAsUntouched();
      }
    }
    return false;
  }

  onblur() {
    console.log(' BLRRE$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  }
  selected(event) {
    // console.log(event);
    this.materialFormLocalModel.controls.specFamily.setValue([event]);
    //if (this.showFieldErrors) {
    //   this.cdr.detectChanges();
      this.ngAfterViewInit();// doing our own change detection
    //}
  }
}

