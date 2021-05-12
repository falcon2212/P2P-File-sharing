import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Redirect} from "react-router";

let APP_CONFIG = require("../config/app_config");
const ENDPOINT = APP_CONFIG.BACKEND_ENDPOINT;

class DeviceSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            device: null,
            transaction:false,
        };

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.state.device = null;
    }

    handleSubmit() {
        let d = this.props.login_data.login_credentials.devices;
        d.push(this.state.device);
        fetch(ENDPOINT+"users/update_devices/"+this.props.login_data.login_credentials.user_id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({devices: d})
        })
            .then(res => res.json())
            .then(
                res => {
                    if(res === null){
                        console.log("Some issue");
                    }
                    else {
                        console.log(res);
                        this.props.onReq(true, {username: res.username, name: res.name, user_id: res._id, devices: res.devices});
                        this.props.onDeviceChange(this.state.device);
                        this.props.onRoomChange("1");
                        this.setState({transaction: true});
                    }
                }
            )
            .catch(
                err => {
                    console.log(err);
                });
    }

    handleChange(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        this.setState({[fieldName]: fieldVal});
    }

    render() {
        if(this.state.transaction){
            return <Redirect to={"/dashboard"}/>;
        }
        else {
            return (
                <Form className={"form-global"}>
                    <h3>New device?</h3>
                    <Form.Group controlId="formBasicDevice">
                        <Form.Label>Device name</Form.Label>
                        <Form.Control type={"text"} name={"device"}
                                      onChange={this.handleChange.bind(this)}/>
                    </Form.Group>

                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        Register
                    </Button>
                </Form>
            );
        }
    }
}


export {DeviceSelection};