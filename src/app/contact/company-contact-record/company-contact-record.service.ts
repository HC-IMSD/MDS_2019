import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactDetailsService} from '../contact.details/contact.details.service';

@Injectable()
export class CompanyContactRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        detailsDirty: [false, Validators.required],
        companyName: ['', Validators.required],
        contactDetails: ContactDetailsService.getReactiveModel(fb)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const contactModel = ContactDetailsService.getEmptyModel();
    const companyModel = {
      id: '',
      company: ''
    };
    return this.extend(companyModel, contactModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, contactRecordModel, countryList) {
    console.log(contactRecordModel);
    console.log(formRecord);
    contactRecordModel.id = formRecord.controls.id.value;
    contactRecordModel.company = formRecord.controls.companyName.value;
    ContactDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.contactDetails), contactRecordModel, countryList);

  }


  public static mapDataModelFormModel(contactRecordModel, formRecord: FormGroup, countryList) {
    formRecord.controls.id.setValue(contactRecordModel.id);
    formRecord.controls.companyName.setValue(contactRecordModel.company);
    ContactDetailsService.mapDataModelToFormModel(contactRecordModel, <FormGroup>formRecord.controls.contactDetails, countryList);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
