import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Link, Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom/";
import { Kontrolle } from "./Kontrolle";

export function MainKontrolle(){
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Router>
            <div>
                <Paper squere>
                    <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    >
                    <Tab label="Kontronllpanel" component={Link} to="/kontrolle" />
                    </Tabs>
                </Paper>
                <Switch>
                    <Route path="/kontrolle">
                        <Kontrolle />
                    </Route>
                    <Route>
                        <Redirect to="/kontrolle" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}