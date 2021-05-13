import React, {Component} from 'react';
import {ListGroup} from "react-bootstrap";

class Tmp extends Component {
    handleSelect(event){
        console.log(event);
    }
    render(){
        let l = ["hello", "hi"];
        let h = [];
        for(var i=0; i<2; i++){
            h.push(<ListGroup.Item eventKey={l[i]} variant={"info"}>{l[i]}</ListGroup.Item>);
        }
        return(
            <ListGroup onSelect={this.handleSelect.bind(this)}>
                {h}
            </ListGroup>
        );
    }
}

export { Tmp };