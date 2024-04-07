import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Deadline } from './deadline/Deadline';
import { Gebindemanagement } from './gebindemanagement/Gebindemanagement';
import { Lager } from './lager/Lager';
import { FrischBestandManagement } from './frischbestandmanagement/FrischBestandManagement';
import { BrotBestandManagement } from './brotmanagement/BrotBestandManagement';

export function MainManagement(){
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Router>
            <div>
            <Paper square>
                <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                >
                <Tab label="Lager" component={Link} to="/lager" />
                <Tab label="Frisch" component={Link} to="/frischbestandmanagement" />
                <Tab label="Gebinde" component={Link} to="/gebindemanagement" />
                <Tab label="Brot" component={Link} to="/brotbestandmanagement" />
                <Tab label="Deadline" component={Link} to="/deadline" />
                </Tabs>
            </Paper>
            <Switch>
                <Route path="/lager">
                    <Lager />
                </Route>
                <Route path="/frischbestandmanagement">
                    <FrischBestandManagement />
                </Route>
                <Route path="/gebindemanagement">
                    <Gebindemanagement />
                </Route>
                <Route path="/brotbestandmanagement">
                    <BrotBestandManagement />
                </Route>
                <Route path="/deadline">
                    <Deadline />
                </Route>
                <Route>
                    <Redirect to="/lager" />
                </Route>
            </Switch>
            </div>
        </Router>
    );
}