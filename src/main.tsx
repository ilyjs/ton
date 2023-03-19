import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { store, StoreContext } from './store';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={{ store }}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
);
