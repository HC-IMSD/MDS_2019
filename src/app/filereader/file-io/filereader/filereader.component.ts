import {Component, OnInit, EventEmitter, Output, Input, SimpleChanges} from '@angular/core';

import {ConvertResults} from '../convert-results';
import {FileConversionService} from '../file-conversion.service';
import {FileIoGlobalsService} from '../file-io-globals.service';


@Component({
  selector: 'filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css']
})

export class FilereaderComponent implements OnInit {
  @Output() complete = new EventEmitter();
  @ Input() rootTag:string = '';
  //@Input() saveType: string = FileIoGlobalsService.draftFileType;
  private rootId:string='';

  constructor() {
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes['rootTag']){
      this.rootId=changes['rootTag'].currentValue;
    }
  }

  /**
   * Attaches to the file browser, detecting the file selection change
   * @param $event
   */
  changeListener($event: any) {

    this.readSelectedFile($event.target);

  }

  /**
   * Determines if a file was selected. Sets a callback to process the file after load (asych)
   * @param inputValue
   */
  readSelectedFile(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    let self = this;
    myReader.onloadend = function (e) {
      // you can perform an action with data here callback for asynch load
      let convertResult = new ConvertResults();
      FilereaderComponent._readFile(file.name, myReader.result, self.rootId, convertResult);
      self.complete.emit(convertResult);
    };
    if (file && file.name) {
      myReader.readAsText(file);
    }
  }

  /***
   * Processes the file data. Determines the type of file based on the filename suffix
   * @param name - the name of the file. Can include the path
   * @param result - the result of the file read i.e. file contents as text
   * @param rootId - the name of the rootTag. If null is ignored
   * @param {ConvertResults} convertResult -The results of the file read
   * @private
   */
  private static _readFile(name:string, result, rootId:string, convertResult:ConvertResults) {
    let splitFile = name.split('.');
    let fileType = splitFile[splitFile.length - 1];
    let conversion:FileConversionService =new FileConversionService();

    if ((fileType.toLowerCase()) == FileIoGlobalsService.draftFileType) {
      conversion.convertToJSONObjects(result, convertResult);
     FilereaderComponent.checkRootTagMatch(convertResult, rootId);
    } else if ((fileType.toLowerCase() === FileIoGlobalsService.finalFileType)) {
      conversion.convertXMLToJSONObjects(result, convertResult);
      FilereaderComponent.checkRootTagMatch(convertResult, rootId);
    } else {
      convertResult.data = null;
      convertResult.messages=[]; //clear msessages
      convertResult.messages.push(FileIoGlobalsService.fileTypeError);
    }
  }
  private static checkRootTagMatch(convertResult:ConvertResults, rootName:string) {
    if (!rootName|| !convertResult ||!convertResult.data) return;

    if (!convertResult.data[rootName]) {
      convertResult.data = null;
      convertResult.messages = [];
      convertResult.messages.push(FileIoGlobalsService.dataTypeError);
    }
  }

}
