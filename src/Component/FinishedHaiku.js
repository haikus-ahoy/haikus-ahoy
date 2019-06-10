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
    }

    // function to save the completed haiku to Firebase
    saveHaikuToFirebase = () => {
        const dbRef = firebase.database().ref('/userHaikus');
        dbRef.push(this.state.completedHaiku);
    }

    // bindInput = (event) => {
    //     this.setState({
    //         completedHaiku: event.target.value,
    //     })
    // }

    render() {
        return(
            <div>
                <p>{this.state.completedHaiku.split('\n')
                .reduce()
                }</p>
                <button onClick={this.saveHaikuToFirebase}>save haiku</button>

                {/* <input type="text" onChange={this.bindInput}/> */}
            </div>
        )
    }
}

export default FinishedHaiku