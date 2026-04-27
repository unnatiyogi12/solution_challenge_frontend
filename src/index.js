import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from './reportWebVitals';

const googleClientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "723632844857-a5a4jt8j3eaf9962q387g7trnrjbkn27.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
