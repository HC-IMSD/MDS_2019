import {ChangeDetectorRef, Component, OnInit,  SimpleChanges, OnChanges, ViewChild, Input, HostListener, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// import {TranslateService} from '@ngx-translate/core';
import {CompanyBaseService} from './company-base.service';
import {FileConversionService} from '../filereader/file-io/file-conversion.service';
import {ConvertResults} from '../filereader/file-io/convert-results';
import {GlobalsService} from '../globals/globals.service';
import {ContactListComponent} from '../contact/contact.list/contact.list.component';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {CompanyDataLoaderService} from '../data-loader/company-data-loader.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'company-base',
  templateUrl: './company-base.component.html',
  styleUrls: ['./company-base.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CompanyBaseComponent implements OnInit {
  public errors;
  @Input() isInternal;
  @Input() lang;
  @ViewChild('tabs', {static: true}) private tabs: NgbTabset;
  @ViewChild(ContactListComponent, {static: true}) companyContacts: ContactListComponent;

  private _genInfoErrors = [];
  private _addressErrors = [];
  private _contactErrors = [];
  private _adminChangesErrors = [];
  // private _primContactErrors = [];
  public companyForm: FormGroup;
  public errorList = [];
  public rootTagText = 'DEVICE_COMPANY_ENROL';
  public isInternalSite = true;
  public loadFileIndicator = 0;
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
  public helpIndex = CompanyBaseService.getHelpTextIndex();
  public foo = '';
  public fileServices: FileConversionService;
  public saveXmlLabel = 'save.draft';
  public mailToLabel = 'mailto.label';
  public xslName = 'REP_MDS_CO_3_0.xsl';
  public showMailToHelpText: boolean;
  public mailToLink = '';
  public activeContacts = [];
  public hasContact = false;

  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef, private dataLoader: CompanyDataLoaderService,
              private http: HttpClient, private translate: TranslateService) {

    dataLoader = new CompanyDataLoaderService(this.http);
    this.countryList = [];
    this.showAdminChanges = false;
    this.showErrors = false;
    this.showMailToHelpText = false;
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
    if (this.isInternal === GlobalsService.NO) {
      this.isInternalSite = false;
      // console.log('isInternalSite in ngOnInit: ' + this.isInternalSite);
    } else {
      this.saveXmlLabel = 'approve.final';
    }
  }

  ngAfterViewInit(): void {
    document.location.href = '#def-top';
    document.location.href = '#main';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactModel']) {
      this._updateContactList(changes['primContactModel'].currentValue);
    }
  }

  private _updateContactList(contacts) {
    this.activeContacts = contacts.filter(contact =>
      (contact[status] === 'NEW' || contact[status] === 'REVISE' || contact[status] === 'ACTIVE'));
    this.hasContact = (this.activeContacts && this.activeContacts.length > 0);
  }

  processErrors() {
    // console.log('@@@@@@@@@@@@ Processing errors in Company base compo
    this.errorList = [];
    // concat the error arrays
    this.errorList = this._genInfoErrors.concat(
      this._addressErrors.concat(this._contactErrors.concat(
        this._adminChangesErrors)));
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

  // processPrimContactErrors(errorList) {
  //   this._primContactErrors = errorList;
  //   this.processErrors();
  // }

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

  public isExternalAndNoError() {
    return (this.isInternalSite || (this.errorList && this.errorList.length > 0) || !this.companyContacts.contactListForm.pristine);
  }

  public saveXmlFile() {
    this.showErrors = false;
    if (this.errorList && this.errorList.length > 0) {
      this.showErrors = true;
      document.location.href = '#topErrorSummary';
    } else {
      if (this.companyContacts.contactListForm.pristine) { // .isPristine
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
        if (this.contactModel && (this.contactModel).length > 0) {
          const cm = this._removeHcStatus(this.contactModel);
          result.DEVICE_COMPANY_ENROL.contacts = {contact: cm};
        }
        const fileName = this._buildfileName();
        this.fileServices.saveXmlToFile(result, fileName, true, this.xslName);
      } else {
        if (this.lang === GlobalsService.ENGLISH) {
          alert('Please save the unsaved input data before generating XML file.');
        } else {
          alert('Veuillez sauvegarder les données d\'entrée non enregistrées avant de générer le fichier XML.');
        }
      }

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
    if (this.contactModel && (this.contactModel).length > 0) {
      const cm = !this.isInternalSite ? this._removeHcStatus(this.contactModel) : this.contactModel;
      result.DEVICE_COMPANY_ENROL.contacts = {contact: cm};
    }
    // result.DEVICE_COMPANY_ENROL.contacts =
    //   (this.contactModel && (this.contactModel).length > 0) ? {contact: this.contactModel} : {};
    // const version: Array<any> = this.genInfoModel.enrol_version.toString().split('.');
    const fileName = this._buildfileName();
    this.fileServices.saveJsonToFile(result, fileName, null);
  }

  public processFile(fileData: ConvertResults) {
    this.loadFileIndicator++;
     // console.log('processing file.....');
     // console.log(fileData);
    this.genInfoModel = fileData.data.DEVICE_COMPANY_ENROL.general_information;
   // set amend reasons and admin changes section to null if status is Final
    if (this.genInfoModel.status === GlobalsService.FINAL) {
      this.genInfoModel.amend_reasons = {
        manufacturer_name_change: '',
        manufacturer_address_change: '',
        facility_change: '',
        contact_change: '',
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
      this.contactModelUpdated(this.contactModel);
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

  private _removeHcStatus(contacts) {
    const cts = contacts.map(function(item) {
      delete item.hc_status;
      return item;
    });
    return cts;
  }

  public updateChild() {
    // console.log("Calling updateChild")
  }

  private _buildfileName() {
    // const version: Array<any> = this.genInfoModel.enrol_version.split('.');
    const today = new Date();
    const pipe = new DatePipe('en-US');
    const date_generated = pipe.transform(today, 'yyyyMMddHHmm');
    if (this.isInternalSite) {
      return 'final-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else if (this.genInfoModel.status === GlobalsService.AMEND) {
      return 'draft-com-' + this.genInfoModel.company_id + '-' + date_generated;
    } else {
      return 'draft-com-' + date_generated;
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

  public mailto() {
    this.showMailToHelpText = true;
    const emailSubject = 'Draft CO XML - ' + this.addressModel.company_name +
      (this.genInfoModel.company_id === null ? '' : this.genInfoModel.company_id);
    let emailAddress;
    let body = 'NOTE: The Company XML file is not automatically attached. ATTACH THE DRAFT COMPANY XML PRIOR TO SUBMITTING.';
    if (this.genInfoModel.are_licenses_transfered  === GlobalsService.YES ||
      this.genInfoModel.amend_reasons.manufacturer_name_change === GlobalsService.YES ||
      this.genInfoModel.amend_reasons.manufacturer_address_change === GlobalsService.YES ||
      this.genInfoModel.amend_reasons.facility_change === GlobalsService.YES) {
      emailAddress = 'qs.mdb@hc-sc.gc.ca';
    } else {
      emailAddress = 'devicelicensing-homologationinstruments@hc-sc.gc.ca';
    }
    // todo: add more body text

    this.mailToLink = 'mailto:' + emailAddress + '?subject=' + emailSubject + '&body=' + body;
  }

  /*
   * update adminChanges to show the text info in the adminChanges component
*/
  public mailtoQS() {
    return (this.genInfoModel.are_licenses_transfered  === GlobalsService.YES ||
            this.genInfoModel.amend_reasons.manufacturer_name_change === GlobalsService.YES ||
            this.genInfoModel.amend_reasons.manufacturer_address_change === GlobalsService.YES ||
            this.genInfoModel.amend_reasons.facility_change === GlobalsService.YES);
  }

  contactModelUpdated(contacts) {
    const cntList = contacts.filter(contact =>
      (contact.status._id === 'NEW' || contact.status._id === 'REVISE' || contact.status._id === 'ACTIVE'));
    this.activeContacts = [];
    if (cntList) {
      cntList.forEach((contact: any) => {
        this.activeContacts.push(contact.full_name);
      });
    }
    this.hasContact = (this.activeContacts && this.activeContacts.length > 0);
  }
}
