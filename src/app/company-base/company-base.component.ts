import {ChangeDetectorRef, Component, OnInit, ViewChild, Input, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {CompanyBaseService} from './company-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css']
})

export class CompanyBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @ViewChild('tabs', {static: true}) private tabs: NgbTabset;

  private _genInfoErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _adminChangesErrors = [];
  private _primContactErrors = [];
  public companyForm: FormGroup;
  public errorList = [];
  public rootTagText = 'DEVICE_COMPANY_ENROL';
  public isInternalSite = false;
  public loadFileIndicator = false;
  public countryList = [];
  public provinceList = [];
  public stateList = [];
  public adminChanges = [];
  public showAdminChanges: boolean;
  public showErrors: boolean;
  public title = '';
  public headingLevel = 'h2';
  public addressModel = CompanyBaseService.getEmptyAddressDetailsModel();
  public genInfoModel = CompanyBaseService.getEmptyGenInfoModel();
  public contactModel = [];
  public adminChangesModel = CompanyBaseService.getEmptyAdminChangesModel();
  public primContactModel = CompanyBaseService.getEmptyPrimarycontactModel();
  public foo = '';
  public fileServices: FileConversionService;
  public saveXmlLabel = 'save.draft';
  public xslName = GlobalsService.STYLESHEETS_1_0_PREFIX + 'REP_MDS_CO_1_0.xsl';

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
    this.showAdminChanges = false;
    this.showErrors = false;
    this.fileServices = new FileConversionService();
  }

  async ngOnInit() {
    if (!this.companyForm) {
      this.companyForm = CompanyBaseService.getReactiveModel(this._fb);
    }
    this.countryList = await (this.dataLoader.getCountries(this.translate.currentLang));
    this.provinceList = await (this.dataLoader.getProvinces(this.translate.currentLang));
    this.stateList = await (this.dataLoader.getStates(this.translate.currentLang));
    // console.log('isInternal in ngOnInit: ' + this.isInternal);
    if (this.isInternal === GlobalsService.YES) {
      this.isInternalSite = true;
      // console.log('isInternalSite in ngOnInit: ' + this.isInternalSite);
      this.saveXmlLabel = 'approve.final';
    }
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the error arrays
    this.errorList = this._genInfoErrors.concat(
      this._addressErrors.concat(this._contactErrors.concat(
        this._primContactErrors.concat(this._adminChangesErrors))));
    this.cdr.detectChanges(); // doing our own change detection
  }

  processAddressErrors(errorList) {
    this._addressErrors = errorList;
    this.processErrors();
  }

  processGenInfoErrors(errorList) {
    this._genInfoErrors = errorList;
    this.processErrors();
  }

  processContactErrors(errorList) {
    this._contactErrors = errorList;
    this.processErrors();
  }

  processPrimContactErrors(errorList) {
    this._primContactErrors = errorList;
    this.processErrors();
  }

  processAdminChangesErrors(errorList) {
    this._adminChangesErrors = this.showAdminChanges ? errorList : [];
    this.processErrors();
  }

  processAdminChangesUpdate(adminChanges) {
    this.adminChanges = adminChanges;
    if (adminChanges && adminChanges.length > 0) {
      this.showAdminChanges = adminChanges[0];
    } else {
      this.showAdminChanges = false;
    }
    if (!this.showAdminChanges) {
      // reset adminchanges model to empty and update its error list to empty if showAdminChanges is false
      this.adminChangesModel = CompanyBaseService.getEmptyAdminChangesModel();
      this.processAdminChangesErrors([]);
    }
  }

  public hideErrorSummary() {
    return (this.showErrors && this.errorList && this.errorList.length > 0);
    // if (!this.errorList) {
    //   return false;
    // }
    // return this.errorList.length === 0;
  }

  public isExternalAndFinal() {
    return (!this.isInternalSite && this.genInfoModel.status === GlobalsService.FINAL);
  }

  public saveXmlFile() {
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
    } else {
      this._updatedAutoFields();
      if (this.isInternalSite) {
        this.genInfoModel.status = CompanyBaseService.setFinalStatus();
      }
      const result = {
        'DEVICE_COMPANY_ENROL': {
          'general_information': this.genInfoModel,
          'address': this.addressModel,
          'contacts': {},
          'primary_contact': this.primContactModel,
          'administrative_changes': this.adminChangesModel
        }
      };
      result.DEVICE_COMPANY_ENROL.contacts =
        (this.contactModel && (this.contactModel).length > 0) ? {contact: this.contactModel} : {};
      const fileName = this._buildfileName();
      this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
    }
  }

  public saveWorkingCopyFile() {
    this._updatedSavedDate();
    let result = {'DEVICE_COMPANY_ENROL': {
      'general_information': this.genInfoModel,
      'address': this.addressModel,
      'contacts': {},
      'primary_contact': this.primContactModel,
      'administrative_changes': this.adminChangesModel
    }};
    result.DEVICE_COMPANY_ENROL.contacts =
      (this.contactModel && (this.contactModel).length > 0) ? {contact: this.contactModel} : {};
    const version: Array<any> = this.genInfoModel.enrol_version.toString().split('.');
    const fileName = 'draftrepcom-' + version[0] + '-' + version[1];
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator = true;
     console.log('processing file.....');
     console.log(fileData);
    this.genInfoModel = fileData.data.DEVICE_COMPANY_ENROL.general_information;
   // set amend reasons and admin changes section to null if status is Final
    if (this.genInfoModel.status === GlobalsService.FINAL) {
      this.genInfoModel.amend_reasons = {
        manufacturer_name_change: '',
        manufacturer_address_change: '',
        facility_change: '',
        other_change: '',
        other_details: ''
      };
      // this.genInfoModel.are_licenses_transfered = '';
    }

    this._updateAdminChanges();
    if (fileData.data.DEVICE_COMPANY_ENROL.administrative_changes) {
      this.adminChangesModel = fileData.data.DEVICE_COMPANY_ENROL.administrative_changes;
    }

    this.addressModel = fileData.data.DEVICE_COMPANY_ENROL.address;
    this.primContactModel = fileData.data.DEVICE_COMPANY_ENROL.primary_contact;
    const cont = fileData.data.DEVICE_COMPANY_ENROL.contacts.contact;
    if (cont) {
      this.contactModel = (cont instanceof Array) ? cont : [cont];
    } else {
      this.contactModel = [];
    }
    if (this.isInternalSite) {
      // once load data files on internal site, lower components should update error list and push them up
      this.showErrors = true;
    }
  }

  private _updatedAutoFields() {
    this._updatedSavedDate();
    if (this.isInternalSite) {
      this.genInfoModel.status = CompanyBaseService.setFinalStatus();
      this.genInfoModel.enrol_version = (Math.floor(Number(this.genInfoModel.enrol_version)) + 1).toString() + '.0';
    } else {
      const version: Array<any> = this.genInfoModel.enrol_version.split('.');
      version[1] = (Number(version[1]) + 1).toString();
      this.genInfoModel.enrol_version = version[0] + '.' + version[1];
    }
  }

  private _updatedSavedDate() {
    const today = new Date();
    const pipe = new DatePipe('en-US');
    this.genInfoModel.last_saved_date = pipe.transform(today, 'yyyy-MM-dd');
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }

  private _buildfileName() {
    const version: Array<any> = this.genInfoModel.enrol_version.split('.');
    if (this.isInternalSite) {
      return 'hcrepcom-' + this.genInfoModel.company_id + '-' + version[0] + '-' + version[1];
    } else if (this.genInfoModel.status === GlobalsService.AMEND) {
      return 'draftrepcom-' + this.genInfoModel.company_id + '-' + version[0] + '-' + version[1];
    } else {
      return 'draftrepcom-' + version[0] + '-' + version[1];
    }
  }
/*
 * update adminChanges to show the text info in the adminChanges component
 */
  private _updateAdminChanges() {
    this.adminChanges[1] = this.genInfoModel.amend_reasons.manufacturer_name_change === GlobalsService.YES;
    this.adminChanges[2] = this.genInfoModel.amend_reasons.manufacturer_address_change === GlobalsService.YES;
    this.adminChanges[3] = this.genInfoModel.amend_reasons.facility_change === GlobalsService.YES;
    this.adminChanges[0] = this.genInfoModel.are_licenses_transfered  === GlobalsService.YES ||
        this.adminChanges[1] || this.adminChanges[2] || this.adminChanges[3];
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

}
