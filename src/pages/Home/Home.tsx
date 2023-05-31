import NavBar from "../components/NavBar";
import {Main} from "./styles/Main.tsx";
import {WorkSpace} from "./styles/WorkSpace.tsx";
import ActionBar from "../components/ActionBar";
import DialogCreate from "../../components/DialogCreate";
import {useWebcontainers} from "../../hooks";
import FileBrowser from "../../containers/FileBrowser";
import EditorComponent from "../components/Editor";
import styled from "@emotion/styled";

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
  width: 70%;
  height: 100vh;
  left: 30%;
  position: absolute;
  margin-top: 48px;
`;

export function Home() {
    const webcontainerInstance = useWebcontainers();
    console.log("webcontainerInstance", webcontainerInstance);

    return (
        <Main>
            <NavBar/>
            <WorkSpace>
                <ActionBar/>
            </WorkSpace>
            <LeftPanel>
                <FileBrowser/>
            </LeftPanel>
            <Editor>
                <EditorComponent/>
            </Editor>
            <DialogCreate webcontainerInstance={webcontainerInstance} />
        </Main>
    );
}