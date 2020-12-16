import './App.css';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { TextInput } from '@rtslabs/f1-uikit-web';

const defaultHistory = createBrowserHistory();

function App(props) {
  return (
    <Router history={props.history || defaultHistory}>
      <div className="App">
        <header className="App-header">
          <p>
            Viewing Form MicroFrontend
          </p>
        </header>
        <form>
          <label htmlFor="text-input">Text input from UI Kit</label>
          <TextInput name="text-input" />
        </form>
      </div>
    </Router>
  );
}

export default App;
