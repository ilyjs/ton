import React, { useState } from 'react';
import { rewireEditor } from '../config';
import { EditorFn } from './Editor';
import Layout from './Layout';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';
import { light, dark } from '../styles/Themes';

export const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  return <>
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  </>;
};
