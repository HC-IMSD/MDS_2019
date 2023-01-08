import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class MasterFileDetailsService {

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
      mfDescription: [null, []],
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
        master_file_description: '',
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
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
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
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i15')],
      descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }

  public static getS36394041Descriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i6')], descArray[this.getDescMap().indexOf('i8')], descArray[this.getDescMap().indexOf('i10')],
      descArray[this.getDescMap().indexOf('i11')], descArray[this.getDescMap().indexOf('i17')], descArray[this.getDescMap().indexOf('i18')],
      descArray[this.getDescMap().indexOf('i19')], descArray[this.getDescMap().indexOf('i25')]];
  }

  public static getPAPVDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i9')], descArray[this.getDescMap().indexOf('i14')], descArray[this.getDescMap().indexOf('i15')],
      descArray[this.getDescMap().indexOf('i16')], descArray[this.getDescMap().indexOf('i22')], descArray[this.getDescMap().indexOf('i25')]];
  }
  public static getPSURPVDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i3')]];
  }
  public static getRCPVDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i2')], descArray[this.getDescMap().indexOf('i21')]];
  }
  public static getPSAPVDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i0')], descArray[this.getDescMap().indexOf('i11')]];
  }
  public static getREGPVDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i4')], descArray[this.getDescMap().indexOf('i9')], descArray[this.getDescMap().indexOf('i13')],
      descArray[this.getDescMap().indexOf('i23')], descArray[this.getDescMap().indexOf('i24')]];
  }
  public static getPRVLDDescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i20')], descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
  }
  public static getPRVLDADescriptions(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    return [descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i20')], descArray[this.getDescMap().indexOf('i25')], descArray[this.getDescMap().indexOf('i26')]];
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
    return MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityLeadList(), lang);
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
      }
    ];
  }

  public static getActivityTypeList(lang) {
    return MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityTypeList(), lang);
  }

  public static getActivityTypeMDBList(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityTypeList(), lang);
    return [descArray[this.getDescMap().indexOf('i0')], descArray[this.getDescMap().indexOf('i1')], descArray[this.getDescMap().indexOf('i2')],
      descArray[this.getDescMap().indexOf('i9')], descArray[this.getDescMap().indexOf('i10')], descArray[this.getDescMap().indexOf('i3')]];
  }

  public static getActivityTypePVList(lang) {
    const descArray = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityTypeList(), lang);
    return [descArray[this.getDescMap().indexOf('i4')], descArray[this.getDescMap().indexOf('i5')], descArray[this.getDescMap().indexOf('i6')],
      descArray[this.getDescMap().indexOf('i7')], descArray[this.getDescMap().indexOf('i8')]];
  }

  public static getMFDescList(lang) {
    return MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
  }

  public static getRawMFDescList() {
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
      }
    ];
  }
  public static getDescMap() {
    return ['i0', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'i12', 'i13', 'i14', 'i15', 'i16', 'i17', 'i18', 'i19', 'i20', 'i21', 'i22', 'i23', 'i24', 'i25', 'i26'];
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, masterFileModel) {
    const activityLeadList = MasterFileDetailsService.getActivityLeadList(MasterFileDetailsService.lang);
    const activityTypeList = MasterFileDetailsService.getActivityTypeList(MasterFileDetailsService.lang);
    const descArray = MasterFileDetailsService.getMFDescList(MasterFileDetailsService.lang);
    const dcArray = MasterFileDetailsService._convertListText(
            MasterFileDetailsService.getDeviceClassList(), MasterFileDetailsService.lang);
    // masterFileModel.routing_id = formRecord.controls.routingId.value;
    masterFileModel.dossier_id = formRecord.controls.dossierId.value;
    masterFileModel.dossier_type = {
      '__text': 'Medical Device',
      '_id': 'D23',
      '_label_en': 'Medical Device',
      '_label_fr': 'Medical Device'
    };

    if (formRecord.controls.manuCompanyId.value) {
      masterFileModel.company_id = 'K' + formRecord.controls.manuCompanyId.value;
    }
    masterFileModel.manufacturing_contact_id = formRecord.controls.manuContactId.value;
    if (formRecord.controls.reguCompanyId.value) {
      masterFileModel.regulatory_company_id = 'K' + formRecord.controls.reguCompanyId.value;
    }
    masterFileModel.regulatory_contact_id = formRecord.controls.reguContactId.value;
   // masterFileModel.regulatory_activity_lead = formRecord.controls.activityLead.value;

    if (formRecord.controls.activityLead.value) {
      const recordIndex1 = ListService.getRecord(activityLeadList, formRecord.controls.activityLead.value, 'id');
      if (recordIndex1 > -1) {
        masterFileModel.regulatory_activity_lead = {
          '__text': activityLeadList[recordIndex1].text,
          '_id': activityLeadList[recordIndex1].id,
          '_label_en': activityLeadList[recordIndex1].en,
          '_label_fr': activityLeadList[recordIndex1].fr
        };
      }
    } else {
      masterFileModel.regulatory_activity_lead = null;
    }

    // masterFileModel.activity_type = formRecord.controls.activityType.value;
    if (formRecord.controls.activityType.value) {
      const recordIndex2 = ListService.getRecord(activityTypeList, formRecord.controls.activityType.value, 'id');
      if (recordIndex2 > -1) {
        masterFileModel.regulatory_activity_type = {
          '__text': activityTypeList[recordIndex2].text,
          '_id' : activityTypeList[recordIndex2].id,
          '_label_en': activityTypeList[recordIndex2].en,
          '_label_fr': activityTypeList[recordIndex2].fr
        };
      }
    } else {
      masterFileModel.regulatory_activity_type = null;
    }

    if (formRecord.controls.descriptionType.value) {
      const recordIndex3 = ListService.getRecord(descArray, formRecord.controls.descriptionType.value, 'id');
      if (recordIndex3 > -1) {
        masterFileModel.description_type = {
          '__text': descArray[recordIndex3].text,
          '_id': descArray[recordIndex3].id,
          '_label_en': descArray[recordIndex3].en,
          '_label_fr': descArray[recordIndex3].fr
        };
      }
    } else {
      masterFileModel.description_type = null;
    }
    // masterFileModel.device_class = formRecord.controls.deviceClass.value;
    if (formRecord.controls.deviceClass.value) {
      const recordIndex4 = ListService.getRecord(dcArray, formRecord.controls.deviceClass.value, 'id');
      if (recordIndex4 > -1) {
        masterFileModel.device_class = {
          '__text': dcArray[recordIndex4].text,
          '_id': dcArray[recordIndex4].id,
          '_label_en': dcArray[recordIndex4].en,
          '_label_fr': dcArray[recordIndex4].fr
        };
      }
    } else {
      masterFileModel.device_class = null;
    }
    masterFileModel.amend_reasons.classification_change = formRecord.controls.classChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.licence_change = formRecord.controls.licenceChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.device_change = formRecord.controls.deviceChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.process_change = formRecord.controls.processChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.quality_change = formRecord.controls.qualityChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.design_change = formRecord.controls.designChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.materials_change = formRecord.controls.materialsChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.labelling_change = formRecord.controls.labellingChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.safety_change = formRecord.controls.safetyChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.purpose_change = formRecord.controls.purposeChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.amend_reasons.add_delete_change = formRecord.controls.addChange.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.licence_number = formRecord.controls.licenceNum.value;
    if (formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i9')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i2')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i3')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i6')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i7')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i10')].id &&
      formRecord.controls.descriptionType.value !== descArray[this.getDescMap().indexOf('i12')].id) {
      masterFileModel.application_number = formRecord.controls.appNum.value;
    } else if (formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i2')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i3')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i6')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i7')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i10')].id  ||
            formRecord.controls.descriptionType.value === descArray[this.getDescMap().indexOf('i12')].id ) {
      masterFileModel.application_number = formRecord.controls.appNumOpt.value;
    }
    masterFileModel.meeting_id = formRecord.controls.meetingId.value;
    masterFileModel.device_name = formRecord.controls.deviceName.value;
    masterFileModel.proposed_licence_name = formRecord.controls.licenceName.value;
    masterFileModel.request_version = formRecord.controls.requestVersion.value;
    masterFileModel.request_date = formRecord.controls.requestDate.value;
    masterFileModel.request_to = formRecord.controls.requestTo.value;
    masterFileModel.brief_description = formRecord.controls.briefDesc.value;
    masterFileModel.master_file_description = MasterFileDetailsService._setConcatDetails(masterFileModel);
    // if (formRecord.controls.deviceChange.value ||
    //     (formRecord.controls.activityType.value === activityTypeList[1].id &&
    //           formRecord.controls.descriptionType.value === descArray[9].id)) {
      masterFileModel.has_ddt = formRecord.controls.hasDdtMan.value;
    // } else {
    //   masterFileModel.has_ddt = formRecord.controls.hasDdt.value ? GlobalsService.YES : GlobalsService.NO;
    // }
    masterFileModel.has_app_info = formRecord.controls.hasAppInfo.value ? GlobalsService.YES : GlobalsService.NO;
    masterFileModel.is_solicited_info = formRecord.controls.isSolicitedInfo.value;
    masterFileModel.rationale = formRecord.controls.rationale.value;
    masterFileModel.proposed_indication = formRecord.controls.proposedIndication.value;
    masterFileModel.org_manufacture_id = formRecord.controls.orgManufactureId.value;
    masterFileModel.org_manufacture_lic = formRecord.controls.orgManufactureLic.value;
  }

  public static mapDataModelToFormModel(masterFileModel, formRecord: FormGroup, lang) {
    // formRecord.controls.routingId.setValue(masterFileModel.routing_id);
    formRecord.controls.dossierId.setValue(masterFileModel.dossier_id);
    if (masterFileModel.company_id) {
      formRecord.controls.manuCompanyId.setValue(masterFileModel.company_id.slice(1));
    }
    formRecord.controls.manuContactId.setValue(masterFileModel.manufacturing_contact_id);
    if (masterFileModel.regulatory_company_id) {
      formRecord.controls.reguCompanyId.setValue(masterFileModel.regulatory_company_id.slice(1));
    }
    formRecord.controls.reguContactId.setValue(masterFileModel.regulatory_contact_id);

    /**
     formRecord.controls.activityLead.setValue(masterFileModel.activity_lead);
     formRecord.controls.activityType.setValue(masterFileModel.activity_type);
*/

    if (masterFileModel.regulatory_activity_lead) {
      const activityLeads = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityLeadList(), lang);
      const recordIndex = ListService.getRecord(activityLeads, masterFileModel.regulatory_activity_lead._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.activityLead.setValue(activityLeads[recordIndex].id);
      } else {
        formRecord.controls.activityLead.setValue(null);
      }
    } else {
      formRecord.controls.activityLead.setValue(null);
    }


    const activityTypes = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawActivityTypeList(), lang);
    if (masterFileModel.regulatory_activity_type) {
      const recordIndex = ListService.getRecord(activityTypes, masterFileModel.regulatory_activity_type._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.activityType.setValue(activityTypes[recordIndex].id);
      } else {
        formRecord.controls.activityType.setValue(null);
      }
    } else {
      formRecord.controls.activityType.setValue(null);
    }

    const descriptions = MasterFileDetailsService._convertListText(MasterFileDetailsService.getRawMFDescList(), lang);
    if (masterFileModel.description_type) {
      const recordIndex = ListService.getRecord(descriptions, masterFileModel.description_type._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.descriptionType.setValue(descriptions[recordIndex].id);
      } else {
        formRecord.controls.descriptionType.setValue(null);
      }
    } else {
      formRecord.controls.descriptionType.setValue(null);
    }

    // formRecord.controls.deviceClass.setValue(masterFileModel.device_class);
    const dcs = MasterFileDetailsService._convertListText(MasterFileDetailsService.getDeviceClassList(), lang);
    if (masterFileModel.device_class) {
      const recordIndex = ListService.getRecord(dcs, masterFileModel.device_class._id, 'id');
      if (recordIndex > -1) {
        formRecord.controls.deviceClass.setValue(dcs[recordIndex].id);
      } else {
        formRecord.controls.deviceClass.setValue(null);
      }
    } else {
      formRecord.controls.deviceClass.setValue(null);
    }
    const clsc = masterFileModel.amend_reasons.classification_change === GlobalsService.YES ? true : false;
    formRecord.controls.classChange.setValue(clsc);
    const licc = masterFileModel.amend_reasons.licence_change === GlobalsService.YES ? true : false;
    formRecord.controls.licenceChange.setValue(licc);
    const decc = masterFileModel.amend_reasons.device_change === GlobalsService.YES ? true : false;
    formRecord.controls.deviceChange.setValue(decc);
    const proc = masterFileModel.amend_reasons.process_change === GlobalsService.YES ? true : false;
    formRecord.controls.processChange.setValue(proc);
    const quac = masterFileModel.amend_reasons.quality_change === GlobalsService.YES ? true : false;
    formRecord.controls.qualityChange.setValue(quac);
    const desc = masterFileModel.amend_reasons.design_change === GlobalsService.YES ? true : false;
    formRecord.controls.designChange.setValue(desc);
    const matc = masterFileModel.amend_reasons.materials_change === GlobalsService.YES ? true : false;
    formRecord.controls.materialsChange.setValue(matc);
    const labc = masterFileModel.amend_reasons.labelling_change === GlobalsService.YES ? true : false;
    formRecord.controls.labellingChange.setValue(labc);
    const safc = masterFileModel.amend_reasons.safety_change === GlobalsService.YES ? true : false;
    formRecord.controls.safetyChange.setValue(safc);
    const purc = masterFileModel.amend_reasons.purpose_change === GlobalsService.YES ? true : false;
    formRecord.controls.purposeChange.setValue(purc);
    const addc = masterFileModel.amend_reasons.add_delete_change === GlobalsService.YES ? true : false;
    formRecord.controls.addChange.setValue(addc);
    if (clsc || licc || decc || proc || quac || desc || matc || labc || safc || purc || addc) {
      formRecord.controls.amendReason.setValue('reasonFilled');
    }
    formRecord.controls.licenceNum.setValue(masterFileModel.licence_number);
    if (masterFileModel.description_type._id &&
      (masterFileModel.description_type._id === descriptions[2].id ||
        masterFileModel.description_type._id === descriptions[3].id ||
        masterFileModel.description_type._id === descriptions[6].id ||
        masterFileModel.description_type._id === descriptions[7].id ||
        masterFileModel.description_type._id === descriptions[10].id ||
        masterFileModel.description_type._id === descriptions[12].id)) {
      formRecord.controls.appNumOpt.setValue(masterFileModel.application_number);
    } else {
      formRecord.controls.appNum.setValue(masterFileModel.application_number);
    }
    formRecord.controls.meetingId.setValue(masterFileModel.meeting_id);
    formRecord.controls.deviceName.setValue(masterFileModel.device_name);
    formRecord.controls.licenceName.setValue(masterFileModel.proposed_licence_name);
    formRecord.controls.requestVersion.setValue(masterFileModel.request_version);
    formRecord.controls.requestDate.setValue(masterFileModel.request_date);
    formRecord.controls.requestTo.setValue(masterFileModel.request_to);
    formRecord.controls.briefDesc.setValue(masterFileModel.brief_description);
    formRecord.controls.mfDescription.setValue(masterFileModel.master_file_description);
    // const hasddt = masterFileModel.has_ddt === GlobalsService.YES ? true : false;
    // if (formRecord.controls.deviceChange.value ||
    //   (masterFileModel.regulatory_activity_type._id === activityTypes[1].id &&
    //         masterFileModel.description_type._id === descriptions[9].id)) {
      formRecord.controls.hasDdtMan.setValue(masterFileModel.has_ddt);
    // } else {
    //   formRecord.controls.hasDdt.setValue(hasddt);
    // }
    const hasapp = masterFileModel.has_app_info === GlobalsService.YES ? true : false;
    formRecord.controls.hasAppInfo.setValue(hasapp);
    formRecord.controls.isSolicitedInfo.setValue(masterFileModel.is_solicited_info);
    formRecord.controls.rationale.setValue(masterFileModel.rationale);
    formRecord.controls.proposedIndication.setValue(masterFileModel.proposed_indication);
    formRecord.controls.orgManufactureId.setValue(masterFileModel.org_manufacture_id);
    formRecord.controls.orgManufactureLic.setValue(masterFileModel.org_manufacture_lic);
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

  private static _setConcatDetails(masterFileModel) {
    // const rDate = '';
    let concatText = '';
    if (masterFileModel.description_type) {
      concatText = masterFileModel.description_type._label_en;
      // if (masterFileModel.descriptionType.value.id === dTypeList[9].id) {
      //   concatText = enDescription;
      //   if (masterFileModel.deviceClass) {
      //     concatText += ' with device class: ' + masterFileModel.deviceClass;
      //   }
      //   if (masterFileModel.deviceName) {
      //     concatText += ', and name of device: ' + masterFileModel.deviceName;
      //   }
      // }
      if (masterFileModel.request_to) {
        concatText += masterFileModel.request_date + ' to ' + masterFileModel.request_to;
      } else if (masterFileModel.request_date) {
        concatText += ' dated ' + masterFileModel.request_date;
      }
      // if (masterFileModel.application_number) {
      //   concatText += ' with application number: ' + masterFileModel.application_number;
      // }
      // if (masterFileModel.meeting_id) {
      //   concatText = 'Meeting ID, ' + masterFileModel.meeting_id + ', ' + concatText;
      // }
      // if (masterFileModel.brief_description) {
      //   concatText += ', and brief description: ' + masterFileModel.brief_description;
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
