import { useRef} from "react";
import Editor from "@monaco-editor/react";

import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import styled from "@emotion/styled";
//import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

loader.config({ monaco });

loader.init().then((monaco) => console.log('here is the monaco instance:', monaco));

const Wrap = styled.div`
  display: flex;
`

export const EditorComponent = () => {
    const editorRef = useRef(null);

    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }


    return (
        <Wrap>

            <Editor
                theme="vs-dark"
                height="90vh"
                defaultLanguage="func"
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
            />

        </Wrap>
    );
};