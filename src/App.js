import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {

    const dummyData = [];
    for (let i = 0; i < 10; i++) {
      dummyData.push({
        word: "umbrella",
        numSyllables: 3
      })
    }

    super();

    this.state = {
      lineOne: [],
      getUserWord: [],
      seedWord: '',
      currentMatches: dummyData
    }
    console.log(this.state.currentMatches);
  }

  // function to get the user input, which makes the API call to the Datamuse API
  getUserWord = () => {
    const seedWord = this.state.seedWord;
    console.log(this.state.seedWord)

    // API call to Datamuse to get the syllable count for the user input, and to error handle potential spelling mistakes
    axios({
      url: `http://api.datamuse.com/words?md=s&sp=${seedWord}`,
      method: 'GET',
      dataResponse: 'json',
    })
      // a promise to return a successful or unsuccessful API call
      .then(response => {
        console.log("resp", response);
        // a variable to store the data from the API
        response = response.data;
        // a variable to store the word value from the first entry in the array
        const word = response[0].word;
        // a variable to store the number of syllables value from the first entry in the array
        const numSyllables = response[0].numSyllables;
        console.log(word, numSyllables);
        console.log(`"${word}" has ${numSyllables} syllables.`);
        // if the user input word is less than 6 syllables
        if (seedWord === word && numSyllables < 6) {
          console.log(`The first line has ${5 - numSyllables} syllables remaining.`);
          // a variable that holds a copy of the line one array in state
          const newFirstLine = [...this.state.lineOne];
          // pushes the word and number of syllables values of the the user input word to the newFirstLine array
          newFirstLine.push({ 'word': word, 'numSyllables': numSyllables })

          // sets state of lineOne to be equal to the value of newFirstLine
          this.setState({
            lineOne: newFirstLine,
          });
          console.log(this.state.lineOne);
          // if the user's word has too many syllables, prompt an error
        } else if (seedWord === word && numSyllables < 5) {
          console.log(`Think of a word between 1 and 5 syllables and try again.`);
          // error handling for if the user misspells their word
        } else {
          console.log(`It looks like you meant to type "${word}". Please try again.`);
        }
        // more error handling - if word cannot be found, or is spelled too incorrectly to be recognized
      }).catch((response) => {
        console.log(`"${seedWord}" is not a word that I know.`);
      })
  }

  getWordSuggestions = () => {
    const previousWord = this.state.seedWord;
    console.log('hello', previousWord);
    axios({
      url: `http://api.datamuse.com/words?lc=${previousWord}&md=s`,
      method: 'GET',
      dataResponse: 'json',
    })
      // a promise to return a successful or unsuccessful API call
      .then((response) => {
        console.log(response);
      })
  }


  // click event for our button
  handleClick = (e) => {
    // prevents default action
    e.preventDefault();
    // calls the getUserInput function, which calls the API
    this.getUserWord();
    this.getWordSuggestions();
  }

  // keeps track of the user's keystrokes in the input field
  handleChange = (event) => {
    // sets state of seedWord according to the user's input
    this.setState({
      seedWord: event.target.value
    })
    console.log(this.state)
  }

  render() {
    return (

      <div>
        <form action="submit">
          <label htmlFor="word">Input Starting Word Here</label>
          <input onChange={this.handleChange} value={this.state.seedWord} id="word" name="word" type="text" />
          <button onClick={this.handleClick}>Submit</button>
        </form>


        <div className="nextWordOption">
          <ul>
            {this.state.currentMatches.map((result, i) => {
              return (
                <li key={i}>{result.word}</li>
              )
            })}
          </ul>
        </div>



      </div>
    );
  }
}
export default App;
