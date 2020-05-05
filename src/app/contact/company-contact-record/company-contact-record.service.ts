import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactDetailsService} from '../contact.details/contact.details.service';

@Injectable()
export class CompanyContactRecordService {

  constructor() {
  }

  public static getReactiveModel(fb: FormBuilder, isInternal): FormGroup {
    if (!fb) {
      return null;
    }
    return fb.group({
        id: -1,
        seqNumber: -1,
        detailsDirty: [false, Validators.required],
        isNew: true,
        contactDetails: ContactDetailsService.getReactiveModel(fb, isInternal)
      }
    );
  }

  /** returns a data model for this **/
  public static getEmptyModel() {

    const contactModel = ContactDetailsService.getEmptyModel();
    const companyModel = {
      id: '',
    };
    return this.extend(companyModel, contactModel);
  }

  public static mapFormModelToDataModel(formRecord: FormGroup, contactRecordModel) {
    // console.log(contactRecordModel);
    // console.log(formRecord);
    contactRecordModel.id = formRecord.controls.id.value;
    // contactRecordModel.company = formRecord.controls.companyName.value;
    ContactDetailsService.mapFormModelToDataModel((<FormGroup>formRecord.controls.contactDetails), contactRecordModel);

  }


  public static mapDataModelFormModel(contactRecordModel, formRecord: FormGroup) {
    formRecord.controls.id.setValue(Number(contactRecordModel.id));
    formRecord.controls.isNew.setValue(false);
    // formRecord.controls.companyName.setValue(contactRecordModel.company);
    ContactDetailsService.mapDataModelToFormModel(contactRecordModel, <FormGroup>formRecord.controls.contactDetails);
  }

  public static extend(dest, src) {
    for (var key in src) {
      dest[key] = src[key];
    }
    return dest;
  }

}
