import {FormGroup} from '@angular/forms';
import {TheraClassService} from './therapeutic/therapeutic-classification/thera-class.service';

export interface IMasterDetails {


   deleteModelRecord(id:number);
   getModelRecordList();
   getModelRecord(id);
  saveRecord(record: FormGroup);
  initIndex(recordList);
  getNextIndex();
  resetIndex();
  getCurrentIndex();
  setIndex(value:number);
  getRecordId(record:FormGroup);
  setRecordId(record: FormGroup, value:number);

}
