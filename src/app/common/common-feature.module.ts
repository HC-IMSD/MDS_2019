import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExpanderComponent} from './expander/expander.component';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {AppPrivacyComponent} from './privacy/privacy-statement-en.component';
import {AppSecurityComponent} from './security/security-disclaimer-en.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [
    ExpanderComponent,
    AppPrivacyComponent,
    AppSecurityComponent
  ],
  exports: [
    ExpanderComponent,
    AppPrivacyComponent,
    AppSecurityComponent
  ]
})
export class CommonFeatureModule {
}
