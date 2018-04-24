import {Injectable} from '@angular/core';

@Injectable()
export class FileIoGlobalsService {
  public static attributeKey = '_attr';
  public static innerTextKey = '_text';
  public static defaultXSLName= 'REP_Combined.xsl';
  public static importSuccess= 'fileio.msg.success'; // json key
  public static parseFail= 'fileio.msg.parseFail';  // json key
  public static fileTypeError = 'fileio.msg.fileTypeError';
  public static dataTypeError = 'fileio.msg.dataTypeError';
  public static draftFileType = 'hcsc';
  public static finalFileType = 'xml';

  constructor() {
  }

}
