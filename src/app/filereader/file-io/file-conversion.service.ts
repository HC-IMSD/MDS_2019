import {Injectable} from '@angular/core';
// import * as xml2js from 'xml2js';
import {ConvertResults} from './convert-results';
import {FileIoGlobalsService} from './file-io-globals.service';
import * as FileSaver from 'file-saver';

declare var X2JS: any;


@Injectable()
export class FileConversionService {

  constructor() {
  }

  /***
   * Converts an incoming json string to a json object
   * @param data -the json string to convert
   * @param convertResult -the json object to store the data in
   */
  convertToJSONObjects(data, convertResult: ConvertResults) {
    convertResult.messages = [];
    try {
      convertResult.data = JSON.parse(data);
      convertResult.messages.push(FileIoGlobalsService.importSuccess);
    } catch (e) {
      convertResult.data = null;
      convertResult.messages.push(FileIoGlobalsService.jsonParseFail);
    }
  }

  /***
   *  Using xml2js to do the coversion from JSON to XML
   * @param data
   * @param convertResult
   */
  convertXMLToJSONObjects(data, convertResult: ConvertResults) {

    let xmlConfig = {
      escapeMode: true,
      emptyNodeForm: 'text',
      useDoubleQuotes: true
    };
    let jsonConverter = new X2JS(xmlConfig);
    convertResult.messages = [];
    // converts XML as a string to a json
    convertResult.data = jsonConverter.xml_str2json(data);
    return (null);

    /* //see https://www.npmjs.com/package/xml2js for list of options
     let config = {
       attrkey: FileIoGlobalsService.attributeKey, //when there are attributes, this is the key, default $
       charkey: FileIoGlobalsService.innerTextKey, //when there are attributes, this what hte text value is of the tag
       trim: true,
       explicitArray: false, //Makes all the values an array
     };
     convertResult.messages = [];
     xml2js.parseString(data, config, function (err, result) {
       convertResult.data = result;
     });
     if (convertResult.data === null) {
       convertResult.messages.push(FileIoGlobalsService.parseFail);
     } else {
       convertResult.messages.push(FileIoGlobalsService.importSuccess);
       // console.log(convertResult);
     }*/
  }

  /***
   * Converts a json object to XML. Assumes root tag is root of JSON object
   * @param jsonObj
   * @returns {any}
   */
  convertJSONObjectsToXML(jsonObj) {
    if (!jsonObj) return null;
   /* let builder = new xml2js.Builder({
      headless: true,    //make headless for easier addition of xsl. Add header manualt
      attrkey: FileIoGlobalsService.attributeKey, //when there are attributes, this is the key, default $
      charkey: FileIoGlobalsService.innerTextKey, //when there are attributes, this what hte text value is of the tag
      explicitArray: false,
      explicitChildren: true
    });
    //making headless so easier to add the stylesheet info
    let xmlResult = builder.buildObject(jsonObj);*/
    let xmlConfig = {
      escapeMode: true,
      emptyNodeForm: 'text',
      useDoubleQuotes: true
    };
    let jsonConverter = new X2JS(xmlConfig);
    // converts XML as a string to a json
    let xmlResult = jsonConverter.json2xml_str(jsonObj);
    return xmlResult;
  }

  //let blob = new Blob([makeStrSave], {type: 'text/plain;charset=utf-8'});
  public saveJsonToFile(jsonObj, fileName: string, rootTag: string) {
    if (!jsonObj) return;
    let makeStrSave = JSON.stringify(jsonObj);
    let blob = new Blob([makeStrSave], {type: 'text/plain;charset=utf-8'});
    if (!fileName) {
      fileName = 'REPDraft.' + FileIoGlobalsService.draftFileType;
    } else {
      fileName += '.' + FileIoGlobalsService.draftFileType;
    }
    FileSaver.saveAs(blob, fileName);
  }

  /**
   * Saves the incoming JSON data as an xml file
   * @param jsonObj -the json object to write as XML
   * @param {string} fileName - the bsse filename to save the file as. the suffix is sdded
   * @param {boolean} addXsl
   * @param {string} xslName
   */
  public saveXmlToFile(jsonObj, fileName: string, addXsl: boolean = true, xslName: string = null) {
    if (!jsonObj) return;
    let xmlResult = this.convertJSONObjectsToXML(jsonObj);

    if (addXsl) {
      if (!xslName) {
        xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' + '<?xml-stylesheet  type="text/xsl" href=' + FileIoGlobalsService.defaultXSLName + '?>' + xmlResult;
      } else {
        xmlResult = '<?xml version="1.0" encoding="UTF-8"?>' + '<?xml-stylesheet  type="text/xsl" href="' + xslName + '"?>' + xmlResult;
      }
    }
    let blob = new Blob([xmlResult], {type: 'text/plain;charset=utf-8'});
    if (!fileName) {
      fileName = 'REPFinal.' + FileIoGlobalsService.finalFileType;
    } else {
      fileName += '.' + FileIoGlobalsService.finalFileType;
    }
    FileSaver.saveAs(blob, fileName);
  }
}
