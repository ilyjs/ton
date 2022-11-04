import scriptRaw from '!!raw-loader!../contracts/01-simple-example/script.ts';
import contractRaw from '!!raw-loader!../contracts/01-simple-example/contract.fc';
import stdlibRaw from '!!raw-loader!../contracts/01-simple-example/stdlib.fc';

const files = {
  "script.ts": {
    name: "script.ts",
    language: "typescript",
    value: scriptRaw
  },
  "contract.fc": {
    name: "contract.fc",
    language: "func",
    value: contractRaw
  },
  "stdlib.fc": {
    name: "stdlib.fc",
    language: "func",
    value: stdlibRaw
  },
} as const;

export default files;
