import {Injectable} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormArray} from '@angular/forms';
import {CompanyAddressRecordService} from '../app/address/company-address-record/company-address-record.service';
import {IMasterDetails} from '../app/master-details';

@Injectable()
export class CompanyModelService {

  private addressList = [
    {
      id: 1,
      address: 'address1',
      city: 'city1',
      country:
        {
          'id': 'ABW',
          'text': 'Aruba'
        }
    },
    {
      id: 2,
      address: 'address2',
      city: 'city2',
      country:
        {
          'id': 'ABW',
          'text': 'Aruba'
        }

    }

  ];
  // private addressList=[];
  private _indexValue = -1;


  _initIndex() {

    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i].id > this._indexValue) {
        this._indexValue = this.addressList[i].id;
      }
    }
  }

  getNextIndex() {
    this._indexValue++;
    return this._indexValue;
  }

  resetIndex() {
    this._indexValue = -1;
  }

  constructor() {
    this._initIndex();
  }


  getAddresses() {
    //this.addressList=[];
    return this.addressList;
  }

  addAddress(record) {
    //TODO error checking
    this.addressList.push(record);
  }

  getAddressModel() {
    return {
      id: -1,
      address: null,
      city: null,
      country: null
    };
  }

  getAddressFormRecord(fb: FormBuilder) {

    return CompanyAddressRecordService.getReactiveModel(fb);
  }


  addressFormToData(record, addressModel) {

    // CompanyAddressRecordService.mapFormModelToDataModel(record,addressModel);
    return (addressModel);

  }

  addressDataToForm(addressModel, record, countryList) {
    CompanyAddressRecordService.mapDataModelFormModel(addressModel, record, countryList);
    return (addressModel);
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

  getModelAddress(id) {
    let modelList = this.getAddresses();

    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        return modelList[i];
      }
    }
    return null;
  }

  deleteModelRecord(id): boolean {
    let modelList = this.getAddresses();
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].id === id) {
        this.addressList.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}
