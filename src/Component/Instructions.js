import React, {Component} from 'react';

class Instructions extends Component {

    render() {

        return(
           
            
                <div className="Instructions">
                    <h1>Haikus Ahoy!</h1>
                    <p><span>Ahoy Matey!</span> Welcome aboard our boat-themed haiku generator of the High Seas. <span>Argh!</span></p>
                    <p>A haiku is <span>a Japanese poem meant to evoke an image. It is </span>composed of three lines which have a syllable count of 5-7-5. Type a starting word below and a list of words will generate for you to choose from until the poem is done. If you don't like how your poem is going, you can delete the most recent word you added and you'll get a fresh list of options.</p>
                </div>   
         
        )
    }
}

export default Instructions;