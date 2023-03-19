import React, {useEffect, useRef, useState} from "react";
import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {runCode} from "../ton/executor/tonvm";

import ReactJson from 'react-json-view'
import files from "../files";
import {writeFileSync, mkdirSync} from 'memfs';
import {runTs} from "../utils/runTs";
import {Preview, Wrap} from "../styles/Editor";
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';

window['fileName'] = "./01-simple-example/contract.fc";

mkdirSync('./01-simple-example');
mkdirSync('./02-nft-example');

for (const filePath in files) {
    writeFileSync(filePath, files[filePath].value);
}

loader.config({monaco});

export const EditorFn =  observer(() => {
    const [value, setValue] = useState({});
    const [fileName, setFileName] = useState("./01-simple-example/contract.fc");
    const {  selectedNode, selectFile } = useStore().store.fileStore;

    console.log("files", files)

    // hack for changing file from tree
    window['setFileName'] = (value) => {
        window['fileName'] = value;
        setFileName(value);
    }

    const editorRef = useRef(null);
    useEffect(() => {
        editorRef.current?.focus();
    }, [files[window['fileName']].name]);

    function handleEditorChange(value: any) {
        writeFileSync(`./${window['fileName']}`, value);
    }

    async function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }

    const handleKeyDown = async (ev: KeyboardEvent) => {
        if (ev.shiftKey && ev.key === 'Enter') {
            ev.preventDefault();
            ev.stopPropagation();

            const runCodeHandler = async () => {
                console.log("selectFile", selectFile);
                if (selectFile && selectFile.data?.language === "func") {
                    console.log(11111);
                    console.log("selectFile 11111", selectFile);
                    console.log("editorRef.current.getValue()", editorRef.current.getValue())
                    const prewCode = await runCode(editorRef.current.getValue());
                    setValue(prewCode);
                }

                if (selectFile && selectFile.data?.language === "typescript") {
                    await runTs(editorRef.current.getValue(), setValue);
                }
            }

            await runCodeHandler();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keyup", handleKeyDown);

    }, [selectFile]);



    return <Wrap>
        {selectFile && selectFile.data?
          <Editor
            theme={"vs-dark"}
            height="100vh"
            path={selectFile.data?.path}
            defaultLanguage={selectFile.data?.language}
            defaultValue={selectFile.data?.value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          /> : <div style={{width: 525, backgroundColor: '#1e1e1e'}}></div>
        }
        <Preview>
            <ReactJson src={value} theme={'twilight'}></ReactJson>
        </Preview>
    </Wrap>

})
