import "../FoodLog.css";
import React, {useState} from "react";
import {createFoodLogEntry, updateFoodLogEntry} from "../../../Utils/queries";
import {MealTime, SourceType} from "../../../Utils/enums";
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {UserMeal} from "../../../Utils/response-types";
import {FoodLogTemplate} from "./FoodLogTemplate";

const AddFoodLogPage = (props: {selectedTemplate: FoodLogTemplate|undefined, setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>, setFoodLog: React.Dispatch<React.SetStateAction<UserMeal[]>>}) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(props.selectedTemplate?.name ?? "");
  const [mealTime, setMealTime] = useState<MealTime>(props.selectedTemplate?.meal_time ?? MealTime.Snack);
  const [actualCalories, setActualCalories] = useState<string>((props.selectedTemplate?.actual_calories ?? 0).toString());
  const [actualProteins, setActualProteins] = useState<string>((props.selectedTemplate?.actual_proteins ?? 0).toString());
  const [actualFats, setActualFats] = useState<string>((props.selectedTemplate?.actual_fats ?? 0).toString());
  const [actualCarbs, setActualCarbs] = useState<string>((props.selectedTemplate?.actual_carbs ?? 0).toString());
  const [actualPortion, setActualPortion] = useState<string>((props.selectedTemplate?.actual_portion_grams ?? 0).toString());

  const handleSave = async () => {
    try {
      const resp = await createFoodLogEntry(name, mealTime, Number(actualCalories), Number(actualProteins), Number(actualFats), Number(actualCarbs), Number(actualPortion), props.selectedTemplate?.source_type ?? SourceType.Manual);
      if (resp.success) {
        props.setSelectedTemplate(undefined);
        props.setFoodLog(resp.food_log);
        navigate('/foodlog');
      } else {
        alert("Failed to create");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating food log");
    }
  };

  const handleUpdate = async () => {
    try {
      const resp = await updateFoodLogEntry(props.selectedTemplate?.log_id!, mealTime, Number(actualCalories), Number(actualProteins), Number(actualFats), Number(actualCarbs), Number(actualPortion));
      if (resp.success) {
        props.setSelectedTemplate(undefined);
        navigate('/foodlog');
      } else {
        alert("Failed to create");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating food log");
    }
  };

    return (
        <div className="base-page">
            <div style={{display: "flex", flexDirection: "row", gap: 15, marginLeft: 20}}>
                <button className="icon-button" onClick={() => {
                    props.setSelectedTemplate(undefined);
                    navigate('/foodlog');
                }}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <h2>{!(props.selectedTemplate?.log_id)? "Add New Meal" : "Update Meal"}</h2>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Dish Name:</span>
                {!(props.selectedTemplate?.log_id) ? <input className="attribute-input" type="text" value={name}
                                                            onChange={(e) => setName(e.target.value)}/> :
                    <span className="attribute-value">{props.selectedTemplate?.name}</span>}
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Meal Time:</span>
                <select
                    className="attribute-input"
                    value={String(mealTime)}
                    onChange={(e) => setMealTime(Number(e.target.value) as MealTime)}
                >
                    {[
                        {label: "Breakfast", value: MealTime.Breakfast},
                        {label: "Lunch", value: MealTime.Lunch},
                        {label: "Dinner", value: MealTime.Dinner},
                        {label: "Snack", value: MealTime.Snack}
                    ].map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Actual Calories:</span>
                <input className="attribute-input" type="number" value={actualCalories}
                       onChange={(e) => setActualCalories(e.target.value)}/>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Actual Proteins:</span>
                <input className="attribute-input" type="number" value={actualProteins}
                       onChange={(e) => setActualProteins(e.target.value)}/>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Actual Fats:</span>
                <input className="attribute-input" type="number" value={actualFats}
                       onChange={(e) => setActualFats(e.target.value)}/>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Actual Carbs:</span>
                <input className="attribute-input" type="number" value={actualCarbs}
                       onChange={(e) => setActualCarbs(e.target.value)}/>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Actual Portion:</span>
                <input className="attribute-input" type="number" value={actualPortion}
                       onChange={(e) => setActualPortion(e.target.value)}/>
            </div>
            <div style={{display: "flex", flex: 1}}></div>
            <button
                onClick={!(props.selectedTemplate?.log_id)? handleSave : handleUpdate}
                className="button green-button"
                style={{margin: 5}}>
                {!(props.selectedTemplate?.log_id)? "Add Meal" : "Update Meal"}
            </button>
        </div>
    );
};

export default AddFoodLogPage;
