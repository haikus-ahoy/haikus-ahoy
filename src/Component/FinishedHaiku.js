import React, { Component } from 'react';
import firebase from '../firebase';

class FinishedHaiku extends Component {
    constructor() {
        super();
    
        this.state = {
            completedHaiku: '',
            haikuKeys: [],
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
        console.log('HIIIIII', haikuKeys);
    }

    // function to save the completed haiku to Firebase
    saveHaikuToFirebase = () => {
        const dbRef = firebase.database().ref('/userHaikus');
        dbRef.push(this.props.convertHaikuToString());
    }

    render() {
        return(
            <div>
                <p>{this.props.renderedHaiku}</p>
                <button onClick={this.saveHaikuToFirebase}>save haiku</button>
            </div>
        )
    }
}

export default FinishedHaiku