import {ExpanderComponent} from '../../common/expander/expander.component';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

export interface ErrorSummaryObject {

  index: number;
  label: string;
  controlId: string;
  error: string;
  type: string;
  tabSet: NgbTabset;
  tabId:number,
  componentId: string;
  tableId: string;
  expander: ExpanderComponent;
  compRef;
}
