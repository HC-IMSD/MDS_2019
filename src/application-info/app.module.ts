import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from '../app/validation.service';
import {ErrorModule} from '../app/error-msg/error-ui.module';
import {ApplicationInfoBaseComponent} from '../app/application-info-base/application-info-base.component';
import {MainPipeModule} from '../app/main-pipe/main-pipe.module';
import {GlobalsService} from '../app/globals/globals.service';
import {ApplicationInfoDetailsComponent} from '../app/application-info-details/application-info.details.component';
import {DeviceModule} from '../app/device/device.module';
import {MaterialModule} from '../app/bio-material/material.module';
import {FileIoModule} from '../app/filereader/file-io/file-io.module';
import {CompanyDataLoaderService} from '../app/data-loader/company-data-loader.service';
import {AppInfoDataLoaderService} from '../app/data-loader/app-info-data-loader.service';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from '../app/common/common-feature.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataLoaderModule} from '../app/data-loader/data-loader.module';

@NgModule({
  declarations: [
    AppComponent,
    ApplicationInfoDetailsComponent,
    ApplicationInfoBaseComponent
  ],
  imports: [
    DeviceModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    MainPipeModule,
    FileIoModule,
    HttpClientModule,
    CommonFeatureModule,
    DataLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot()
  ],
  providers: [
    ValidationService,
    GlobalsService,
    CompanyDataLoaderService
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/applicationInfo/', '.json');
}
