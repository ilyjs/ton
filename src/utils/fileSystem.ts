import {writeFileSync, mkdirSync} from 'memfs';

export const initFile = (files: any, paths: string[]) => {
  for (const path of paths) {
    mkdirSync(path);
  }

  for (const filePath in files) {
    writeFileSync(filePath, files[filePath].value);
  }
}

export const writeFile = (path: string, value: string) => {
  writeFileSync(path, value);
}