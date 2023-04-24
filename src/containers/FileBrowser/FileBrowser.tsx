import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  MultiBackend,
  getBackendOptions, NodeModel, DropOptions, DragLayerMonitorProps,
} from '@minoru/react-dnd-treeview';
import SampleData from './sample_data.json';
import { CustomData } from './components/types';
import { CustomNode } from './components/CustomNode';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import newFiles from '../../filesNew';
import { deleteFile, initFile2, initFile3 } from '../../utils/fileSystem';
import './components/styles/style.css';
import { NativeTypes } from 'react-dnd-html5-backend';

import files, { filesJSON } from '../../files';
import { fs, vol } from 'memfs';
import { toJS } from 'mobx';

//initFile(files,['./01-simple-example', './02-nft-example']);
//initFile2(filesJSON);

export const FileBrowser = observer(() => {
  const {
    files,
    setFiles,
    setSelectedNode,
    selectedNode,
    lastId,
    setLastId,
    changeFileName,
    deleteFile
  } = useStore().store.fileStore;

  const getFileExtension = (nameFile: string) => {
    const splitFile = nameFile.split('.');
    return splitFile[splitFile.length - 1];
  };

  const getFileLanguage = (nameFile: string) => {
    const fileType = getFileExtension(nameFile);
    if (fileType === 'ts') return 'typescript';
    else if (fileType === 'fc') return 'func';
    else return 'text';
  };

  function getFileById(files: any, id: number | string) {
    return files.find((file: any) => file.id === id);
  }

  function getFilePath(files: any, nameFile: string, parent: number | string): string {
    if (parent === 0) return `./${nameFile}`;

    const file = getFileById(files, parent);
    if (!file) {
      throw new Error(`File with id ${parent} not found`);
    }

    const parentPath = getFilePath(files, file.text, file.parent);
    return `${parentPath}/${nameFile}`;
  }

  const changeDuplicateName = (name: string) => {
    console.log("changeDuplicateName");
    const nameParts = name.split('.');
    if (nameParts.length === 1) return name + 1;
    nameParts[nameParts.length - 2] = nameParts[nameParts.length - 2] + '1';
    return nameParts.join('.');
  };

  function isNameMatchCheck(files: any, nameFile: string, parent: string | number): boolean {
    if (!nameFile ?? !parent ?? !files) {
      throw new Error('Missing argument: nameFile, parent, or files is undefined');
    }
    const folderFiles = files.filter((file: any) => parent === file.parent);
    return folderFiles.some((file: any) => file.text === nameFile);
  }

  const handleDrop = async (newTree: NodeModel[], options: DropOptions) => {
    const { dropTargetId, monitor } = options;
    const itemType = monitor.getItemType();
    if (itemType === NativeTypes.FILE) {
      const uploadFiles: File[] = monitor.getItem().files;
      const nodes: NodeModel[] = [];

      for (let i = 0; i < uploadFiles.length; i++) {
        let value;
        let fileName = uploadFiles[0].name;
        await uploadFiles[0].text().then((text) => (value = text));
        const language = getFileLanguage(fileName);
        const isNameMatch = isNameMatchCheck(files, fileName, dropTargetId);
        if (isNameMatch) fileName = changeDuplicateName(fileName);

        const path = getFilePath(files, fileName, dropTargetId);
        nodes.push({
          id: lastId + i,
          parent: dropTargetId,
          text: fileName,
          data: {
            path: path,
            fileType: language,
            language,
            value,
          },
        });
      }

      const mergedTree = [...newTree, ...nodes];

      setFiles(mergedTree);
      console.log(toJS(mergedTree));
      setLastId(lastId + uploadFiles.length);
    } else {
      setFiles(newTree);
    }

  };
  const findFileById = (files: NodeModel[], id: string | number) => {

    const itemIndex = files.findIndex((item: NodeModel) => item.id === id);
    if (itemIndex !== -1) {
      return {file: files[itemIndex], index: itemIndex};
    }

  };
  const handleSelect = (node: NodeModel) => setSelectedNode(node);

  useEffect(() => {
    setFiles(newFiles);
  }, []);

  useEffect(() => {
    console.log(234)
    files && initFile3(files);
    setTimeout(() => {
      //console.log(vol.toJSON())
      //deleteFile('/01-simple-example/stdlib.fc1');

    }, 3000);

  }, [JSON.stringify(files)]);

  const onChangeFileName = (id: string | number, fileName: string) => {
    const {file, index} = findFileById(files,id);
    if(!file) return;

    const isNameMatch = isNameMatchCheck(newFiles, fileName, file.parent);
    if(isNameMatch) return;


    if(file.data) {
      const language = getFileLanguage(fileName);
      const path = getFilePath(files, fileName, file.parent);
       file.data = {...file.data,  language, path, fileType: language}
    }
    file.text = fileName;
    changeFileName(file, index);
  }

  const onDelete = (id: number | string) => {
    const { index} = findFileById(files,id);
    console.log("props.node",index);
    if(!index) return;
    deleteFile(index);
  }

  return <DndProvider backend={MultiBackend} options={getBackendOptions()}>
    <Tree
      tree={files ?? []}
      rootId={0}
      extraAcceptTypes={[NativeTypes.FILE]}
      render={(
        node: NodeModel<CustomData>,
        { depth, isOpen, onToggle },
      ) => (
        <CustomNode
          node={node}
          depth={depth}
          isOpen={isOpen}
          onToggle={onToggle}
          onChangeFileName={onChangeFileName}
          onDelete={onDelete}
          onSelect={handleSelect}
          isSelected={node.id === selectedNode?.id}
        />
      )}
      onDrop={handleDrop}
      classes={{
        root: 'treeRoot',
        draggingSource: 'draggingSource',
        dropTarget: 'dropTarget',
      }}
    />
  </DndProvider>;

});