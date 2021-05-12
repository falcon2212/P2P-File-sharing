import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Redirect} from "react-router";

let APP_CONFIG = require("../config/app_config");
const ENDPOINT = APP_CONFIG.BACKEND_ENDPOINT;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            username: "",
            password: "",
            name: ""
        };

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(ENDPOINT+"start")
            .then(res => res.json())
            .then((res) => {
                this.setState({isLoaded: true,});
            })
            .catch((err)=>{
                this.setState({isLoaded: true, error: err});
                console.log(err);
            });
    }

    handleSubmit() {
        // <validate_user user={this.state} handleValid={(n)=>{this.setState({isLoaded: true, name: n})}/>
        fetch(ENDPOINT+"users/find", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        })
            .then(res => res.json())
            .then(
                res => {
                    if(res === null){
                        console.log("Username password do not match");
                        alert("username password do not match");
                    }
                    else if (res.name !== "") {
                        console.log(res);
                        this.props.onReq(true, {username: this.state.username, name: res.name, user_id: res._id, devices: res.devices});
                        this.setState({name: res.name});
                    }
                })
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
        let { isLoaded, error, username, password, name} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if(name !== ""){
            return <Redirect to={"/device_select"}/>;
        }
        else {
            {/*TODO: isLoaded error handling*/}
            return (
                <Form className={"form-global"}>
                    <h3>Login</h3>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type={"text"} name={"username"}
                                      onChange={this.handleChange.bind(this)}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name={"password"}
                                      onChange={this.handleChange.bind(this)}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me"/>
                    </Form.Group>
                    {/*<LinkContainer to={"/"}>*/}

                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        Submit
                    </Button>
                    {/*</LinkContainer>*/}
                    {/*<AfterSubmit name={this.state.name}/>*/}
                </Form>
            );
        }
    }
}


export {Login};