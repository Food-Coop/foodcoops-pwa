import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useRouteMatch} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Lager } from './lager/Lager';
import { FrischBestandManagement } from './frischbestandmanagement/FrischBestandManagement';
import { BrotBestandManagement } from './brotmanagement/BrotBestandManagement';

export function MainManagement(){
    const [value, setValue] = useState(0);
    const match = useRouteMatch();

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
                <Tab label="Lager" component={Link} to={`${match.url}/lager`} />
                <Tab label="Frisch" component={Link} to={`${match.url}/frischbestandmanagement`} />
                <Tab label="Brot" component={Link} to={`${match.url}/brotbestandmanagement`} />
                </Tabs>
            </Paper>
            <Switch>
                <Route exact path={`${match.url}/lager`}>
                    <Lager />
                </Route>
                <Route exact path={`${match.url}/frischbestandmanagement`}>
                    <FrischBestandManagement />
                </Route>
                <Route exact path={`${match.url}/brotbestandmanagement`}>
                    <BrotBestandManagement />
                </Route>
                <Route>
                    <Redirect to={`${match.url}/lager`}/>
                </Route>
            </Switch>
            </div>
        </Router>
    );
}