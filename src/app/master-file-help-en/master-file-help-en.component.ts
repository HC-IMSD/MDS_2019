import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'master-file-help-en',
  templateUrl: './master-file-help-en.component.html',
  encapsulation: ViewEncapsulation.None

})

/**
 * Sample component is used for nothing
 */
export class MasterFileHelpEnComponent {
  @Input() helpTextSequences;
  constructor () {
  }
}
