import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { loadWASM } from 'onigasm';
import { loader } from '@monaco-editor/react';
import ftmLanguage from './ton/ftmLanguage.json';
// @ts-ignore
import NiceMonacoTree from 'nice-monaco-tree';

let loaded = false;

export async function rewireEditor(): Promise<any> {
  if (!loaded) {
    await loadWASM('/onigasm.wasm');
    loaded = true;
  }

  await loader.init().then((monaco) => {
    const registry = new Registry({
      getGrammarDefinition: async (scopeName) => {
        return {
          format: 'json',
          content: ftmLanguage,
        };
      },
    });
    const grammars = new Map();
    grammars.set('func', 'source.func');
    monaco.languages.register({ id: 'func' });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    wireTmGrammars(monaco, registry, grammars);
  });
}
