import React from 'react';
import './Haiku.css';

const Haiku = (props) => {
    return (
        <div className="haikuModal">
            <div className="haikuBody"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    display: props.show ? 'block' : 'none'
                }}>
                <div className="haikuHeader">
                    <h3>Haiku</h3>
                    <span className="closeHaikuBtn" onClick={props.cancel}>×</span>
                </div>
                <div className="haikuContent">
                    <div>
                        {props.children}
                    </div>
                    <div className="haikuFooter">
                        <button className="btnContinue" onClick={props.refresh}>Start Over</button>
                        {/* <FinishedHaiku convertHaikuToString={props.convertHaikuToString}/> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Haiku;

