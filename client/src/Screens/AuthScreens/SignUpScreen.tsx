import './LogIn.css';
import React, {useCallback, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {LogInStatus} from "../../Utils/enums";
import {signUp} from "../../Utils/queries";
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {faUser, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Header from "../Header";
import GoogleLoginButton from "./GoogleSignInButton";
import {LoggedInContext} from "../../Utils/contexts";


const SignUp = (props: {setUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const navigate = useNavigate();
    const logInHandler = useContext(LoggedInContext)!;
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const [logInStatus, setLogInStatus] = useState<LogInStatus>(LogInStatus.NotSent);
    const [networkError, setNetworkError] = useState<number>(0);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        setLogInStatus(LogInStatus.WaitingForResponse);
        signUp(login.trim(), password.trim()).then(response => {
            if (response.errorCode){
                setNetworkError(response.errorCode);
                setLogInStatus(LogInStatus.NetworkError);
            } else if (!response.success) {
                setLogInStatus(LogInStatus.IncorrectLoginOrPassword);
            } else {
                setLogInStatus(LogInStatus.WaitingForVerification);
            }
        });
    };

    const toLogIn = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const form_is_unfilled = login === "" || password === "" || repeatPassword === "";
    
    return (
        <div className="login-page">
            <Header setUserId={undefined} />
            <div className="login-form-area">
                <h2 className="subheading">Sign Up</h2>
                <div className="form-container">
                    <form className='form' onSubmit={handleSubmit}>
                        <label htmlFor="inputField"><FontAwesomeIcon icon={faUser} className="form-icon"/>Email:</label>
                        <input type="text"
                               id="login"
                               value={login}
                               disabled={logInStatus === LogInStatus.WaitingForResponse}
                               onChange={(event) => {
                                   setLogin(event.target.value);
                                   setLogInStatus(LogInStatus.NotSent);
                               }}
                        />
                        <label htmlFor="inputField"><FontAwesomeIcon icon={faLock} className="form-icon"/>Password:</label>
                        <input type={showPassword ? 'text' : 'password'}
                               id="password"
                               value={password}
                               disabled={logInStatus in [LogInStatus.WaitingForResponse, LogInStatus.WaitingForVerification]}
                               onChange={(event) => {
                                   setPassword(event.target.value);
                                   setLogInStatus(LogInStatus.NotSent);
                               }}
                        />
                        <label htmlFor="inputField"><FontAwesomeIcon icon={faLock} className="form-icon"/>Repeat Password:</label>
                        <input type={showPassword ? 'text' : 'password'}
                               id="password"
                               value={repeatPassword}
                               disabled={logInStatus in [LogInStatus.WaitingForResponse, LogInStatus.WaitingForVerification]}
                               onChange={(event) => {
                                   setRepeatPassword(event.target.value);
                                   setLogInStatus(LogInStatus.NotSent);
                               }}
                        />
                        <p className="show-password" onClick={() => setShowPassword(prev => !prev)}>
                            <FontAwesomeIcon icon={showPassword? faEyeSlash : faEye} className="form-icon"/>
                            {showPassword ? 'Hide Password' : 'Show Password'}
                        </p>
                        <p className="info-text-mini">
                            {logInStatus === LogInStatus.WaitingForResponse ?
                                "Waiting for response..." :
                                logInStatus === LogInStatus.WaitingForVerification ?
                                "Please check your inbox for verification link" : ""}
                        </p>
                        <p className="error-text-mini">
                            {(login || password || repeatPassword) && form_is_unfilled ?
                                "Please, fill all the fields" :
                                password !== repeatPassword ?
                                    "Passwords don't match" : ""
                            }
                        </p>
                        <button className="button green-button" type="submit" disabled={form_is_unfilled || password !== repeatPassword || logInStatus in [LogInStatus.WaitingForResponse, LogInStatus.WaitingForVerification]}>Sign Up</button>
                        <p className="info-text-mini">or <span className="info-link-mini" onClick={toLogIn}>Log In</span></p>
                        <GoogleLoginButton logInHandler={logInHandler} setUserId={props.setUserId} setLogInStatus={setLogInStatus}/>
                    </form>
                </div>
                <div className="filler"></div>
            </div>
        </div>
    );
};

export default SignUp;