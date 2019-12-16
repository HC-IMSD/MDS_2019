import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalsService} from '../globals/globals.service';

@Injectable()
export class AppInfoDataLoaderService {

  private rawSpecFamilyList: Array<any> = [
    {id: '2', label_en: 'BOVINE', label_fr: 'fr_BOVINE'},
    {id: '4', label_en: 'CAPRINE', label_fr: 'fr_CAPRINE'},
    {id: '9', label_en: 'EQUINE', label_fr: 'fr_EQUINE'},
    {id: '11', label_en: 'FISH', label_fr: 'fr_FISH'},
    {id: '12', label_en: 'HONEY BEE', label_fr: 'fr_HONEY BEE'},
    {id: '1', label_en: 'HUMAN', label_fr: 'fr_HUMAN'},
    {id: '3', label_en: 'OVINE', label_fr: 'fr_OVINE'},
    {id: '5', label_en: 'PORCINE', label_fr: 'fr_PORCINE'},
    {id: '7', label_en: 'ROOSTER', label_fr: 'fr_ROOSTER'},
    {id: '6', label_en: 'SHARK', label_fr: 'fr_SHARK'},
    {id: '10', label_en: 'SHRIMP-PANDALUS BORREALIS', label_fr: 'fr_SHRIMP-PANDALUS BORREALIS'},
    {id: '8', label_en: 'SILK WORM', label_fr: 'fr_SILK WORM'},
    {id: 'other', label_en: 'OTHER', label_fr: 'fr_OTHER'}
  ];

  private tissueTypeList: Array<any> = [
      {id: '26', label_en: 'AMNIOTIC MEMBRANE', label_fr: 'fr_AMNIOTIC MEMBRANE'},
      {id: '24', label_en: 'ANIMAL FAT', label_fr: 'fr_ANIMAL FAT'},
      {id: '23', label_en: 'ARTERY / VEIN', label_fr: 'fr_ARTERY / VEIN'},
      {id: '14', label_en: 'BLOOD', label_fr: 'fr_BLOOD'},
      {id: '2', label_en: 'BONE', label_fr: 'fr_BONE'},
      {id: '10', label_en: 'CARTILAGE', label_fr: 'fr_CARTILAGE'},
      {id: '11', label_en: 'COMB', label_fr: 'fr_COMB'},
      {id: '19', label_en: 'DERMAL', label_fr: 'fr_DERMAL'},
      {id: '6', label_en: 'DURA MATER', label_fr: 'fr_DURA MATER'},
      {id: '7', label_en: 'FIBROBLAST', label_fr: 'fr_FIBROBLAST'},
      {id: '4', label_en: 'HEART VALVE', label_fr: 'fr_HEART VALVE'},
      {id: '5', label_en: 'HIDES OR SKIN', label_fr: 'fr_HIDES OR SKIN'},
      {id: '8', label_en: 'INTESTINE', label_fr: 'fr_INTESTINE'},
      {id: '30', label_en: 'LIGAMENT', label_fr: 'fr_LIGAMENT'},
      {id: '20', label_en: 'MILK', label_fr: 'fr_MILK'},
      {id: '9', label_en: 'MUCOSA', label_fr: 'fr_MUCOSA'},
      {id: '22', label_en: 'NON-SPECIFIC MEAT', label_fr: 'fr_NON-SPECIFIC MEAT'},
      {id: '28', label_en: 'NOT APPLICABLE', label_fr: 'fr_NOT APPLICABLE'},
      {id: '3', label_en: 'PERICARDIUM', label_fr: 'fr_PERICARDIUM'},
      {id: '15', label_en: 'PERITONEUM', label_fr: 'fr_PERITONEUM'},
      {id: '18', label_en: 'PLACENTA', label_fr: 'fr_PLACENTA'},
      {id: '16', label_en: 'SCLERA', label_fr: 'fr_SCLERA'},
      {id: '12', label_en: 'SEROSA', label_fr: 'fr_SEROSA'},
      {id: '13', label_en: 'SERUM', label_fr: 'fr_SERUM'},
      {id: '25', label_en: 'SHRIMP SHELLS', label_fr: 'fr_SHRIMP SHELLS'},
      {id: '21', label_en: 'SILK', label_fr: 'fr_SILK'},
      {id: '27', label_en: 'TEETH', label_fr: 'fr_TEETH'},
      {id: '1', label_en: 'TENDON', label_fr: 'fr_TENDON'},
      {id: '17', label_en: 'TRACHEA', label_fr: 'fr_TRACHEA'},
      {id: '29', label_en: 'URINARY BLADDER MATRIX', label_fr: 'fr_URINARY BLADDER MATRIX'},
      {id: 'other', label_en: 'OTHER', label_fr: 'fr_OTHER'}
  ];

