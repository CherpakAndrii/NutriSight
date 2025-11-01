import React, {useContext, useState} from "react";
import {ConnectionStatus, LogInState} from "../Utils/enums";

import './Welcome.css';
import {LoggedInContext} from "../Utils/contexts";
import {checkConnection, testAuth} from "../Utils/queries"

const Welcome = (props: {setMyUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const logInHandler = useContext(LoggedInContext)!;
    const [stage, setStage] = useState<ConnectionStatus>(ConnectionStatus.NoAttempts);
    
    if (stage === ConnectionStatus.NoAttempts) {
        setStage(ConnectionStatus.Connecting);
        checkConnection().then(response => {
            if (response.success){
                setStage(ConnectionStatus.Connected);
            } else {
                setStage(ConnectionStatus.NoConnection);
            }
        });
    }

    if (stage === ConnectionStatus.Connected) {
        setStage(ConnectionStatus.TestingToken);
        testAuth().then(response => {
            if (response.success){
                setStage(ConnectionStatus.TokenTested);
                props.setMyUserId(response.user_id!);
                logInHandler(LogInState.LoggedIn);
            } else {
                setStage(ConnectionStatus.TokenTested);
                logInHandler(LogInState.NotLoggedIn);
            }
        });
    }
    
    return (
        <div className="welcome-page">
            <h1 className="welcome">Welcome to the NutriSight!</h1>
            <p className="status-info">{stage === ConnectionStatus.Connecting? "Checking connection to the server..." :
                stage === ConnectionStatus.NoConnection? "Failed to connect to the server. Try again later..." :
                "Validating your access token..." }</p>
        </div>
    );
};

export default Welcome;