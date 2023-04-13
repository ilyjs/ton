import { writeFileSync, mkdirSync, fs, vol } from 'memfs';
import { filesJSON } from '../files';

export const initFile = (files: any, paths: string[]) => {
  for (const path of paths) {
    mkdirSync(path);
  }

  for (const filePath in files) {
    writeFileSync(filePath, files[filePath].value);
  }
};

export const initFile2 = (filesJSON: any, path?: string) => {
  vol.fromJSON(filesJSON);

};

export const initFile3 = (files: any) => {
  let jsonFiles: { [key: string]: string } = {};
  for (let file of files) {
    if (file.data && file.data.hasOwnProperty('path') && file.data.hasOwnProperty('value')) {
      jsonFiles[file.data.path] = file.data.value;
    }
    vol.reset();
    console.log("jsonFiles",jsonFiles)
    vol.fromJSON(jsonFiles);
  }

};

export const deleteFile = (path: string) => {
  console.log(vol.toJSON());
  vol.unlink(path, (err) => {
    if (err) {
      console.error(err);
      console.log(vol.toJSON());
      return;
    }
    console.log('Файл удален');
  });
};

export const writeFile = (path: string, value: string) => {
  writeFileSync(path, value);
};