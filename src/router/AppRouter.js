import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, useLocation } from 'react-router-dom';
import { AuthButton } from '../auth/AuthButton';
import { About } from '../About';
import { MainBestellung } from '../bestellung/MainBestellung';
import { MainEinkauf } from '../einkauf/MainEinkauf';
import { MainManagement } from '../MainManagement';
import { PrivateRoute } from '../auth/PrivateRoute';
import { Home } from '../Home';
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import './AppRouter.css';

export const AppRouter = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (newOpen) => () => {
    setMenuOpen(newOpen);
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

  const itemsList = () => (
      <Box sx={{ width: 350 }} role="presentation" onClick={toggleMenu(false)}>
        <List>
          <Link to="/home">
            <ListItemButton sx={{ color: "grey" }}>
              <ListItemIcon> 
                <HomeIcon/>
              </ListItemIcon>
              <Typography variant="h6">
                Home
              </Typography>
            </ListItemButton>
          </Link>
          <Link to="/mainBestellung">
            <ListItemButton sx={{ color: "grey" }}>
              <ListItemIcon> 
                <AddShoppingCartIcon/>
              </ListItemIcon>
              <Typography variant="h6">
               Bestellung
              </Typography>
            </ListItemButton>
          </Link>
          <Link to="/mainEinkauf">
            <ListItemButton sx={{ color: "grey" }}>
              <ListItemIcon> 
                <ShoppingCartIcon/>
              </ListItemIcon>
              <Typography variant="h6">
                Einkauf
              </Typography>
            </ListItemButton>
          </Link>
          <Link to="/mainManagement">
            <ListItemButton sx={{ color: "grey" }}>
              <ListItemIcon> 
                <InventoryIcon/>
              </ListItemIcon>
              <Typography variant="h6">
                Management
              </Typography>
            </ListItemButton>
          </Link>
          <Divider />
          <Link to="/about">
            <ListItemButton sx={{ color: "grey" }}>
              <ListItemIcon> 
                <InfoIcon/>
              </ListItemIcon>
              <Typography variant="h6">
                Impressum
              </Typography>
            </ListItemButton>
          </Link>
        </List>
        <AuthButton/>
    </Box>
);

  return (
    <div>
      <div className={`Header`}>
        <BurgerMenuButton variant="contained" size="large" disableElevation color='secondary' className="BurgerButton" onClick={toggleMenu(true)}>
          ☰
        </BurgerMenuButton>
        <Drawer open={menuOpen} onClose={toggleMenu(false)}>
          <div
            role="presentation"
            onClick={toggleMenu}
            onKeyDown={toggleMenu}
          >
            {itemsList()}
          </div>
        </Drawer>
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

const BurgerMenuButton = styled(Button)({

  fontSize: '30px',
  backgroundColor: '#333', 
  '&:hover': {
    backgroundColor: '#555',
    boxShadow: 'none',
  },
});
