import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class Login extends Component {
    render() {
        return(
            <Form className={"form-global"}>
                <h3>Login</h3>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <LinkContainer to={"/"}>
                    <Button variant="primary" type="submit" onClick={()=>this.props.onReq("true")}>
                        Submit
                    </Button>
                </LinkContainer>
            </Form>
        );
    }
}


export {Login};