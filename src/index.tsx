import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {EditorFn} from "./Editor";
import { rewireEditor } from "./config";

import styled from "styled-components";
const H1 = styled.h1`
  margin: 3px;
`
const App = () => {
    rewireEditor();
   return <> <H1> FunC Editor</H1>
        <EditorFn/>
    </>
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
