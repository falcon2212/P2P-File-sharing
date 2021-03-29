import React, { Component } from 'react';
// import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
// import { createHashHistory } from 'history';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from "./components/Header";
import {Middle} from "./components/Middle";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: false,
            middle_content: "home"
        };
    }

    handleReq(ls, mc) {
        this.setState({logged_in: ls, middle_content: mc});
        // this.render();
    }

    render() {
        return(
            <div>
                <Header logged_in={this.state.logged_in} onReq={(mc) => this.handleReq(this.state.logged_in,mc)}/>
                {/*<BrowserRouter*/}
                <Middle middle_content={this.state.middle_content}/>
            </div>
        );
    }
}

export { App };