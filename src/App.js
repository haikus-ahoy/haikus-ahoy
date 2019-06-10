import React, { Component } from 'react';
import axios from 'axios';
import Instructions from './Instructions.js';
import {
BrowserRouter as Router,
Route, Link} from 'react-router-dom';
import './App.css';

class App extends Component {
  constructor() {  
    super();
    //set state for each of the lines, the whole Haiku, the user's word, the seed word for getting more results, all the boat words form the initial axios call *************
    this.state = {
      lineOne:[],
      lineTwo:[],
      lineThree:[],
      wholeHaiku: [],
      getUserWord: [],
      userWord: '',
      seedWord: '',
      allBoatWords:[],
      wordOptions: [],
      currentMatches: [],
      currentThreeBoatWords: [],
      lineTwoSyllables: 0,
      lineThreeSyllables: 0,
      syllableFilter: 4,
    }
    
  }
  //calling the function of the axios call for all the ship words that we pull three at a time from 
  componentDidMount(){
    this.getShipWords();
  }
  
  // function to get the user input, which makes the API call to the Datamuse API
  getUserWord = () => {
    const seedWord = this.state.seedWord.toLowerCase();
   

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
      // a variable to error handle if word is spelled wrong, and get the first word in the array of suggested correct spellings
      const word = response[0].word;
      // a variable to store the number of syllables value from the first entry in the array
      const numSyllables = response[0].numSyllables;
      // if the user input word is less than 6 syllables
      const regEx = /^$|\s+/
      if (seedWord === word && numSyllables < 6) {
        // a variable that holds a copy of the line one array in state
        const newWholeHaiku = [...this.state.wholeHaiku];
        // pushes the word and number of syllables values of the user input word to the newWholeHaiku array
        newWholeHaiku.push({ 'word': word, 'numSyllables': numSyllables})
        this.getWordSuggestions(word); 
        // sets state of wholeHaiku to be equal to the value of newWholeHaiku, reset user input to nothing 
        this.setState({
          wholeHaiku: newWholeHaiku,
          seedWord: ''
        },
          this.distributeSyllables);
        // if the user's word has too many syllables, prompt an error
      } else if (seedWord === "" || seedWord === " " || seedword === regEx.test(seedWord) ) {
        alert('Please type in a word to get started!')
      }
        else if (seedWord === word && numSyllables > 5) {
        alert('Please think of a word that is less than 5 syllables');
        return;
        // error handling for if the user misspells their word
      } else if (!regEx.test(seedWord) ) {
        alert('Please enter a word')
      } else {
        alert(`It looks like you meant to type "${word}". Please try again.`);
        return;
      }
        // more error handling - if word cannot be found, or is spelled too incorrectly to be recognized
    }).catch((response) => {
      alert(`Sorry, ${seedWord} is not a word that I know.`);
    })
  }

  //Get a second API call for words that might follow seedWord in a sentence
  getWordSuggestions = (previousWord) => {
    //create a variable for seedWord
    // const previousWord = this.state.seedWord;
    //call Axios
    axios({
      url: `http://api.datamuse.com/words?lc=${previousWord}&md=s`,
      method: 'GET',
      dataResponse: 'json',
    })
    // a promise to return a successful or unsuccessful API call
    .then((response) => {
      //copying syllable filter, which is set to 4 in state
      const syllableFilter = this.state.syllableFilter;
      //creating a variable for numbers
      const RegEx = /1|2|3|4|5|6|7|8|9|0/
      //filtering out punctuation and making sure the words being generated are less than the sylable filter based on the conditionals in the syllableFilter below
      const filterPunctuation = response.data.filter((hit) => {
        return !RegEx.test(hit.word) && hit.word !== "." && hit.numSyllables <= syllableFilter;
      })
      //Create an empty word array
      const wordOptionsArray = [];
      //push the filteredPunctuation words into the wordOptionsArray
      for(let i = 0; i < 7; i++){
        wordOptionsArray.push(filterPunctuation[i])
      }
      // filter undefined hits
      const filteredWordOptions = wordOptionsArray.filter(element => {
        return element !== undefined;
      });
      //grabbing threeBoatWords from below, and concatonating them to the filteredWordOptions to display for the user to pick from 
      const threeBoatWords = this.grabThree();
      const fullWordOptionsArray = filteredWordOptions.concat(this.state.currentThreeBoatWords);
      //setting state of wordOptions to fullWordOptionsArray
      this.setState({
        wordOptions: fullWordOptionsArray,
      })
    })
    //error checking 
    .catch(() => {
      alert(`We're sorry, we're having some issues with our data manager. Please check back later!`)
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
      //filtering the results based on the conditional filter of syllables below
      const filterdSyllables = responseTwo.data.filter(result => {
        return result.numSyllables < 4
      })
      //setState of allBoatWords to the filteredSyllables boat words
      this.setState({
        allBoatWords: filterdSyllables,
      }, () => {
        //callgrabThree function to insure it is called only when API call is successsful
        this.grabThree();
      }
      )
    })
  }
  //grab three boat words form the one API call on componentDidMount
  grabThree = ()=>{
    //a copy of allBoatWrods
    const allBoatWords = [...this.state.allBoatWords];
    //a copy of syllableFitler
    const syllableFilter = this.state.syllableFilter;
    //filtering the boat words based on how many syllables are reuqired based on how many syllables are left per line for the user
    const filterdSyllables = allBoatWords.filter(result => {
      return result.numSyllables <= syllableFilter;
      } )
    //a variable for the top three random words
    const topThree = [];
    //a for loop to filter through the array
    for (let i = 0; i < 3; i++) {
      //if the array returns less than one words, break 
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
      //set the state for currentThreeBoatWords to topThree
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
    const wholeHaiku = [...this.state.wholeHaiku]
    //creating a variable for the new word
    const newWord = this.state.wordOptions[index]
    //push the new word to the wholeHaiku array
    wholeHaiku.push(newWord)
    //set state so that wholeHaiku is the new wholeHaiku and seedWord is the newWord's property of word
    this.setState ({
      wholeHaiku: wholeHaiku,
      // seedWord: newWord.word,
      seedWord: '',
      }, 
      //doing a callback to the getWordSuggestions so we can repopulate the options
      () => {
        //call get word suggestions to repopulate the next word options 
        this.getWordSuggestions(newWord.word)
        //calling the function to count syllables
        this.distributeSyllables();
      }
    )
  }

  //sends the number of syllables to the wholeHaikuSyllables array
  countSyllables = (haikuArray) => {
    const syllableReduce = haikuArray.reduce((total, word) =>{
      return total + word.numSyllables
    }, 0 )
    return syllableReduce
  }
  
  //a function to check the syllable count of each line and push the lines to the state
  distributeSyllables = () => {
    //a copy of whole Haiku
    const wholeHaiku = [...this.state.wholeHaiku];
    //save an array for each line
    const lineOne =[];
    const lineTwo =[];
    const lineThree= [];
    //create a variable to start the syllable count at four
    let syllableFilter = 4;
    //going through the wholeHaiku, which is the created Haiku thus far at any given moment
    wholeHaiku.forEach((count, i) => {
      //grab a slice of wholeHaiku so we can count the number of syllables
      const haikuSlice = wholeHaiku.slice(0, i+1);
      const sliceSyllables = this.countSyllables(haikuSlice);
      
      //depending on our current number of syllables, push the word to the matching line 
      //also calculate the number of syllables remaining for that line
      if (sliceSyllables < 6){
        lineOne.push(wholeHaiku[i]);
        syllableFilter = 5 - this.countSyllables(lineOne);
      } else if (sliceSyllables < 13){
        lineTwo.push(wholeHaiku[i])
        syllableFilter = 7 - this.countSyllables(lineTwo);
      } else if (sliceSyllables < 18){
        lineThree.push(wholeHaiku[i])
        syllableFilter = 5 - this.countSyllables(lineThree);
      } 
      //when the syllable filter is less than 1, rest to 0 so the user wil be given options for the next line
      if (syllableFilter < 1){
        syllableFilter = 4;
      }
      
    })
    //set the state for lineOne to lineThree and syllableFilter
   this.setState({
     lineOne: lineOne,
     lineTwo: lineTwo,
     lineThree: lineThree,
     syllableFilter: syllableFilter,
   })
}

//creating a function to remove the last word in the Haiku if the user wants 
removeLastWord = () => {
  //copying Haiku
  const wholeHaikuCopy = [...this.state.wholeHaiku];
  //removing last word
  wholeHaikuCopy.pop();
  //set state to the Haiku without the last word 
  this.setState({
    wholeHaiku: wholeHaikuCopy,
  },
  //make sure it won't crash if the user exits back to the first word 
  () => {
    this.distributeSyllables();
    if (wholeHaikuCopy.length === 0) {
      this.setState({
        wordOptions: [],
      })
      return null;
    }
    //calling the API to get word suggestions 
    const newLastWord = wholeHaikuCopy[wholeHaikuCopy.length - 1].word;
    this.getWordSuggestions(newLastWord);
  })
}  

//creating a function to display the syllable count 
syllableDisplay (currentLine) {
  //creating a boolean for when each line is full 
  const lineOneFull = this.countSyllables(this.state.lineOne) === 5;
  const lineTwoFull = this.countSyllables(this.state.lineTwo) === 7;
  const lineThreeFull = this.countSyllables(this.state.lineThree) === 5;
  
  //creating conditions for displaying the syllable counts
  if (lineOneFull && lineTwoFull && lineThreeFull) {
    // all lines remove syllable display
    return ([])
    //if lines one and two are full and we're on the third line
  } else if (lineOneFull && lineTwoFull && !lineThreeFull) {
    if (currentLine === this.state.lineThree) {
      // count current syllables remaining
      const syllablesRemain = 5 - this.countSyllables(currentLine);
      // return lineThree's display here
      return <div><p>{syllablesRemain + " syllables remain"}</p></div>
    } else {
      // don't return lineOne or lineTwo's displays here
      return ([]);
    }
    //if line one is full and we're on line two 
  } else if (lineOneFull && !lineTwoFull) {
    if (currentLine === this.state.lineTwo) {
      //count current syllables remaining 
      const syllablesRemain = 7 - this.countSyllables(currentLine);
      // return lineThree's display here
      return <div><p>{syllablesRemain + " syllables remain"}</p></div>
    } else {
      // don't return lineOne or lineThree's displays here
      return ([]);
    }
    //if line one is not full then display line one syllable count 
  } else if (!lineOneFull) {
    if (currentLine === this.state.lineOne) {
      const syllablesRemain = 5 - this.countSyllables(currentLine);

      // return lineThree's display here
      return <div><p>{syllablesRemain + " syllables remain"}</p></div>
    } else {
      return ([]);
    }
    
  }
  
}

  render() {
    return (
      <Router>
        <div className="wrapperBig">
          <Instructions />
          <div className="form">
            <div className="container">
              <div className="wrapperSmall">
                <form action="submit">
                  <label htmlFor="word">Input Starting Word Here</label>
                  <input onChange={this.handleChange} value={this.state.seedWord} id="word" name="word" type="text" disabled={this.state.wholeHaiku.length > 0 ? true : false}/>
                  <button disabled={this.state.wholeHaiku.length > 0 ? true : false } onClick={this.handleClick}>Submit</button>
                </form>
                {/* wrapperSmall */}
              </div>
              {/* container */}
            </div>
            {/* form */}
          </div>

          <div className="nextWordOption">
            <div className="containter">
              <div className="wrapperSmall">
                <h2>Word Options</h2>
                  <ul>
                    {/* //mapping over the wordOptions array and displaying to the page  */}
                    {this.state.wordOptions.map((result, i) => {
                    return (
                        // Creating an onClick listener for each button appended to the page 
                        <li key={i}><button disabled={this.countSyllables(this.state.wholeHaiku)>= 17 ? true : false}  onClick={(event) => { this.buttonWordChoice(event, i)} } className="wordButton">
                          {result.word}
                        </button></li>
                      )
                    })}
                  </ul>
                {/* wrapperSmall */}
              </div>
              {/* container */}
            </div>
          {/* nextwordoption */}
          </div>
          <div className="haiku">
            <div className="container">
              <div className="wrapperSmall">

                <h2>Haiku</h2>
                {this.state.wholeHaiku.length > 0 ? <button id="removeLastItem" onClick={this.removeLastWord}>Remove last item</button> : null}
                <div className="flexParent">
              
                  <div className="lines">
                    <h3>Line One</h3>
                    <ul>
                      {this.state.lineOne.map((result, i) => {
                        return (<li key={i}>{result.word}</li>)
                      })}
                    </ul>
                    {
                      this.syllableDisplay(this.state.lineOne)
                    }
                    {/* lines */}
                  </div>
                  <div className="lines">
                    <h3>Line Two</h3>
                    <ul>
                      {this.state.lineTwo.map((result, i) => {
                      return (<li key={i}>{result.word}</li>)
                      }
                      )}
                    </ul>
                    {
                      this.syllableDisplay(this.state.lineTwo)
                    }
                  </div>
                  <div className="lines">
                    <h3>Line Three</h3>
                    <ul>
                      {this.state.lineThree.map((result, i) => {
                        return (<li key={i}>{result.word}</li>)
                      }
                      )}
                    </ul>
                    {
                      this.syllableDisplay(this.state.lineThree)
                    }
                  </div>
                  <div>
                    {this.countSyllables(this.state.wholeHaiku) >= 17 ? <button>Click to see whole poem</button> : null}
                  </div>
                  <div className="wholeHaiku">
                    <h3>Whole Haiku</h3>
                    <ul>
                      {this.state.wholeHaiku.map((result, i) => {
                        return (<li key={i}>{result.word}</li>)
                      }
                      )}
                    </ul>
                    
                    {/* {this.countSyllables(this.state.wholeHaiku) === 17 ? console.log("true") : console.log("false") } */}
                  </div>
                </div>
              {/* wrapperSmall */}
              </div>
            {/* container */}
            </div>
          {/* haiku */}
          </div>         
        {/* WrapperBig */}
        </div>
      </Router>
    );
  }
}
export default App;
