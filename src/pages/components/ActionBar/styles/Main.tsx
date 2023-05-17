import styled from "@emotion/styled";

import { Theme } from '@mui/material/styles';

interface StyledDivProps {
    theme: Theme;
}

export const Main = styled('div')<StyledDivProps>(({ theme }) => ({
    backgroundColor:  theme.palette.background.default,
    display: 'flex',
    "background-image": 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
    "flex-direction": 'column',
"flex-shrink": 0,
"justify-content": 'space-between',
"z-index": 10
}));