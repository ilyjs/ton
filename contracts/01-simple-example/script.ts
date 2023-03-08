import {SmartContract} from "func-editor";
import {Address, Builder, CellMessage, CommonMessageInfo, contractAddress, InternalMessage} from "ton";
import {readFileSync} from "fs";

const dataInit = new Builder()
  .storeUint(0x10, 64)
  .endCell();

const contract = await SmartContract.fromFuncSource({
    targets: ['contract.fc'],
    // Sources
    sources: {
        'stdlib.fc': readFileSync('./01-simple-example/stdlib.fc', 'utf-8'),
        'contract.fc': readFileSync('./01-simple-example/contract.fc', 'utf-8'),
    }
}, dataInit, {
  debug: true
});

const address = contractAddress({
  workchain: 0,
  initialData: contract.dataCell,
  initialCode: contract.codeCell,
});

contract.setC7Config({
  myself: address,
});

const response1 = await contract.invokeGetMethod('get_total', []);

const myAddress = Address.parse('EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz');
const txResult = await contract.sendInternalMessage(
  new InternalMessage({
    from: myAddress,
    to: address,
    value: 1,
    bounce: true,
    bounced: false,
    body: new CommonMessageInfo({
      body: new CellMessage(
        new Builder()
          .storeUint(0x10, 32)
          .endCell()
      ),
    }),
  }),
);

const response2 = await contract.invokeGetMethod('get_total', []);

console.log({
  response1: { get_total: response1.result[0].toNumber() },
  txResult: { type: txResult.type, actions: txResult.actionList },
  response2: { get_total: response2.result[0].toNumber() }
});
