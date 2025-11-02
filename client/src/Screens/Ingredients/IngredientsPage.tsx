import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import IngredientsPageMain from "./IngredientsList/IngredientsPageMain";
import {PageNotFound} from "../HomeScreen/ErrorPages";
import AddIngredientsPage from "./AddIngredientsPage";
import {IngredientAISuggestionResp, UserIngredient} from "../../Utils/response-types";
import RecognizeIngredientPage from "./RecognizeIngredient";

const IngredientsPage: React.FC = () => {
    const [selectedIngredientTemplate, setSelectedIngredientTemplate] = useState<IngredientAISuggestionResp|undefined>(undefined);
    const [ingredients, setIngredients] = useState<UserIngredient[]>([]);

    return (
        <Routes>
          <Route path="/" element={<IngredientsPageMain ingredients={ingredients} setIngredients={setIngredients} />} />
          <Route path="/photo" element={<RecognizeIngredientPage setSelectedTemplate={setSelectedIngredientTemplate}/>} />
          <Route path="/add" element={<AddIngredientsPage selectedTemplate={selectedIngredientTemplate} setSelectedTemplate={setSelectedIngredientTemplate} setIngredients={setIngredients} />} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
    );
};

export default IngredientsPage
