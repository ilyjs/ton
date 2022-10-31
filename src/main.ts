import { Builder, Cell } from 'ton';
import { compileFunc } from 'ton-compiler/dist/wasm';
import { SmartContract } from 'ton-contract-executor';

(async () => {
  const result = await compileFunc({
    entryPoints: ['./src/stdlib.fc', './src/contract.fc'],
  });
  // @ts-ignore:next-line
  // const codeBoc = result['codeBoc'];
  // const codeCell = Cell.fromBoc(Buffer.from(codeBoc, 'base64'))[0];
  // const dataCell = new Builder().storeUint(24, 64).endCell();
  // const contract = await SmartContract.fromCell(codeCell, dataCell, {
  //   debug: true,
  // });
  //
  // const response = await contract.invokeGetMethod('get_total', []);
  // const counter = response.result[0].toString();
  //
  // console.log({ counter });
})();
