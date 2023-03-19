import contract01_script_raw from '!!raw-loader!../contracts/01-simple-example/script.ts';
import contract01_contract_raw from '!!raw-loader!../contracts/01-simple-example/contract.fc';
import contract01_stdlib_raw from '!!raw-loader!../contracts/01-simple-example/stdlib.fc';

import contract02_mintNft_raw from '!!raw-loader!../contracts/02-nft-example/mint-nft.ts';
import contract02_nftCollection_raw from '!!raw-loader!../contracts/02-nft-example/nft-collection.fc';
import contract02_nftCollectionEditable_raw from '!!raw-loader!../contracts/02-nft-example/nft-collection-editable.fc';
import contract02_nftItem_raw from '!!raw-loader!../contracts/02-nft-example/nft-item.fc';
import contract02_nftItemEditableDRAFT_raw from '!!raw-loader!../contracts/02-nft-example/nft-item-editable-DRAFT.fc';
import contract02_nftMarketplace_raw from '!!raw-loader!../contracts/02-nft-example/nft-marketplace.fc';
import contract02_nftSale_raw from '!!raw-loader!../contracts/02-nft-example/nft-sale.fc';
import contract02_opCodes_raw from '!!raw-loader!../contracts/02-nft-example/op-codes.fc';
import contract02_parAms_raw from '!!raw-loader!../contracts/02-nft-example/params.fc';
import contract02_stdlib_raw from '!!raw-loader!../contracts/02-nft-example/stdlib.fc';

const newFiles = [
  {
    'id': 1,
    'parent': 0,
    'droppable': true,
    'text': '01-simple-example',
  },
  {
    'id': 2,
    'parent': 1,
    'droppable': false,
    'text': 'script.ts',
    'data': {
      "path": './01-simple-example/script.ts',
      'fileType': 'ts',
      'value': contract01_script_raw,
      'language': 'typescript',
    },
  },
  {
    'id': 3,
    'parent': 1,
    'droppable': false,
    'text': 'contract.fc',
    'data': {
      "path": './01-simple-example/contract.fc',
      'fileType': 'func',
      'value': contract01_contract_raw,
      'language': 'func',
    },
  },
  {
    'id': 4,
    'parent': 1,
    'droppable': false,
    'text': 'stdlib.fc',
    'data': {
      "path": './01-simple-example/stdlib.fc',
      'fileType': 'func',
      'value': contract01_stdlib_raw,
      'language': 'func',
    },
  },
];



const files = {


  './01-simple-example/stdlib.fc': {
    name: 'stdlib.fc',
    language: 'func',
    value: contract01_stdlib_raw,
  },

  './02-nft-example/mint-nft.ts': {
    name: 'mint-nft.ts',
    language: 'typescript',
    value: contract02_mintNft_raw,
  },
  './02-nft-example/nft-collection.fc': {
    name: 'nft-collection.fc',
    language: 'func',
    value: contract02_nftCollection_raw,
  },
  './02-nft-example/nft-collection-editable.fc': {
    name: 'nft-collection-editable.fc',
    language: 'func',
    value: contract02_nftCollectionEditable_raw,
  },
  './02-nft-example/nft-item.fc': {
    name: 'nft-item.fc',
    language: 'func',
    value: contract02_nftItem_raw,
  },
  './02-nft-example/nft-item-editable-DRAFT.fc': {
    name: 'nft-item-editable-DRAFT.fc',
    language: 'func',
    value: contract02_nftItemEditableDRAFT_raw,
  },
  './02-nft-example/nft-marketplace.fc': {
    name: 'nft-marketplace.fc',
    language: 'func',
    value: contract02_nftMarketplace_raw,
  },
  './02-nft-example/nft-sale.fc': {
    name: 'nft-sale.fc',
    language: 'func',
    value: contract02_nftSale_raw,
  },
  './02-nft-example/op-codes.fc': {
    name: 'op-codes.fc',
    language: 'func',
    value: contract02_opCodes_raw,
  },
  './02-nft-example/params.fc': {
    name: 'params.fc',
    language: 'func',
    value: contract02_parAms_raw,
  },
  './02-nft-example/stdlib.fc': {
    name: 'stdlib.fc',
    language: 'func',
    value: contract02_stdlib_raw,
  },
};


export default newFiles;
