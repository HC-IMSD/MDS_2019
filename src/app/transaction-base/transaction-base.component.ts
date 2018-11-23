import {ChangeDetectorRef, Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {TransactionBaseService} from './transaction-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {TransactionDataLoaderService} from '../data-loader/transaction-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'transaction-base',
  templateUrl: './transaction-base.component.html',
  styleUrls: ['./transaction-base.component.css']
})

export class TransactionBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;

  private _transactionDetailErrors = [];
  private _requesterErrors = [];
  private _transFeesErrors = [];
  public transactionForm: FormGroup;  // todo: do we need it? could remove?
  public errorList = [];
  public rootTagText = 'MDS_TRANSACTION_ENROL';
  public userList = [];
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public transactionModel = TransactionBaseService.getEmptyTransactionDetailsModel();
  public requesterModel = [];
  public transFeesModel = [];
  public fileServices: FileConversionService;
  public xslName = 'REP_MDS_RT_1_0.xsl';

  /* public customSettings: TinyMce.Settings | any;*/
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: TransactionDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new TransactionDataLoaderService(this.http);
    this.userList = [];
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    if (!this.transactionForm) {
      this.transactionForm = TransactionBaseService.getReactiveModel(this._fb);
    }
    this.userList = await (this.dataLoader.getRequesters(this.translate.currentLang));
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in ApplicationInfo base compo
    this.errorList = [];
    // concat the two array
    this.errorList = this._transactionDetailErrors.concat(this._requesterErrors.concat(this._transFeesErrors));
    // .concat(this._theraErrors);
    this.cdr.detectChanges(); // doing our own change detection
  }

  processDetailErrors(errorList) {
    this._transactionDetailErrors = errorList;
    this.processErrors();
  }

  processRequesterErrors(errorList) {
    this._requesterErrors = errorList;
    this.processErrors();
  }

  processTransFeesErrors(errorList) {
    this._transFeesErrors = errorList;
    this.processErrors();
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
  }

  public saveXmlFile() {
    this._updatedAutoFields();
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
      const result = {
        'MDS_TRANSACTION_ENROL': {
          'application_info': this.transactionModel,
          'requesters': {
            'requester': this.requesterModel
          },
          'transFees': this.transFeesModel
        }
      };
      const fileName = 'hcrepdi-' + this.transactionModel.last_saved_date;
      this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    const result = {'MDS_TRANSACTION_ENROL': {
      'application_info': this.transactionModel,
      'requesters': {
        'requester': this.requesterModel
      },
      'transFees': this.transFeesModel
    }};
    const fileName = 'hcrepdi-' + this.transactionModel.last_saved_date;
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
     console.log('processing file.....');
     console.log(fileData);
    this.transactionModel = fileData.data.MDS_TRANSACTION_ENROL.application_info;
    const dev = fileData.data.MDS_TRANSACTION_ENROL.requesters.requester;
    if (dev) {
      this.requesterModel = (dev instanceof Array) ? dev : [dev];
    }
    const mat = fileData.data.MDS_TRANSACTION_ENROL.transFees;
    if (mat) {
      this.transFeesModel = (mat instanceof Array) ? mat : [mat];
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.transactionModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd-hhmm');
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    const version: Array<any> = this.transactionModel.enrol_version.split('.');
    version[0] = (Number(version[0]) + 1).toString();
    this.transactionModel.enrol_version = version[0] + '.' + version[1];
  }

  public preload() {
    // console.log("Calling preload")
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }

}
