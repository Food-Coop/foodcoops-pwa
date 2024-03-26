import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Deadline } from './deadline/Deadline';
import { Gebindemanagement } from './gebindemanagement/Gebindemanagement';
import { Lager } from './lager/Lager';
import { FrischBestandManagement } from './frischbestandmanagement/FrischBestandManagement';

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
                >
                <Tab label="Gebinde-Management" component={Link} to="/gebindemanagement" />
                <Tab label="Lager-Management" component={Link} to="/lager" />
                <Tab label="Frischbestand-Management" component={Link} to="/frischbestandmanagement" />
                <Tab label="Deadline-Management" component={Link} to="/deadline" />
                </Tabs>
            </Paper>
            <Switch>

                <Route path="/gebindemanagement">
                    <Gebindemanagement />
                </Route>
                <Route path="/lager">
                    <Lager />
                </Route>
                <Route path="/frischbestandmanagement">
                    <FrischBestandManagement />
                </Route>
                <Route path="/deadline">
                    <Deadline />
                </Route>
                <Route>
                    <Redirect to="/gebindemanagement" />
                </Route>
            </Switch>
            </div>
        </Router>
    );
}