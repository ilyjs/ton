import React, {useEffect, useRef, useState} from "react";
import Editor, {loader} from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {runCode} from "../ton/executor/tonvm";

import ReactJson from 'react-json-view'
import files from "../files";
import {writeFileSync, mkdirSync} from 'memfs';
import {runTs} from "../utils/runTs";
import {Preview, Wrap} from "../styles/Editor";

window['fileName'] = "./01-simple-example/contract.fc";

mkdirSync('./01-simple-example');
mkdirSync('./02-nft-example');

for (const filePath in files) {
    writeFileSync(filePath, files[filePath].value);
}

loader.config({monaco});

export const EditorFn = () => {
    const [value, setValue] = useState({});
    const [fileName, setFileName] = useState("./01-simple-example/contract.fc");

    // hack for changing file from tree
    window['setFileName'] = (value) => {
        window['fileName'] = value;
        setFileName(value);
    }

    const editorRef = useRef(null);
    useEffect(() => {
        editorRef.current?.focus();
    }, [files[window['fileName']].name]);
    console.log(files[window['fileName']].name)

    function handleEditorChange(value: any) {
        writeFileSync(`./${window['fileName']}`, value);
    }

    async function handleEditorDidMount(editor: any) {
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
                        await runTs(editorRef.current.getValue(), setValue);
                    }
                }

                await runCodeHandler();
            }
        });
    }, []);

    return <Wrap>
        <Editor
            theme={"vs-dark"}
            height="100vh"
            path={files[window['fileName']].name}
            defaultLanguage={files[window['fileName']].language}
            defaultValue={files[window['fileName']].value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
        />
        <Preview>
            <ReactJson src={value} theme={'twilight'}></ReactJson>
        </Preview>
    </Wrap>

}
