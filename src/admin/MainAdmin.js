import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useRouteMatch} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Deadline } from '../deadline/Deadline';
import { Kontrolle } from './Kontrolle';
import { OrderOverview } from './OrderOverview';

export function MainAdmin(){
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
                <Tab label="Zu Viel / Zu Wenig" component={Link} to={`${match.url}/zuVielzuWenig`} />
                <Tab label="Bestellungs-Übersicht" component={Link} to={`${match.url}/OrderOverview`} />
                <Tab label="Deadline" component={Link} to={`${match.url}/deadline`} />
                </Tabs>
            </Paper>
            <Switch>
                <Route path={`${match.url}/zuVielzuWenig`}>
                    <Kontrolle />
                </Route>
                <Route path={`${match.url}/OrderOverview`}>
                    <OrderOverview />
                </Route>
                <Route exact path={`${match.url}/deadline`}>
                    <Deadline />
                </Route>
                <Route>
                    <Redirect to={`${match.url}/zuVielzuWenig`}/>
                </Route>
            </Switch>
            </div>
        </Router>
    );
}