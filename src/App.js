import React, { Component } from 'react';
import axios from 'axios';
import Modal from './Modal.js';
import Haiku from './Component/Haiku.js';
import Swal from 'sweetalert2';
import Instructions from './Instructions.js';
import './App.css';

class App extends Component {
  // tiny change to see 
  constructor() {  
    super();
    //set states
    this.state = {
      //state for each line
      lineOne:[],
      lineTwo:[],
      lineThree:[],
      //state for whoel haiku
      wholeHaiku: [],
      //state for user word
      getUserWord: [],
      //state for the word that populates the next word options
      seedWord: '',
      //state for all the boat words called
      allBoatWords:[],
      //state for the next word options
      wordOptions: [],
      //state for the current matches of the next words
      currentMatches: [],
      //state for the three boat words that will be added
      currentThreeBoatWords: [],
      //state for the syllable counter
      syllableFilter: 4,
      //states for the modals to show and not show
      isShowing: false,
      showFinishedHaiku: false,
      showPoem: false,
    }
    //create ref object for scroll
    this.containerRef = React.createRef();
  }

  //calling the function of the axios call for all the ship words that we pull three at a time from 
  componentDidMount(){
    this.getShipWords();
    this.setState ({
      isShowing:true,
    })
  }

  //smooth scroll
  scrollToElement = () => {
    window.scrollTo(0, this.containerRef.current.offsetTop);
  }

  //functions for modals for instructions and poem at end
  closeModalHandler = () => {
    this.setState({
      isShowing: false
    });
  }

  openPoem = () =>{
    this.setState({
      showPoem:true,
    })
  }
  closePoem = () =>{
    this.setState({
      showPoem: false,
    })
  }
   refreshPage = () => {
     window.location.reload(); 
   }


