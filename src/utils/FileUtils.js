import FileSaver from 'file-saver';
import JSZip from 'jszip';

export default class FileUtils {
    static saveTextFile = (strData, fileName) => {
      const blob = new Blob([strData], { type: 'text/plain' });
      this.fileSaver(blob, fileName);
    };

    static saveJsonFileFromString = (strData, fileName) => {
      const blob = new Blob([strData], { type: 'application/json' });
      this.fileSaver(blob, fileName);
    };

    static saveJsonFileFromObject = (object, fileName) => {
      const strData = JSON.stringify(object, null, 2);
      this.saveJsonFileFromString(strData, fileName);
    };

    static getContentLocalFileText(file, callback) {
      const reader = new FileReader();
      reader.onload = (evt) => callback(evt.target.result);
      reader.onerror = () => callback(null);
      reader.readAsText(file);
    }

    static getContentLocalFileJson(file, callback) {
      this.getContentLocalFileText(file, (content) => {
        if (content == null) {
          callback(null);
          return;
        }
        try {
          const json = JSON.parse(content);
          callback(json);
        } catch (e) {
          callback(undefined);
        }
      });
    }

    static createZipFile(files, callback) {
      const zip = new JSZip();
      files.forEach((uploadFile) => {
        zip.file(uploadFile.name, uploadFile);
      });
      zip.generateAsync({ type: 'blob' }).then((blobdata) => {
        const zipblob = new Blob([blobdata]);
        callback(zipblob);
      });
    }

    /*
    static directDownloadFile(blob, filename) {
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      elem.click();
    }
    */

    static fileSaver(blob, filename) {
      FileSaver.saveAs(blob, filename);
    }
}
