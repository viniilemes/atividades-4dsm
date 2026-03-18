import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store'; // Assumindo que você criou o store.ts
import App from './App';
import { CssBaseline } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* CssBaseline remove as margens padrão do navegador e aplica a fonte do MUI */}
      <CssBaseline />
      <App />
    </Provider>
  </React.StrictMode>,
);