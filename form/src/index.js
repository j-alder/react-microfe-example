import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

window.renderForm = (containerId, history) => {
  ReactDOM.render(<App history={history} />, document.getElementById(containerId));
};

window.unmountForm = (containerId) => {
  if (document.getElementById(containerId)) {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
  }
};
