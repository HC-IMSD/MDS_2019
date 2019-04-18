import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {ValidationService} from '../app/validation.service';
import {ErrorModule} from '../app/error-msg/error-ui.module';
import {CompanyBaseComponent} from '../app/company-base/company-base.component';
import {CompanyHelpEnComponent} from '../app/company-help-en//company-help-en.component';
import {MainPipeModule} from '../app/main-pipe/main-pipe.module';
import {GlobalsService} from '../app/globals/globals.service';
import {AddressModule} from '../app/address/address.module';
import {LicenceModule} from '../app/licence/licence.module';
import {NumbersOnlyDirective} from '../app/number-only/number.only.directive';
// import {AddressDetailsComponent} from '../app/address/address.details/address.details.component';
import {ContactModule} from '../app/contact/contact.module';
import {CompanyInfoComponent} from '../app/company-info/company.info.component';
import {CompanyAdminChangesComponent} from '../app/company-admin-changes/company-admin.changes.component';
import {FileIoModule} from '../app/filereader/file-io/file-io.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonFeatureModule} from '../app/common/common-feature.module';
import {TherapeuticModule} from '../app/therapeutic/therapeutic.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataLoaderModule} from '../app/data-loader/data-loader.module';
import {CompanyDataLoaderService} from '../app/data-loader/company-data-loader.service';

@NgModule({
  declarations: [
    AppComponent,
    CompanyInfoComponent,
    CompanyAdminChangesComponent,
    CompanyBaseComponent,
    CompanyHelpEnComponent,
    NumbersOnlyDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorModule,
    MainPipeModule,
    AddressModule,
    ContactModule,
    LicenceModule,
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
    CompanyDataLoaderService,
    Title
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
  return new TranslateHttpLoader(http, './assets/i18n/company/', '.json');
}
