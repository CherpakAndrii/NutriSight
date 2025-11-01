import React, {createContext} from "react";
import {LogInState} from "./enums";


export const LoggedInContext = createContext<React.Dispatch<React.SetStateAction<LogInState>>|null>(null);
