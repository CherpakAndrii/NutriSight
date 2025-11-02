import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {UserRecipe} from "../../Utils/response-types";
import {removeRecipe} from "../../Utils/queries";


function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const RecipeEntry = (props: {recipe: UserRecipe, setRecipes: React.Dispatch<React.SetStateAction<UserRecipe[]>>}) => {
    const [extended, setExtended] = useState<boolean>(false);

    const handleRemove = async () => {
      const resp = await removeRecipe(props.recipe.recipe_id);
      if (resp.success) {
        props.setRecipes(resp.recipes);
      }
    };

    return (
        <div className="food-logs-wrapper">
            <div className="food-logs-container" onClick={() => {
                setExtended(!extended)
            }}>
                <p className="meal-name">{props.recipe.name}</p>
                <div className="chevron-wrapper">
                    <FontAwesomeIcon icon={extended ? faChevronUp : faChevronDown}/>
                </div>
            </div>
            <div className="extendable-res-container" style={{display: extended ? "flex" : "none"}}>
                {extended ? <>
                    <div className="attribute-row" key="name">
                        <span className="attribute-label">Name</span>
                        <span className="attribute-value">
                          {props.recipe.name}
                        </span>
                    </div>
                    <div className="attribute-row" key="ingredients">
                        <span className="attribute-label">Ingredients</span>
                        <span className="attribute-value">
                          {props.recipe.ingredients.map(i => `${i.name} -- ${i.amount} ${i.unit}`).join('\n')}
                        </span>
                    </div>
                    {['calories', 'protein', 'fat', 'carbs', 'instructions'].map(key => (
                    <div className="attribute-row" key={key}>
                        <span className="attribute-label">{capitalize(key)}</span>
                        <span className="attribute-value">
                          {props.recipe[key]?.toString()}
                        </span>
                    </div>
                ))}
                    <div className="attribute-row" key="created_at">
                        <span className="attribute-label">Created At</span>
                        <span className="attribute-value">
                          {props.recipe.created_at.replace('T', ' ').split('.')[0]}
                        </span>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", width: "100%", gap: 5}}>
                        <button onClick={handleRemove} className="button red-button" style={{flex: 1}}>Delete</button>
                    </div>
                </> : <></>}
            </div>

        </div>
    );
}

export default RecipeEntry;
