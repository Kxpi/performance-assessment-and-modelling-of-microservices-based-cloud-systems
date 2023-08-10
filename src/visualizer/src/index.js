import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NewApp from './NewApp'
import DevApp from './DevApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* skrot do komentarzy ctrl+k+c, do cofania komentarzy ctrl+k+u*/}
    <App /> 
    {/* <NewApp /> */}
    {/* <DevApp /> */}
  </React.StrictMode>
);

