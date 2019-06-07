import React, {Component} from 'react';

class Instructions extends Component {
    render() {

        return(
            <header>    
                <h1>Haikus Ahoy!</h1>
                <p>Ahoy thar Matey! Welcome aboard our boat-themed haiku generator of the High Seas. Argh!</p>
                <p>A haiku is a Japanese poem meant to evoke an image. It is composed of three lines. Line one has 5 syllables, line two has 7 syllables, and line three has 5 syllables. Type a starting word below and a list of words will generate for you to choose from until the poem is done. If you don't like how your poem is going, you can delete the most recent word you added and you'll get a fresh list of options.</p>
               
                <button>Sails away!</button>
            </header>
        )
    }
}

export default Instructions;