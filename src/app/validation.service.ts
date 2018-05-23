import {TranslateService} from '@ngx-translate/core';

export class ValidationService {

  constructor() {
    //private translate: TranslateService
    // this.translate.get('error.msg.required').subscribe(res => { console.log(res); });

  }


  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    //TODO sucky need to make the keys the same as the translation for the error summary
    let config = {
      'required': 'required',
      'error.msg.email': 'error.msg.email',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'error.msg.postal': 'error.msg.postal',
      'error.mgs.zip':'error.mgs.zip'
    };

    return config[validatorName];
  }

  /*  static creditCardValidator(control) {
      // Visa, MasterCard, American Express, Diners Club, Discover, JCB
      if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
        return null;
      } else {
        return {'invalidCreditCard': true};
      }
    }*/

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {'error.msg.email': true};
    }
  }

  /*static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }*/
  static canadaPostalValidator(control){
    if(!control.value){
      return null;
    }
    if (control.value.match(/^(?!.*[DFIOQU])[A-VXYa-vxy][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/)) {
      return null;
    } else {
      return {'error.msg.postal': true};
    }

  }
  static usaPostalValidator(control){
    if(!control.value){
      return null;
    }
    if (control.value.match(/^[0-9]{5}(?:-[0-9]{4})?$/)) {
      return null;
    } else {
      return {'error.mgs.zip': true};
    }
  }

}
