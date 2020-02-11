import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'company-help-en',
  templateUrl: './company-help-en.component.html',
  encapsulation: ViewEncapsulation.None
})

/**
 * Sample component is used for nothing
 */
export class CompanyHelpEnComponent {

  @Input() helpTextSequences;
  constructor () {
  }
}
