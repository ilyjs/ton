import compile from "ts-browser-eval";
import {SmartContract} from "../ton/SmartContract";
import {
    Address,
    Builder as Builder_,
    Cell as Cell_,
    CellMessage,
    CommonMessageInfo,
    contractAddress,
    InternalMessage
} from 'ton';
import {readFileSync } from "memfs";
import {compileFunc} from '@ton-community/func-js';

var Builder = Builder_;
var Cell = Cell_;
export const runTs = async (code: any, setValue: (object: object) => void) => {
    const project = {
        'main.ts': code,
    };

    // @ts-ignore
    const result = await compile(project, 'main.ts', {
        target: 'ES2017',
    }, {
        format: 'es',
        name: 'bundle',
    });
    console.log(result);

    await (async function (Builder, SmartContract, Cell, InternalMessage, CommonMessageInfo, CellMessage, Buffer, readFileSync, contractAddress, compileFunc, Address) {
        try {
            var console = {
                log(...args) {
                    window.console.log(...args);

                    setValue(args[0]);
                }
            };

            const code = result[0].code.replace(/^import {.*$/gmi, '').replace(/^\n+/, '');

            eval(`
            (async () => {
                try {
                    ${code}
                } catch (e) {
                    setValue({ error: e.message, stack: e.stack });
                }
            })();
        `);
            // @ts-ignore
        } catch (e: Error) {
            setValue({ error: e.message, stack: e.stack });
        }
    })(Builder, SmartContract, Cell, InternalMessage, CommonMessageInfo, CellMessage, Buffer, readFileSync, contractAddress, compileFunc, Address);
}