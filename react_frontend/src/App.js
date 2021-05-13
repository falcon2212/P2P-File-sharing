import React, { Component } from 'react';
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
            login_credentials : {},
            device:null,
            room: null,
            // middle_content: "home"
        };
        this.handleReq = this.handleReq.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
    }

    handleReq(ls, lc) {
        this.setState({logged_in: ls, login_credentials: lc});
        // this.render();
    }

    handleDeviceChange(d){
        this.setState({device: d})
    }

    handleRoomChange(r) {
        this.setState({room: r});
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
                    <Route path={"/authors"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"authors"}/>
                    </Route>
                    <Route path={"/login"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"login"} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                    </Route>
                    <Route path={"/sign_up"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"sign_up"} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                    </Route>
                    <Route path={"/dashboard"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"dashboard"} login_data={this.state} onRoomChange={(r) => this.handleRoomChange(r)}/>
                    </Route>
                    <Route path={"/room_select"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"room_select"} onRoomChange={(r) => this.handleRoomChange(r)}/>
                    </Route>
                    <Route path={"/device_select"}>
                        <Header login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)}/>
                        <Middle middle_content={"device_select"} login_data={this.state} onReq={(ls, lc) => this.handleReq(ls, lc)} onDeviceChange={(d) => this.handleDeviceChange(d)} onRoomChange={(r) => this.handleRoomChange(r)}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export { App };