import "./HomeScreen/Home.css";
import React, {useCallback, useContext} from "react";
import {Link} from 'react-router-dom';
import {LogInState} from "../Utils/enums";
import {LoggedInContext} from "../Utils/contexts";
import {logOut} from "../Utils/queries";

const Header = (props: {setUserId: React.Dispatch<React.SetStateAction<number>>|undefined}) => {
    const logInHandler = useContext(LoggedInContext)!;

    const logOutCallback = useCallback(async () => {
        props.setUserId!(0);
        await logOut();
        logInHandler(LogInState.NotLoggedIn);
    }, [logInHandler, props.setUserId]);
    
    return (
        <header>
            <Link style={{textDecoration: "unset"}} to="/"><h2 className="subheading">NutriSight</h2></Link>
            <div className="btn-container">
                {props.setUserId? <button className="button green-button" onClick={logOutCallback}>Log Out</button>: <></>}
            </div>
        </header>
    );
};

export default Header;