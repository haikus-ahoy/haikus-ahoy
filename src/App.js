import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

class App extends Component {
  constructor() {  
    super();

    this.state = {
      lineOne: [],
      getUserWord: [],
      seedWord: '',
      allBoatWords:[],
      wordOptions: [],
      currentMatches: [],
      currentThreeBoatWords: [],
      lineOneSyllables: 0,
      lineTwoSyllables: 0,
      lineThreeSyllables: 0,
    }
    
  }

  componentDidMount(){
    this.getShipWords();
  }
  
  // function to get the user input, which makes the API call to the Datamuse API
  getUserWord = () => {
    const seedWord = this.state.seedWord;
   

  // API call to Datamuse to get the syllable count for the user input, and to error handle potential spelling mistakes
  axios({
    url: `http://api.datamuse.com/words?md=s&sp=${seedWord}`,
    method: 'GET',
    dataResponse: 'json',
    })
    // a promise to return a successful or unsuccessful API call
    .then(response => {
      // a variable to store the data from the API
      response = response.data;
      // a variable to store the word value from the first entry in the array
      const word = response[0].word;
      console.log('this is word', word, response)
      // a variable to store the number of syllables value from the first entry in the array
      const numSyllables = response[0].numSyllables;
      // console.log(`"${word}" has ${numSyllables} syllables.`);
      // if the user input word is less than 6 syllables
      if (seedWord === word && numSyllables < 6) {
        // console.log(`The first line has ${5 - numSyllables} syllables remaining.`);
        // a variable that holds a copy of the line one array in state
        const newFirstLine = [...this.state.lineOne];
        // pushes the word and number of syllables values of the the user input word to the newFirstLine array
        newFirstLine.push({ 'word': word, 'numSyllables': numSyllables})
        this.getWordSuggestions(); 
        //counting the first word
        const firstWordSyllableCount = this.countSyllables(newFirstLine);
        console.log('first word syllable count', firstWordSyllableCount)
        // sets state of lineOne to be equal to the value of newFirstLine
        this.setState({
          lineOne: newFirstLine,
          lineOneSyllables: firstWordSyllableCount,
        });
        // console.log(this.state.lineOne);
        // if the user's word has too many syllables, prompt an error

        //set state for 
      } else if (seedWord === word && numSyllables > 5) {
        
        // console.log(`Think of a word between 1 and 5 syllables and try again.`);
        return;
        // error handling for if the user misspells their word
      } else {
        // console.log(`It looks like you meant to type "${word}". Please try again.`);
        return;
      }
        // more error handling - if word cannot be found, or is spelled too incorrectly to be recognized
    }).catch((response) => {
      // console.log(`"${seedWord}" is not a word that I know.`);
    })
  }

  //Get a second API call for words that might follow seedWord in a sentence
  getWordSuggestions = () => {
    //create a variable for seedWord
    const previousWord = this.state.seedWord;
    //call Axios
    axios({
      url: `http://api.datamuse.com/words?lc=${previousWord}&md=s`,
      method: 'GET',
      dataResponse: 'json',
    })
    // a promise to return a successful or unsuccessful API call
    .then((response) => {
      const wordOptionsArray = [];
      for(let i = 0; i < 7; i++){
        wordOptionsArray.push(response.data[i])
      }
      const threeBoatWords = this.grabThree();
      ////////////////////////////////////////////////////////////
      //we need to concat the chosenboat words that we will creat
      console.log(this.state.currentThreeBoatWords, 'these boat words now')
      const fullWordOptionsArray = wordOptionsArray.concat(this.state.currentThreeBoatWords);
        this.setState({
        wordOptions: fullWordOptionsArray,
      })
    })
  }
  //a third API call to get some words related to boats
  getShipWords = () => {
    axios({
      url: `http://api.datamuse.com/words?topics=boat&md=s&max=1000`,
      method: 'GET',
      dataResponse: 'json',
    // a promise to return a successful or unsuccessful API call
    }).then((responseTwo) => {
      const filterdSyllables = responseTwo.data.filter(result => {
        return result.numSyllables < 4
      })
      this.setState({
        allBoatWords: filterdSyllables,
      }, () => {
        this.grabThree();
      }
      //////////////////////////////////////////////////////////////
      //get three boat words here not alone without knowing the axios is done
      )
    })
  }
  //this will be modified when haiku is in working progress. 
  grabThree = ()=>{
    //a function to return words with syllables less than *4*
    const allBoatWords = [...this.state.allBoatWords];
    const filterdSyllables = allBoatWords.filter(result => {
        return result.numSyllables < 4
      } )
    //a variable for the top three random words
    const topThree = [];
    //a for loop to filter through the array
    for (let i = 0; i < 3; i++) {
      //if the array returns less than three words, break 
      if (filterdSyllables.length < 1) {
        break
      } else {
        //otherwise create a variable for length
        const length = filterdSyllables.length;
        //create a variable for randomIndex
        const randIndex = Math.floor(Math.random() * length);
        //push the three random boat words to topThree
        topThree.push(filterdSyllables.splice(randIndex, 1)[0]);
        }
    }
    this.setState({
      currentThreeBoatWords: topThree
    })
    return topThree;
  }

  // click event for our button
  handleClick = (e) => {
    // prevents default action
    e.preventDefault();
    // calls the getUserInput function, which calls the API
    this.getUserWord();
  }

  // keeps track of the user's keystrokes in the input field
  handleChange = (event) => {
    // sets state of seedWord according to the user's input
    this.setState({
      seedWord: event.target.value
    }) 
  }

//adds the selected button to the line one array
  buttonWordChoice = (event, index) => {
    //event prevent default
    event.preventDefault();
    //saving line one in a copy
    const lineOne = [...this.state.lineOne]
    //creating a variable for the new word
    const newWord = this.state.wordOptions[index]
    console.log(this.state.wordOptions, "this is the new word")
    //push the new word to the lineOne array
    lineOne.push(newWord)
    //set state so that lineOne is the new lineOne and seedWord is the newWord's property of word
    this.setState ({
      lineOne: lineOne,
      seedWord: newWord.word,
      }, 
      //doing a callback to the getWordSuggestions so we can repopulate the options
      () => {
        //call get word suggestions to repopulate the next word options 
        this.getWordSuggestions()
        const currentSyllables = this.countSyllables(lineOne)
        this.setState({
          lineOneSyllables: currentSyllables
        }, () => {
          console.log(this.state.lineOneSyllables, "this is line one syllables")
        })
      }
    )
  }

  //sends the number of syllables to the lineOneSyllables array
  countSyllables = (lineOne) => {
    const syllableReduce = lineOne.reduce((total, word) =>{
      return total + word.numSyllables
    }, 0 )
    return syllableReduce
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
        <h2>Word Options</h2>
          <ul>
            {/* //mapping over the wordOptions array and displaying to the page  */}
            {this.state.wordOptions.map((result, i) => {
              return (
                // Creating an onClick listener for each button appended to the page 
                <li key={i}><button onClick={(event) => { this.buttonWordChoice(event, i)} } className="wordButton">
                {result.word}
                </button></li>
              )
            })}
          </ul>

        </div>
        <div>
          <h2>Haiku</h2>
          <div className="lines">
            <h3>Line One</h3>
            <ul>
              {this.state.lineOne.map((result, i) => {
                return (<li key={i}>{result.word}</li>)
                }
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
