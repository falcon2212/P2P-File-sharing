import React, { useState, useEffect, Component } from "react";
import {Col, ListGroup, Nav, Row, Tab} from 'react-bootstrap'
import "./dashboard.css";
import {Github} from "react-bootstrap-icons";

class About extends Component {
    render() {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">App</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Tools</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <p1>
                                    This is a peer to peer file sharing app, intending to act as a medium to share files amongst personal devices
                                    <Github href={"https://github.com/falcon2212/window-drop"} />
                                </p1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h1>Frontend</h1>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><b>React.js</b> framework</ListGroup.Item>
                                    <ListGroup.Item><b>react-bootstrap</b> components</ListGroup.Item>
                                    <ListGroup.Item><b>socket.io-client</b> for client side event handling</ListGroup.Item>
                                </ListGroup>
                                <h1>Backend</h1>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><b>Node.js</b>+<b>Express</b> framework</ListGroup.Item>
                                    <ListGroup.Item><b>socket.io</b> for event handling over network</ListGroup.Item>
                                    <ListGroup.Item><b>WebRTC</b> for peer communication</ListGroup.Item>
                                    <ListGroup.Item><b>Mongoose</b> for user management</ListGroup.Item>
                                </ListGroup>
                                <h1>DevOps</h1>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><b>WebStorm</b>, <b>VisualStudio</b> IDEs</ListGroup.Item>
                                    <ListGroup.Item><b>GitHub Actions</b> for CI/CD</ListGroup.Item>
                                    <ListGroup.Item><b>Docker</b> for containerization</ListGroup.Item>
                                    <ListGroup.Item><b>Azure</b> for deploying the app</ListGroup.Item>
                                </ListGroup>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export {About};



