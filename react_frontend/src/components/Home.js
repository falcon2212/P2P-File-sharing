import React, { useState, useEffect, Component } from "react";
import {Button, Jumbotron} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class Home extends Component {
    render() {
        return (
            <Jumbotron>
                <h1>P2P file sharing</h1>
                <p>
                    This is a peer to peer file sharing app, intending to act as a medium to share files amongst personal devices.
                </p>
                <p>
                    <LinkContainer to={"/about"}>
                        <Button variant="info">Learn more</Button>
                    </LinkContainer>
                </p>
            </Jumbotron>
        );
    }
}

export {Home};