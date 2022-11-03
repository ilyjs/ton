import React, {useEffect, useRef, useState} from "react";
import Editor, {useMonaco} from "@monaco-editor/react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import styled from "styled-components";
import {runCode} from "./tonvm";
// @ts-ignore--next-line
import func from "./tree-sitter-func.wasm";
// @ts-ignore--next-line
import treeSitterCppWasmUrl from "./tree-sitter-cpp.wasm"
import * as Parser from "web-tree-sitter"
import { Theme, Language, MonacoTreeSitter } from "monaco-tree-sitter";

monaco.editor.createModel("", "func",func)
// Theme.load(require("./test.json"));
// let nMonaco = null;
// (async () => {
//     // @ts-ignore--next-line
//     await Parser.init();
//     const language = new Language(require("./grammar.json"));
//     // Load the language's parser library's WASM binary
//     // @ts-ignore--next-line
//
//     await language.init(func, Parser);
//
//     nMonaco = monaco.editor.create(document.body, {
//         value: "int main() { return 0; }",
//         // This "language" property only affects the monaco-editor's built-in syntax highlighter
//         language: "func"
//     });
//     // @ts-ignore--next-line
//     const monacoTreeSitter = new MonacoTreeSitter(Monaco, editor, language);
//
//
// })();

// loader.config({
//     // @ts-ignore--next-line
//
//     monaco
// });
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


Theme.load(require("./test.json"));
const cppCode = `#include <cstdio>
#include <vector>
struct TreeNode {
    TreeNode *leftChild, *rightChild;
    std::vector<double> data;
    int weight;
};
int main() {
    TreeNode root;
    root.leftChild = new TreeNode();
    int a, b;
    scanf("%d %d", &a, &b);
    auto c = a + b;
    return 0 + a - b + c;
}`;

export const EditorFn = () => {
    const [value, setValue] = useState("")
    const editorRef = useRef(null);
    // const monacos = useMonaco();



    async function  handleEditorDidMount(editor: any, monaco: any)  {
        editorRef.current = editor;
    }

    const runCodeHandler = async () => {
        const prewCode = await runCode(editorRef.current.getValue());
        setValue(JSON.stringify(prewCode))
      //console.log( await runCode(editorRef.current.getValue()))
    }

    return <Container>
        <button onClick={()=>runCodeHandler()}>Run</button>  <Wrap>   <Editor

        theme={"vs-dark"}
        height="90vh"
        defaultLanguage="func"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
    />
<Prew>{value}</Prew>
    </Wrap>
    </Container>

}
