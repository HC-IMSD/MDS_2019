import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {CompanyAdminChangesService} from './company-admin.changes.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';


@Component({
  selector: 'comp-admin-changes',
  templateUrl: 'company-admin.changes.component.html'
})

/**
 * Sample component is used for nothing
 */
export class CompanyAdminChangesComponent implements OnInit, OnChanges, AfterViewInit {

  public adminChangesFormLocalModel: FormGroup;
  @Input('group') public adminChangesFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() isInternal: boolean;
  @Input() showAdminChanges;
  @Input() adminChangesModel;
  @Input() lang;
  @Output() adminChangesErrorList = new EventEmitter(true);
  @Output() licenceErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public showAmendInfo: Array<boolean> = [false, false, false, false];
  public yesNoList: Array<any> = [];
  public showFieldErrors = false;
  public licenceModel = [];
  private adminChangesService: CompanyAdminChangesService;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    this.showFieldErrors = false;
    this.showErrors = false;
    this.adminChangesService = new CompanyAdminChangesService();
    this.yesNoList = this.adminChangesService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.adminChangesFormLocalModel) {
      this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
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
    this.adminChangesErrorList.emit(temp);

  }

  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.adminChangesFormRecord) {
        this.setToLocalModel();

      } else {
        this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
        this.adminChangesFormLocalModel.markAsPristine();
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
      this.adminChangesErrorList.emit(temp);
    }
    if (changes['showAdminChanges']) {
      this.showAmendInfo = changes['showAdminChanges'].currentValue;
    }
    if (changes['adminChangesFormLocalModel']) {
      this.adminChangesFormRecord = this.adminChangesFormLocalModel;
    }
    if (changes['adminChangesModel']) {
      const dataModel = changes['adminChangesModel'].currentValue;
      if (!this.adminChangesFormLocalModel) {
        this.adminChangesFormLocalModel = this.adminChangesService.getReactiveModel(this._fb);
        this.adminChangesFormLocalModel.markAsPristine();
      }
      this.licenceModel = dataModel.licences;
      CompanyAdminChangesService.mapDataModelToFormModel(dataModel, (<FormGroup>this.adminChangesFormLocalModel));
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.adminChangesFormLocalModel = this.adminChangesFormRecord;
    if (!this.adminChangesFormLocalModel.pristine) {
      this.adminChangesFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    CompanyAdminChangesService.mapFormModelToDataModel((<FormGroup>this.adminChangesFormLocalModel),
      this.adminChangesModel, this.licenceModel);
  }

  processLicenceErrors(errorList) {
    this.licenceErrorList.emit(errorList);

  }

  processLicenceModel(errorList) {
    this.licenceErrorList.emit(errorList);

  }

  isReguChange() {
    if (this.adminChangesFormLocalModel.controls.isReguChange.value) {
      if (this.adminChangesFormLocalModel.controls.isReguChange.value === GlobalsService.YES) {
        return true;
      } else {
        this.adminChangesFormLocalModel.controls.newCompanyId.setValue(null);
        this.adminChangesFormLocalModel.controls.newCompanyId.markAsUntouched();
        this.adminChangesFormLocalModel.controls.newContactId.setValue(null);
        this.adminChangesFormLocalModel.controls.newContactId.markAsUntouched();
        this.adminChangesFormLocalModel.controls.newContactName.setValue(null);
        this.adminChangesFormLocalModel.controls.newContactName.markAsUntouched();
      }
    }
    return false;
  }
}

