import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class TransactionDetailsService {

  // private static licenceAppTypeList: Array<any> = TransactionDetailsService.getRawLicenceAppTypeList();
  private static lang = GlobalsService.ENGLISH;

  constructor() {
  }

  /**
   * Gets the reactive forms Model for address details
   * @param {FormBuilder} fb
   * @returns {any}
   */
  public getReactiveModel(fb: FormBuilder) {
    if (!fb) {return null; }
    return fb.group({
      dossierId: ['', [Validators.required, ValidationService.dossierIdValidator]],
      dossierType: ['Medical device', []],
      manuCompanyId: ['', [Validators.required, ValidationService.companyIdValidator]],
      manuContactId: ['', [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: ['', [Validators.required, ValidationService.regulatoryCompanyIdValidator]],
      reguContactId: ['', [Validators.required, ValidationService.regulatoryContactIdValidator]],
      activityLead: ['', Validators.required],
      activityType: ['', Validators.required],
      descriptionType: ['', Validators.required],
      deviceClass: ['', Validators.required],
      amendReason: ['', Validators.required],
      classChange: [false, []],
      rationale: ['', Validators.required],
      proposedIndication: ['', Validators.required],
      licenceChange: [false, []],
      deviceChange: [false, []],
      processChange: [false, []],
      qualityChange: [false, []],
      designChange: [false, []],
      materialsChange: [false, []],
      labellingChange: [false, []],
      safetyChange: [false, []],
      purposeChange: [false, []],
      addChange: [false, []],
      licenceNum: ['', [Validators.required, ValidationService.licenceNumValidator]],
      orgManufactureId: ['', [Validators.required, ValidationService.numberValidator]],
      orgManufactureLic: ['', [Validators.required, ValidationService.numberValidator]],
      appNum: ['', [Validators.required, ValidationService.appNumValidator]],
      appNumOpt: ['', [ValidationService.appNumValidator]],
      meetingId: '',
      deviceName: ['', Validators.required],
      licenceName: ['', Validators.required],
      requestVersion: ['', Validators.required],
      requestDate: ['', Validators.required],
      requestTo: ['', Validators.required],
      briefDesc: ['', Validators.required],
      transDescription: [null, []],
      hasDdt: [false, []],
      hasDdtMan: ['', Validators.required],
      hasAppInfo: [false, []],
      isSolicitedInfo: ['', []]
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public getEmptyModel() {

    return (
      {
        dossier_id: '',
        dossier_type: 'Medical Device',
        company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        regulatory_activity_lead: '',
        regulatory_activity_type: '',
        description_type: '',
        device_class: '',
        amend_reasons: {
          classification_change: '',
          licence_change: '',
          device_change: '',
          process_change: '',
          quality_change: '',
          design_change: '',
          materials_change: '',
          labelling_change: '',
          safety_change: '',
          purpose_change: '',
          add_delete_change: ''
        },
        licence_number: '',
        application_number: '',
        meeting_id: '',
        device_name: '',
        rationale: '',
        proposed_indication: '',
        proposed_licence_name: '',
        request_version: '',
        request_date: '',
        request_to: '',
        brief_description: '',
        transaction_description: '',
        has_ddt: '',
        has_app_info: '',
        is_solicited_info: ''
      }
    );
  }

  /**
   * Gets an data array
   *
   */
 // public static getActivityLeads() {
 //   return ['Medical Device Bureau'];
 // }

 // public static getRawActivityTypes() {
 //   return ['Minor Change', 'Licence', 'Licence Amendment', 'S.36/39/40/41', 'MD-PV' ];
//  }

  /**
   * Gets an yesno array
   *
   */
  public getYesNoList() {
    return [
      GlobalsService.YES,
      GlobalsService.NO
    ];
  }

  /**
   * Gets an data array
   *
   */
  public static getDeviceClassList() {
    return [
      {
        id: 'DC2',
        en: 'Class II',
        fr: 'fr_Class II'
      },
      {
        id: 'DC3',
        en: 'Class III',
        fr: 'fr_Class III'
      },
      {
        id: 'DC4',
        en: 'Class IV',
        fr: 'fr_Class IV'
      }
    ];
  }

  /**
   * Gets an data array
   *
   */
  public static getLicenceDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i1')], descArray[this.getDescMap().indexOf('i5')],
      descArray[this.getDescMap().indexOf('i7')], descArray[this.getDescMap().indexOf('i9')],
      descArray[this.getDescMap().indexOf('i12')], descArray[this.getDescMap().indexOf('i14')],
      descArray[this.getDescMap().indexOf('i15')], descArray[this.getDescMap().indexOf('i20')],
      descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }

  /**
   * Gets an data array
   *
   */
  public static getFaxbackDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i15')],
      descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }

  public static getS36394041Descriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i6')], descArray[this.getDescMap().indexOf('i8')], descArray[this.getDescMap().indexOf('i10')],
      descArray[this.getDescMap().indexOf('i11')], descArray[this.getDescMap().indexOf('i17')], descArray[this.getDescMap().indexOf('i18')],
      descArray[this.getDescMap().indexOf('i19')], descArray[this.getDescMap().indexOf('i25')]];
  }

  public static getPAPVDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i9')], descArray[this.getDescMap().indexOf('i14')], descArray[this.getDescMap().indexOf('i15')],
      descArray[this.getDescMap().indexOf('i16')], descArray[this.getDescMap().indexOf('i22')], descArray[this.getDescMap().indexOf('i25')]];
  }
  public static getPSURPVDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i3')]];
  }
  public static getRCPVDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i2')], descArray[this.getDescMap().indexOf('i21')]];
  }
  public static getPSAPVDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i0')], descArray[this.getDescMap().indexOf('i13')]];
  }
  public static getREGPVDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i4')], descArray[this.getDescMap().indexOf('i9')], descArray[this.getDescMap().indexOf('i13')],
      descArray[this.getDescMap().indexOf('i23')], descArray[this.getDescMap().indexOf('i24')]];
  }
  public static getPRVLDDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i20')], descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }
  public static getPRVLDADescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i20')], descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }
  public static getCOVID19Descriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i27')]];
  }
  public static getCOVID19AMDDescriptions(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i28')]];
  }

  /**
   * Gets an data array
   *
   */
  public static getDossierType() {
    return [
      {
        id: 'D23',
        en: 'Medical Device',
        fr: 'Medical Device'
      }
    ];
  }

  /**
   {
       // id: 'B14-20160301-10 ',
       // en: 'Post-market Vigilance',
       // fr: 'Post-market Vigilance'
     }
   */

  private static getRawActivityLeadList() {
    return  [
      {
        id: 'B14-20160301-08',
        en: 'Medical Devices Directorate',
        fr: 'Medical Devices Directorate'
      },
      {
        id: 'B14-20160301-10',
        en: 'Post-market Vigilance',
        fr: 'Post-market Vigilance'
      }];
  }

  public static getActivityLeadList(lang) {
    return TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityLeadList(), lang);
  }

  public static getRawActivityTypeList() {
    return [
      { // 0
        id: 'B02-20160301-033',
        en: 'Minor Change',
        fr: 'Minor Change'
      },
      { // 1
        id: 'B02-20160301-039',
        en: 'Licence',
        fr: 'Licence'
      },
      { // 2
        id: 'B02-20160301-040',
        en: 'Licence Amendment',
        fr: 'Licence Amendment'
      },
      { // 3
        id: 'B02-20160301-081',
        en: 'S.25/36/39/40/41',
        fr: 'S.25/36/39/40/41'
      },
      { // 4
        id: 'B02-20190627-02',
        en: 'PA-PV',
        fr: 'PA-PV'
      },
      { // 5
        id: 'B02-20160301-079',
        en: 'PSUR-PV',
        fr: 'PSUR-PV'
      },
      { // 6
        id: 'B02-20190627-04',
        en: 'RC-PV',
        fr: 'RC-PV'
      },
      { // 7
        id: 'B02-20190627-03',
        en: 'PSA-PV',
        fr: 'PSA-PV'
      },
      { // 8
        id: 'B02-20190627-05',
        en: 'REG-PV',
        fr: 'REG-PV'
      },
      { // 9
        id: 'B02-20160301-073',
        en: 'Private Label',
        fr: 'Private Label'
      },
      { // 10
        id: 'B02-20160301-074',
        en: 'Private Label Amendment',
        fr: 'Private Label Amendment'
      },
      { // 11
        id: 'B02-20200417-01',
        en: 'COVID-19 Interim Order Application',
        fr: 'Demande d&#39;ordonnance provisoire COVID-19'
      },
      { // 12
        id: 'B02-20200417-02',
        en: 'COVID-19 Interim Order Ap - Amendment',
        fr: 'Demande d&#39;ordonnance provisoire COVID-19 - Modification'
      }
    ];
  }

  public static getActivityTypeList(lang) {
    return TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityTypeList(), lang);
  }

  public static getActivityTypeMDBList(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityTypeList(), lang);
    return [descArray[11], descArray[12], descArray[0], descArray[1], descArray[2],
      descArray[9], descArray[10], descArray[3]];
  }

  public static getActivityTypePVList(lang) {
    const descArray = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityTypeList(), lang);
    return [descArray[11], descArray[12], descArray[4], descArray[5], descArray[6],
      descArray[7], descArray[8]];
  }

  public static getTransDescList(lang) {
    return TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
  }

  public static getRawTransDescList() {
    return [
      {
        id: 'ACRI', //22
        en: 'Advertising complaint request for information',
        fr: 'Advertising complaint request for information'
      },
      {
        id: 'ACD', //0
        en: 'Appeal Comprehensive Document',
        fr: 'Appeal Comprehensive Document'
      },
      {
        id: 'DLVN', //20
        en: 'Dissemination list version number',
        fr: 'Dissemination list version number'
      },
      {
        id: 'FPO', //23
        en: 'For Period of ',
        fr: 'For Period of '
      },
      {
        id: 'FSAN', //16
        en: 'Foreign Safety Action Notification',
        fr: 'Foreign Safety Action Notification'
      },
      {
        id: 'INITIAL',  //9
        en: 'Initial',
        fr: 'Initial'
      },
      {
        id: 'IRSR', //24
        en: 'Issue Related Safety Request ',
        fr: 'Issue Related Safety Request '
      },
      {
        id: 'LIA', //1
        en: 'Letter of Intent to Appeal',
        fr: 'Letter of Intent to Appeal'
      },
      {
        id: 'LIOH', //2
        en: 'Letter of Intent to Invoke Opportunity to be Heard',
        fr: 'Letter of Intent to Invoke Opportunity to be Heard'
      },
      {
        id: 'MM', //10
        en: 'Minutes of Meeting',
        fr: 'Minutes of Meeting'
      },
      {
        id: 'OHCD', //3
        en: 'Opportunity to be Heard Comprehensive Document',
        fr: 'Opportunity to be Heard Comprehensive Document'
      },
      {
        id: 'PSI', //25
        en: 'Patient Safety Information (Medication error)',
        fr: 'Patient Safety Information (Medication error)'
      },
      {
        id: 'PRCI', //14
        en: 'Public Release of Clinical Information',
        fr: 'Public Release of Clinical Information'
      },
      {
        id: 'RO', //18
        en: 'Reassessment Order',
        fr: 'Reassessment Order'
      },
      {
        id: 'RAIL', //4
        en: 'Response to Additional Information Letter',
        fr: 'Response to Additional Information Letter'
      },
      {
        id: 'RER', //11
        en: 'Response to E-mail Request',
        fr: 'Response to E-mail Request'
      },
      {
        id: 'RMHPDR', //13
        en: 'Response to MHPD Request',
        fr: 'Response to MHPD Request'
      },
      {
        id: 'RS25L', //21
        en: 'Response to S.25 Letter',
        fr: 'Response to S.25 Letter'
      },
      {
        id: 'RS36L', //6
        en: 'Response to S.36 Letter',
        fr: 'Response to S.36 Letter'
      },
      {
        id: 'RS39L', //7
        en: 'Response to S.39 Letter',
        fr: 'Response to S.39 Letter'
      },
      {
        id: 'RS', //5
        en: 'Response to Screening Deficiency Letter',
        fr: 'Response to Screening Deficiency Letter'
      },
      {
        id: 'RCD', //19
        en: 'Risk communication document',
        fr: 'Risk communication document'
      },
      {
        id: 'SMR', //26
        en: 'Submission Meeting Request',
        fr: 'Submission Meeting Request'
      },
      {
        id: 'TCC', //15
        en: 'Terms and Conditions Commitment',
        fr: 'Terms and Conditions Commitment'
      },
      {
        id: 'TSO', //17
        en: 'Test and Studies Order',
        fr: 'Test and Studies Order'
      },
      {
        id: 'UD', //12
        en: 'Unsolicited Information',
        fr: 'Unsolicited Information'
      },
      {
        id: 'WR', //8
        en: 'Withdrawal Request',
        fr: 'Withdrawal Request'
      },
      {
        id: 'COVID-19',
        en: 'COVID-19 Interim Order Application',
        fr: 'Demande d\'ordonnance provisoire COVID-19'
      },
      {
        id: 'COVID-19-AMD',
        en: 'COVID-19 Interim Order Ap - Amendment',
        fr: 'Demande d\'ordonnance provisoire COVID-19 - Modification'
      }
    ];
  }
  public static getDescMap() {
    return ['i0', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'i18', 'i19', 'i20', 'i21', 'i22', 'i23', 'i24', 'i25', 'i26', 'i27', 'i28'];
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, transactionModel) {
    const activityLeadList = TransactionDetailsService.getActivityLeadList(TransactionDetailsService.lang);
    const activityTypeList = TransactionDetailsService.getActivityTypeList(TransactionDetailsService.lang);
    const descArray = TransactionDetailsService.getTransDescList(TransactionDetailsService.lang);
    const dcArray = TransactionDetailsService._convertListText(
            TransactionDetailsService.getDeviceClassList(), TransactionDetailsService.lang);
    // transactionModel.routing_id = formRecord.controls.routingId.value;
    transactionModel.dossier_id = formRecord.controls.dossierId.value;
    transactionModel.dossier_type = {
      '__text': 'Medical Device',
      '_id': 'D23',
      '_label_en': 'Medical Device',
      '_label_fr': 'Medical Device'
    };

    if (formRecord.controls.manuCompanyId.value) {
      transactionModel.company_id = 'K' + formRecord.controls.manuCompanyId.value;
    }
    transactionModel.manufacturing_contact_id = formRecord.controls.manuContactId.value;
    if (formRecord.controls.reguCompanyId.value) {
      transactionModel.regulatory_company_id = 'K' + formRecord.controls.reguCompanyId.value;
    }
    transactionModel.regulatory_contact_id = formRecord.controls.reguContactId.value;
   // transactionModel.regulatory_activity_lead = formRecord.controls.activityLead.value;

    if (formRecord.controls.activityLead.value) {
      const recordIndex1 = ListService.getRecord(activityLeadList, formRecord.controls.activityLead.value, 'id');
      if (recordIndex1 > -1) {
        transactionModel.regulatory_activity_lead = {
          '__text': activityLeadList[recordIndex1].text,
          '_id': activityLeadList[recordIndex1].id,
          '_label_en': activityLeadList[recordIndex1].en,
          '_label_fr': activityLeadList[recordIndex1].fr
        };
      }
    } else {
      transactionModel.regulatory_activity_lead = null;
    }

    // transactionModel.activity_type = formRecord.controls.activityType.value;
    if (formRecord.controls.activityType.value) {
      const recordIndex2 = ListService.getRecord(activityTypeList, formRecord.controls.activityType.value, 'id');
      if (recordIndex2 > -1) {
        transactionModel.regulatory_activity_type = {
          '__text': activityTypeList[recordIndex2].text,
          '_id' : activityTypeList[recordIndex2].id,
          '_label_en': activityTypeList[recordIndex2].en,
          '_label_fr': activityTypeList[recordIndex2].fr
        };
      }
    } else {
      transactionModel.regulatory_activity_type = null;
    }

    if (formRecord.controls.descriptionType.value) {
      const recordIndex3 = ListService.getRecord(descArray, formRecord.controls.descriptionType.value, 'id');
      if (recordIndex3 > -1) {
        transactionModel.description_type = {
          '__text': descArray[recordIndex3].text,
          '_id': descArray[recordIndex3].id,
          '_label_en': descArray[recordIndex3].en,
          '_label_fr': descArray[recordIndex3].fr
        };
      }
    } else {
      transactionModel.description_type = null;
    }
    // transactionModel.device_class = formRecord.controls.deviceClass.value;
    if (formRecord.controls.deviceClass.value) {
      const recordIndex4 = ListService.getRecord(dcArray, formRecord.controls.deviceClass.value, 'id');
      if (recordIndex4 > -1) {
        transactionModel.device_class = {
          '__text': dcArray[recordIndex4].text,
          '_id': dcArray[recordIndex4].id,
          '_label_en': dcArray[recordIndex4].en,
          '_label_fr': dcArray[recordIndex4].fr
        };
      }
    } else {
      transactionModel.device_class = null;
    }
    transactionModel.amend_reasons.classification_change = formRecord.controls.classChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.licence_change = formRecord.controls.licenceChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.device_change = formRecord.controls.deviceChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.process_change = formRecord.controls.processChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.quality_change = formRecord.controls.qualityChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.design_change = formRecord.controls.designChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.materials_change = formRecord.controls.materialsChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.labelling_change = formRecord.controls.labellingChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.safety_change = formRecord.controls.safetyChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.purpose_change = formRecord.controls.purposeChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.add_delete_change = formRecord.controls.addChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.licence_number = formRecord.controls.licenceNum.value;
    if (formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i9')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i2')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i3')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i6')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i7')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i10')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i12')].id) {
      transactionModel.application_number = formRecord.controls.appNum.value;
    } else if (formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i2')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i3')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i6')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i7')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i10')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i12')].id ) {
      transactionModel.application_number = formRecord.controls.appNumOpt.value;
    }
    transactionModel.meeting_id = formRecord.controls.meetingId.value;
    transactionModel.device_name = formRecord.controls.deviceName.value;
    transactionModel.proposed_licence_name = formRecord.controls.licenceName.value;
    transactionModel.request_version = formRecord.controls.requestVersion.value;
    transactionModel.request_date = formRecord.controls.requestDate.value;
    transactionModel.request_to = formRecord.controls.requestTo.value;
    transactionModel.brief_description = formRecord.controls.briefDesc.value;
    transactionModel.transaction_description = TransactionDetailsService._setConcatDetails(transactionModel);
    // if (formRecord.controls.deviceChange.value ||
    //     (formRecord.controls.activityType.value === activityTypeList[1].id &&
    //           formRecord.controls.descriptionType.value === descArray[9].id)) {
      transactionModel.has_ddt = formRecord.controls.hasDdtMan.value;
    // } else {
    //   transactionModel.has_ddt = formRecord.controls.hasDdt.value ? GlobalsService.YES : GlobalsService.NO;
    // }
    transactionModel.has_app_info = formRecord.controls.hasAppInfo.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.is_solicited_info = formRecord.controls.isSolicitedInfo.value;
    transactionModel.rationale = formRecord.controls.rationale.value;
    transactionModel.proposed_indication = formRecord.controls.proposedIndication.value;
    transactionModel.org_manufacture_id = formRecord.controls.orgManufactureId.value;
    transactionModel.org_manufacture_lic = formRecord.controls.orgManufactureLic.value;
  }

  public static mapDataModelToFormModel(transactionModel, formRecord: FormGroup, lang) {
    // formRecord.controls.routingId.setValue(transactionModel.routing_id);
    formRecord.controls.dossierId.setValue(transactionModel.dossier_id);
    if (transactionModel.company_id) {
      formRecord.controls.manuCompanyId.setValue(transactionModel.company_id.slice(1));
    }
    formRecord.controls.manuContactId.setValue(transactionModel.manufacturing_contact_id);
    if (transactionModel.regulatory_company_id) {
      formRecord.controls.reguCompanyId.setValue(transactionModel.regulatory_company_id.slice(1));
    }
    formRecord.controls.reguContactId.setValue(transactionModel.regulatory_contact_id);

    /**
     formRecord.controls.activityLead.setValue(transactionModel.activity_lead);
     formRecord.controls.activityType.setValue(transactionModel.activity_type);
*/

    if (transactionModel.regulatory_activity_lead) {
      const activityLeads = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityLeadList(), lang);
      const recordIndex = ListService.getRecord(activityLeads, transactionModel.regulatory_activity_lead._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.activityLead.setValue(activityLeads[recordIndex].id);
      } else {
        formRecord.controls.activityLead.setValue(null);
      }
    } else {
      formRecord.controls.activityLead.setValue(null);
    }


    const activityTypes = TransactionDetailsService._convertListText(TransactionDetailsService.getRawActivityTypeList(), lang);
    if (transactionModel.regulatory_activity_type) {
      const recordIndex = ListService.getRecord(activityTypes, transactionModel.regulatory_activity_type._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.activityType.setValue(activityTypes[recordIndex].id);
      } else {
        formRecord.controls.activityType.setValue(null);
      }
    } else {
      formRecord.controls.activityType.setValue(null);
    }

    const descriptions = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    if (transactionModel.description_type) {
      const recordIndex = ListService.getRecord(descriptions, transactionModel.description_type._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.descriptionType.setValue(descriptions[recordIndex].id);
      } else {
        formRecord.controls.descriptionType.setValue(null);
      }
    } else {
      formRecord.controls.descriptionType.setValue(null);
    }

    // formRecord.controls.deviceClass.setValue(transactionModel.device_class);
    const dcs = TransactionDetailsService._convertListText(TransactionDetailsService.getDeviceClassList(), lang);
    if (transactionModel.device_class) {
      const recordIndex = ListService.getRecord(dcs, transactionModel.device_class._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.deviceClass.setValue(dcs[recordIndex].id);
      } else {
        formRecord.controls.deviceClass.setValue(null);
      }
    } else {
      formRecord.controls.deviceClass.setValue(null);
    }
    const clsc = transactionModel.amend_reasons.classification_change === GlobalsService.YES ? true : false;
    formRecord.controls.classChange.setValue(clsc);
    const licc = transactionModel.amend_reasons.licence_change === GlobalsService.YES ? true : false;
    formRecord.controls.licenceChange.setValue(licc);
    const decc = transactionModel.amend_reasons.device_change === GlobalsService.YES ? true : false;
    formRecord.controls.deviceChange.setValue(decc);
    const proc = transactionModel.amend_reasons.process_change === GlobalsService.YES ? true : false;
    formRecord.controls.processChange.setValue(proc);
    const quac = transactionModel.amend_reasons.quality_change === GlobalsService.YES ? true : false;
    formRecord.controls.qualityChange.setValue(quac);
    const desc = transactionModel.amend_reasons.design_change === GlobalsService.YES ? true : false;
    formRecord.controls.designChange.setValue(desc);
    const matc = transactionModel.amend_reasons.materials_change === GlobalsService.YES ? true : false;
    formRecord.controls.materialsChange.setValue(matc);
    const labc = transactionModel.amend_reasons.labelling_change === GlobalsService.YES ? true : false;
    formRecord.controls.labellingChange.setValue(labc);
    const safc = transactionModel.amend_reasons.safety_change === GlobalsService.YES ? true : false;
    formRecord.controls.safetyChange.setValue(safc);
    const purc = transactionModel.amend_reasons.purpose_change === GlobalsService.YES ? true : false;
    formRecord.controls.purposeChange.setValue(purc);
    const addc = transactionModel.amend_reasons.add_delete_change === GlobalsService.YES ? true : false;
    formRecord.controls.addChange.setValue(addc);
    if (clsc || licc || decc || proc || quac || desc || matc || labc || safc || purc || addc) {
      formRecord.controls.amendReason.setValue('reasonFilled');
    }
    formRecord.controls.licenceNum.setValue(transactionModel.licence_number);
    if (transactionModel.description_type._id &&
      (transactionModel.description_type._id === descriptions[2].id ||
        transactionModel.description_type._id === descriptions[3].id ||
        transactionModel.description_type._id === descriptions[6].id ||
        transactionModel.description_type._id === descriptions[7].id ||
        transactionModel.description_type._id === descriptions[10].id ||
        transactionModel.description_type._id === descriptions[12].id)) {
      formRecord.controls.appNumOpt.setValue(transactionModel.application_number);
    } else {
      formRecord.controls.appNum.setValue(transactionModel.application_number);
    }
    formRecord.controls.meetingId.setValue(transactionModel.meeting_id);
    formRecord.controls.deviceName.setValue(transactionModel.device_name);
    formRecord.controls.licenceName.setValue(transactionModel.proposed_licence_name);
    formRecord.controls.requestVersion.setValue(transactionModel.request_version);
    formRecord.controls.requestDate.setValue(transactionModel.request_date);
    formRecord.controls.requestTo.setValue(transactionModel.request_to);
    formRecord.controls.briefDesc.setValue(transactionModel.brief_description);
    formRecord.controls.transDescription.setValue(transactionModel.transaction_description);
    // const hasddt = transactionModel.has_ddt === GlobalsService.YES ? true : false;
    // if (formRecord.controls.deviceChange.value ||
    //   (transactionModel.regulatory_activity_type._id === activityTypes[1].id &&
    //         transactionModel.description_type._id === descriptions[9].id)) {
      formRecord.controls.hasDdtMan.setValue(transactionModel.has_ddt);
    // } else {
    //   formRecord.controls.hasDdt.setValue(hasddt);
    // }
    const hasapp = transactionModel.has_app_info === GlobalsService.YES ? true : false;
    formRecord.controls.hasAppInfo.setValue(hasapp);
    formRecord.controls.isSolicitedInfo.setValue(transactionModel.is_solicited_info);
    formRecord.controls.rationale.setValue(transactionModel.rationale);
    formRecord.controls.proposedIndication.setValue(transactionModel.proposed_indication);
    formRecord.controls.orgManufactureId.setValue(transactionModel.org_manufacture_id);
    formRecord.controls.orgManufactureLic.setValue(transactionModel.org_manufacture_lic);
  }

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private static _convertListText(rawList, lang) {
    const result = [];
    if (lang === GlobalsService.FRENCH) {
      rawList.forEach(item => {
        item.text = item.fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

  private static _setConcatDetails(transactionModel) {
    const rDate = '';
    let concatText = '';
    // const dTypeList = TransactionDetailsService.getRawTransDescList();
    if (transactionModel.description_type) {
      concatText = transactionModel.description_type._label_en;
      // if (transactionModel.descriptionType.value.id === dTypeList[9].id) {
      //   concatText = enDescription;
      //   if (transactionModel.deviceClass) {
      //     concatText += ' with device class: ' + transactionModel.deviceClass;
      //   }
      //   if (transactionModel.deviceName) {
      //     concatText += ', and name of device: ' + transactionModel.deviceName;
      //   }
      // }
      if (transactionModel.request_to) {
        concatText += transactionModel.request_date + ' to ' + transactionModel.request_to;
      } else if (transactionModel.request_date) {
        // rDate = TransactionDetailsService._convertDate(transactionModel.request_date);
        concatText += ' dated ' + transactionModel.request_date;
      }
      // if (transactionModel.application_number) {
      //   concatText += ' with application number: ' + transactionModel.application_number;
      // }
      // if (transactionModel.meeting_id) {
      //   concatText = 'Meeting ID, ' + transactionModel.meeting_id + ', ' + concatText;
      // }
      // if (transactionModel.brief_description) {
      //   concatText += ', and brief description: ' + transactionModel.brief_description;
      // }
    }
    return concatText;
  }

  private static _convertDate(value) {

    if (!value) {return ''; }
    const date = new Date(value);
    const m_names = ['Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
      'Oct', 'Nov', 'Dec'];
    const result = m_names[date.getUTCMonth()] + '. ' + date.getUTCDate() + ', ' + date.getFullYear();
    return result;
  }
}
