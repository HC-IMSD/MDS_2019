import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class TransactionDetailsService {

  // private static licenceAppTypeList: Array<any> = TransactionDetailsService.getRawLicenceAppTypeList();

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
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      dossierType: ['Medical device', []],
      manuCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      manuContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      reguCompanyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      reguContactId: [null, [Validators.required, ValidationService.dossierContactIdValidator]],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      transDescription: [null, Validators.required],
      deviceClass: [null, Validators.required],
      amendReason: [null, Validators.required],
      classChange: [false, []],
      licenceChange: [false, []],
      processChange: [false, []],
      qualityChange: [false, []],
      designChange: [false, []],
      materialsChange: [false, []],
      labellingChange: [false, []],
      safetyChange: [false, []],
      purposeChange: [false, []],
      addChange: [false, []],
      licenceNum: [null, [Validators.required, ValidationService.licenceNumValidator]],
      appNum: [null, [Validators.required, ValidationService.appNumValidator]],
      deviceName: [null, Validators.required],
      requestDate: [null, Validators.required],
      hasDdt: [false, []],
      hasAppInfo: [false, []],
      isSolicitedInfo: [null, Validators.required]
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
        manufacturing_company_id: '',
        manufacturing_contact_id: '',
        regulatory_company_id: '',
        regulatory_contact_id: '',
        activity_lead: '',
        activity_type: '',
        transaction_description: '',
        device_class: '',
        amend_reasons: {
          classification_change: '',
          licence_change: '',
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
        device_name: '',
        request_date: '',
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
  public static getActivityLeads() {
    return ['Medical Device Bureau'];
  }

  public static getRawActivityTypes() {
    return ['Fax-back', 'Licence', 'Licence Amendment'];
  }

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
    return ['DC2', 'DC3', 'DC4'];
  }

  /**
   * Gets an data array
   *
   */
  public static getLicenceDescriptions() {
    const descArray = TransactionDetailsService.getRawTransDescList();
    return [descArray[0], descArray[1], descArray[4], descArray[5],
      descArray[8], descArray[9], descArray[10], descArray[11], descArray[12]];
  }

  /**
   * Gets an data array
   *
   */
  public static getFaxbackDescriptions() {
    const descArray = TransactionDetailsService.getRawTransDescList();
    return [descArray[8], descArray[9], descArray[11]];
  }

  /**
   * Gets an data array
   *
   */
  private static getRawTransDescList() {
    return [
      {
        id: 'ACD',
        en: 'Appeal Comprehensive Document',
        fr: 'Appeal Comprehensive Document'
      },
      {
        id: 'LIA',
        en: 'Letter of Intent to Appeal',
        fr: 'Letter of Intent to Appeal'
      },
      {
        id: 'LIOH',
        en: 'Letter of Intent to Invoke Opportunity to be Heard',
        fr: 'Letter of Intent to Invoke Opportunity to be Heard'
      },
      {
        id: 'OHCD',
        en: 'Opportunity to be Heard Comprehensive Document',
        fr: 'Opportunity to be Heard Comprehensive Document'
      },
      {
        id: 'RAIL',
        en: 'Response to Additional Information Letter',
        fr: 'Response to Additional Information Letter'
      },
      {
        id: 'RS',
        en: 'Response to SDL',
        fr: 'Response to SDL'
      },
      {
        id: 'RS36L',
        en: 'Response to S.36 Letter',
        fr: 'Response to S.36 Letter'
      },
      {
        id: 'RS39L',
        en: 'Response to S.39 Letter',
        fr: 'Response to S.39 Letter'
      },
      {
        id: 'WR',
        en: 'Withdrawal Request',
        fr: 'Withdrawal Request'
      },
      {
        id: 'INITIAL',
        en: 'Initial',
        fr: 'Initial'
      },
      {
        id: 'MM',
        en: 'Minutes of Meeting',
        fr: 'Minutes of Meeting'
      },
      {
        id: 'RER',
        en: 'Response to E-mail Request',
        fr: 'Response to E-mail Request'
      },
      {
        id: 'UD',
        en: 'Unsolicited Data',
        fr: 'Unsolicited Data'
      }
    ];
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, transactionModel) {
    transactionModel.dossier_id = formRecord.controls.dossierId.value;
    transactionModel.manufacturing_company_id = formRecord.controls.manuCompanyId.value;
    transactionModel.manufacturing_contact_id = formRecord.controls.manuContactId.value;
    transactionModel.regulatory_company_id = formRecord.controls.reguCompanyId.value;
    transactionModel.regulatory_contact_id = formRecord.controls.reguContactId.value;
    transactionModel.activity_lead = formRecord.controls.activityLead.value;
    transactionModel.activity_type = formRecord.controls.activityType.value;
    const descArray = TransactionDetailsService.getRawTransDescList();
    if (formRecord.controls.transDescription.value) {
      const recordIndex1 = ListService.getRecord(descArray, formRecord.controls.transDescription.value, 'id');
      if (recordIndex1 > -1) {
        transactionModel.transaction_description = {
          '__text': descArray[recordIndex1].id,
          '_label_en': descArray[recordIndex1].en,
          '_label_fr': descArray[recordIndex1].fr
        };
      }
    } else {
      transactionModel.transaction_description = null;
    }
    transactionModel.device_class = formRecord.controls.deviceClass.value;
    transactionModel.amend_reasons.classification_change = formRecord.controls.classChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.licence_change = formRecord.controls.licenceChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.process_change = formRecord.controls.processChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.quality_change = formRecord.controls.qualityChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.design_change = formRecord.controls.designChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.materials_change = formRecord.controls.materialsChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.labelling_change = formRecord.controls.labellingChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.safety_change = formRecord.controls.safetyChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.purpose_change = formRecord.controls.purposeChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.amend_reasons.add_delete_change = formRecord.controls.addChange.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.licence_number = formRecord.controls.licenceNum.value;
    transactionModel.application_number = formRecord.controls.appNum.value;
    transactionModel.device_name = formRecord.controls.deviceName.value;
    transactionModel.request_date = formRecord.controls.requestDate.value;
    transactionModel.has_ddt = formRecord.controls.hasDdt.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.has_app_info = formRecord.controls.hasAppInfo.value ? GlobalsService.YES : GlobalsService.NO;
    transactionModel.is_solicited_info = formRecord.controls.isSolicitedInfo.value;
  }

  public static mapDataModelToFormModel(transactionModel, formRecord: FormGroup, lang) {
    formRecord.controls.dossierId.setValue(transactionModel.dossier_id);
    formRecord.controls.manuCompanyId.setValue(transactionModel.manufacturing_company_id);
    formRecord.controls.manuContactId.setValue(transactionModel.manufacturing_contact_id);
    formRecord.controls.reguCompanyId.setValue(transactionModel.regulatory_company_id);
    formRecord.controls.reguContactId.setValue(transactionModel.regulatory_contact_id);
    formRecord.controls.activityLead.setValue(transactionModel.activity_lead);
    formRecord.controls.activityType.setValue(transactionModel.activity_type);

    const descriptions = TransactionDetailsService._convertListText(TransactionDetailsService.getRawTransDescList(), lang);
    if (transactionModel.transaction_description) {
      const recordIndex = ListService.getRecord(descriptions, transactionModel.transaction_description.__text, 'id');
      if (recordIndex > -1) {
        const labelText = descriptions[recordIndex].text;
        formRecord.controls.transDescription.setValue(
          {
            'id': transactionModel.transaction_description.__text,
            'text': labelText
          }
        );
      } else {
        formRecord.controls.transDescription.setValue(null);
      }
    } else {
      formRecord.controls.transDescription.setValue(null);
    }

    formRecord.controls.deviceClass.setValue(transactionModel.device_class);
    const clsc = transactionModel.amend_reasons.classification_change === GlobalsService.YES ? true : false;
    formRecord.controls.classChange.setValue(clsc);
    const licc = transactionModel.amend_reasons.licence_change === GlobalsService.YES ? true : false;
    formRecord.controls.licenceChange.setValue(licc);
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
    formRecord.controls.licenceNum.setValue(transactionModel.licence_number);
    formRecord.controls.appNum.setValue(transactionModel.application_number);
    formRecord.controls.deviceName.setValue(transactionModel.device_name);
    formRecord.controls.requestDate.setValue(transactionModel.request_date);
    const hasddt = transactionModel.has_ddt === GlobalsService.YES ? true : false;
    formRecord.controls.hasDdt.setValue(hasddt);
    const hasapp = transactionModel.has_app_info === GlobalsService.YES ? true : false;
    formRecord.controls.hasAppInfo.setValue(hasapp);
    formRecord.controls.isSolicitedInfo.setValue(transactionModel.is_solicited_info);
  }

  /**
   * Find a record by its unique id,. If a dup, returns first instance
   * @param list
   * @param criteria
   * @returns {any}
   */
  public static findRecordByTerm(list, criteria, searchTerm) {

    let result = list.filter(
      item => item[searchTerm] === criteria[searchTerm]);
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
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

}
