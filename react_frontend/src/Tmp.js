import React, {Component} from 'react';

class Tmp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
        };
    }

    componentDidMount() {
        console.log('I was triggered during componentDidMount')
        fetch("http://localhost:3080/")
            .then(res => res.json())
            .then((res) => {
                this.setState({isLoaded: true,});
                console.log(res);
            })
            .catch((err)=>{
                this.setState({isLoaded: true, error: err});
                console.log('fuck')
                console.log(err);
            });
    }

    render(){
        return(
            <h1>Check console</h1>
        );
    }
}

export { Tmp };