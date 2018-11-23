import {
  Component, Input, Output, OnInit, SimpleChanges, OnChanges, EventEmitter, ViewChildren, QueryList,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ControlMessagesComponent} from '../error-msg/control-messages.component/control-messages.component';
import {TransactionDetailsService} from './transaction.details.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {GlobalsService} from '../globals/globals.service';
import {isArray} from 'util';
import {noUndefined} from '@angular/compiler/src/util';


@Component({
  selector: 'app-info-details',
  templateUrl: 'transaction.details.component.html'
})

/**
 * Sample component is used for nothing
 */
export class TransactionDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  public transDetailsFormLocalModel: FormGroup;
  @Input('group') public transDetailsFormRecord: FormGroup;
  @Input() detailsChanged: number;
  @Input() showErrors: boolean;
  @Input() userList;
  @Input() transactionModel;
  @Input() requesterModel;
  @Input() transFeesModel;
  @Input() lang;
  // @Output() hasQmsc = new EventEmitter();
  @Output() detailErrorList = new EventEmitter(true);
  @Output() requesterErrorList = new EventEmitter(true);
  @Output() transFeesErrorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  // For the searchable select box, only accepts/saves id and text.
  // Will need to convert
  public actLeadList;
  public actTypeList;
  public transDescList;
  public amendReasonList;
  public yesNoList: Array<any> = [];
  public licenceAppTypeList: Array<any> = [];
  public showFieldErrors = false;
  private detailsService: TransactionDetailsService;

  constructor(private _fb: FormBuilder, // todo: private dataLoader: DossierDataLoaderService,
              private http: HttpClient, private translate: TranslateService,
              private cdr: ChangeDetectorRef) {
    // todo: dataLoader = new DossierDataLoaderService(this.http);
    this.showFieldErrors = false;
    this.showErrors = false;
    this.actLeadList = [];
    this.actTypeList = [];
    this.transDescList = [];
    this.amendReasonList = [];
    this.detailsService = new TransactionDetailsService();
    this.yesNoList = this.detailsService.getYesNoList();
  }

  async ngOnInit() {
    if (!this.transDetailsFormLocalModel) {
      this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
    }
    this.detailsChanged = 0;
    this.actLeadList = TransactionDetailsService.getActivityLeads();
    // this.actTypeList = TransactionDetailsService.getActivityTypes();
    // this.transDescList = TransactionDetailsService.getDrugTypes();
    // this.amendReasonList = TransactionDetailsService.getDrugTypes();
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
    this.detailErrorList.emit(temp);

  }


  ngOnChanges(changes: SimpleChanges) {

    // since we can't detect changes on objects, using a separate flag
    if (changes['detailsChanged']) { // used as a change indicator for the model
      // console.log("the details cbange");
      if (this.transDetailsFormRecord) {
        this.setToLocalModel();

      } else {
        this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
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
      this.detailErrorList.emit(temp);
    }
    if (changes['transDetailsFormLocalModel']) {
      console.log('**********the DOSSIER details changed');
      this.transDetailsFormRecord = this.transDetailsFormLocalModel;
    }
    if (changes['transactionModel']) {
      const dataModel = changes['transactionModel'].currentValue;
      if (!this.transDetailsFormLocalModel) {
        this.transDetailsFormLocalModel = this.detailsService.getReactiveModel(this._fb);
        this.transDetailsFormLocalModel.markAsPristine();
      }
      TransactionDetailsService.mapDataModelToFormModel(dataModel, (<FormGroup>this.transDetailsFormLocalModel));
    }
    if (changes['userList']) {
      this.userList = changes['userList'].currentValue;
    }
  }

  /**
   * Uses the updated reactive forms model locally
   */

  setToLocalModel() {
    this.transDetailsFormLocalModel = this.transDetailsFormRecord;
    if (!this.transDetailsFormLocalModel.pristine) {
      this.transDetailsFormLocalModel.markAsPristine();
    }
  }

  onblur() {
    // console.log('input is typed');
    TransactionDetailsService.mapFormModelToDataModel((<FormGroup>this.transDetailsFormLocalModel),
      this.transactionModel);
  }

  processRequesterErrors(errorList) {
    this.requesterErrorList.emit(errorList);

  }

  processTransFeesErrors(errorList) {
    this.transFeesErrorList.emit(errorList);
  }

  isIVDD() {
    if (this.transDetailsFormLocalModel.controls.isIvdd.value) {
      if (this.transDetailsFormLocalModel.controls.isIvdd.value === GlobalsService.YES) {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.isHomeUse.setValue(null);
        this.transDetailsFormLocalModel.controls.isHomeUse.markAsUntouched();
        this.transDetailsFormLocalModel.controls.isCarePoint.setValue(null);
        this.transDetailsFormLocalModel.controls.isCarePoint.markAsUntouched();
      }
    }
    return false;
  }

  isNOIVDD() {
    if (this.transDetailsFormLocalModel.controls.isIvdd.value) {
      if (this.transDetailsFormLocalModel.controls.isIvdd.value === GlobalsService.NO) {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.hasDrug.setValue(null);
        this.transDetailsFormLocalModel.controls.hasDrug.markAsUntouched();
        this.transDetailsFormLocalModel.controls.hasDinNpn.setValue(null);
        this.transDetailsFormLocalModel.controls.hasDinNpn.markAsUntouched();
        this.transDetailsFormLocalModel.controls.din.setValue('');
        this.transDetailsFormLocalModel.controls.din.markAsUntouched();
        this.transDetailsFormLocalModel.controls.npn.setValue('');
        this.transDetailsFormLocalModel.controls.npn.markAsUntouched();
        this.transDetailsFormLocalModel.controls.drugName.setValue('');
        this.transDetailsFormLocalModel.controls.drugName.markAsUntouched();
        this.transDetailsFormLocalModel.controls.activeIngredients.setValue('');
        this.transDetailsFormLocalModel.controls.activeIngredients.markAsUntouched();
        this.transDetailsFormLocalModel.controls.manufacturer.setValue('');
        this.transDetailsFormLocalModel.controls.manufacturer.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceUsp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceUsp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceGmp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceGmp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceOther.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceOther.markAsUntouched();
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.setValue('');
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
      }
    }
    return false;
  }

  hasDrug() {
    if (this.transDetailsFormLocalModel.controls.hasDrug.value) {
      if (this.transDetailsFormLocalModel.controls.hasDrug.value === GlobalsService.YES) {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.hasDinNpn.setValue(null);
        this.transDetailsFormLocalModel.controls.hasDinNpn.markAsUntouched();
        this.transDetailsFormLocalModel.controls.din.setValue('');
        this.transDetailsFormLocalModel.controls.din.markAsUntouched();
        this.transDetailsFormLocalModel.controls.npn.setValue('');
        this.transDetailsFormLocalModel.controls.npn.markAsUntouched();
        this.transDetailsFormLocalModel.controls.drugName.setValue('');
        this.transDetailsFormLocalModel.controls.drugName.markAsUntouched();
        this.transDetailsFormLocalModel.controls.activeIngredients.setValue('');
        this.transDetailsFormLocalModel.controls.activeIngredients.markAsUntouched();
        this.transDetailsFormLocalModel.controls.manufacturer.setValue('');
        this.transDetailsFormLocalModel.controls.manufacturer.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceUsp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceUsp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceGmp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceGmp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceOther.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceOther.markAsUntouched();
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.setValue('');
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
      }
    }
    return false;
  }

  hasDin() {
    if (this.transDetailsFormLocalModel.controls.hasDinNpn.value) {
      if (this.transDetailsFormLocalModel.controls.hasDinNpn.value === 'din') {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.din.setValue('');
        this.transDetailsFormLocalModel.controls.din.markAsUntouched();
      }
    }
    return false;
  }

  hasNpn() {
    if (this.transDetailsFormLocalModel.controls.hasDinNpn.value) {
      if (this.transDetailsFormLocalModel.controls.hasDinNpn.value === 'npn') {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.npn.setValue('');
        this.transDetailsFormLocalModel.controls.npn.markAsUntouched();
      }
    }
    return false;
  }

  isNoDinNpn() {
    if (this.transDetailsFormLocalModel.controls.hasDinNpn.value) {
      if (this.transDetailsFormLocalModel.controls.hasDinNpn.value === 'nodinnpn') {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.drugName.setValue('');
        this.transDetailsFormLocalModel.controls.drugName.markAsUntouched();
        this.transDetailsFormLocalModel.controls.activeIngredients.setValue('');
        this.transDetailsFormLocalModel.controls.activeIngredients.markAsUntouched();
        this.transDetailsFormLocalModel.controls.manufacturer.setValue('');
        this.transDetailsFormLocalModel.controls.manufacturer.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceUsp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceUsp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceGmp.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceGmp.markAsUntouched();
        this.transDetailsFormLocalModel.controls.complianceOther.setValue(false);
        this.transDetailsFormLocalModel.controls.complianceOther.markAsUntouched();
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.setValue('');
        this.transDetailsFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
      }
    }
    return false;
  }

  isOtherPharmacopeia() {
    if (this.transDetailsFormLocalModel.controls.complianceOther.value) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.otherPharmacopeia.setValue('');
      this.transDetailsFormLocalModel.controls.otherPharmacopeia.markAsUntouched();
    }
    return false;
  }

  isIt() {
      if (this.transDetailsFormLocalModel.controls.provisionMdrIT.value) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.authorizationNum.setValue('');
      this.transDetailsFormLocalModel.controls.authorizationNum.markAsUntouched();
    }
    return false;
  }

  isSa() {
    if (this.transDetailsFormLocalModel.controls.provisionMdrSA.value) {
      return true;
    } else {
      this.transDetailsFormLocalModel.controls.deviceId.setValue('');
      this.transDetailsFormLocalModel.controls.deviceId.markAsUntouched();
    }
    return false;
  }

  isNoDeclaration() {
    if (this.transDetailsFormLocalModel.controls.declarationConformity.value) {
      return (this.transDetailsFormLocalModel.controls.declarationConformity.value === GlobalsService.NO);
    }
    return false;
  }

  isRecombinant() {
    if (this.transDetailsFormLocalModel.controls.hasRecombinant.value) {
      if (this.transDetailsFormLocalModel.controls.hasRecombinant.value === GlobalsService.YES) {
        return true;
      } else {
        this.transDetailsFormLocalModel.controls.isAnimalHumanSourced.setValue(null);
        this.transDetailsFormLocalModel.controls.isAnimalHumanSourced.markAsUntouched();
        this.transDetailsFormLocalModel.controls.isListedIddTable.setValue(null);
        this.transDetailsFormLocalModel.controls.isListedIddTable.markAsUntouched();
        this.transFeesModel = [];
      }
    }
    return false;
  }
}

