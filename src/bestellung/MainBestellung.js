import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Bestellung } from './Bestellung';
import { Brot } from '../brot/Brot';

export function MainBestellung(){
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
                <Tab label="Frischbestellung" component={Link} to="/bestellung" />
                <Tab label="Brotbestellung" component={Link} to="/brotbestellung" />
                </Tabs>
            </Paper>
            <Switch>
                <Route path="/bestellung">
                    <Bestellung />
                </Route>
                <Route path="/brotbestellung">
                    <Brot />
                </Route>
                <Route>
                    <Redirect to="/bestellung" />
                </Route>
            </Switch>
            </div>
        </Router>
    );
}