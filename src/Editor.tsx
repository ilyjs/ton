import React, {useRef, useState} from "react";
import Editor from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styled from "styled-components";
import {runCode} from "./tonvm";

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

loader.config({
    monaco
});


export const EditorFn = () => {
    const [value, setValue] = useState("")
    const editorRef = useRef(null);

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    const runCodeHandler = async () => {
        const prewCode = await runCode(editorRef.current.getValue());
        setValue(JSON.stringify(prewCode))
      console.log( await runCode(editorRef.current.getValue()))
    }

    return <Container> <button onClick={()=>runCodeHandler()}>Run</button>  <Wrap>   <Editor
        theme={"vs-dark"}
        height="90vh"
        defaultLanguage="text"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
    />
<Prew>{value}</Prew>
    </Wrap>
    </Container>

}