import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button, Col, Container, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class Sign_up extends Component {
    render() {
        return(
            <Container className={"justify-content-center mb-5 mt-5"}>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="For eg, brain_freeze, v-house" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridFirstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control />
                    </Form.Group>

                    <Form.Group controlId="formGridSecondName">
                        <Form.Label>Second name</Form.Label>
                        <Form.Control/>
                    </Form.Group>

                    <LinkContainer to={"/login"}>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </LinkContainer>
                </Form>
            </Container>
        );
    }
}

export {Sign_up};