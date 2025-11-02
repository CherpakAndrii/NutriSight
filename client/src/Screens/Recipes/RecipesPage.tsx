import React, {useState} from "react";
import {UserRecipe} from "../../Utils/response-types";
import {DataLoadingStatus} from "../../Utils/enums";
import {generateRecipes} from "../../Utils/queries";
import {getRecipes} from "../../Utils/queries";
import RecipeEntry from "./RecipeEntry";

const RecipesPage: React.FC = () => {
    const [recipes, setRecipes] = useState<UserRecipe[]>([]);
    const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.NotLoaded);

  if (dataLoadingStatus === DataLoadingStatus.NotLoaded) {
      setDataLoadingStatus(DataLoadingStatus.Loading);
      getRecipes().then(resp => {
          if (resp.recipes) {
              setRecipes(resp.recipes);
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }

  if (dataLoadingStatus !== DataLoadingStatus.Loaded) return (
      <div className="empty-page">
          <h3 className="empty-page-title">{dataLoadingStatus === DataLoadingStatus.Error? "Error loading your recipes" : "Loading your recipes..."}</h3>
      </div>
  );

  const handleGenerateRecipes = () => {
      setDataLoadingStatus(DataLoadingStatus.Loading);
      generateRecipes().then(resp => {
          if (resp.recipes) {
              setRecipes(resp.recipes);
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }

    return (
        <div className="base-page">
            <h2>Recipes Collection</h2>
            <button
                onClick={handleGenerateRecipes}
                className="button green-button"
                style={{margin: 5}}>Generate New Recipes
            </button>
            <div>
                {recipes.map(recipe => <RecipeEntry key={recipe.recipe_id} recipe={recipe} setRecipes={setRecipes} />)}
            </div>
        </div>
    );
};

export default RecipesPage
