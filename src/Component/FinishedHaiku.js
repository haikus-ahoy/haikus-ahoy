import React, { Component } from 'react';
import firebase from '../firebase';

class FinishedHaiku extends Component {
    constructor() {
        super();
    
        this.state = {
            completedHaiku: '',
        }
    }

    componentDidMount() {
        const haikuString = this.props.convertHaikuToString();
        this.setState({
            completedHaiku: haikuString,
        })
        console.log(this.props.renderedHaiku);
    }

    // function to save the completed haiku to Firebase
    saveHaikuToFirebase = () => {
        const dbRef = firebase.database().ref('/userHaikus');
        dbRef.push(this.props.convertHaikuToString());
    }

    // bindInput = (event) => {
    //     this.setState({
    //         completedHaiku: event.target.value,
    //     })
    // }

    render() {
        return(
            <div>
                <p>{this.props.renderedHaiku}</p>
                <button onClick={this.saveHaikuToFirebase}>save haiku</button>

                {/* <input type="text" onChange={this.bindInput}/> */}
            </div>
        )
    }
}

export default FinishedHaiku