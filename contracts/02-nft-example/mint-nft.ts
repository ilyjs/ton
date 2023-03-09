import {SmartContract} from "func-editor";
import {Address, Builder, CellMessage, CommonMessageInfo, contractAddress, InternalMessage} from "ton";
import {readFileSync} from "fs";

const index = 101;
const collectionAddress = Address.parse('EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz');
const ownerAddress = Address.parse('EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi')

const dataInit = new Builder()
  .storeUint(index, 64)
  .storeAddress(collectionAddress)
  .endCell();

const contract = await SmartContract.fromFuncSource({
    targets: ['nft-item.fc'],
    // Sources
    sources: {
        'stdlib.fc': readFileSync('./02-nft-example/stdlib.fc', 'utf-8'),
        'op-codes.fc': readFileSync('./02-nft-example/op-codes.fc', 'utf-8'),
        'params.fc': readFileSync('./02-nft-example/params.fc', 'utf-8'),
        'nft-item.fc': readFileSync('./02-nft-example/nft-item.fc', 'utf-8'),

    },
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

const response1 = await contract.invokeGetMethod('get_nft_data', []);

const txResult = await contract.sendInternalMessage(
  new InternalMessage({
    from: collectionAddress,
    to: address,
    value: 1,
    bounce: true,
    bounced: false,
    body: new CommonMessageInfo({
      body: new CellMessage(
        new Builder()
          .storeAddress(ownerAddress)
          .storeRef(
            new Builder()
              .storeUint(0x01, 8)
              .storeBuffer(Buffer.from('https://get.ton/nft/101.json', 'ascii'))
              .endCell()
          )
          .endCell()
      ),
    }),
  }),
);

const response2 = await contract.invokeGetMethod('get_nft_data', []);

console.log({
  response1: {
    init: response1.result[0].toNumber()
  },
  txResult: {
    type: txResult.type,
    operation: 'init'
  },
  response2: {
    init: response2.result[0].toNumber(),
    index: response2.result[1].toNumber(),
    collectionAddress: response2.result[2].readAddress().toFriendly(),
    owner_address: response2.result[3].readAddress().toFriendly(),
    content: response2.result[4].bits.buffer.toString('ascii').replace('\x01', '')
  },
});
