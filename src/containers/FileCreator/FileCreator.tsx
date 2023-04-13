import React from 'react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  justify-content: end;
  padding: 10px
`;

export const FileCreator = () => {
  return <Wrapper> <IconButton aria-label='addFolder'>
    <CreateNewFolderIcon fontSize='small' />
  </IconButton>
    <IconButton aria-label='addFile'>
      <NoteAddIcon fontSize='small' />
    </IconButton>
  </Wrapper>;
};