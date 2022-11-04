import {rewireEditor} from "../config";
import {EditorFn} from "./Editor";
import React from "react";

export const App = () => {
  rewireEditor();

  return <>
    <EditorFn/>
  </>
};
