import {Injectable} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormArray} from '@angular/forms';
import {DossierDetailsService} from '../app/dossier-details/dossier.details.service';
import {IMasterDetails} from '../app/master-details';

@Injectable()
export class DossierModelService {
  constructor() {
  }

  getDossierModel() {
    return {
      // id: -1,
      // address: null,
      // city: null,
      // country: null
    };
  }

  getDossierFormRecord(fb: FormBuilder) {

    return DossierDetailsService.getReactiveModel(fb);
  }


  dossierFormToData(dossierModel) {

    return (dossierModel);

  }

  addressDataToForm(dossierModel, record) {
    DossierDetailsService.mapDataModelToFormModel(dossierModel, record);
    return (dossierModel);
  }


  saveRecord(record: FormGroup) {
    /* if (record.controls.id.value === -1) {
       record.controls.id.setValue(this.getNextIndex());
       let addressModel=this.getAddressModel();
       this.addressList.push(this.addressFormToData(record,addressModel));
       return addressModel.id;
     }else{
        let modelRecord= this.getModelAddress(record.controls.id.value);
         this.addressFormToData(record,modelRecord);
     }*/
  }
}
