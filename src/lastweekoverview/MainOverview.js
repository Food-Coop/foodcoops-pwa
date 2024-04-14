import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Link, Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom/";
import { LastWeekOverview } from "./LastWeekOverview";

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
                    <Tab label="Übersicht Vorwoche" component={Link} to="/lastWeekOverview" />
                    </Tabs>
                </Paper>
                <Switch>
                    <Route path="/lastWeekOverview">
                        <LastWeekOverview />
                    </Route>
                    <Route>
                        <Redirect to="/lastWeekOverview" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}