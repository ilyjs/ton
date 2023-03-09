import {rewireEditor} from "../config";
import {EditorFn} from "./Editor";
import React from "react";

export const App = () => {
  rewireEditor();

  return <>
    <h3 style={{paddingLeft: 15, color: " #fff"}}>FunC Editor <small style={{color: "#aaa"}}>press [shift+enter] to run the code</small></h3>
    <div style={{display: "inline-block", width: "15%", height: "100vh", "position": "absolute"}}>

      <div style={{width: "100%", height: "calc(100vh - 4em)"}} id="tree"></div>
    </div>
    <div style={{display: "inline-block", width: "85%", height: "100vh", left: "15%", position: "absolute"}}>

    <EditorFn/>
    </div>
  </>
};
