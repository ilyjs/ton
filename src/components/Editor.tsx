import React, {useEffect, useRef, useState} from "react";
import compile from 'ts-browser-eval'
import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styled from "styled-components";
import {runCode} from "../ton/executor/tonvm";
import {
  Address,
  Builder as Builder_,
  Cell as Cell_,
  CellMessage,
  CommonMessageInfo,
  contractAddress,
  InternalMessage
} from 'ton';
import {compileFunc} from 'ton-compiler/dist/wasm';
import {crc16 as crc16_} from "ton-contract-executor/dist/utils/crc16"
import ReactJson from 'react-json-view'
import files from "../files";
import {SmartContract} from "../ton/SmartContract";
import {readFileSync, writeFileSync, mkdirSync} from 'memfs';

const vmExec = require("ton-contract-executor/dist/vm-exec/vm-exec");

var Builder = Builder_;
var Cell = Cell_;
var runCodeFC = runCode;
var crc16 = crc16_;
var vmExec_1 = vmExec;
var Buffer_ = Buffer;
window['fileName'] = "./01-simple-example/contract.fc";
var contractCode = window['fileName'].value;

mkdirSync('./01-simple-example');
mkdirSync('./02-nft-example');

for (const filePath in files) {
  writeFileSync(filePath, files[filePath].value);
}

const Wrap = styled.div`
  display: flex;
`

const Container = styled.div``
const Prew = styled.div`
  background: #181818;
  width: 50vw;
  height: 100vh;
  word-break: break-word;
  padding: 5px;
  box-sizing: border-box;
  color: whitesmoke;
  overflow-y: auto;
`
loader.config({monaco});

let patched = false;

export const EditorFn = () => {
  const [value, setValue] = useState({});
  const [fileName, setFileName] = useState("./01-simple-example/contract.fc");

  // hack for changing file from tree
  window['setFileName'] = (value) => {
    window['fileName'] = value;
    setFileName(value);
  }

  const editorRef = useRef(null);
  const [funcCode, setFuncCode] = useState("");
  const [jsCode, setJsCode] = useState("")
  useEffect(() => {
    editorRef.current?.focus();
    //console.log(editorRef.current.getValue())
  }, [files[window['fileName']].name]);
  console.log(files[window['fileName']].name)

  function handleEditorChange(value: any, event: any) {
    writeFileSync(`./${window['fileName']}`, value);

    if (files[window['fileName']].language === "func") {
      setFuncCode(value);
      contractCode = value;
    }

    if (files[window['fileName']].language === "javascript") {
      setFuncCode(value)
    }
  }

  const runTs = async (code: any) => {
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

        console.log(code);

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

  async function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  useEffect(() => {
    window.addEventListener("keydown", async (ev) => {
      if (ev.shiftKey && ev.key === 'Enter') {
        ev.preventDefault();
        ev.stopPropagation();

        const runCodeHandler = async () => {
          console.log(fileName, files[window['fileName']]);
          if (files[window['fileName']].language === "func") {
            const prewCode = await runCode(editorRef.current.getValue());
            setValue(prewCode);
          }

          if (files[window['fileName']].language === "typescript") {
            await runTs(editorRef.current.getValue());
          }
        }

        await runCodeHandler();
      }
    });
  }, []);

  return <Container>
    <Wrap>
      <Editor
        theme={"vs-dark"}
        height="100vh"
        path={files[window['fileName']].name}
        defaultLanguage={files[window['fileName']].language}
        defaultValue={files[window['fileName']].value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
      <Prew>
        <ReactJson src={value} theme={'twilight'}></ReactJson>
      </Prew>
    </Wrap>
  </Container>

}
