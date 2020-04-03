import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoDetailsService {

  private static licenceAppTypeList: Array<any> = ApplicationInfoDetailsService.getRawLicenceAppTypeList();
  private static drugTypeList: Array<any> = ApplicationInfoDetailsService.getRawDrugTypeList();
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
      companyId: [null, [Validators.required, ValidationService.companyIdValidator]],
      dossierId: [null, [Validators.required, ValidationService.dossierIdValidator]],
      mdsapNum: [null, Validators.required],
      mdsapOrg: [null, Validators.required],
      licenceAppType: [null, Validators.required],
      activityLead: [null, Validators.required],
      activityType: [null, Validators.required],
      deviceClass: [null, Validators.required],
      isIvdd: [null, Validators.required],
      isHomeUse: [null, Validators.required],
      isCarePoint: [null, Validators.required],
      isEmitRadiation: [null, Validators.required],
      hasDrug: [null, Validators.required],
      hasDinNpn: [null, []],
     /** din: ['', []],
      npn: ['', []], **/
      din: [null, [Validators.required, ValidationService.dinValidator]],
      npn: [null, [Validators.required, ValidationService.npnValidator]],
      drugName: [null, Validators.required],
      activeIngredients: [null, Validators.required],
      manufacturer: [null, Validators.required],
      hasCompliance: [null, Validators.required],
      complianceUsp: [false, []],
      complianceGmp: [false, []],
      complianceOther: [false, []],
      otherPharmacopeia: [null, Validators.required],
      provisionMdrIT: [false, []],
      provisionMdrSA: [false, []],
      applicationNum: ['', [ValidationService.appNumValidator]],
      sapReqNum: ['', []],
      declarationConformity : [null, Validators.required],
      hasRecombinant: [null, Validators.required],
      isAnimalHumanSourced : [null, Validators.required],
      // hasMaterial: [null, Validators.required],
      isListedIddTable: [null, Validators.required]
    });
  }

  /**
   * Gets an empty data model
   *
   */
  public getEmptyModel() {

    return (
      {
        company_id: '',
        dossier_id: '',
        mdsap_number: '',
        mdsap_org: '',
        licence_application_type: '',
        regulatory_activity_lead: '',
        regulatory_activity_type: '',
        device_class: '',
        is_ivdd: '',
        is_home_use: '',
        is_care_point_use: '',
        is_emit_radiation: '',
        has_drug: '',
        has_din_npn: '',
        din: '',
        npn: '',
        drug_name: '',
        active_ingredients: '',
        manufacturer: '',
        compliance_usp: '',
        compliance_gmp: '',
        compliance_other: '',
        other_pharmacopeia: '',
        provision_mdr_it: '',
        provision_mdr_sa: '',
        application_number: '',
        sap_request_number: '',
        declaration_conformity : '',
        has_recombinant: '',
        is_animal_human_sourced : '',
        is_listed_idd_table: ''
      }
    );
  }

  /**
   * Sets language variable
   *
   */
  public static setLang(lang) {
    ApplicationInfoDetailsService.lang = lang;
  }


    /**
   * Gets an data array
   *
   */
  public static getRawDrugTypeList() {
    return [
      {
        id: 'din',
        en: 'Drug Identification Number (DIN)',
        fr: 'fr_DIN'
      },
      {
        id: 'npn',
        en: 'Natural Product Number (NPN)',
        fr: 'fr_NPN'
      },
      {
        id: 'nodinnpn',
        en: 'No DIN/NPN',
        fr: 'fr_No DIN/NPN'
      }
    ];
  }

  /**
   * Gets an data array
   *
   */
  public static getDrugTypes(lang) {
    const rawList = ApplicationInfoDetailsService.getRawDrugTypeList();
    return this._convertListText(rawList, lang);
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
  private static getRawLicenceAppTypeList() {
    return [
      {
        id: 'D',
        en: 'Single Device',
        fr: 'Instrument à article unique'
      },
      {
        id: 'S',
        en: 'System',
        fr: 'Système'
      },
      {
        id: 'K',
        en: 'Test Kit',
        fr: 'Trousse d\'essai'
      },
      {
        id: 'F',
        en: 'Device Family',
        fr: 'Famille d\'instruments'
      },
      {
        id: 'G',
        en: 'Device Group',
        fr: 'Groupe d\'instruments'
      },
      {
        id: 'Y',
        en: 'Device Group Family',
        fr: 'Famille de groupe d\'instruments'
      },
      {
        id: 'U',
        en: 'Unknown',
        fr: 'Indéterminé'
      }
    ];
  }

  /**
   * Gets an data array
   *
   */
  public static getLicenceAppTypeList(lang) {
    const rawList = this.getRawLicenceAppTypeList();
    return this._convertListText(rawList, lang);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, appInfoModel) {
    const activityLeadList = ApplicationInfoDetailsService.getActivityLeadList(ApplicationInfoDetailsService.lang);
    const activityTypeList = ApplicationInfoDetailsService.getActivityTypeList(ApplicationInfoDetailsService.lang);
    const deviceClassList = ApplicationInfoDetailsService.getDeviceClassList(ApplicationInfoDetailsService.lang);

   // appInfoModel.company_id = formRecord.controls.companyId.value;
    if (formRecord.controls.companyId.value) {
      appInfoModel.company_id = 'K' + formRecord.controls.companyId.value;
    }
    appInfoModel.dossier_id = formRecord.controls.dossierId.value;
    // appInfoModel.device_class = formRecord.controls.deviceClass.value;
    appInfoModel.mdsap_number = formRecord.controls.mdsapNum.value;
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
    if (formRecord.controls.mdsapOrg.value) {
     const mdsapOrgList = ApplicationInfoDetailsService.getMdsapOrgListList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(mdsapOrgList, formRecord.controls.mdsapOrg.value, 'id');
      if (recordIndex2 > -1) {
        appInfoModel.mdsap_org = {
          '__text': mdsapOrgList[recordIndex2].text,
          '_id': mdsapOrgList[recordIndex2].id,
          '_label_en': mdsapOrgList[recordIndex2].en,
          '_label_fr': mdsapOrgList[recordIndex2].fr
        };
      }
    } else {
      appInfoModel.mdsap_org = null;
    }

    if (formRecord.controls.licenceAppType.value) {
      const latList = ApplicationInfoDetailsService.getLicenceAppTypeList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(latList, formRecord.controls.licenceAppType.value, 'id');
      if (recordIndex2 > -1) {
        appInfoModel.licence_application_type = {
          '__text': latList[recordIndex2].text,
          '_id': latList[recordIndex2].id,
          '_label_en': latList[recordIndex2].en,
          '_label_fr': latList[recordIndex2].fr
        };
      }
    } else {
      appInfoModel.licence_application_type = null;
    }

    if (formRecord.controls.activityLead.value) {
      const recordIndex1 = ListService.getRecord(activityLeadList, formRecord.controls.activityLead.value, 'id');
      if (recordIndex1 > -1) {
        appInfoModel.regulatory_activity_lead = {
          '__text': activityLeadList[recordIndex1].text,
          '_id': activityLeadList[recordIndex1].id,
          '_label_en': activityLeadList[recordIndex1].en,
          '_label_fr': activityLeadList[recordIndex1].fr
        };
      }
    } else {
      appInfoModel.regulatory_activity_lead = null;
    }

    if (formRecord.controls.activityType.value) {
      const recordIndex2 = ListService.getRecord(activityTypeList, formRecord.controls.activityType.value, 'id');
      if (recordIndex2 > -1) {
        appInfoModel.regulatory_activity_type = {
          '__text': activityTypeList[recordIndex2].text,
          '_id' : activityTypeList[recordIndex2].id,
          '_label_en': activityTypeList[recordIndex2].en,
          '_label_fr': activityTypeList[recordIndex2].fr
        };
      }
    } else {
      appInfoModel.regulatory_activity_type = null;
    }

    if (formRecord.controls.deviceClass.value) {
      const recordIndex2 = ListService.getRecord(deviceClassList, formRecord.controls.deviceClass.value, 'id');
      if (recordIndex2 > -1) {
        appInfoModel.device_class = {
          '__text': deviceClassList[recordIndex2].text,
          '_id' : deviceClassList[recordIndex2].id,
          '_label_en': deviceClassList[recordIndex2].en,
          '_label_fr': deviceClassList[recordIndex2].fr
        };
      }
    } else {
      appInfoModel.device_class = null;
    }

    appInfoModel.is_ivdd = formRecord.controls.isIvdd.value;
    appInfoModel.is_home_use = formRecord.controls.isHomeUse.value;
    appInfoModel.is_care_point_use = formRecord.controls.isCarePoint.value;
    appInfoModel.is_emit_radiation = formRecord.controls.isEmitRadiation.value;
    appInfoModel.has_drug = formRecord.controls.hasDrug.value;
    if (formRecord.controls.hasDinNpn.value) {
      const dtList = ApplicationInfoDetailsService.getDrugTypes(ApplicationInfoDetailsService.lang);
      const recordIndex3 = ListService.getRecord(dtList, formRecord.controls.hasDinNpn.value, 'id');
      if (recordIndex3 > -1) {
        appInfoModel.has_din_npn = {
          '__text': dtList[recordIndex3].text,
          '_id': dtList[recordIndex3].id,
          '_label_en': dtList[recordIndex3].en,
          '_label_fr': dtList[recordIndex3].fr
        };
      }
    } else {
      appInfoModel.has_din_npn = null;
    }
    // appInfoModel.has_din_npn = formRecord.controls.hasDinNpn.value;
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
    appInfoModel.application_number = formRecord.controls.applicationNum.value;
    appInfoModel.sap_request_number = formRecord.controls.sapReqNum.value;
    appInfoModel.declaration_conformity = formRecord.controls.declarationConformity.value;
    appInfoModel.has_recombinant = formRecord.controls.hasRecombinant.value;
    appInfoModel.is_animal_human_sourced = formRecord.controls.isAnimalHumanSourced.value;
    appInfoModel.is_listed_idd_table = formRecord.controls.isListedIddTable.value;
  }

  public static mapDataModelToFormModel(appInfoModel, formRecord: FormGroup) {
    if ( appInfoModel.company_id.length > 0 ) {
      const comIDs = appInfoModel.company_id.slice(1);
      // console.log("company_id" + comIDs[1]);
      formRecord.controls.companyId.setValue(comIDs);
    }


   // formRecord.controls.companyId.setValue(appInfoModel.company_id);
    formRecord.controls.dossierId.setValue(appInfoModel.dossier_id);
    formRecord.controls.mdsapNum.setValue(appInfoModel.mdsap_number);

    if (appInfoModel.mdsap_org) {
      const mdsapOrgList = ApplicationInfoDetailsService.getMdsapOrgListList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(mdsapOrgList, appInfoModel.mdsap_org._id, 'id');
      if (appInfoModel.mdsap_org) {
        if (recordIndex2 > -1) {
          formRecord.controls.mdsapOrg.setValue(mdsapOrgList[recordIndex2].id);
        } else {
          formRecord.controls.mdsapOrg.setValue(null);
        }
      } else {
        formRecord.controls.mdsapOrg.setValue(null);
      }
    }

    if (appInfoModel.licence_application_type) {
      const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, appInfoModel.licence_application_type._id, 'id');
      if (recordIndex2 > -1) {
        formRecord.controls.licenceAppType.setValue(this.licenceAppTypeList[recordIndex2].id);
      } else {
        formRecord.controls.licenceAppType.setValue(null);
      }
    } else {
      formRecord.controls.licenceAppType.setValue(null);
    }

    if (appInfoModel.regulatory_activity_lead) {
      const activityLeadList = ApplicationInfoDetailsService.getActivityLeadList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(activityLeadList, appInfoModel.regulatory_activity_lead._id, 'id');
      if (recordIndex2 > -1) {
        formRecord.controls.activityLead.setValue(activityLeadList[recordIndex2].id);
      } else {
        formRecord.controls.activityLead.setValue(null);
      }
    } else {
      formRecord.controls.activityLead.setValue(null);
    }

    if (appInfoModel.regulatory_activity_type) {
      const activityTypeList = ApplicationInfoDetailsService.getActivityTypeList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(activityTypeList, appInfoModel.regulatory_activity_type._id, 'id');
      if (recordIndex2 > -1) {
        formRecord.controls.activityType.setValue(activityTypeList[recordIndex2].id);
      } else {
        formRecord.controls.activityType.setValue(null);
      }
    } else {
      formRecord.controls.activityType.setValue(null);
    }

    if (appInfoModel.device_class) {
      const deviceClassList = ApplicationInfoDetailsService.getDeviceClassList(ApplicationInfoDetailsService.lang);
      const recordIndex2 = ListService.getRecord(deviceClassList, appInfoModel.device_class._id, 'id');
      if (recordIndex2 > -1) {
        formRecord.controls.deviceClass.setValue(deviceClassList[recordIndex2].id);
      } else {
        formRecord.controls.deviceClass.setValue(null);
      }
    } else {
      formRecord.controls.deviceClass.setValue(null);
    }
    formRecord.controls.isIvdd.setValue(appInfoModel.is_ivdd);
    formRecord.controls.isHomeUse.setValue(appInfoModel.is_home_use);
    formRecord.controls.isCarePoint.setValue(appInfoModel.is_care_point_use);
    formRecord.controls.isEmitRadiation.setValue(appInfoModel.is_emit_radiation);
    formRecord.controls.hasDrug.setValue(appInfoModel.has_drug);

    if (appInfoModel.has_din_npn) {
      const recordIndex3 = ListService.getRecord(this.drugTypeList, appInfoModel.has_din_npn._id, 'id');
      if (recordIndex3 > -1) {
        formRecord.controls.hasDinNpn.setValue(this.drugTypeList[recordIndex3].id);
      } else {
        formRecord.controls.hasDinNpn.setValue(null);
      }
    } else {
      formRecord.controls.hasDinNpn.setValue(null);
    }
    // formRecord.controls.hasDinNpn.setValue(appInfoModel.has_din_npn);
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
    formRecord.controls.applicationNum.setValue(appInfoModel.application_number);
    formRecord.controls.sapReqNum.setValue(appInfoModel.sap_request_number);
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


  /**
   * Gets an data array
   *
   */
  public static getDeviceClassList(lang) {
    const rawList = this.getRawDeviceClassList();
    return this._convertListText(rawList, lang);
  }

  /**
   * Gets an data array
   *
   */
  private static getRawDeviceClassList() {
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
    return ApplicationInfoDetailsService._convertListText(ApplicationInfoDetailsService.getRawActivityLeadList(), lang);
  }

  public static getActivityTypeList(lang) {
    return ApplicationInfoDetailsService._convertListText(ApplicationInfoDetailsService.getRawActivityTypeList(), lang);
  }

  public static getMdsapOrgListList(lang) {
    return ApplicationInfoDetailsService._convertListText(ApplicationInfoDetailsService.getRawMdsapOrgList(), lang);
  }

  public static getRawActivityTypeList() {
    return [
      {
        id: 'B02-20160301-033',
        en: 'Minor Change',
        fr: 'Minor Change'
      },
      {
        id: 'B02-20160301-039',
        en: 'Licence',
        fr: 'Licence'
      },
      {
        id: 'B02-20160301-040',
        en: 'Licence Amendment',
        fr: 'Licence Amendment'
      },
      {
        id: 'B02-20160301-073',
        en: 'Private Label',
        fr: 'Private Label'
      },
      {
        id: 'B02-20160301-074',
        en: 'Private Label Amendment',
        fr: 'Private Label Amendment'
      },
      {
        id: 'B02-20160301-081',
        en: 'S.25/36/39/40/41',
        fr: 'S.25/36/39/40/41'
      },
      {
        id: 'B02-20190627-02',
        en: 'PA-PV',
        fr: 'PA-PV'
      },
      {
        id: 'B02-20160301-079',
        en: 'PSUR-PV',
        fr: 'PSUR-PV'
      },
      {
        id: 'B02-20190627-04',
        en: 'RC-PV',
        fr: 'RC-PV'
      },
      {
        id: 'B02-20190627-03',
        en: 'PSA-PV',
        fr: 'PSA-PV'
      },
      {
        id: 'B02-20190627-05',
        en: 'REG-PV',
        fr: 'REG-PV'
      }
    ];
  }

  public static getRawMdsapOrgList() {
    return [
      {
        id: 'NotApplicable',
        en: 'Not Applicable',
        fr: 'Not Applicable'
      },
      {
        id: 'BSIGroupAmericaInc',
        en: 'BSI Group America Inc.',
        fr: 'BSI Group America Inc.'
      },
      {
        id: 'DekraCertificationBV',
        en: 'Dekra Certification B.V.',
        fr: 'Dekra Certification B.V.'
      },
      {
        id: 'DQSMedizinprodukteGMBH',
        en: 'DQS Medizinprodukte GMBH',
        fr: 'DQS Medizinprodukte GMBH'
      },
      {
        id: 'IntertekTestingServicesNAInc',
        en: 'Intertek Testing Services NA Inc.',
        fr: 'Intertek Testing Services NA Inc.'
      },
      {
        id: 'LaboratoireNationaldemétrologie',
        en: 'Laboratoire National de métrologie et d\'Essais (LNE) - Dvision certification G-MED (traiding as LNE/G-MED and G-MED)PSU',
        fr: 'Laboratoire National de métrologie et d\'Essais (LNE) - Dvision certification G-MED (traiding as LNE/G-MED and G-MED)'
      },
      {
        id: 'LloydsRegisterQualityAssuranceInc',
        en: 'Lloyd\'s Register Quality Assurance Inc.',
        fr: 'Lloyd\'s Register Quality Assurance Inc.'
      },
      {
        id: 'NationalStandardsAuthorityofIreland',
        en: 'National Standards Authority of Ireland',
        fr: 'National Standards Authority of Ireland'
      },
      {
        id: 'QMI-SAICanadaLimited',
        en: 'QMI-SAI Canada Limited',
        fr: 'QMI-SAI Canada Limited'
      },

      {
        id: 'SGSUnitedKingdomLtd',
        en: 'SGS United Kingdom Ltd.',
        fr: 'SGS United Kingdom Ltd.'
      },
      {
        id: 'TUVRNATÜVRheinlandofNorthAmericaInc',
        en: 'TUVRNA - TÜV Rheinland of North America, Inc.',
        fr: 'TUVRNA - TÜV Rheinland of North America, Inc.'
      },
      {
        id: 'TUVAMTÜVSÜDAmericaInc',
        en: 'TUVAM - TÜV SÜD America Inc. (also operating as TÜV America Inc.)',
        fr: 'TUVAM - TÜV SÜD America Inc. (also operating as TÜV America Inc.)'
      },
      {
        id: 'TUVUSAInc',
        en: 'TUV USA - TÜV USA, Inc.',
        fr: 'TUV USA - TÜV USA, Inc.'
      },
      {
        id: 'TUVNORD',
        en: 'TUVNORD - TUV Nord Cert GMBH',
        fr: 'TUVNORD - TUV Nord Cert GMBH'
      },
      {
        id: 'UL',
        en: 'UL - UL LLC',
        fr: 'UL - UL LLC'
      }
    ];
  }

  public static getActivityTypeMDBList(lang) {
    const descArray = ApplicationInfoDetailsService._convertListText(ApplicationInfoDetailsService.getRawActivityTypeList(), lang);
    return [descArray[0], descArray[1], descArray[2], descArray[3], descArray[4], descArray[5]];
  }

  public static getActivityTypePVList(lang) {
    const descArray = ApplicationInfoDetailsService._convertListText(ApplicationInfoDetailsService.getRawActivityTypeList(), lang);
    return [descArray[6], descArray[7], descArray[8], descArray[9], descArray[10]];
  }

}
