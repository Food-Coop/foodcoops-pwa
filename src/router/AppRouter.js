import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, useLocation } from 'react-router-dom';
import { AuthButton } from '../auth/AuthButton';
import { About } from '../About';
import { MainBestellung } from '../bestellung/MainBestellung';
import { MainEinkauf } from '../einkauf/MainEinkauf';
import { MainManagement } from '../MainManagement';
import { PrivateRoute } from '../auth/PrivateRoute';
import { Home } from '../Home';
import './AppRouter.css';

export const AppRouter = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <AppContent menuOpen={menuOpen} toggleMenu={toggleMenu} />
    </Router>
  );
};

const AppContent = ({ menuOpen, toggleMenu }) => {
  const location = useLocation();

  const getPageName = () => {
    const routeToPageName = {
      '/home': 'Home',
      '/mainBestellung': 'Bestellung',
      '/mainEinkauf': 'Einkauf',
      '/mainManagement': 'Management',
      '/about': 'Impressum',
    };

    return routeToPageName[location.pathname] || 'Home';
  };

  return (
    <div>
      <div className={`Header ${menuOpen ? 'open' : ''}`}>
        <button className="BurgerButton" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <nav className="BurgerMenu">
            <ul>
              <li>
                <Link to="/home" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mainBestellung" onClick={toggleMenu}>
                  Bestellung
                </Link>
              </li>
              <li>
                <Link to="/mainEinkauf" onClick={toggleMenu}>
                  Einkauf
                </Link>
              </li>
              <li>
                <Link to="/mainManagement" onClick={toggleMenu}>
                  Management
                </Link>
              </li>
              <li>
                <AuthButton />
              </li>
            </ul>
          </nav>
        )}
        <h1 className='CurrentSiteName'>{getPageName()}</h1>
        <Link to="/home">
          <img className="LogoImage" src="manifest-icon-512.png" alt="logo" />
        </Link>
      </div>
      <Switch>
        <Route exact path="/login" component={AuthButton} />
        <Route exact path="/about" component={About} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainBestellung" component={MainBestellung} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainEinkauf" component={MainEinkauf} />
        <PrivateRoute roles={["Einkäufer"]} path="/mainManagement" component={MainManagement} />
        <Route path="/" component={Home} />
      </Switch>
      <footer>
        <Link to="/about">Impressum - Legal Disclaimer</Link>
      </footer>
    </div>
  );
};
