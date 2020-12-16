import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { MicroFrontend } from './MicroFrontend';
import './App.css';

const {
  REACT_APP_MAP_HOST: mapHost,
  REACT_APP_FORM_HOST: formHost,
} = process.env;

const Map = ({ history }) => (
  <MicroFrontend history={history} host={mapHost} name="Map" />
);
const Form = ({ history }) => (
  <MicroFrontend history={history} host={formHost} name="Form" />
);

const Home = () => (
  <div className="header">
    Home Component- exists in Core
    <img src="http://placebear.com/g/200/300" alt="qt" />
  </div>
);

const App = () => {
  useEffect(() => localStorage.setItem('coords', '-77.4603,37.5538'));
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="topbar">
          <Link className="nav-link" to="/">React MicroFrontend Example</Link>
          <Link className="nav-link" to="/map">Map MFE</Link>
          <Link className="nav-link" to="/form">Form MFE</Link>
        </div>
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/map" render={() => <Map coords={[80, -35]} />} />
            <Route exact path="/form" component={Form} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
