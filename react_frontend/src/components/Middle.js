import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Home} from "./Home";
import {Authors} from "./Authors";
import {About} from "./About";
import {Login} from "./Login";
import {SignUp} from "./SignUp";
import {Dashboard} from "./Dashboard";
import {RoomSelect} from "./RoomSelect";
import {DeviceSelection} from "./DeviceSelection";

class Middle extends Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         middle_content: this.props.middle_content
    //     };
    // }

    render() {
        let middle;
        if(this.props.middle_content === "home"){
            middle = <Home/>;
        }
        else if(this.props.middle_content === "authors"){
            middle = <Authors/>;
        }
        else if(this.props.middle_content === "about"){
            middle = <About/>;
        }
        else if(this.props.middle_content === "login"){
            middle = <Login onReq={this.props.onReq} onRoomChange={this.props.onRoomChange}/>;
        }
        else if(this.props.middle_content === "sign_up"){
            middle = <SignUp onReq={this.props.onReq} onRoomChange={this.props.onRoomChange}/>;
        }
        else if(this.props.middle_content === "dashboard"){
            middle = <Dashboard login_data={this.props.login_data}/>;
        }
        else if(this.props.middle_content === "room_select"){
            middle = <RoomSelect onRoomChange={this.props.onRoomChange}/>;
        }
        else if(this.props.middle_content === "device_select"){
            middle = <DeviceSelection login_data={this.props.login_data} onDeviceChange={this.props.onDeviceChange} onRoomChange={this.props.onRoomChange} onReq={this.props.onReq}/>;
        }
        return(
            middle
        );
    }
}

export {Middle};