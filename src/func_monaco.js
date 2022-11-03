import Parser from "web-tree-sitter";
import {Language, Theme} from "monaco-tree-sitter";
import func from "./tree-sitter-func.wasm";
import * as monaco from "monaco-editor";

Theme.load(require("./test.json"));
monaco.languages.register()
let nMonaco = null;
(async () => {

    await Parser.init();
    console.log(1)
    const language = new Language(require("./grammar.json"));
    // Load the language's parser library's WASM binary
    // @ts-ignore--next-line

    await language.init(func, Parser);

    nMonaco = monaco.editor.create(document.body, {
        value: "int main() { return 0; }",
        // This "language" property only affects the monaco-editor's built-in syntax highlighter
        language: "func"
    });

    return nMonaco
})()
console.log(2)
export const monFC =  nMonaco;
