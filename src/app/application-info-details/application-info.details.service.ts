import {AfterViewInit, Injectable, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalsService} from '../globals/globals.service';
import {ValidationService} from '../validation.service';
import {ListService} from '../list-service';

@Injectable()
export class ApplicationInfoDetailsService {

  private static licenceAppTypeList: Array<any> = ApplicationInfoDetailsService.getRawLicenceAppTypeList();

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
      qmscNum: [null, Validators.required],
      licenceAppType: [null, Validators.required],
      isIvdd: [null, Validators.required],
      isHomeUse: [null, Validators.required],
      isCarePoint: [null, Validators.required],
      isEmitRadiation: [null, Validators.required],
      hasDrug: [null, Validators.required],
      hasDinNpn: [null, []],
      din: ['', []],
      npn: ['', []],
      drugName: ['', []],
      activeIngredients: ['', []],
      manufacturer: ['', []],
      complianceUsp: [false, []],
      complianceGmp: [false, []],
      complianceOther: [false, []],
      otherPharmacopeia: ['', []],
      provisionMdrIT: [false, []],
      provisionMdrSA: [false, []],
      authorizationNum: ['', []],
      deviceId: ['', []],
      declarationConformity : [null, Validators.required],
      hasRecombinant: [null, Validators.required],
      isAnimalHumanSourced : [null, Validators.required],
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
        qmsc_number: '',
        licence_application_type: '',
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
        authorization_number: '',
        device_id: '',
        declaration_conformity : '',
        has_recombinant: '',
        is_animal_human_sourced : '',
        is_listed_idd_table: ''
      }
    );
  }

  /**
   * Gets an data array
   *
   */
  public static getDrugTypes() {
    return ['din', 'npn', 'nodinnpn'];
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

  public static mapFormModelToDataModel(formRecord: FormGroup, dossierModel) {
    dossierModel.company_id = formRecord.controls.companyId.value;
    dossierModel.dossier_id = formRecord.controls.dossierId.value;
    // dossierModel.device_class = formRecord.controls.deviceClass.value;
    dossierModel.qmsc_number = formRecord.controls.qmscNum.value;
    // dossierModel.has_qmsc = formRecord.controls.hasQMSC.value;
    // if (formRecord.controls.qMSCRegistrar.value) {
    //   const recordIndex1 = ListService.getRecord(registrarList, formRecord.controls.qMSCRegistrar.value, 'id');
    //   if (recordIndex1 > -1) {
    //     dossierModel.registrar = {
    //       '__text': registrarList[recordIndex1].id,
    //       '_label_en': registrarList[recordIndex1].en,
    //       '_label_fr': registrarList[recordIndex1].fr
    //     };
    //   }
    // } else {
    //   dossierModel.registrar = null;
    // }
    if (formRecord.controls.licenceAppType.value) {
      const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, formRecord.controls.licenceAppType.value, 'id');
      if (recordIndex2 > -1) {
        dossierModel.licence_application_type = {
          '__text': this.licenceAppTypeList[recordIndex2].id,
          '_label_en': this.licenceAppTypeList[recordIndex2].en,
          '_label_fr': this.licenceAppTypeList[recordIndex2].fr
        };
      }
    } else {
      dossierModel.licence_application_type = null;
    }
    dossierModel.is_ivdd = formRecord.controls.isIvdd.value;
    dossierModel.is_home_use = formRecord.controls.isHomeUse.value;
    dossierModel.is_care_point_use = formRecord.controls.isCarePoint.value;
    dossierModel.is_emit_radiation = formRecord.controls.isEmitRadiation.value;
    dossierModel.has_drug = formRecord.controls.hasDrug.value;
    dossierModel.has_din_npn = formRecord.controls.hasDinNpn.value;
    dossierModel.din = formRecord.controls.din.value;
    dossierModel.npn = formRecord.controls.npn.value;
    dossierModel.drug_name = formRecord.controls.drugName.value;
    dossierModel.active_ingredients = formRecord.controls.activeIngredients.value;
    dossierModel.manufacturer = formRecord.controls.manufacturer.value;
    dossierModel.compliance_usp = formRecord.controls.complianceUsp.value ? GlobalsService.YES : GlobalsService.NO;
    dossierModel.compliance_gmp = formRecord.controls.complianceGmp.value ? GlobalsService.YES : GlobalsService.NO;
    dossierModel.compliance_other = formRecord.controls.complianceOther.value ? GlobalsService.YES : GlobalsService.NO;
    dossierModel.other_pharmacopeia = formRecord.controls.otherPharmacopeia.value;
    dossierModel.provision_mdr_it = formRecord.controls.provisionMdrIT.value ? GlobalsService.YES : GlobalsService.NO;
    dossierModel.provision_mdr_sa = formRecord.controls.provisionMdrSA.value ? GlobalsService.YES : GlobalsService.NO;
    dossierModel.authorization_number = formRecord.controls.authorizationNum.value;
    dossierModel.device_id = formRecord.controls.deviceId.value;
    dossierModel.declaration_conformity = formRecord.controls.declarationConformity.value;
    dossierModel.has_recombinant = formRecord.controls.hasRecombinant.value;
    dossierModel.is_animal_human_sourced = formRecord.controls.isAnimalHumanSourced.value;
    dossierModel.is_listed_idd_table = formRecord.controls.isListedIddTable.value;
  }

  public static mapDataModelToFormModel(dossierModel, formRecord: FormGroup) {
    formRecord.controls.companyId.setValue(dossierModel.company_id);
    formRecord.controls.dossierId.setValue(dossierModel.dossier_id);
    formRecord.controls.qmscNum.setValue(dossierModel.qmsc_number);
    const recordIndex2 = ListService.getRecord(this.licenceAppTypeList, dossierModel.licence_application_type.__text, 'id');
    if (recordIndex2 > -1) {
      formRecord.controls.licenceAppType.setValue(this.licenceAppTypeList[recordIndex2].id);
    } else {
      formRecord.controls.licenceAppType.setValue(null);
    }
    formRecord.controls.isIvdd.setValue(dossierModel.is_ivdd);
    formRecord.controls.isHomeUse.setValue(dossierModel.is_home_use);
    formRecord.controls.isCarePoint.setValue(dossierModel.is_care_point_use);
    formRecord.controls.isEmitRadiation.setValue(dossierModel.is_emit_radiation);
    formRecord.controls.hasDrug.setValue(dossierModel.has_drug);
    formRecord.controls.hasDinNpn.setValue(dossierModel.has_din_npn);
    formRecord.controls.din.setValue(dossierModel.din);
    formRecord.controls.npn.setValue(dossierModel.npn);
    formRecord.controls.drugName.setValue(dossierModel.drug_name);
    formRecord.controls.activeIngredients.setValue(dossierModel.active_ingredients);
    formRecord.controls.manufacturer.setValue(dossierModel.manufacturer);
    const cusp = dossierModel.compliance_usp === GlobalsService.YES ? true : false;
    formRecord.controls.complianceUsp.setValue(cusp);
    const cgmp = dossierModel.compliance_gmp === GlobalsService.YES ? true : false;
    formRecord.controls.complianceGmp.setValue(cgmp);
    const cother = dossierModel.compliance_other === GlobalsService.YES ? true : false;
    formRecord.controls.complianceOther.setValue(cother);
    formRecord.controls.otherPharmacopeia.setValue(dossierModel.other_pharmacopeia);
    const mdtit = dossierModel.provision_mdr_it === GlobalsService.YES ? true : false;
    formRecord.controls.provisionMdrIT.setValue(mdtit);
    const mdrsa = dossierModel.provision_mdr_sa === GlobalsService.YES ? true : false;
    formRecord.controls.provisionMdrSA.setValue(mdrsa);
    formRecord.controls.authorizationNum.setValue(dossierModel.authorization_number);
    formRecord.controls.deviceId.setValue(dossierModel.device_id);
    formRecord.controls.declarationConformity.setValue(dossierModel.declaration_conformity);
    formRecord.controls.hasRecombinant.setValue(dossierModel.has_recombinant);
    formRecord.controls.isAnimalHumanSourced.setValue(dossierModel.is_animal_human_sourced);
    formRecord.controls.isListedIddTable.setValue(dossierModel.is_listed_idd_table);
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