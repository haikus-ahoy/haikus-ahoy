import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor (){
    super();
    this.state = {
      lineOne :[],
      getUserWord: [],
      seedWord: '',
     


    }
  }


 getUserWord = () => {
    const seedWord = this.state.seedWord;
    console.log(this.state.seedWord)
 
    axios({
      url: `http://api.datamuse.com/words?md=s&sp=${seedWord}`,
      method: 'GET',
      dataResponse: 'json',
    })
      .then(response => {
        console.log("resp",response);
        response = response.data;
        const word = response[0].word;
        const numSyllables = response[0].numSyllables;
        console.log(word,numSyllables);
        console.log(`"${word}" has ${numSyllables} syllables.`);
        if (seedWord === word && numSyllables < 6) {
          console.log(`The first line has ${5 - numSyllables} syllables remaining.`);
          const newFirstLine = [...this.state.lineOne];
          newFirstLine.push({ 'word': word, 'numSyllables': numSyllables })
          this.setState({
            lineOne: newFirstLine,
          });
          console.log(this.state.lineOne);
        } else if (seedWord === word && numSyllables < 5) {
          console.log(`Think of a word between 1 and 5 syllables and try again.`);
        } else {
          console.log(`It looks like you meant to type "${word}". Please try again.`);
        }
      }).catch((response) => {
        console.log(`"${seedWord}" is not a word that I know.`);
       
      })

  
  }

  handleClick = (e) => {
    e.preventDefault();
    this.getUserWord();
  }
  handleChange = (event)=> {
    this.setState({
      seedWord: event.target.value,
      
    })
    console.log(this.state)
  }



  // const newFirstLine = [...this.state.lineOne];
  // newFirstLine.push({ 'word': word, 'numSyllables': numSyllables })
  // this.setState({
  //   lineOne: newFirstLine,
  // });




render () {
    return (
      <form action="submit">
      <label htmlFor="word">Input Starting Word Here</label>
        <input onChange={this.handleChange} value={this.state.seedWord} id="word" name="word" type="text" />
        <button onClick={this.handleClick}>Submit</button>

      </form>
    );
  }
} 
export default App;
