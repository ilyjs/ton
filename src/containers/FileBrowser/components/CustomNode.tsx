import React, { FormEvent, KeyboardEventHandler,KeyboardEvent, MouseEventHandler, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { CustomData } from './types';
import { TypeIcon } from './TypeIcon';
import { TreeRoot, ExpandIconWrapper, LabelGridItem, ButtonsNode, ButtonNode } from './styles';
import { IconButton, TextField } from '@mui/material';
import { Delete, FileCopy, Edit, Check } from '@mui/icons-material';
import * as events from 'events';
import styled from '@emotion/styled';

const StyledTextField = styled(TextField)`
  && {
    input {
      font-size: 14px;
      padding: 6px 6px;

    }
  }
`;

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel['id']) => void;
  onSelect: (node: NodeModel) => void;
  onChangeFileName : (id: string | number, fileName: string) => void;

};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data, text } = props.node;
  const [hover, setHover] = useState(false);
  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const indent = props.depth * 24;
  const inputRef = useRef(null);

  const handleShowInput = (e: any) => {
    setVisibleInput(true);
    e.stopPropagation();
  };

  useEffect(() => {
    inputRef &&  inputRef.current && inputRef.current.focus()
  },[inputRef])
  const handleSelect = () => props.onSelect(props.node);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };
  const handleChangeText = (e: any) => {
    setLabelText(e.target.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
  const handleSubmit = () => {
     setVisibleInput(false);
     console.log('props.node.id',props.node.id)
     props.onChangeFileName(props.node.id, labelText);
  };

  function useOutsideClick(
    ref: React.RefObject<HTMLElement>,
    fn: () => void,
    event: keyof DocumentEventMap = 'mousedown',
  ) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          fn();
        }
      }

      document.addEventListener(event, handleClickOutside);
      return () => {
        document.removeEventListener(event, handleClickOutside);
      };
    }, [ref, event]);
  }

  useOutsideClick(inputRef, handleSubmit);
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
            <StyledTextField
              autoFocus
              ref={inputRef}
              value={labelText}
              onChange={handleChangeText}
              onKeyDown={handleKeyDown}
              onClick={(e: any) => e.stopPropagation()}
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
            <IconButton size='small'>
              <Delete fontSize='small' />
            </IconButton>
          </ButtonNode>
        </ButtonsNode>
      )}
    </TreeRoot>
  );
};
