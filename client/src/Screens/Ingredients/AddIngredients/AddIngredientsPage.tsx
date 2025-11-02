import React, {useState} from "react";
import {createIngredient} from "../../../Utils/queries";
import {SourceType} from "../../../Utils/enums";
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {IngredientAISuggestionResp, UserIngredient} from "../../../Utils/response-types";

const AddIngredientsPage = (props: {selectedTemplate: IngredientAISuggestionResp|undefined, setSelectedTemplate: React.Dispatch<React.SetStateAction<IngredientAISuggestionResp|undefined>>, setIngredients: React.Dispatch<React.SetStateAction<UserIngredient[]>>}) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(props.selectedTemplate?.name ?? "");
  const [portion_grams, setActualPortion] = useState<string>((props.selectedTemplate?.portion_grams ?? 0).toString());

  const handleSave = async () => {
    try {
      const resp = await createIngredient(name, Number(portion_grams), props.selectedTemplate ? SourceType.Photo : SourceType.Manual);
      if (resp.success) {
        props.setSelectedTemplate(undefined);
        props.setIngredients(resp.ingredients);
        navigate('/ingredients');
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
                    navigate('/ingredients');
                }}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <h2>Add New Ingredient</h2>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Ingredients Name:</span>
                <input className="attribute-input" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="attribute-row">
                <span className="attribute-label">Available Quantity (grams):</span>
                <input className="attribute-input" type="number" value={portion_grams} onChange={(e) => setActualPortion(e.target.value)}/>
            </div>
            <div style={{display: "flex", flex: 1}}></div>
            <button
                onClick={handleSave}
                className="button green-button"
                style={{margin: 5}}>Add Ingredient</button>
        </div>
    );
};

export default AddIngredientsPage;
