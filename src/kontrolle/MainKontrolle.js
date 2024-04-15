import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Link, Redirect, Route, BrowserRouter as Router, Switch, useRouteMatch } from "react-router-dom/";
import { Kontrolle } from "./Kontrolle";


export function MainKontrolle(){
    const [value, setValue] = useState(0);
    const match = useRouteMatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Router>
            <div>
                <Paper square>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    >
                    <Tab label="Zu Viel / Zu Wenig" component={Link} to={`${match.url}/zuVielzuWenig`} />
                    </Tabs>
                </Paper>
                <Switch>
                    <Route path={`${match.url}/zuVielzuWenig`}>
                        <Kontrolle />
                    </Route>
                    <Route>
                        <Redirect to={`${match.url}/zuVielzuWenig`}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}