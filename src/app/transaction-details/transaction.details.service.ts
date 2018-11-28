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

  /**
   * Gets an data array
   *
   */
  private static getRawAmendReasonList() {
    return [
      'classification.change',
      'licence.change',
      'process.change',
      'quality.change',
      'design.change',
      'materials.change',
      'labelling.change',
      'safety.change',
      'purpose.change',
      'add.delete.change'
    ];
  }

  /**
   * Gets an data array
   *
   */
  // public static getLicenceAppTypeList(lang) {
  //   const rawList = this.getRawLicenceAppTypeList();
  //   return this._convertListText(rawList, lang);
  // }

  public static mapFormModelToDataModel(formRecord: FormGroup, appInfoModel) {
    appInfoModel.dossier_id = formRecord.controls.dossierId.value;
    appInfoModel.manufacturing_company_id = formRecord.controls.manuCompanyId.value;
    appInfoModel.manufacturing_contact_id = formRecord.controls.manuContactId.value;
    appInfoModel.regulatory_company_id = formRecord.controls.reguCompanyId.value;
    appInfoModel.regulatory_contact_id = formRecord.controls.reguContactId.value;
    appInfoModel.qmsc_number = formRecord.controls.qmscNum.value;
    // appInfoModel.has_qmsc = formRecord.controls.hasQMSC.value;
    // if (formRecord.controls.qMSCRegistrar.value) {
    //   const recordIndex1 = ListService.getRecord(registrarList, formRecord.controls.qMSCRegistrar.value, 'id');
    //   if (recordIndex1 > -1) {
    //     appInfoModel.registrar = {
    //       '__text': registrarList[recordIndex1].id,
    //       '_label_en': registrarList[recordIndex1].en,
    //       '_label_fr': registrarList[recordIndex1].fr
    //     };
    //   }
    // } else {
    //   appInfoModel.registrar = null;
    // }
    // if (formRecord.controls.licenceAppType.value) {
    //   const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, formRecord.controls.licenceAppType.value, 'id');
    //   if (recordIndex2 > -1) {
    //     appInfoModel.licence_application_type = {
    //       '__text': this.licenceAppTypeList[recordIndex2].id,
    //       '_label_en': this.licenceAppTypeList[recordIndex2].en,
    //       '_label_fr': this.licenceAppTypeList[recordIndex2].fr
    //     };
    //   }
    // } else {
    //   appInfoModel.licence_application_type = null;
    // }
    appInfoModel.is_ivdd = formRecord.controls.isIvdd.value;
    appInfoModel.is_home_use = formRecord.controls.isHomeUse.value;
    appInfoModel.is_care_point_use = formRecord.controls.isCarePoint.value;
    appInfoModel.is_emit_radiation = formRecord.controls.isEmitRadiation.value;
    appInfoModel.has_drug = formRecord.controls.hasDrug.value;
    appInfoModel.has_din_npn = formRecord.controls.hasDinNpn.value;
    appInfoModel.din = formRecord.controls.din.value;
    appInfoModel.npn = formRecord.controls.npn.value;
    appInfoModel.drug_name = formRecord.controls.drugName.value;
    appInfoModel.active_ingredients = formRecord.controls.activeIngredients.value;
    appInfoModel.manufacturer = formRecord.controls.manufacturer.value;
    appInfoModel.compliance_usp = formRecord.controls.complianceUsp.value ? GlobalsService.YES : GlobalsService.NO;
    appInfoModel.compliance_gmp = formRecord.controls.complianceGmp.value ? GlobalsService.YES : GlobalsService.NO;
    appInfoModel.compliance_other = formRecord.controls.complianceOther.value ? GlobalsService.YES : GlobalsService.NO;
    appInfoModel.other_pharmacopeia = formRecord.controls.otherPharmacopeia.value;
    appInfoModel.provision_mdr_it = formRecord.controls.provisionMdrIT.value ? GlobalsService.YES : GlobalsService.NO;
    appInfoModel.provision_mdr_sa = formRecord.controls.provisionMdrSA.value ? GlobalsService.YES : GlobalsService.NO;
    appInfoModel.authorization_number = formRecord.controls.authorizationNum.value;
    appInfoModel.device_id = formRecord.controls.deviceId.value;
    appInfoModel.declaration_conformity = formRecord.controls.declarationConformity.value;
    appInfoModel.has_recombinant = formRecord.controls.hasRecombinant.value;
    appInfoModel.is_animal_human_sourced = formRecord.controls.isAnimalHumanSourced.value;
    appInfoModel.is_listed_idd_table = formRecord.controls.isListedIddTable.value;
  }

  public static mapDataModelToFormModel(appInfoModel, formRecord: FormGroup) {
    formRecord.controls.companyId.setValue(appInfoModel.company_id);
    formRecord.controls.dossierId.setValue(appInfoModel.dossier_id);
    formRecord.controls.qmscNum.setValue(appInfoModel.qmsc_number);
    // if (appInfoModel.licence_application_type) {
    //   const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, appInfoModel.licence_application_type.__text, 'id');
    //   if (recordIndex2 > -1) {
    //     formRecord.controls.licenceAppType.setValue(this.licenceAppTypeList[recordIndex2].id);
    //   } else {
    //     formRecord.controls.licenceAppType.setValue(null);
    //   }
    // } else {
    //   formRecord.controls.licenceAppType.setValue(null);
    // }
    formRecord.controls.isIvdd.setValue(appInfoModel.is_ivdd);
    formRecord.controls.isHomeUse.setValue(appInfoModel.is_home_use);
    formRecord.controls.isCarePoint.setValue(appInfoModel.is_care_point_use);
    formRecord.controls.isEmitRadiation.setValue(appInfoModel.is_emit_radiation);
    formRecord.controls.hasDrug.setValue(appInfoModel.has_drug);
    formRecord.controls.hasDinNpn.setValue(appInfoModel.has_din_npn);
    formRecord.controls.din.setValue(appInfoModel.din);
    formRecord.controls.npn.setValue(appInfoModel.npn);
    formRecord.controls.drugName.setValue(appInfoModel.drug_name);
    formRecord.controls.activeIngredients.setValue(appInfoModel.active_ingredients);
    formRecord.controls.manufacturer.setValue(appInfoModel.manufacturer);
    const cusp = appInfoModel.compliance_usp === GlobalsService.YES ? true : false;
    formRecord.controls.complianceUsp.setValue(cusp);
    const cgmp = appInfoModel.compliance_gmp === GlobalsService.YES ? true : false;
    formRecord.controls.complianceGmp.setValue(cgmp);
    const cother = appInfoModel.compliance_other === GlobalsService.YES ? true : false;
    formRecord.controls.complianceOther.setValue(cother);
    formRecord.controls.otherPharmacopeia.setValue(appInfoModel.other_pharmacopeia);
    const mdtit = appInfoModel.provision_mdr_it === GlobalsService.YES ? true : false;
    formRecord.controls.provisionMdrIT.setValue(mdtit);
    const mdrsa = appInfoModel.provision_mdr_sa === GlobalsService.YES ? true : false;
    formRecord.controls.provisionMdrSA.setValue(mdrsa);
    formRecord.controls.authorizationNum.setValue(appInfoModel.authorization_number);
    formRecord.controls.deviceId.setValue(appInfoModel.device_id);
    formRecord.controls.declarationConformity.setValue(appInfoModel.declaration_conformity);
    formRecord.controls.hasRecombinant.setValue(appInfoModel.has_recombinant);
    formRecord.controls.isAnimalHumanSourced.setValue(appInfoModel.is_animal_human_sourced);
    formRecord.controls.isListedIddTable.setValue(appInfoModel.is_listed_idd_table);
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
