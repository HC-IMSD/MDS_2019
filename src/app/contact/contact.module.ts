import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContactDetailsComponent} from './contact.details/contact.details.component';
import {CompanyContactRecordComponent} from './company-contact-record/company-contact-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {SelectModule} from 'ng2-select';
import {FileIoModule} from '../filereader/file-io/file-io.module';
import {ErrorModule} from '../error-msg/error-ui.module';
import {ContactListComponent} from './contact.list/contact.list.component';
import {ContactListService} from './contact.list/contact-list.service';
import {CommonFeatureModule} from '../common/common-feature.module';
import {TranslateModule} from '@ngx-translate/core';
import {NumbersOnlyModule} from '../number-only/number-only.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    FileIoModule,
    ErrorModule,
    NumbersOnlyModule,
    CommonFeatureModule,
    TranslateModule
  ],
  declarations: [
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent

  ],
  exports: [
    NumbersOnlyModule,
    CompanyContactRecordComponent,
    ContactDetailsComponent,
    ContactListComponent
  ],
  providers: [
   ContactListService
  ]
})
export class ContactModule { }
