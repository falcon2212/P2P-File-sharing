import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            username: "",
            password: "",
            name: "",
        };
    }

    componentDidMount() {
        fetch("http://localhost:3080")
            .then(res => res.json())
            .then((res) => this.setState({isLoaded: true,}),(err)=>{this.setState({isLoaded: true, error: err})});
    }

    getUser() {
        fetch("http://localhost:3080", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        })
            .then(res => res.json())
            .then(
                res => this.setState({
                    isLoaded: true,
                    name: res.name
                }),
                err => this.setState({
                    isLoaded: true,
                    error: err
                })
            );
        let { error, isLoaded, username, password, name} = this.state;
        if (error !== null && isLoaded && name !== "") {
            this.props.onReq(true, {username:username, name: name});
        }
    }

    render() {
        let { error, isLoaded, username, password} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        else {
            this.setState({error:null, isLoaded:false});
            return (
                <Form className={"form-global"} onSubmit={this.getUser()}>
                    <h3>Login</h3>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"
                                      onChange={this.setState({username: this})}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                                      onChange={this.setState({password: this})}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me"/>
                    </Form.Group>
                    <LinkContainer to={"/"}>
                        <Button variant="primary" type="submit"> {/*onClick={()=>this.props.onReq("true")}>*/}
                            Submit
                        </Button>
                    </LinkContainer>
                </Form>
            );
        }
    }
}


export {Login};