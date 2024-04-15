import React, { useState } from 'react';
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Bestellung } from './Bestellung';
import { Brot } from '../brot/Brot';

export function MainBestellung(){
    const [value, setValue] = useState(0);
    const match = useRouteMatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Paper square>
                <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                >
                <Tab label="Frischbestellung" component={Link} to={`${match.url}/bestellung`} />
                <Tab label="Brotbestellung" component={Link} to={`${match.url}/brotbestellung`} />
                </Tabs>
            </Paper>
            <Switch>
                <Route exact path={`${match.path}/bestellung`}>
                    <Bestellung />
                </Route>
                <Route exact path={`${match.path}/brotbestellung`}>
                    <Brot />
                </Route>
                <Route exact path={match.path}>
                    <Redirect to={`${match.path}/bestellung`} />
                </Route>
            </Switch>
        </div>
    );
}