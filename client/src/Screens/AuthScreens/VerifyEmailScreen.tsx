import './LogIn.css';
import React, {useContext, useState} from "react";
import {useParams} from "react-router-dom";
import {LogInState, LogInStatus} from "../../Utils/enums";
import {verifyEmail} from "../../Utils/queries";
import Header from "../Header";
import {LoggedInContext} from "../../Utils/contexts";


const VerifyEmail = (props: {setUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const logInHandler = useContext(LoggedInContext)!;

    const { token } = useParams<{ token: string }>();

    const [logInStatus, setLogInStatus] = useState<LogInStatus>(LogInStatus.NotSent);
    const [networkError, setNetworkError] = useState<number>(0);

    if (logInStatus === LogInStatus.NotSent) {
        setLogInStatus(LogInStatus.WaitingForResponse);
        verifyEmail(token!).then(response => {
            if (response.errorCode){
                setNetworkError(response.errorCode);
                setLogInStatus(LogInStatus.NetworkError);
            } else if (!response.success) {
                setLogInStatus(LogInStatus.IncorrectLoginOrPassword);
            } else {
                props.setUserId(response.user_id);
                logInHandler(LogInState.LoggedIn);
            }
        });
    }

    return (
        <div className="login-page">
            <Header setUserId={undefined} />
            <div className="login-form-area">
                <h2 className="subheading">{
                    logInStatus === LogInStatus.WaitingForResponse? "Verifying your token..." :
                        logInStatus === LogInStatus.IncorrectLoginOrPassword? "Token is incorrect!" :
                            logInStatus === LogInStatus.NetworkError? "Network error" : ""
                }</h2>
            </div>
        </div>
    );
};

export default VerifyEmail;