import React from 'react';
import ReactDOM from 'react-dom';
// import {Route, Router} from "react-router";
import {BrowserRouter} from "react-router-dom";

import { App } from "./App";
import {Tmp} from "./Tmp";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
            {/*<Tmp/>*/}
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

