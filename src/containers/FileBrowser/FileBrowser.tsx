import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  MultiBackend,
  getBackendOptions, NodeModel,
} from '@minoru/react-dnd-treeview';
import SampleData from './sample_data.json';
import { CustomData } from './components/types';
import { CustomNode } from './components/CustomNode';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import newFiles from '../../filesNew';
import {initFile} from '../../utils/fileSystem';
import './components/styles/style.css';
import files from '../../files';

initFile(files,['./01-simple-example', './02-nft-example']);

export const FileBrowser = observer(() => {
  const { files, setFiles, setSelectedNode, selectedNode } = useStore().store.fileStore;
  const handleDrop = (newTree: NodeModel[]) => setFiles(newTree);
  const handleSelect = (node: NodeModel) => setSelectedNode(node);

  useEffect(() => {
    setFiles(newFiles);
  }, []);

  return <DndProvider backend={MultiBackend} options={getBackendOptions()}>
    <Tree
      tree={files??[]}
      rootId={0}
      render={(
        node: NodeModel<CustomData>,
        { depth, isOpen, onToggle },
      ) => (
        <CustomNode
          node={node}
          depth={depth}
          isOpen={isOpen}
          onToggle={onToggle}
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