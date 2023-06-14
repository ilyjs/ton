import {useEffect, useRef, useState} from "react";
import Editor from "@monaco-editor/react";

import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
 import styled from "@emotion/styled";

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import {observer} from "mobx-react-lite";
import { useStore } from '../../../store';

//import * as monaco from "monaco-editor";




self.MonacoEnvironment = {
    createTrustedTypesPolicy: () => undefined,
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

export const EditorComponent = observer (  () => {
    const {  selectedNode, selectFile,files, setFiles } = useStore().store.fileStore;
    const [typeFile, setTypeFile] = useState('func');

    const getFileExtension = (nameFile: string) => {
        const splitFile = nameFile.split('.');
        return splitFile[splitFile.length - 1];
    };

    const getFileLanguage = (nameFile: string) => {
        const fileType = getFileExtension(nameFile);
        if (fileType === 'ts') return 'typescript';
        else if (fileType === 'fc') return 'func';
        else return 'text';
    };
    useEffect(() => {
        setTypeFile(getFileLanguage(selectFile?.text?? ''))
        console.log("selectFile", selectFile);

    }, [selectFile])

    const editorRef = useRef(null);

    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }


    return (
        <Wrap>

            <Editor
                path={String(selectFile?.id)?? ''}
                value={selectFile?.data?.value?? ''}
                theme="vs-dark"
                height="90vh"
                defaultLanguage="func"
                language={typeFile}
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
            />

        </Wrap>
    );
});