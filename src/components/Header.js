import React, { Component } from "react";
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

import "bootstrap/dist/css/bootstrap.min.css";
import "./headers.css";
import {Button, Container, Form, FormControl, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";

class Header extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         logged_in: props.logged_in
    //     };
    // }

    render() {
        let header;
        if (!this.props.logged_in) {
            header = (
                <Navbar bg="dark" variant="dark" expand="lg" sticky={"top"}>
                    <Navbar.Brand href={"/"}>WinDrop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav activeKey={"home"} className="mr-auto">
                            <Nav.Link eventKey={"home"} onSelect={()=>this.props.onReq("home")}>Home</Nav.Link>
                            <Nav.Link eventKey={"faq"} onSelect={()=>this.props.onReq("faq")}>FAQs</Nav.Link>
                            <Nav.Link eventKey={"about"} onSelect={()=>this.props.onReq("about")}>About</Nav.Link>
                            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                            {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                            {/*    <NavDropdown.Divider />*/}
                            {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                            {/*</NavDropdown>*/}
                        </Nav>
                        <Nav fill={true} className="justify-content-end">
                            <Button variant={"outline-primary"} href={"#"}>Login</Button>
                            <Button variant={"primary"} href={"#"}>Sign-up</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            );
        }
        else{
            header = (
                <Navbar bg="dark" variant="dark" expand="lg" sticky={"top"}>
                    <Container fluid={true}>
                        <Navbar.Brand onSelect={()=>this.props.onReq("home")}>WinDrop</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav defaultActiveKey={"home"} className="mr-auto">
                                <Nav.Link eventKey={"home"} onSelect={()=>this.props.onReq("home")}>Home</Nav.Link>
                                <Nav.Link eventKey={"faq"} onSelect={()=>this.props.onReq("faq")}>FAQs</Nav.Link>
                                <Nav.Link eventKey={"about"} onSelect={()=>this.props.onReq("about")}>About</Nav.Link>
                                {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                                {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                                {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                                {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                                {/*    <NavDropdown.Divider />*/}
                                {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                                {/*</NavDropdown>*/}
                            </Nav>
                            <Nav fill={true} className={"justify-content-end"}>
                                <NavDropdown eventKey={1} id="basic-nav-dropdown" drop={"down"}
                                title={
                                    <Image dir={"public/logo192.png"} alt={"user pic"}/>
                                }>

                                    <NavDropdown.Item eventKey={1.1} href="#profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item eventKey={1.2}>
                                        <i className="fa fa-sign-out"></i> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            );
        }
        return (
            header
        );
    }
}

export { Header };