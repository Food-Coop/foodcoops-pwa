import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Link, Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom/";
import { OrderOverview } from "./OrderOverview";

export function MainOverview(){
    const [value, setValue] = useState(0);

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
                    <Tab label="Bestellung Übersicht" component={Link} to="/brotOverview" />
                    </Tabs>
                </Paper>
                <Switch>
                    <Route path="/OrderOverview">
                        <OrderOverview />
                    </Route>
                    <Route>
                        <Redirect to="/OrderOverview" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}