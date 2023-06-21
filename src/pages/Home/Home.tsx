import {memo} from "react";
import NavBar from "../components/NavBar";
import {Main} from "./styles/Main.tsx";
import {WorkSpace} from "./styles/WorkSpace.tsx";
import ActionBar from "../components/ActionBar";
import DialogCreate from "../../components/DialogCreate";
import {useWebcontainers} from "../../hooks";
import FileBrowser from "../../containers/FileBrowser";
import EditorComponent from "../components/Editor";
import {rewireEditor} from "../../configEditor/config.ts"
import styled from "@emotion/styled";
import {Preview} from "./styles/Preview.ts";
import Terminal from "./terminal";
//import {WebContainer} from "@webcontainer/api";

const LeftPanel = styled.div`
  display: inline-block;
  width: 30%;
  height: 100vh;
  position: absolute;
  margin-top: 48px;
  margin-left: 12px;
  background: #222;
`;

const Editor = styled.div`
  display: inline-block;
  width: 50%;
  height: 100vh;
  left: 30%;
  position: absolute;
  margin-top: 48px;
`;

export const Home = memo(() => {
    rewireEditor();
    const webcontainerInstance = useWebcontainers();

    const files = {
        'package.json': {
            file: {
                contents: `
        {
          "name": "vite-starter",
          "private": true,
          "version": "0.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          "devDependencies": {
            "vite": "^4.0.4"
          }
        }`,
            },
        },
    };





    return (
        <Main>
            <NavBar/>
            <WorkSpace>
                <ActionBar/>
            </WorkSpace>
            <LeftPanel >
                <FileBrowser webcontainerInstance={webcontainerInstance} />
            </LeftPanel>
            <Editor>
                <EditorComponent/>
            </Editor>
            <Preview>
                {
                    webcontainerInstance? <Terminal webcontainerInstance={webcontainerInstance} /> : ''
                }
            </Preview>
            <DialogCreate webcontainerInstance={webcontainerInstance}/>
        </Main>
    );
})