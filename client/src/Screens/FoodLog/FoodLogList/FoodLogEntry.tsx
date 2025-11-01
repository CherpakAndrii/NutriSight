import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {UserMeal} from "../../../Utils/response-types";
import {removeFoodLogEntry} from "../../../Utils/queries";
import {MealTime, SourceType} from "../../../Utils/enums";
import {FoodLogTemplate} from "../FoodLogTemplate";
import {useNavigate} from "react-router-dom";


function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const FoodLogEntry = (props: {meal: UserMeal, setLogs: React.Dispatch<React.SetStateAction<UserMeal[]>>, setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>}) => {
    const [extended, setExtended] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleEdit = async () => {
        props.setSelectedTemplate({log_id: props.meal.meal_id, name: props.meal.name, meal_time: props.meal.meal_time, actual_calories: props.meal.actual_calories!, actual_proteins: props.meal.actual_proteins!, actual_fats: props.meal.actual_fats!, actual_carbs: props.meal.actual_carbs!, actual_portion_grams: props.meal.actual_portion_grams!, source_type: props.meal.source_type});
        navigate('/foodlog/add');
    };

    const handleRemove = async () => {
      const resp = await removeFoodLogEntry(props.meal.meal_id);
      if (resp.success) {
        props.setLogs(resp.food_log);
      }
    };

    return (
        <div className="food-logs-wrapper">
            <div className="food-logs-container" onClick={() => {
                setExtended(!extended)
            }}>
                <p className="meal-name">{props.meal.name}</p>
                <div className="chevron-wrapper">
                    <FontAwesomeIcon icon={extended ? faChevronUp : faChevronDown}/>
                </div>
            </div>
            <div className="extendable-res-container" style={{display: extended ? "flex" : "none"}}>
                {extended ? ['actual_calories', 'actual_proteins', 'actual_fats', 'actual_carbs', 'actual_portion_grams', 'created_at'].map(key => (
                    <div className="attribute-row" key={key}>
                        <span className="attribute-label">{capitalize(key.replace('_', ' '))}</span>
                        <span className="attribute-value">
                          {props.meal[key]?.toString()}
                        </span>
                    </div>
                )) : <></>}
                {extended ? <>
                    <div className="attribute-row" key="source_type">
                        <span className="attribute-label">Source Type</span>
                        <span className="attribute-value">
                          {SourceType[props.meal.source_type]}
                        </span>
                    </div>
                    <div className="attribute-row" key="meal_time">
                        <span className="attribute-label">Meal Time</span>
                        <span className="attribute-value">
                          {MealTime[props.meal.meal_time]}
                        </span>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", width: "100%", gap: 5}}>
                        <button onClick={handleEdit} className="button green-button" style={{flex: 1}}>Edit</button>
                        <button onClick={handleRemove} className="button red-button" style={{flex: 1}}>Delete</button>
                    </div>
                </> : <></>}
            </div>

        </div>
    );
}

export default FoodLogEntry;
