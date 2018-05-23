import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExpanderComponent} from './expander/expander.component';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ExpanderComponent
  ],
  exports: [
    ExpanderComponent
  ]
})
export class CommonFeatureModule {
}
