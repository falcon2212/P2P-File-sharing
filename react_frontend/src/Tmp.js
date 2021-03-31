import React from 'react';
import {Route} from "react-router";
import {Link} from "react-router-dom";
import {App} from "./App";

const Tmp = () => (
    <div>
        <nav>
            <Link to="/dashboard">App</Link>
        </nav>
        <div>
            <Route path="/dashboard" component={App} />
        </div>
    </div>
);

export { Tmp };