import "./FoodLog.css";
import React, {useState} from "react";
import {createFoodLogEntry, updateFoodLogEntry} from "../../Utils/queries";
import {MealTime, SourceType} from "../../Utils/enums";
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {FoodLogTemplate} from "./FoodLogTemplate";
import {UserMeal} from "../../Utils/response-types";

const RecognizeMealPage = (props: {setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>}) => {
  const navigate = useNavigate();


    return (
        <div className="base-page">
            <input type="file" accept="image/*" capture="environment"/>
        </div>
    );
};

export default RecognizeMealPage;
