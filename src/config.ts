import {Registry} from "monaco-textmate";
import {wireTmGrammars} from "monaco-editor-textmate";
import {loadWASM} from "onigasm";
import {loader} from "@monaco-editor/react";
import ftmLanguage from './ton/ftmLanguage.json';

// @ts-ignore
import NiceMonacoTree from 'nice-monaco-tree';

let loaded = false;

export async function rewireEditor(): Promise<any> {
  if (!loaded) {
    await loadWASM("/onigasm.wasm");
    loaded = true;
  }

  await loader.init().then((monaco) => {
    const registry = new Registry({
      getGrammarDefinition: async (scopeName) => {
        return {
          format: "json",
          content: ftmLanguage
        };
      }
    });
    const grammars = new Map();
    grammars.set("func", "source.func");
    monaco.languages.register({id: "func"});
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    wireTmGrammars(monaco, registry, grammars);

    // hack for monaco tree
    window['expandTree'] = () => {};

    const monacoTree = NiceMonacoTree.init(document.getElementById('tree'), {
      files: ['contract.fc', 'script.ts', 'stdlib.fc'],
      onClick: (file) => {
        console.log(`Select ${file}`);
        window['setFileName'](file);
      },
      onDoubleClick: file => {
        console.log(`Select ${file}`);
        window['setFileName'](file);
      },
    });

    monacoTree.setSelection('contract.fc');
    // monacoTree.setSelection('public/js/ui.js'); // 选中某个文件
    // monacoTree.getSelection(); // 获取当前选中的文件
    // monacoTree.expandAll(); // 递归展开所有文件夹
    // monacoTree.expandFolder('public/js'); // 展开某个文件夹
    // monacoTree.collapseAll(); // 递归收起所有文件夹
    // monacoTree.collapseFolder('public/js'); // 收起某个文件夹
    // monacoTree.getTree(); // 获取底层tree实例，上面挂载了很多方法和事件
  });
}
