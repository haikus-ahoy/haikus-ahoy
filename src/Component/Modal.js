import React from 'react';

const Modal = (props) => {
    return (
        <div className="instructionWrapper">
            <div className="modalWrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    display: props.show ? 'inline-block' : 'none'
                }}>
               
                <div className="modalBody">
                    <div>
                        {props.children}
                    </div>
                </div>
                <div className="buttonContainer">
                    <button className="btnCancel" onClick={props.close}>Sails Away</button>
                    
                </div>
            </div>
        </div>
    )
}

export default Modal;
