import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { loadWASM } from "onigasm";
import { loader } from "@monaco-editor/react";


let loaded = false;

export async function rewireEditor(): Promise<any> {
    if (!loaded) {
        await loadWASM("/onigasm.wasm");
        loaded = true;
    }

    await loader.init().then((monaco) => {
        const registery = new Registry({
            getGrammarDefinition: async (scopeName) => {
                return {
                    format: "json",
                    content: await (await fetch("./ftmLanguage.json")).text()
                };
            }
        });
        const grammars = new Map();
        grammars.set("func", "source.func");
        monaco.languages.register({ id: "func" });
        wireTmGrammars(monaco, registery, grammars);
    });
}
