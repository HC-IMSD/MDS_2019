import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddressDetailsComponent} from './address.details/address.details.component';
import {CompanyAddressRecordComponent} from './company-address-record/company-address-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {AddressListComponent} from './address.list/address.list.component';
import {AddressListService} from './address.list/address-list.service';
import {CommonFeatureModule} from '../common/common-feature.module';
import {TranslateModule} from '@ngx-translate/core';
import {NumbersOnlyDirective} from '../number-only/number.only.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    FileIoModule,
    ErrorModule,
    CommonFeatureModule,
    TranslateModule

  ],
  declarations: [
    CompanyAddressRecordComponent,
    AddressDetailsComponent,
    AddressListComponent,
    NumbersOnlyDirective

  ],
  exports:[
    CompanyAddressRecordComponent,
    AddressDetailsComponent,
    AddressListComponent
  ],
  providers: [
   AddressListService
  ]
})
export class AddressModule { }
