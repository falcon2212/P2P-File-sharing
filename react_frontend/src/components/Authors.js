import React, { Component } from "react";
import {Col, ListGroup, Nav, Row, Tab} from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";

class Authors extends Component {
    render() {
        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Srihari Vemuru</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Sushranth Hebbar</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="third">Mohammad Khalid</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <h1>Role</h1>
                                <p1>Frontend design, integration, network logic</p1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h1>Role</h1>
                                <p1>Backend, network logic</p1>
                            </Tab.Pane>
                            <Tab.Pane eventKey="third">
                                <h1>Role</h1>
                                <p1>DevOps tools</p1>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

export {Authors};