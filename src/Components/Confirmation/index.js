import React from "react";
import './style.css';

function Confirmation({ title, textCancel, textConfirm, colorCancel, colorConfirm, onSave, onCancel }){
  return (
    <div className="mainConfirmationContainer">
      <div className="confirmationContainer">
        <p className="title">{title}</p>
        <div className="buttonConfirmContainer">
          <button style={{backgroundColor:colorCancel}}className="cancelButton"onClick={onCancel}>{textCancel}</button>
          <button style={{backgroundColor:colorConfirm}}className="saveButton" onClick={onSave}>{textConfirm}</button>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;