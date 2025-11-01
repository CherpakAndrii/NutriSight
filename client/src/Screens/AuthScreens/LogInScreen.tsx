import './LogIn.css';
import React, {useContext, useCallback, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {LogInState, LogInStatus} from "../../Utils/enums";
import {LoggedInContext} from "../../Utils/contexts";
import {logIn} from "../../Utils/queries";
import GoogleLoginButton from './GoogleSignInButton'
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {faUser, faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Header from "../Header";


const Login = (props: {setUserId: React.Dispatch<React.SetStateAction<number>>}) => {
    const logInHandler = useContext(LoggedInContext)!;
    const navigate = useNavigate();

    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const [logInStatus, setLogInStatus] = useState<LogInStatus>(LogInStatus.NotSent);
    const [networkError, setNetworkError] = useState<number>(0);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        setLogInStatus(LogInStatus.WaitingForResponse);
        logIn(login.trim(), password.trim()).then(response => {
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
    };

    const toSignUp = useCallback(() => {
        navigate('/signup');
    }, [navigate]);
    
    const form_is_unfilled = login === "" || password === "";
    
    return (
        <div className="login-page">
            <Header setUserId={undefined} />
            <div className="login-form-area">
                <h2 className="subheading">Log In</h2>
                <div className="form-container">
                    <form className='form' onSubmit={handleSubmit}>
                        <label htmlFor="inputField"><FontAwesomeIcon icon={faUser} className="form-icon"/>Login:</label>
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
                               disabled={logInStatus === LogInStatus.WaitingForResponse}
                               onChange={(event) => {
                                   setPassword(event.target.value);
                                   setLogInStatus(LogInStatus.NotSent);
                               }}
                        />
                        <p className="show-password" onClick={() => setShowPassword(prev => !prev)}>
                            <FontAwesomeIcon icon={showPassword? faEyeSlash : faEye} className="form-icon"/>
                            {showPassword ? 'Hide Password' : 'Show Password'}
                        </p>
                        <p className="info-text-mini">
                            {logInStatus === LogInStatus.WaitingForResponse ?
                                "Waiting for response..." : ""}
                        </p>
                        <p className="error-text-mini">
                            {(login || password) && form_is_unfilled ?
                                "Please, fill all the fields" :
                                logInStatus === LogInStatus.IncorrectLoginOrPassword ?
                                    "Incorrect credentials!" :
                                    logInStatus === LogInStatus.NetworkError ?
                                        `Error: ${networkError}` : ""
                            }
                        </p>
                        <button className="button green-button" type="submit"
                                disabled={form_is_unfilled || logInStatus === LogInStatus.WaitingForResponse}>Log In
                        </button>
                        <p className="info-text-mini">or <span className="info-link-mini" onClick={toSignUp}>Sign Up</span></p>
                        <GoogleLoginButton logInHandler={logInHandler} setUserId={props.setUserId} setLogInStatus={setLogInStatus}/>
                    </form>
                </div>
                <div className="filler"></div>
            </div>
        </div>
    );
};

export default Login;