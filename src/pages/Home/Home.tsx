import NavBar from "../components/NavBar";
import {Main} from "./styles/Main.tsx";
import {WorkSpace} from "./styles/WorkSpace.tsx";
import ActionBar from "../components/ActionBar";

export function Home() {
    return (
        <Main>
            <NavBar/>
            <WorkSpace>
               <ActionBar/>
            </WorkSpace>

        </Main>
    );
}