import React, { Component } from 'react';
import firebase from '../firebase';

class FinishedHaiku extends Component {
    constructor() {
        super();
    
        this.state = {
            completedHaiku: '',
            haikuKeys: [],
            saveConfirmedMessage: '',
        }
    }

    componentDidMount() {
        const haikuString = this.props.convertHaikuToString();
        this.setState({
            completedHaiku: haikuString,
        })
        console.log(this.props.renderedHaiku);

        const dbRef = firebase.database().ref('/userHaikus');

        // this sort of works, but the firebase docs are a mess
        const haikuKeys = [];
        dbRef.orderByKey().on('child_added', (dataSnapshot) => {
            console.log(dataSnapshot.key);
            haikuKeys.push(dataSnapshot.key);

            // dataSnapshot.forEach(haiku => firebaseArray.push(haiku));
            // console.log(firebaseArray);

            // const userHaikusLength = dataSnapshot.numChildren();
            // const randomIndex = Math.floor(Math.random() * userHaikusLength);
            // console.log(randomIndex);
        });

        this.setState({
            haikuKeys: haikuKeys,
        });
    }

    // function to save the completed haiku to Firebase
    saveHaikuToFirebase = () => {
        const dbRef = firebase.database().ref('/userHaikus');
        dbRef.push(this.props.convertHaikuToString());
        // this.setState({
        //     saveConfirmedMessage: "Thank you for sharing your haiku!",
        // })
    }

    render() {
        return(
            <div>
                <p>{this.props.renderedHaiku}</p>
                {/* <button disabled={this.state.saveConfirmedMessage? true: false} onClick={this.saveHaikuToFirebase}>save haiku</button>
                <p>{this.state.saveConfirmedMessage}</p> */}
            </div>
        )
    }
}

export default FinishedHaiku