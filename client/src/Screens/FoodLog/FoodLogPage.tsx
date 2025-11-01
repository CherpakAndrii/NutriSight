import "./FoodLog.css";
import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import FoodLogPageMain from "./FoodLogList/FoodLogPageMain";
import {PageInDevelopment, PageNotFound} from "../HomeScreen/ErrorPages";
import {FoodLogTemplate} from "./FoodLogTemplate";
import AddFoodLogPage from "./AddFoodLogPage";
import {UserMeal} from "../../Utils/response-types";
import RecognizeMealPage from "./RecognizeMeal";

const FoodLogPage: React.FC = () => {
    const [selectedMealTemplate, setSelectedMealTemplate] = useState<FoodLogTemplate|undefined>(undefined);
    const [foodLog, setFoodLog] = useState<UserMeal[]>([]);

    return (
        <Routes>
          <Route path="/" element={<FoodLogPageMain setSelectedTemplate={setSelectedMealTemplate} foodLog={foodLog} setFoodLog={setFoodLog} />} />
          <Route path="/photo" element={<RecognizeMealPage setSelectedTemplate={setSelectedMealTemplate}/>} />
          <Route path="/add" element={<AddFoodLogPage selectedTemplate={selectedMealTemplate} setSelectedTemplate={setSelectedMealTemplate} setFoodLog={setFoodLog} />} />
          <Route path="/search" element={<PageInDevelopment />} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
    );
};

export default FoodLogPage
