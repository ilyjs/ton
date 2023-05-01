import { rewireEditor } from '../config';
import { EditorFn } from './Editor';
import Switch from '@mui/material/Switch';
import styled from '@emotion/styled';
import FileBrowser from '../containers/FileBrowser';
import React from 'react';

const LabelHeader = styled.h3`
  padding-left: 15px;
  color: #fff
`;

const Label = styled.span`
  background: linear-gradient(45deg, #00a0f0 30%, #a100ef);
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Logo = styled.img`
  width: 2.17em;
  margin-left: 15px;
`;
const Header = styled.header`
  display: flex;
`;
const LeftPanel = styled.div`
  display: inline-block;
  width: 30%;
  height: 100vh;
  position: absolute;
`;

const Tree = styled.div`
  width: 100%;
  height: calc(100vh - 4em);
`;
const Editor = styled.div`
  display: inline-block;
  width: 70%;
  height: 100vh;
  left: 30%;
  position: absolute;
`;
const Layout = () => {

  rewireEditor();

  return <>
    <Header>
      <LabelHeader><Label> Ton Editor </Label> <small style={{ color: '#aaa' }}>press
        [shift+enter] to run the code</small></LabelHeader>
    </Header>
    <LeftPanel>
      {/*<Tree id='tree'></Tree>*/}
      <FileBrowser/>
    </LeftPanel>
    <Editor>
      <EditorFn />
    </Editor>
  </>;
};

export default Layout;