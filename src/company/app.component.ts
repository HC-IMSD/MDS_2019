import {Component, Input, ElementRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';

/*declare var xml2js: any;*/

// TODO this needs to not be in the nase component. base should have almost nothing in it, generic
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public translateInstance: TranslateService;
  @Input() isInternal;
  public language = 'en';

// we will use form builder to simplify our syntax
  constructor(
        private translate: TranslateService,
        private elementRef: ElementRef,
        public titleService: Title
  ) {
    translate.setDefaultLang(environment.lang);
    this.language = environment.lang;
    console.log(environment.lang);
    this.translateInstance = translate;
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(environment.lang);
    this.translate.get('commmon.required.bracket').subscribe(res => {
      console.log(res);
    });
    this.isInternal = elementRef.nativeElement.getAttribute('isInternal');
    // console.log(elementRef.nativeElement.getAttribute('isInternal'));
    // console.log('isInternal: ' + this.isInternal);
    this.setTitle('Company Template: Regulatory Enrolment Process (REP)');
  }
  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
}
