import {useEffect} from "react";
import Editor, {useMonaco, loader} from "@monaco-editor/react";
import styled from "@emotion/styled";
//import * as monaco from "monaco-editor";

//loader.config({monaco});

const Wrap = styled.div`
  display: flex;
`

export const EditorComponent = () => {
    const monacoInstance = useMonaco();

    useEffect(() => {
        if (monacoInstance) {
            //  const modelUri = monaco.Uri.parse('a://b/foo.js');
            // const model = monacoInstance.editor.createModel('var x = 7;\nvar y = x;', 'javascript', modelUri);

            // model.onDidChangeMarkers(() => {
            //     const markers = monacoInstance.editor.getModelMarkers({ resource: modelUri });
            //     console.log(markers);
            // });
        }
    }, [monacoInstance]);

    return (
        <Wrap>

            <Editor theme={"vs-dark"}
                    height="100vh"
                    defaultLanguage="javascript" defaultValue="// some comment"/>
        </Wrap>
    );
};