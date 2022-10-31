import React from "react";
import ReactDOM from "react-dom";
import {EditorFn} from "./Editor";
import styled from "styled-components";
const H1 = styled.h1`
  margin: 3px;
`
const App = () => (
   <> <H1> FunC Editor</H1>
       <EditorFn/>
   </>
);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
