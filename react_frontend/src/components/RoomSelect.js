import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"
import {Button, Form} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Redirect} from "react-router";

let APP_CONFIG = require("../config/app_config");
const ENDPOINT = APP_CONFIG.BACKEND_ENDPOINT;

class RoomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: null,
        };

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.state.room = null;
    }

    handleChange(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        this.setState({[fieldName]: fieldVal});
        this.props.onRoomChange(fieldVal);
    }

    render() {
            return (
                <Form className={"form-global"}>
                    <h3>Room select</h3>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Room number</Form.Label>
                        <Form.Control type={"text"} name={"room"}
                                      onChange={this.handleChange.bind(this)}/>
                    </Form.Group>

                    <LinkContainer to={"/dashboard"}>
                        <Button variant="primary">
                            Submit
                        </Button>
                    </LinkContainer>
                </Form>
            );
    }
}


export {RoomSelect};