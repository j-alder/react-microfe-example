import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

window.renderMap = (containerId, history) => {
  ReactDOM.render(<App history={history} />, document.getElementById(containerId));
};

window.unmountMap = (containerId) => {
  if (document.getElementById(containerId)) {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
  }
};
