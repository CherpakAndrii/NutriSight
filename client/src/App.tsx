import React, {useState} from "react";
import {LogInState} from "./Utils/enums";
import {LoggedInContext} from "./Utils/contexts";
import Login from "./Screens/AuthScreens/LogInScreen";
import SignUp from "./Screens/AuthScreens/SignUpScreen";
import VerifyEmail from "./Screens/AuthScreens/VerifyEmailScreen";
import Welcome from "./Screens/WelcomeScreen";
import Home from "./Screens/HomeScreen/Home";
import {Route, Routes, Navigate, useLocation} from "react-router-dom";

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useState(LogInState.AppLoading);
    const [myUserId, setMyUserId] = useState<number>(0);
    const location = useLocation();

    return (
          <LoggedInContext.Provider value={setLoggedIn}>
            <Routes>
              {isLoggedIn === LogInState.AppLoading? <Route path="/*" element={<Welcome setMyUserId={setMyUserId} />} /> : <></>}
              {isLoggedIn === LogInState.LoggedIn? <Route path="/*" element={<Home myUserId={myUserId} setMyUserId={setMyUserId}/>} /> : <></>}
              {isLoggedIn === LogInState.NotLoggedIn? <Route path="/login" element={<Login setUserId={setMyUserId}/>} /> : <></>}
              {isLoggedIn === LogInState.NotLoggedIn? <Route path="/signup" element={<SignUp setUserId={setMyUserId}/>} /> : <></>}
              {isLoggedIn === LogInState.NotLoggedIn? <Route path="/verify/:token" element={<VerifyEmail setUserId={setMyUserId}/>} /> : <></>}
                <Route path="*" element={<Navigate to={
                    isLoggedIn === LogInState.NotLoggedIn? `/login?redirect=${encodeURIComponent(location.pathname+location.search)}` :
                    '/'
                } />
              }/>
            </Routes>
          </LoggedInContext.Provider>
  );
};

export default App;
