import React, { useState } from "react";
import { getIngredients} from "../../../Utils/queries";
import {UserIngredient } from "../../../Utils/response-types";
import {DataLoadingStatus} from "../../../Utils/enums";
import {faCamera, faKeyboard} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import IngredientEntry from "./IngredientEntry";

const IngredientsPageMain = (props: {ingredients: UserIngredient[], setIngredients: React.Dispatch<React.SetStateAction<UserIngredient[]>>}) => {
  const navigate = useNavigate();
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.NotLoaded);

  if (dataLoadingStatus === DataLoadingStatus.NotLoaded) {
      setDataLoadingStatus(DataLoadingStatus.Loading);
      getIngredients().then(resp => {
          if (resp.ingredients) {
              props.setIngredients(resp.ingredients);
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }

  if (dataLoadingStatus !== DataLoadingStatus.Loaded) return (
      <div className="empty-page">
          <h3 className="empty-page-title">{dataLoadingStatus === DataLoadingStatus.Error? "Error loading your ingredients" : "Loading your ingredients..."}</h3>
      </div>
  );

    return (
        <div className="base-page">
            <h2>Available Ingredients</h2>
            <div style={{display: "flex", flexDirection: "row", gap: 10, paddingLeft: 15, paddingRight: 15}}>
                <button onClick={() => navigate('/ingredients/add')} className="button green-button" style={{flex: 1}}><FontAwesomeIcon icon={faKeyboard}/></button>
                <button onClick={() => navigate('/ingredients/photo')} className="button green-button" style={{flex: 1}}><FontAwesomeIcon icon={faCamera}/></button>
            </div>
            <div>
                {props.ingredients.map(ing => <IngredientEntry key={ing.ingredient_id} ingredient={ing} setIngredients={props.setIngredients} />)}
            </div>
        </div>
    );
};

export default IngredientsPageMain;
