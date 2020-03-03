import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {PrimaryContactService} from './primary.contact.service';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';

@Component({
  selector: 'primary-contact',
  templateUrl: 'primary.contact.component.html'
})

/**
 * Primary Contact component is used for company form
 */
export class PrimaryContactComponent implements OnInit, OnChanges, AfterViewInit {

  public primContactFormLocalModel: FormGroup;
  @Input('group') public primContactFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() primContactModel;
  @Input() lang;
  @Input() helpTextSequences;
  @Output() primContactErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  public showFieldErrors = false;
  public yesNoList: Array<any> = [];
  private detailsService: PrimaryContactService;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.detailsService = new PrimaryContactService();
    this.yesNoList = this.detailsService.getYesNoList();
  }

  ngOnInit() {
    if (!this.primContactFormLocalModel) {
      this.primContactFormLocalModel = PrimaryContactService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
  }

  ngAfterViewInit() {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      this._updateErrorList(errorObjs);
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
    this.primContactErrorList.emit(temp);

  }

  ngDoCheck() {
    /*  this.isValid();
      this._syncCurrentExpandedRow();*/
  }

  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.primContactFormRecord) {
        this.setToLocalModel();

      } else {
        this.primContactFormLocalModel = PrimaryContactService.getReactiveModel(this._fb);
        this.primContactFormLocalModel.markAsPristine();
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
      this.primContactErrorList.emit(temp);
    }
    if (changes['primContactFormLocalModel']) {
      console.log('**********the primary contact changed');
      this.primContactFormRecord = this.primContactFormLocalModel;
    }
    if (changes['primContactModel']) {
      const dataModel = changes['primContactModel'].currentValue;
      PrimaryContactService.mapDataModelToFormModel(dataModel, (<FormGroup>this.primContactFormLocalModel));
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.primContactFormLocalModel = this.primContactFormRecord;
    if (!this.primContactFormLocalModel.pristine) {
      this.primContactFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    PrimaryContactService.mapFormModelToDataModel((<FormGroup>this.primContactFormLocalModel),
      this.primContactModel);
  }

  by3rdParty() {
    if (this.primContactFormLocalModel.controls.isThirdParty.value &&
      this.primContactFormLocalModel.controls.isThirdParty.value === GlobalsService.YES) {
      return true;
    } else {
      this.primContactFormLocalModel.controls.repContactCompanyId.setValue(null);
      this.primContactFormLocalModel.controls.repContactCompanyId.markAsUntouched();
      this.primContactFormLocalModel.controls.repContactId.setValue(null);
      this.primContactFormLocalModel.controls.repContactId.markAsUntouched();
      this.primContactFormLocalModel.controls.repRoutingId.setValue(null);
      this.primContactFormLocalModel.controls.repRoutingId.markAsUntouched();
    }
    return false;
  }

  notBy3rdParty() {
    if (this.primContactFormLocalModel.controls.isThirdParty.value &&
      this.primContactFormLocalModel.controls.isThirdParty.value === GlobalsService.NO) {
      return true;
    } else {
      this.primContactFormLocalModel.controls.repContactName.setValue(null);
      this.primContactFormLocalModel.controls.repContactName.markAsUntouched();
    }
    return false;
  }
}

