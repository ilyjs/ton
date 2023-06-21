import {Terminal} from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import {WebContainer} from "@webcontainer/api";

import 'xterm/css/xterm.css';
import {useEffect, useRef} from "react";

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

export const Term = ({webcontainerInstance }: {webcontainerInstance: WebContainer | undefined}) => {
    const isBooted = useRef(false); // используем useRef чтобы хранить флаг
    async function startShell(terminal: Terminal) {
       if(!webcontainerInstance) return ;
        const shellProcess = await webcontainerInstance.spawn('jsh', {
            terminal: {
                cols: terminal.cols,
                rows: terminal.rows,
            }
        });
        shellProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    terminal.write(data);
                },
            })
        );

        const input = shellProcess.input.getWriter();
        terminal.onData((data) => {
            input.write(data);
        });

        return shellProcess;
    }

    const terminalRef = useRef(null);
    const fitAddon = new FitAddon();
    useEffect(() => {
        if (terminalRef.current && webcontainerInstance && !isBooted.current) {
            isBooted.current = true;
            const terminal = new Terminal();
            terminal.open(terminalRef.current);
           // terminal.writeln('Hello, world!');
            fitAddon.fit();
            console.info("webcontainerInstance 444", webcontainerInstance);
            console.info("webcontainerInstance 2234", webcontainerInstance.mount);
            (async ()  => await webcontainerInstance.mount(files))();
            (async () => {
               const shellProcess = await startShell(terminal);
               window.addEventListener('resize', () => {
                   fitAddon.fit();
                   shellProcess.resize({
                       cols: terminal.cols,
                       rows: terminal.rows,
                   });
               });
            })()


        }
    }, []);


    return <div ref={terminalRef} style={{height: 800}} className="terminal"></div>
}