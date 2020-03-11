import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transaction-help-en',
  templateUrl: './transaction-help-en.component.html',
  encapsulation: ViewEncapsulation.None

})

/**
 * Sample component is used for nothing
 */
export class TransactionHelpEnComponent {
  @Input() helpTextSequences;
  constructor () {
  }
}
