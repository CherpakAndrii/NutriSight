import {Sex, AuthProvider, MealTime, SourceType, DietType} from "./enums";


export type SuccessResponse = {success: boolean, errorCode?: number};
export type MessageResponse = {message: string, errorCode?: number};

export type LoginResp = {success: boolean, user_id: number, errorCode?: number};

export type GetUserProfileResp = { profile?: UserProfile, errorCode?: number };
export type ModifyUserProfileResp = { success: boolean, message: string, profile?: UserProfile, errorCode?: number };
export type StatisticsResp = { today: StatisticsEntry, average_last_7_days: StatisticsEntry, errorCode?: number };

export type GetFoodLogResp = { food_log: UserMeal[], errorCode?: number };
export type UpdateFoodLogResp = { success: boolean, food_log: UserMeal[], errorCode?: number };
export type MealAISuggestionResp = { name: string, default_calories?: number, default_proteins?: number, default_fats?: number, default_carbs?: number, default_portion_grams?: number, errorCode?: number };
export type TemplateSearchResp = { results: ProductTemplate[], errorCode?: number };

export type GetIngredientsResp = { ingredients: UserIngredient[], errorCode?: number };
export type AddIngredientResp = { success: boolean, ingredients: UserIngredient[], errorCode?: number };
export type IngredientAISuggestionResp = { name: string, portion_grams?: number, errorCode?: number };

export type GetRecipesResp = { recipes: UserRecipe[], errorCode?: number };
export type AddRecipeResp = { success: boolean, recipes: UserRecipe[], errorCode?: number };


export type Intolerance = {intolerance_id: number, intolerance_name: string};
export type UserProfile = { user_id: number, email: string, auth_provider: AuthProvider, name?: string, age?: number, sex?: Sex, weight?: number, height?: number, goal_calories?: number, goal_protein?: number, goal_fat?: number, goal_carbs?: number, diet_type?: DietType, intolerances?: Intolerance[] };
export type UserMeal = { meal_id: number, user_id: number, name: string, actual_calories?: number, actual_proteins?: number, actual_fats?: number, actual_carbs?: number, actual_portion_grams?: number, meal_time: MealTime, created_at: string, source_type: SourceType, [key: string]: string|number|MealTime|SourceType|undefined };
export type UserIngredient = { ingredient_id: number, user_id: number, name: string, created_at: string, source_type: SourceType, quantity_available_grams: number, [key: string]: string|number|MealTime|SourceType|undefined };
export type ProductTemplate = { product_id: number, name: string, default_calories?: number, default_proteins?: number, default_fats?: number, default_carbs?: number, default_portion_grams?: number, image_url?: string };
export type UserRecipe = { recipe_id: number, user_id: number, name: string, ingredients: RecipeIngredient[], instructions: string, calories: number, protein: number, fat: number, carbs: number, created_at: string, [key: string]: string|number|RecipeIngredient[]|undefined };
export type RecipeIngredient = { name: string, amount: number, unit: string };
export type StatisticsEntry = { calories: number, proteins: number, fats: number, carbs: number };
