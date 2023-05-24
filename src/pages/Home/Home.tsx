import NavBar from "../components/NavBar";
import {Main} from "./styles/Main.tsx";
import {WorkSpace} from "./styles/WorkSpace.tsx";
import ActionBar from "../components/ActionBar";
import DialogCreate from "../../components/DialogCreate";
import {useWebcontainers} from "../../hooks";

export function Home() {
    const webcontainerInstance = useWebcontainers();
    console.log("webcontainerInstance", webcontainerInstance);

    return (
        <Main>
            <NavBar/>
            <WorkSpace>
                <ActionBar/>
            </WorkSpace>
            <DialogCreate webcontainerInstance={webcontainerInstance} />
        </Main>
    );
}