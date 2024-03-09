import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { AuthButton } from '../auth/AuthButton';
import { About } from '../About';
import { Lager } from '../lager/Lager';
import { MainBestellung } from '../bestellung/MainBestellung';
import { Deadline } from '../deadline/Deadline';
import { Gebindemanagement } from '../gebindemanagement/Gebindemanagement';
import { PrivateRoute } from '../auth/PrivateRoute';
import { Home } from '../Home';
import { FrischBestandManagement } from '../frischbestandmanagement/FrischBestandManagement';
import './AppRouter.css';

export const AppRouter = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className={`Header ${menuOpen ? 'open' : ''}`}>
        <button className="BurgerButton" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
        <nav className="BurgerMenu">
          <ul>
            <li>
              <Link to="/mainBestellung" onClick={toggleMenu}>
                Bestellung
              </Link>
            </li>
            <li>
              <Link to="/deadline" onClick={toggleMenu}>
                Deadline
              </Link>
            </li>
            <li>
              <Link to="/gebindemanagement" onClick={toggleMenu}>
                Gebindemanagement
              </Link>
            </li>
            <li>
              <Link to="/lager" onClick={toggleMenu}>
                Lagermanagement
              </Link>
            </li>
            <li>
              <Link to="/frischbestandmanagement" onClick={toggleMenu}>
                Frischbestandmanagement
              </Link>
            </li>
            <li>
              <AuthButton />
            </li>
          </ul>
        </nav>
        )}
        <img className="LogoImage" src="manifest-icon-512.png" alt="logo" />
      </div>
      <Switch>
        <Route exact path="/login" component={AuthButton} />
        <Route exact path="/about" component={About} />
        <PrivateRoute roles={["Einkäufer"]} path="/lager" component={Lager} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainBestellung" component={MainBestellung} />
        <PrivateRoute roles={["Einkäufer"]} path="/gebindemanagement" component={Gebindemanagement} />
        <PrivateRoute roles={["Einkäufer"]} path="/frischbestandmanagement" component={FrischBestandManagement} />
        <PrivateRoute roles={["Einkäufer"]} path="/deadline" component={Deadline} />
        <Route path="/" component={Home} />
      </Switch>
      <footer>
        <Link to="/about">Impressum - Legal Disclaimer</Link>
      </footer>
    </Router>
  );
};
