import React from 'react';

const Modal = (props) => {
    return (
        <div className="instructionWrapper">
            <div className="modalWrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    display: props.show ? 'inline-block' : 'none'
                }}>
                {/* <div className="modal-header">
                    <h3>Modal Header</h3>
                    <span className="close-modal-btn" onClick={props.close}>×</span>
                </div> */}
                <div className="modalBody">
                    <p>
                        {props.children}
                    </p>
                </div>
                <div>
                    <button className="btnCancel" onClick={props.close}>Sails Away</button>
                    
                </div>
            </div>
        </div>
    )
}

export default Modal;
