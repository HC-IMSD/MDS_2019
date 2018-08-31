import {Injectable} from '@angular/core';

@Injectable()
export class FileIoGlobalsService {
  public static attributeKey = '_';
  public static innerTextKey = '__text';
  public static defaultXSLName= 'REP_Combined.xsl';
  public static importSuccess= 'msg.success.load'; // json key
  public static parseFail= 'msg.err.parseFail';
  public static jsonParseFail= 'msg.err.jsonparse';  // json key
  public static xmlParseFail= 'msg.err.xmlparse';
  public static fileTypeError = 'msg.err.file.type';
  public static dataTypeError = 'msg.err.file.type';
  public static draftFileType = 'hcsc';
  public static finalFileType = 'xml';

  constructor() {
  }

}
