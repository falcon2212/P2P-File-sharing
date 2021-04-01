import React, { Component } from 'react';
// import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
// import { createHashHistory } from 'history';
import {
    Switch,
    Route,
    useParams,
    useRouteMatch
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from "./components/Header";
import {Middle} from "./components/Middle";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_in: false,
            login_credentials : {}
            // middle_content: "home"
        };
    }

    handleReq(ls, lc) {
        this.setState({logged_in: ls, login_credentials: lc});
        // this.render();
    }

    render() {
        return(
            <div>
                {/*<Header logged_in={this.state.logged_in}/>*/}
                {/*<Middle middle_content={"home"}/>*/}
                <Switch>
                    <Route exact path={"/"}>
                        {/*<Header logged_in={this.state.logged_in} onReq={(mc) => this.handleReq(this.state.logged_in,mc)}/>*/}
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"home"}/>
                    </Route>
                    <Route path={"/about"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"about"}/>
                    </Route>
                    <Route path={"/faq"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"faq"}/>
                    </Route>
                    <Route path={"/login"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"login"} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                    </Route>
                    <Route path={"/sign_up"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"sign_up"}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export { App };