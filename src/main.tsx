import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <WhatsAppWidget />
  </React.StrictMode>,
);
