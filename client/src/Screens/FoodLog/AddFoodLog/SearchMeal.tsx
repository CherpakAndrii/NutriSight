import "../FoodLog.css";
import React, {useEffect, useState} from "react";
import {searchFoodTemplate} from "../../../Utils/queries";
import {MealTime, SourceType} from "../../../Utils/enums";
import {useNavigate} from "react-router-dom";
import {FoodLogTemplate} from "./FoodLogTemplate";
import {ProductTemplate} from "../../../Utils/response-types";
import SearchSuggestion from "./SearchSuggestion";

const SearchMealPage = (props: {setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>}) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ProductTemplate[]>([]);

  const handleSelection = (selected: ProductTemplate) => {
      props.setSelectedTemplate({
          log_id: 0, meal_time: MealTime.Snack, source_type: SourceType.Manual,
          name: selected.name, actual_calories: selected.default_calories!, actual_proteins: selected.default_proteins!, actual_fats: selected.default_fats!, actual_carbs: selected.default_carbs!, actual_portion_grams: selected.default_portion_grams!
      });
      navigate('/foodlog/add');
  }

    useEffect(() => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      let cancelled = false;

      const fetchSuggestions = async () => {
        const response = await searchFoodTemplate(query);
        if (!cancelled) {
          if (!response.errorCode) {
            setSuggestions(response.results);
          } else {
            setSuggestions([]);
          }
        }
      };

      fetchSuggestions();

      return () => {
        cancelled = true;
      };
    }, [query]);

    return (
        <div className="base-page">
            <div className="attribute-row">
                <span className="attribute-label">Search:</span>
                <input className="attribute-input" type="text" value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>
            <div className="food-logs-group-wrapper extendable-res-container">
                {suggestions.map((s) => <SearchSuggestion onClick={() => handleSelection(s)} name={s.name} imageUrl={s.image_url}/>)}
            </div>
        </div>
    );
};

export default SearchMealPage;
