import "./App.css";
import logo from './logo.svg';
import './Header.css';
import {About} from "./About";
import {Home} from "./Home";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="Header">
                    <Link to="/">
                        <img className="Header-logo" src={logo} alt="logo"/>
                    </Link>
                    <h1>
                        Food Coops
                    </h1>
                </header>
            </div>
            <div>
                <Switch>
                    <Route path="/">
                        <Home/>
                    </Route>
                    <Route path="/about">
                        <About/>
                    </Route>
                </Switch>
            </div>
            <div>
                <footer>
                    <Link to="/about">
                        Impressum - Legal Disclaimer
                    </Link>
                </footer>
            </div>
        </Router>
    );
}

export default App;
