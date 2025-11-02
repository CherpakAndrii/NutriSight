import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {UserIngredient} from "../../../Utils/response-types";
import {removeIngredient} from "../../../Utils/queries";
import {SourceType} from "../../../Utils/enums";


function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const IngredientEntry = (props: {ingredient: UserIngredient, setIngredients: React.Dispatch<React.SetStateAction<UserIngredient[]>>}) => {
    const [extended, setExtended] = useState<boolean>(false);

    const handleRemove = async () => {
      const resp = await removeIngredient(props.ingredient.ingredient_id);
      if (resp.success) {
        props.setIngredients(resp.ingredients);
      }
    };

    return (
        <div className="food-logs-wrapper">
            <div className="food-logs-container" onClick={() => {
                setExtended(!extended)
            }}>
                <p className="meal-name">{props.ingredient.name}</p>
                <div className="chevron-wrapper">
                    <FontAwesomeIcon icon={extended ? faChevronUp : faChevronDown}/>
                </div>
            </div>
            <div className="extendable-res-container" style={{display: extended ? "flex" : "none"}}>
                {extended ? <>
                    <div className="attribute-row" key="name">
                        <span className="attribute-label">Name</span>
                        <span className="attribute-value">
                          {props.ingredient.name}
                        </span>
                    </div>
                    <div className="attribute-row" key="quantity_available_grams">
                        <span className="attribute-label">Quantity Available</span>
                        <span className="attribute-value">
                          {props.ingredient.quantity_available_grams} g
                        </span>
                    </div>
                    <div className="attribute-row" key="created_at">
                        <span className="attribute-label">Created At</span>
                        <span className="attribute-value">
                          {props.ingredient.created_at.replace('T', ' ').split('.')[0]}
                        </span>
                    </div>
                    <div className="attribute-row" key="source_type">
                        <span className="attribute-label">Source Type</span>
                        <span className="attribute-value">
                          {SourceType[props.ingredient.source_type]}
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

export default IngredientEntry;
