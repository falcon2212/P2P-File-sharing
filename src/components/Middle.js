import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Home} from "./Home";
import {About} from "./About";
import {FAQ} from "./FAQ";

class Middle extends Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         middle_content: this.props.middle_content
    //     };
    // }

    render() {
        let middle;
        if(this.props.middle_content === "home"){
            middle = <Home/>;
        }
        else if(this.props.middle_content === "about"){
            middle = <About/>;
        }
        else if(this.props.middle_content === "faq"){
            middle = <FAQ/>;
        }
        return(
            middle
        );
    }
}

export {Middle};