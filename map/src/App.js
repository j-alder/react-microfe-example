import './App.css';
import { WebMapView } from './Map';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

const defaultHistory = createBrowserHistory();

function App(props) {
  return (
    <Router history={props.history || defaultHistory}>
      <div className="App">
        <header className="App-header">
          <p>
            Viewing ArcGIS Map MicroFrontend
          </p>
          Coordinates are stored in localStorage by container app and retrieved by this MFE
        </header>
        <WebMapView coords={props.coords} />
      </div>
    </Router>
  );
}

export default App;
