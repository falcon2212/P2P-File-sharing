import React, { useState, useEffect, Component } from "react";
import {Button, Jumbotron} from "react-bootstrap";

class Home extends Component {
    render() {
        return (
            <Jumbotron>
                <h1>P2P file sharing</h1>
                <p>
                    This is a peer to peer file sharing app, intending to act as a medium to share files amongst personal devices.
                </p>
                <p>
                    <Button variant="info" href={"/about"}>Learn more</Button>
                </p>
            </Jumbotron>
        );
    }
}

export {Home};