  // function to get the user input, which makes the API call to the Datamuse API
  getUserWord = () => {
    const seedWord = this.state.seedWord.toLowerCase();
   

  // API call to Datamuse to get the syllable count for the user input, and to error handle potential spelling mistakes
  axios({
    url: `https://api.datamuse.com/words?md=s&sp=${seedWord}`,
    method: 'GET',
    dataResponse: 'jsonp',
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
      } else if (seedWord === word && numSyllables > 5) {
        Swal.fire({
          type: 'error',
          text: 'Please enter a word that is less than 5 syllables',
        })
        return;
        // error handling for if the user misspells their word
      } else {
        Swal.fire({
          type: 'error',
          text: `It looks like you meant to type "${word}". Please try again.`,
        })
        return;
      }
        // more error handling - if word cannot be found, or is spelled too incorrectly to be recognized
    }).catch((response) => {
      if (seedWord === undefined || seedWord === "" || seedWord ===" ") {
        Swal.fire({
          type: 'error',
          text: `Please type in a word to get started.`,
        })
      } 
      else {
        Swal.fire({
          type: 'error',
          text: `Sorry, ${seedWord} is not a word that I know. If it looks like a word it is also possible that the data manager is not working in which case, please check back later!`,
        })
      }
      
    })
  }

  //Get a second API call for words that might follow seedWord in a sentence
  getWordSuggestions = (previousWord) => {
    //call Axios
    axios({
      url: `https://api.datamuse.com/words?lc=${previousWord}&md=s`,
      method: 'GET',
      dataResponse: 'jsonp',
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
      this.grabThree();
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
      url: `https://api.datamuse.com/words?topics=boat&md=s&max=1000`,
      method: 'GET',
      dataResponse: 'jsonp',
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
  handleSubmit = (e) => {
    // prevents default action
    e.preventDefault();
    // calls the getUserInput function, which calls the API
    this.getUserWord();
    
    setTimeout(()=>{
      // run this method to execute scrolling.
      this.scrollToElement();
    }, 100)
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
  syllableDisplay = (currentLine) => {
    //creating a boolean for when each line is full 
    const lineOneEmpty = this.countSyllables(this.state.lineOne) === 0;
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
        return <div><p>{"You are on Line Three. " +syllablesRemain + " syllables remain"}</p></div>
      } else {
        // don't return lineOne or lineTwo's displays here
        return ([]);
      }
      //if line one is full and we're on line two 
    } else if (lineOneFull && !lineTwoFull) {
      if (currentLine === this.state.lineTwo) {
        //count current syllables remaining 
        const syllablesRemain = 7 - this.countSyllables(currentLine);
        // return lineTwo's display here
        return <div><p>{"You are on Line Two. " + syllablesRemain + " syllables remain"}</p></div>
      } else {
        // don't return lineOne or lineThree's displays here
        return ([]);
      }
      //if line one is not full then display line one syllable count 
    } else if (lineOneEmpty === true) {
      return ([]);
    } else if (!lineOneFull) {
      if (currentLine === this.state.lineOne) {
        const syllablesRemain = 5 - this.countSyllables(currentLine);
        // return lineOne's display here
        return <div><p>{"You are on Line One. " + syllablesRemain + " syllables remain"}</p></div>

      } else {
        return ([]);
      }
    }
  }

  convertHaikuToString = () => {
    // map through lines of haiku, extracting strings from 'word objects'
    const linesAsArraysOfStrings = [
      [...this.state.lineOne].map(elt => elt.word),
      [...this.state.lineTwo].map(elt => elt.word),
      [...this.state.lineThree].map(elt => elt.word)
    ]

    // join the words in each line with a space to a string.
    // concatenate each line string with a newline char.
    // return output.
    return linesAsArraysOfStrings.reduce((total, currentLine) => {
      const joinedLine = currentLine.join(' ');
      return total === null ? joinedLine : total + '\n' + joinedLine;
    }, null)
  }

  renderHaiku = () => {
   return [
      [...this.state.lineOne.map(elt => elt.word)].join(' '),
      <br />,
      [...this.state.lineTwo.map(elt => elt.word)].join(' '),
      <br />,
       [...this.state.lineThree.map(elt => elt.word)].join(' ')
    ];
    
  }

   

  render() {
    return (
     <div className="wrapper">
          <div className="Modal">
            <Modal
              className="modal"
              show={this.state.isShowing}
              close={this.closeModalHandler}>
              <Instructions />
            </Modal>
          </div>
        <header>
          <div className="Form" id="formContainer">
          <form action="submit" onSubmit={this.handleSubmit}>
                <label htmlFor="word" className="visuallyHidden">Input Starting Word Here</label>
                <input className="Input" onChange={this.handleChange} placeholder="Enter Your Starting Word" value={this.state.seedWord} id="word" name="word" type="text" disabled={this.state.wholeHaiku.length > 0 ? true : false}/> 
                <button disabled={this.state.wholeHaiku.length > 0 ? true : false} className="Submit">Submit</button>
                </form>
          {/* form */}
          </div>
       </header>  

      <div className="ContainerHaiku" id="ContainerHaiku" ref={this.containerRef}>
      {this.state.wholeHaiku.length > 0 && (
        <div>
          <div className="Haiku" id="dynamicHaiku">
            {this.state.wholeHaiku.length > 0 ? <h2 onSubmit={this.removeLastWord}>Haiku</h2> : null}
            <div className="flexParent">
              <div className="lines">
                
                <ul className="haikuUl">
                  {this.state.lineOne.map((result, i) => {
                    return (<li key={i}><h4>{result.word}</h4></li>)
                  })}
                </ul>
                {
                  this.syllableDisplay(this.state.lineOne)
                }
                {/* lines */}
              </div>
              <div className="lines">
                
                  <ul className="haikuUl">
                  {this.state.lineTwo.map((result, i) => {
                    return (<li key={i}><h4>{result.word}</h4></li>)
                  }
                  )}
                </ul>
                {
                  this.syllableDisplay(this.state.lineTwo)
                }

              </div>
              <div className="lines">
                
                <ul className="haikuUl">
                  {this.state.lineThree.map((result, i) => {
                    return (<li key={i}><h4>{result.word}</h4></li>)
                  }
                  )}
                  
                </ul>
                  {
                    this.syllableDisplay(this.state.lineThree)
                  }
            </div>
                  
            <div>
              {this.countSyllables(this.state.wholeHaiku) >= 17 ? <button className="seePoem" onClick={this.openPoem}>Click to see whole poem</button> : null}
              <Haiku
                className="poem"
                show={this.state.showPoem}
                cancel={this.closePoem}
                refresh={this.refreshPage}
                convertHaikuToString={this.convertHaikuToString}>
                    <p>{this.renderHaiku()}</p>
              </Haiku>
            </div>
          </div>
        {/* haiku */}
        </div>   
        
        <div className="nextWordOption"> 
          <ul className="suggestedWords">
            {/* //mapping over the wordOptions array and displaying to the page  */}
            {this.state.wordOptions.map((result, i) => {
              return (
                // Creating an onClick listener for each button appended to the page 
                <li key={i}><button disabled={this.countSyllables(this.state.wholeHaiku) >= 17 ? true : false} onClick={(event) => { this.buttonWordChoice(event, i) }} className="wordButton">
                  {result.word}
                </button></li>
              )
            })}
          </ul>
          {this.state.wholeHaiku.length > 0 ? <button id="removeLastItem" className="removeLastItem" disabled={this.state.showFinishedHaiku} onClick={this.removeLastWord}>Remove last word</button> : null}
        </div>    
      </div>
      )}  
      </div>
    </div>
 
    );
  }
}
export default App;
