import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form, ListGroup} from "react-bootstrap";
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
            body: JSON.stringify({username: this.props.login_data.login_credentials.username, devices: d})
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

    handleSelect(event){
        this.props.onDeviceChange(event);
        this.setState({transaction: true});
    }

    render() {
        let h;
        if(this.state.transaction){
            console.log(this.state);
            return <Redirect to={"/dashboard"}/>;
        }
        else {
            if(this.props.login_data.login_credentials.devices.length === 0){
                h = (
                    <div className={"form-global"}>
                        <Form>
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
                    </div>
                );
            }
            else{
                let device_list = [];
                for(var i=0; i<this.props.login_data.login_credentials.devices.length; i++){
                    device_list.push(<ListGroup.Item eventKey={this.props.login_data.login_credentials.devices[i]}>{this.props.login_data.login_credentials.devices[i]}</ListGroup.Item>);
                }
                h = (
                    <div className={"form-global"}>
                        <h3>Which device is this?</h3>
                        <ListGroup onSelect={this.handleSelect.bind(this)}>{device_list}</ListGroup>
                        <Form>
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
                    </div>
                );
            }
        }
        return (
            h
        );
    }
}


export {DeviceSelection};