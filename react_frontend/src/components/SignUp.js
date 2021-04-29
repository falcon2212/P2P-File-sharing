import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Col, Container, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Redirect} from "react-router";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isSubmitted: false,
            error: null,
            username: "",
            password: "",
            name: "",
            email: ""
        };
    }

    componentDidMount() {
        fetch("https://window-drop.azurewebsites.net/start")
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
        fetch("https://window-drop.azurewebsites.net/users/add", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: this.state.username, password: this.state.password, email: this.state.email, name: this.state.name})
        })
            .then(res => res.json())
            .then(
                res => {
                    {/*TODO: username already exists condition*/}
                    if(res === null){
                        console.log("Username password do not match");
                        alert("username password do not match");
                    }
                    else{
                        console.log(res);
                        this.props.onReq(true, {username: this.state.username, name: this.state.name});
                        this.setState({isSubmitted: true});
                    }
                })
            .catch(
                err => {
                    console.log(err);
                }
            );
    }

    handleChange(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        this.setState({[fieldName]: fieldVal});
    }

    render() {
        let { isLoaded, isSubmitted, error, username, password, email} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        else if(isSubmitted){
            return <Redirect to={"/dashboard"}/>;
        }
        else {
            return (
                <Container className={"justify-content-center mb-5 mt-5"}>
                    <Form onSubmit={ () => this.handleSubmit()}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control name={"username"} placeholder="For eg, brain_freeze, v-house" onChange={this.handleChange.bind(this)}/>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name={"email"} type="email" placeholder="Enter email" onChange={this.handleChange.bind(this)}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name={"password"} type="password" placeholder="Password" onChange={this.handleChange.bind(this)}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="formGridFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control name={"name"} onChange={this.handleChange.bind(this)}/>
                        </Form.Group>

                        <Form.Group controlId="formGridSecondName">
                            <Form.Label>Second name</Form.Label>
                            <Form.Control/>
                        </Form.Group>

                        {/*<LinkContainer to={"/"}>*/}
                            <Button variant="primary" onClick={() => this.handleSubmit()}>
                                Submit
                            </Button>
                        {/*</LinkContainer>*/}
                    </Form>
                </Container>
            );
        }
    }
}

export {SignUp};