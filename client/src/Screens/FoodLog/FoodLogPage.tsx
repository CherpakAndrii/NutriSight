import "./FoodLog.css";
import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import FoodLogPageMain from "./FoodLogList/FoodLogPageMain";
import {PageNotFound} from "../HomeScreen/ErrorPages";
import {FoodLogTemplate} from "./AddFoodLog/FoodLogTemplate";
import AddFoodLogPage from "./AddFoodLog/AddFoodLogPage";
import {UserMeal} from "../../Utils/response-types";
import RecognizeMealPage from "./AddFoodLog/RecognizeMeal";
import SearchMealPage from "./AddFoodLog/SearchMeal";

const FoodLogPage: React.FC = () => {
    const [selectedMealTemplate, setSelectedMealTemplate] = useState<FoodLogTemplate|undefined>(undefined);
    const [foodLog, setFoodLog] = useState<UserMeal[]>([]);

    return (
        <Routes>
          <Route path="/" element={<FoodLogPageMain setSelectedTemplate={setSelectedMealTemplate} foodLog={foodLog} setFoodLog={setFoodLog} />} />
          <Route path="/photo" element={<RecognizeMealPage setSelectedTemplate={setSelectedMealTemplate}/>} />
          <Route path="/add" element={<AddFoodLogPage selectedTemplate={selectedMealTemplate} setSelectedTemplate={setSelectedMealTemplate} setFoodLog={setFoodLog} />} />
          <Route path="/search" element={<SearchMealPage setSelectedTemplate={setSelectedMealTemplate} />} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
    );
};

export default FoodLogPage
