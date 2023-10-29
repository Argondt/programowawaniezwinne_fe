import React, { StrictMode } from 'react';
import  { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthenticationProvider from './Providers/AuthenticationProvider';

// window.fetch = fetchInterceptor;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <AuthenticationProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthenticationProvider>,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
