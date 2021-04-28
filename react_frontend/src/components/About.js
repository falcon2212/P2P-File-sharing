import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {ArrowRight, ArrowUp, ArrowUpSquareFill} from "react-bootstrap-icons";
import {Button, Container, FormFile, ListGroup} from "react-bootstrap";

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList:null,
        };
    }
    addFile = (event) => {
        console.log(event.target.files[0]);
        this.setState({fileList: event.target.files[0]});
        console.log(this.state);
    }
    render() {
        // var memberList = <ul id="memberList">No members</ul>;
        // if(this.state.memberList !== ""){
        //     memberList.innerHTML = this.state.memberList;
        // }
        return(
            <Container className={"justify-content-center mb-5 mt-5"}>
                    <FormFile onChange={(e) => {this.addFile(e)}} type={"file"} data-browse={"Select file"}/>
            </Container>
        );
    }
}

export {About};