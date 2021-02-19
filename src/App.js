import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import "./App.css";
import {About} from "./About";
import {Storage} from "./Storage";
import {Home} from "./Home";
import logo from './logo.svg';
import './App.css';
import {Header} from "./Header";

function App() {
  return (
    <div className="App">
      <Header/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
