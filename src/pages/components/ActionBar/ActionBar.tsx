import {Main} from "./styles/Main";
import {useTheme} from '@mui/material/styles';
//import SendIcon from '@mui/icons-material/Send';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { grey } from '@mui/material/colors';

import styled from "@emotion/styled";

const Actions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 4px 0;`

const Button = styled.button`
  position: relative;
  align-items: center;
  color: inherit;
  display: flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  max-height: 100%;
  padding: 0;
  transition: all .1s ease;
  -webkit-appearance: button;
  background-color: initial;
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  line-height: inherit;
  width: 48px;
`


export function ActionBar() {
    const theme = useTheme();
    return (<Main theme={theme}>
        <Actions>
            <Button><FileCopyOutlinedIcon sx={{color: grey['A400']}} /></Button>
        </Actions>

    </Main>);
}