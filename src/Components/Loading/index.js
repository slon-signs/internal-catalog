import React, {useState} from "react";
import './style.css';

function Loading({color, size, text, textColor}){

    let spinnerSize;
    switch (size) {
        case 1:
            spinnerSize = { width: 15, height: 15 };
            break;
        case 2:
            spinnerSize = { width: 25, height: 25 };
            break;
        case 3:
            spinnerSize = { width: 35, height: 35 };
            break;
        default:
            spinnerSize = { width: 10, height: 10 };
    }

    return(
        <div className="loadingContainerClass">
            <span style={{color:textColor}}>{text}</span>
            <div 
                style={{borderTop: `4px solid ${color}`, width: spinnerSize.width, height: spinnerSize.height}} 
                className="loadingSpinner">
            </div>
        </div>
    );
}

export default Loading;