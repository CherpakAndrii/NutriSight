import {MealTime, SourceType} from "../../Utils/enums";

export type FoodLogTemplate = {log_id: number, name: string, meal_time: MealTime, actual_calories: number, actual_proteins: number, actual_fats: number, actual_carbs: number, actual_portion_grams: number, source_type: SourceType};
