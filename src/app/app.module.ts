import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from './validation.service';
import {ErrorModule} from './error-msg/error-ui.module';
import {CompanyBaseComponent} from './company-base/company-base.component';
import {MainPipeModule} from './main-pipe/main-pipe.module';
import {GlobalsService} from './globals/globals.service';
import {AddressModule} from './address/address.module';
import {FileIoModule} from './filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from './common/common-feature.module';
import {TherapeuticModule} from './therapeutic/therapeutic.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataLoaderModule} from './data-loader/data-loader.module';
import {CompanyDataLoaderService} from './data-loader/company-data-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    CompanyBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    MainPipeModule,
    AddressModule,
    FileIoModule,
    HttpClientModule,
    CommonFeatureModule,
    TherapeuticModule,
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
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
