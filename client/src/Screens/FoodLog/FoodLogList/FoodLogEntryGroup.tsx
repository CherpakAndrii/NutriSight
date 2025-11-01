import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {UserMeal} from "../../../Utils/response-types";
import FoodLogEntry from './FoodLogEntry';
import {FoodLogTemplate} from "../FoodLogTemplate";


const FoodLogEntryGroup = (props: {date: string, items: UserMeal[], setLogs: React.Dispatch<React.SetStateAction<UserMeal[]>>, setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>}) => {
    const [extended, setExtended] = useState<boolean>(false);

    return (
        <div className={"food-logs-group-wrapper"}>
            <div className="res-container" onClick={() => {setExtended(!extended)}}>
                <p className="meal-name">{props.date}{extended? "" : " ("+props.items.length+" entr"+(props.items.length === 1? "y" : "ies")+")"}</p>
                <div className="chevron-wrapper">
                    <FontAwesomeIcon icon={extended? faChevronUp : faChevronDown}/>
                </div>
            </div>
            <div className="extendable-res-container" style={{display: extended? "flex" : "none"}}>
                {props.items.map((meal, idx) => <FoodLogEntry key={`${props.date}-${idx}`} meal={meal} setLogs={props.setLogs} setSelectedTemplate={props.setSelectedTemplate}/>)}
            </div>
        </div>
    );
}

export default FoodLogEntryGroup;
