import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import "./App.css";
import "./Storage.js";
import "./Home.js";
import {About} from "./About";
import {Storage} from "./Storage";
import {Home} from "./Home";

function App() {

    return (
        <Router>
            <div className="App">
                <nav>
                </nav>
              <main>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">Impressum - Legal Disclaimer</Link>
                  </li>
                  <li>
                    <Link to="/storage">Storage</Link>
                  </li>
                </ul>
              </main>
              <footer>
              </footer>
              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/storage">
                  <Storage />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
        </Router>

    );
}

export default App;
