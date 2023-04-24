import React, { FormEvent, KeyboardEventHandler,KeyboardEvent, MouseEventHandler, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { CustomData } from './types';
import { TypeIcon } from './TypeIcon';
import {EditableFilenameInput} from './EditableFilenameInput';
import { TreeRoot, ExpandIconWrapper, LabelGridItem, ButtonsNode, ButtonNode } from './styles';
import { IconButton, TextField } from '@mui/material';
import { Delete, FileCopy, Edit, Check } from '@mui/icons-material';

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel['id']) => void;
  onSelect: (node: NodeModel) => void;
  onChangeFileName : (id: string | number, fileName: string) => void;
  onDelete: (index: number | string) => void;

};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data, text } = props.node;
  const [hover, setHover] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const indent = props.depth * 24;
  const inputRef = useRef(null);

  const handleShowInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVisibleInput(true);
    e.stopPropagation();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    props.onSelect(props.node);
    console.log('handleDelete',props.node)
  }

  useEffect(() => {
    inputRef &&  inputRef.current && inputRef.current.focus()
  },[inputRef])
  const handleSelect = () => props.onSelect(props.node);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const onDelete = (event: React.MouseEvent) => {
    props.onDelete(props.node.id);
    event.stopPropagation();
  }

  const handleSubmit = (labelText: string) => {
     setVisibleInput(false);
     props.onChangeFileName(props.node.id, labelText);
  };

  return (
    <TreeRoot
      className={`tree-node`}
      style={{ paddingInlineStart: indent }}

      isSelected={props.isSelected}
      onClick={handleSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}

    >
      <ExpandIconWrapper
        isOpen={props.isOpen}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </ExpandIconWrapper>
      {visibleInput ? <>

          <div>
            <EditableFilenameInput
              text={text}
              onSubmit={handleSubmit}
            />

          </div>

        </> :
        <>
          <div>
            <TypeIcon droppable={droppable} fileType={data?.fileType} />
          </div>
          <LabelGridItem>
            <Typography variant='body2'>{props.node.text}</Typography>
          </LabelGridItem>
        </>
      }

      {hover && !visibleInput && (
        <ButtonsNode>
          <ButtonNode>
            <IconButton onClick={handleShowInput} size='small'>
              <Edit fontSize='small' />
            </IconButton>
          </ButtonNode>
          <ButtonNode>
            <IconButton onClick={onDelete} size='small'>
              <Delete fontSize='small' />
            </IconButton>
          </ButtonNode>
        </ButtonsNode>
      )}
    </TreeRoot>
  );
};