  private derivativeList: Array<any> = [
    {id: '2', label_en: 'ALBUMIN', label_fr: 'fr_ALBUMIN'},
    {id: '28', label_en: 'ANORGANIC BONE MINERAL', label_fr: 'fr_ANORGANIC BONE MINERAL'},
    {id: '19', label_en: 'BMP', label_fr: 'fr_BMP'},
    {id: '15', label_en: 'BUTYL STEARATE', label_fr: 'fr_BUTYL STEARATE'},
    {id: '12', label_en: 'CASEIN', label_fr: 'fr_CASEIN'},
    {id: '7', label_en: 'CATALASE', label_fr: 'fr_CATALASE'},
    {id: '24', label_en: 'CHITOSAN', label_fr: 'fr_CHITOSAN'},
    {id: '9', label_en: 'CHONDROITIN SULPHATE', label_fr: 'fr_CHONDROITIN SULPHATE'},
    {id: '1', label_en: 'COLLAGEN', label_fr: 'fr_COLLAGEN'},
    {id: '21', label_en: 'DEMINERALIZED BONE MATRL', label_fr: 'fr_DEMINERALIZED BONE MATRL'},
    {id: '29', label_en: 'ELASTIN', label_fr: 'fr_ELASTIN'},
    {id: '13', label_en: 'FIBRIN', label_fr: 'fr_FIBRIN'},
    {id: '3', label_en: 'GELATIN', label_fr: 'fr_GELATIN'},
    {id: '4', label_en: 'HEPARIN', label_fr: 'fr_HEPARIN'},
    {id: '5', label_en: 'HYALURONIC ACID', label_fr: 'fr_HYALURONIC ACID'},
    {id: '27', label_en: 'HYDROXYAPATITE', label_fr: 'fr_HYDROXYAPATITE'},
    {id: '18', label_en: 'INFUSION', label_fr: 'fr_INFUSION'},
    {id: '16', label_en: 'ISOBUTYL STEARATE', label_fr: 'fr_ISOBUTYL STEARATE'},
    {id: '14', label_en: 'MAGNESIUM STEARATE', label_fr: 'fr_MAGNESIUM STEARATE'},
    {id: '17', label_en: 'MONOSTEARATE', label_fr: 'fr_MONOSTEARATE'},
    {id: '26', label_en: 'OIL', label_fr: 'fr_OIL'},
    {id: '25', label_en: 'PEPSIN', label_fr: 'fr_PEPSIN'},
    {id: '23', label_en: 'RECOMBINANT HUMAN ALBUMIN', label_fr: 'fr_RECOMBINANT HUMAN ALBUMIN'},
    {id: '20', label_en: 'RHBMP', label_fr: 'fr_RHBMP'},
    {id: '6', label_en: 'SODIUM HYALURONATE', label_fr: 'fr_SODIUM HYALURONATE'},
    {id: '22', label_en: 'TALLOW', label_fr: 'fr_TALLOW'},
    {id: '10', label_en: 'THROMBIN', label_fr: 'fr_THROMBIN'},
    {id: 'other', label_en: 'OTHER', label_fr: 'fr_OTHER'}
  ];

public getSpecFamilyList(lang) {
    const speciesList = this._convertListText(this.rawSpecFamilyList, lang);
    return speciesList;
  }

  public getTissueTypeList(lang) {
    const speciesList = this._convertListText(this.tissueTypeList, lang);
    return speciesList;
  }

  public getDerivativeList(lang) {
    const speciesList = this._convertListText(this.derivativeList, lang);
    return speciesList;
  }

  /***
   * Converts the list iteems of id, label_en, and label_Fr
   * @param rawList
   * @param lang
   * @private
   */
  private _convertListText(rawList, lang) {
    const result = [];
    if (lang === GlobalsService.FRENCH) {
      rawList.forEach(item => {
        item.text = item.label_fr;
        result.push(item);
        //  console.log(item);
      });
    } else {
      rawList.forEach(item => {
        item.text = item.label_en;
        // console.log("adding country"+item.text);
        result.push(item);
        // console.log(item);
      });
    }
    return result;
  }

}
