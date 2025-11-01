import React, {useCallback, useEffect} from 'react';
import {googleLogIn} from '../../Utils/queries'
import {LogInState, LogInStatus} from "../../Utils/enums";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = (props: {setLogInStatus: React.Dispatch<React.SetStateAction<LogInStatus>>, setUserId: React.Dispatch<React.SetStateAction<number>>, logInHandler: React.Dispatch<React.SetStateAction<LogInState>>}) => {
  const handleCredentialResponse = useCallback((response: any) => {
    const id_token = response.credential; // this is the token you send to your server

    googleLogIn(id_token).then(response => {
            if (response.errorCode){
                props.setLogInStatus(LogInStatus.NetworkError);
            } else if (!response.success) {
                props.setLogInStatus(LogInStatus.IncorrectLoginOrPassword);
            } else {
                props.setUserId(response.user_id);
                props.logInHandler(LogInState.LoggedIn);
            }
        });
  }, [props]);

  useEffect(() => {
    // @ts-ignore
    window.google?.accounts?.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    // @ts-ignore
    window.google?.accounts?.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" } // customize style
    );
  }, [handleCredentialResponse]);

  return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;
