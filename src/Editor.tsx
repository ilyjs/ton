import React, {useEffect, useRef, useState} from "react";
//import {transpile}  from "typescript";
import compile from 'ts-browser-eval'
import Editor, {useMonaco} from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import  * as monaco from "monaco-editor";
import styled from "styled-components";
import {runCode} from "./tonvm";
import { Builder as Builder_, Cell as Cell_} from 'ton';
import {compileFunc as  compileFunc_, SourcesMap} from 'ton-compiler/dist/wasm';
import { SmartContract, runTVM, TVMStack,TVMStackEntryTuple, } from 'ton-contract-executor';
import  {crc16 as crc16_} from "ton-contract-executor/dist/utils/crc16"
const vmExec = require("ton-contract-executor/dist/vm-exec/vm-exec");

import files from "./files";

var Builder = Builder_;
var Cell = Cell_;
var compileFunc = compileFunc_;
var runCodeFC = runCode;
var crc16 = crc16_;
var vmExec_1 = vmExec;
var Buffer_ = Buffer;
var contractCode = files["contract.fc"].value;
const Wrap = styled.div`
display: flex;
`

const Container = styled.div``
const Prew = styled.div`
background: black;
  width: 50vh;
  height: 90vh;
  word-break: break-word;
  padding: 5px;
  box-sizing: border-box;
  color: whitesmoke;
  overflow-y: auto;
  
`
loader.config({ monaco });



export const EditorFn = () => {
    const [value, setValue] = useState("");
    const [fileName, setFileName] = useState("contract.fc");
    const file = files[fileName];
    const editorRef = useRef(null);
    const [funcCode, setFuncCode ] = useState("");
    const [jsCode, setJsCode] = useState("")
    useEffect(() => {
        editorRef.current?.focus();
        //console.log(editorRef.current.getValue())
    }, [file.name]);
    console.log(file.name)
    function handleEditorChange(value: any, event: any) {
        if(file.language === "func") {
            setFuncCode(value);
            contractCode = value;
        }
        if(file.language === "javascript") setFuncCode(value)

        // setFiles({...files, [fileName]: value});
    }
    var toPreview = (code: any)  => {
        setValue(JSON.stringify(code));
    }

    const runTs = async (code: any) =>  {
        const project = {
            'main.ts': code,
        };

        // @ts-ignore
        const result = await compile(project, 'main.ts', {
            target: 'ES2017',
        }, {
            format: 'iife',
            name: 'bundle',
        });
        console.log(result);
        eval(result[0].code)
    }
    async function  handleEditorDidMount(editor: any, monaco: any)  {
        editorRef.current = editor;
    }

    const runCodeHandler = async () => {
        if(file.language === "func") {
            const prewCode = await runCode(editorRef.current.getValue());
            setValue(JSON.stringify(prewCode));
        }
        if(file.language === "typescript") {
          await  runTs(editorRef.current.getValue());
        }
      //console.log( await runCode(editorRef.current.getValue()))
    }

    return <Container>
        <button onClick={()=>runCodeHandler()}>Run</button>
        <button
            disabled={fileName === "contract.fc"}
            onClick={() => setFileName("contract.fc")}
        >
            contract.fc
        </button>
        <button
            disabled={fileName === "script.ts"}
            onClick={() => setFileName("script.ts")}
        >
            script.ts
        </button>



        <Wrap>   <Editor

        theme={"vs-dark"}
        height="90vh"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
    />
<Prew>{value}</Prew>
    </Wrap>
    </Container>

}
