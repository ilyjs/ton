import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {FormControl, MenuItem} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import {WebContainer} from '@webcontainer/api';
import path from "path-browserify";
import {useStore} from "../../store";
import {observer} from "mobx-react-lite";
import CircularProgress from '@mui/material/CircularProgress';

interface IProps {
    webcontainerInstance: WebContainer | undefined
}

interface INode {
    id: number | string,
    parent: number | string,
    text: string,
    droppable: boolean,
    data: {
        type: string,
        value: string
    }
}

export const DialogCreate = observer ( function DialogCreate   ({webcontainerInstance}: IProps) {
    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [projectName, setProjectName] = React.useState("");
    const [contractName, setContractName] = React.useState("");
    const [projectTemplate, setProjectTemplate] = React.useState("");

    const {
        setFiles,
    } = useStore().store.fileStore;

    function readDirectory(dirPath: string) {
        return new Promise((resolve, reject) => {
            if(!webcontainerInstance) return;

            webcontainerInstance.fs.readdir(dirPath, { withFileTypes: true }  )
                .then((dirents) => resolve(dirents))
                .catch((error) => reject(error))


        })

    }

    async function createTree(rootPath: string, exclude: string[] = []) {
        const tree: any[] = [];
        const idPathMap: any = {};
        let id = 0;

        async function traverseDirectory(dirPath: string, parentId = 0) {
            const dirents: any = await readDirectory(dirPath);
            if (!webcontainerInstance) return;
            for (const dirent of dirents) {
                if (exclude.includes(dirent.name)) {
                    continue;
                }

                const fullPath = path.join(dirPath, dirent.name);
                idPathMap[fullPath] = id++;
                let node: INode = {
                    id: id,
                    parent: parentId,
                    text: dirent.name,
                    droppable: false,
                    data: {
                        type: 'any',
                        value: ''
                    }
                };

                if (dirent.isFile()) {
                    node = {
                        ...node,
                        droppable: false,
                        data: {
                            ...node.data, type: 'file', value: await webcontainerInstance.fs.readFile(fullPath, 'utf-8')
                        }
                    };
                } else if (dirent.isDirectory()) {
                    node = {
                        ...node,
                        droppable: true,
                        data: {
                            ...node.data,
                            value: '',
                            type: 'directory',
                        }
                    };
                    await traverseDirectory(fullPath, id);
                }

                tree.push(node);


            }
        }

        await traverseDirectory(rootPath);
        return tree;
    }


    const fileSystemTreeCreate = async () => {
        if(webcontainerInstance) {
            const excludeItems = ['node_modules', '.gitignore', '.prettierignore', '.prettierrc', 'package-lock.json'];
            createTree( '/', excludeItems)
                .then(tree => {

                    console.log(JSON.stringify(tree, null, 2));
                    setFiles(tree);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        }
    }
    const createTon = async () => {
        if(webcontainerInstance) {
            const installProcess = await webcontainerInstance.spawn('npm', ['create', 'ton@latest', projectName]);
            const input2 = installProcess.input.getWriter();

            await installProcess.output.pipeTo( new WritableStream({

                write(data) {
                    if (data == `\x1B[43C`) {
                        input2.write(`${contractName}\n`);

                    }
                    if (data == `\x1B[35C`) {
                        input2.write(projectTemplate);

                    }

                    if(data.includes(`For help and docs visit https://github.com/ton-community/blueprint`)){
                        fileSystemTreeCreate();
                        console.log("Lotor");
                        setOpen(false);
                        setLoading(false);
                        installProcess.kill();
                        input2.abort();
                    }

                }

            }));



        }
    }
    const handleClose = async () => {
        setLoading(true);
        console.log(projectName, contractName, projectTemplate)
        if(webcontainerInstance) await createTon();
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setProjectTemplate(event.target.value as string);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Blueprint Create project </DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Project name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={projectName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setProjectName(event.target.value);
                            }}

                        />
                        <TextField
                            margin="dense"
                            id="contractName"
                            label="First created contract name (PascalCase)"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={contractName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setContractName(event.target.value);
                            }}

                        />
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Choose the project template</InputLabel>
                            <Select
                                label="Choose the project template"
                                value={projectTemplate}
                                onChange={handleChange}
                            >
                                <MenuItem value={`\n`}>An empty contract (FunC)</MenuItem>
                                <MenuItem value={`\x1B[B\n`}>A simple counter contract (FunC)</MenuItem>
                                <MenuItem disabled value={2}>An empty contract (TACT)</MenuItem>
                                <MenuItem disabled value={3}>A simple counter contract (TACT)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button disabled={loading} onClick={handleClose}>Create </Button>

                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
} )