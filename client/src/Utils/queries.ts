import axios from "axios";
import API from "./api";
import { SuccessResponse, LoginResp, GetUserProfileResp, StatisticsResp, ModifyUserProfileResp, GetFoodLogResp, UpdateFoodLogResp, MealAISuggestionResp, TemplateSearchResp, GetIngredientsResp, AddIngredientResp, IngredientAISuggestionResp, GetRecipesResp, AddRecipeResp, RecipeAISuggestionResp} from "./response-types";
import {DietType, MealTime, Sex, SourceType} from "./enums";

const simpleOperationsTimeout = 10_000;
const mediumOperationsTimeout = 25_000;
const complexOperationsTimeout = 600_000;

axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'True';


// region AuthOperations
export async function logIn(login: string, password: string): Promise<LoginResp> {
    const bodyData = { login: login, password: password };
    
    return axios
        .post(API.LOGIN, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as LoginResp;
        }).catch((reason) => {
            return {success: false, user_id: 0, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as LoginResp;
        });
}

export async function googleLogIn(id_token: string): Promise<LoginResp> {
    const bodyData = { id_token: id_token };

    return axios
        .post(API.GOOGLE_LOGIN, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as LoginResp;
        }).catch((reason) => {
            return {success: false, user_id: 0, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as LoginResp;
        });
}

export async function signUp(login: string, password: string): Promise<SuccessResponse> {
    const bodyData = { login: login, password: password };

    return axios
        .post(API.SIGNUP, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as SuccessResponse;
        }).catch((reason) => {
            return {success: false, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as SuccessResponse;
        });
}

export async function verifyEmail(access_token: string): Promise<LoginResp> {
    const bodyData = { access_token: access_token };

    return axios
        .post(API.VERIFY_EMAIL, bodyData, {timeout: mediumOperationsTimeout})
        // .get(API.VERIFY_EMAIL+access_token, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as LoginResp;
        }).catch((reason) => {
            return {success: false, user_id: 0, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as LoginResp;
        });
}

export async function testAuth(): Promise<LoginResp> {
    return axios
        .post(API.VERIFY_TOKEN, {}, {timeout: simpleOperationsTimeout})
        .then(({data}) => {
            return data as LoginResp;
        }).catch((reason) => {
            return {success: false, user_id: 0, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as LoginResp;
        });
}

export async function logOut(): Promise<SuccessResponse> {

    return axios
        .post(API.LOGOUT, {}, {timeout: simpleOperationsTimeout})
        .then(({data}) => {
            return data as SuccessResponse;
        }).catch((reason) => {
            return {success: false, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as SuccessResponse;
        });
}

export async function checkConnection(): Promise<SuccessResponse> {
    // don't need connection validation when serving frontend from FastAPI
    return {success: true} as SuccessResponse;
}

// endregion
// region Profile Operations
export async function getProfile(): Promise<GetUserProfileResp> {
    return axios
        .get(API.PROFILE, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as GetUserProfileResp;
        }).catch((reason) => {
            return {profile: undefined, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as GetUserProfileResp;
        });
}

export async function deleteProfile(): Promise<SuccessResponse> {
    return axios
        .delete(API.PROFILE, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as SuccessResponse;
        }).catch((reason) => {
            return {success: false, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as SuccessResponse;
        });
}

export async function updateProfileName(new_name: string): Promise<ModifyUserProfileResp> {
    const bodyData = { name: new_name };
    return axios
        .put(API.PROFILE_NAME, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfileAge(new_age: number): Promise<ModifyUserProfileResp> {
    const bodyData = { age: new_age };
    return axios
        .put(API.PROFILE_AGE, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfilePassword(old_pwd: string|undefined, new_pwd: string): Promise<ModifyUserProfileResp> {
    const bodyData = { prev_pwd: old_pwd, new_pwd: new_pwd };
    return axios
        .put(API.PROFILE_PASSWORD, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfileSex(new_sex: Sex): Promise<ModifyUserProfileResp> {
    const bodyData = { sex: new_sex };
    return axios
        .put(API.PROFILE_SEX, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfileDietType(new_diet_type: DietType): Promise<ModifyUserProfileResp> {
    const bodyData = { dietType: new_diet_type };
    return axios
        .put(API.PROFILE_DIET_TYPE, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfileNumericField(endpoint: string, new_value: number): Promise<ModifyUserProfileResp> {
    const bodyData = { value: new_value };
    return axios
        .put(endpoint, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function updateProfileWeight(new_weight: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_WEIGHT, new_weight);
}

export async function updateProfileHeight(new_height: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_HEIGHT, new_height);
}

export async function updateProfileGoalCalories(new_goal_calories: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_GOAL_CALORIES, new_goal_calories);
}

export async function updateProfileGoalProtein(new_goal_protein: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_GOAL_PROTEIN, new_goal_protein);
}

export async function updateProfileGoalFat(new_goal_fat: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_GOAL_FAT, new_goal_fat);
}

export async function updateProfileGoalCarbs(new_goal_carbs: number): Promise<ModifyUserProfileResp> {
    return updateProfileNumericField(API.PROFILE_GOAL_CARBS, new_goal_carbs);
}

export async function AddIntolerance(new_intolerance: string): Promise<ModifyUserProfileResp> {
    const bodyData = { name: new_intolerance };
    return axios
        .post(API.PROFILE_INTOLERANCES, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function removeIntolerance(intolerance_id: number): Promise<ModifyUserProfileResp> {
    return axios
        .delete(API.PROFILE_INTOLERANCES+intolerance_id, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as ModifyUserProfileResp;
        }).catch((reason) => {
            return {success: false, message: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as ModifyUserProfileResp;
        });
}

export async function getStatistics(): Promise<StatisticsResp> {
    return axios
        .get(API.STATISTICS, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as StatisticsResp;
        }).catch((reason) => {
            return {today: { calories: 0, proteins: 0, fats: 0, carbs: 0}, average_last_7_days: { calories: 0, proteins: 0, fats: 0, carbs: 0}, errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as StatisticsResp;
        });
}

// endregion
// region FoodLog Actions
export async function getFoodLogEntries(): Promise<GetFoodLogResp> {
    return axios
        .get(API.FOOD_LOG, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as GetFoodLogResp;
        }).catch((reason) => {
            return {food_log: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as GetFoodLogResp;
        });
}

export async function createFoodLogEntry(name: string, meal_time: MealTime, actual_calories: number, actual_proteins: number, actual_fats: number, actual_carbs: number, actual_portion_grams: number, source_type: SourceType): Promise<UpdateFoodLogResp> {
    const bodyData = { name: name, meal_time: meal_time, actual_calories: actual_calories, actual_proteins: actual_proteins, actual_fats: actual_fats, actual_carbs: actual_carbs, actual_portion_grams: actual_portion_grams, source_type: source_type };
    return axios
        .post(API.FOOD_LOG, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as UpdateFoodLogResp;
        }).catch((reason) => {
            return {success: false, food_log: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as UpdateFoodLogResp;
        });
}

export async function updateFoodLogEntry(log_id: number, meal_time: MealTime, actual_calories: number, actual_proteins: number, actual_fats: number, actual_carbs: number, actual_portion_grams: number, source_type: SourceType): Promise<UpdateFoodLogResp> {
    const bodyData = { meal_time: meal_time, actual_calories: actual_calories, actual_proteins: actual_proteins, actual_fats: actual_fats, actual_carbs: actual_carbs, actual_portion_grams: actual_portion_grams, source_type: source_type };
    return axios
        .put(API.FOOD_LOG+log_id, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as UpdateFoodLogResp;
        }).catch((reason) => {
            return {success: false, food_log: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as UpdateFoodLogResp;
        });
}

export async function removeFoodLogEntry(log_id: number): Promise<UpdateFoodLogResp> {
    return axios
        .delete(API.FOOD_LOG+log_id, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as UpdateFoodLogResp;
        }).catch((reason) => {
            return {success: false, food_log: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as UpdateFoodLogResp;
        });
}

export async function searchFoodTemplate(query: string): Promise<TemplateSearchResp> {
    const bodyData = { query: query };

    return axios
        .post(API.FOOD_TEMPLATE_SEARCH, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as TemplateSearchResp;
        }).catch((reason) => {
            return {results: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as TemplateSearchResp;
        });
}

export async function recognizeMeal(filename: string, file: Blob): Promise<MealAISuggestionResp> {
    const formData = new FormData();
    formData.append("file", file, filename);

    return axios
        .post(API.RECOGNIZE_MEAL, formData, {timeout: complexOperationsTimeout})
        .then(({data}) => {
            return data as MealAISuggestionResp;
        }).catch((reason) => {
            return {name: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as MealAISuggestionResp;
        });
}

// endregion
// region Ingredients
export async function getIngredients(): Promise<GetIngredientsResp> {
    return axios
        .get(API.INGREDIENTS, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as GetIngredientsResp;
        }).catch((reason) => {
            return {ingredients: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as GetIngredientsResp;
        });
}

export async function createIngredient(name: string, portion_grams: number, source_type: SourceType): Promise<AddIngredientResp> {
    const bodyData = { name: name, portion_grams: portion_grams, source_type: source_type };
    return axios
        .post(API.INGREDIENTS, bodyData, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as AddIngredientResp;
        }).catch((reason) => {
            return {success: false, ingredients: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as AddIngredientResp;
        });
}

export async function removeIngredient(ingredient_id: number): Promise<AddIngredientResp> {
    return axios
        .delete(API.INGREDIENTS+ingredient_id, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as AddIngredientResp;
        }).catch((reason) => {
            return {success: false, ingredients: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as AddIngredientResp;
        });
}

export async function recognizeIngredient(filename: string, file: Blob): Promise<IngredientAISuggestionResp> {
    const formData = new FormData();
    formData.append("file", file, filename);

    return axios
        .post(API.RECOGNIZE_INGREDIENT, formData, {timeout: complexOperationsTimeout})
        .then(({data}) => {
            return data as IngredientAISuggestionResp;
        }).catch((reason) => {
            return {name: "", errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as IngredientAISuggestionResp;
        });
}

// endregion
// region Recipes
export async function getRecipes(): Promise<GetRecipesResp> {
    return axios
        .get(API.RECIPES, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as GetRecipesResp;
        }).catch((reason) => {
            return {recipes: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as GetRecipesResp;
        });
}

export async function removeRecipe(recipe_id: number): Promise<AddRecipeResp> {
    return axios
        .delete(API.INGREDIENTS+recipe_id, {timeout: mediumOperationsTimeout})
        .then(({data}) => {
            return data as AddRecipeResp;
        }).catch((reason) => {
            return {success: false, recipes: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as AddRecipeResp;
        });
}

export async function generateRecipes(): Promise<RecipeAISuggestionResp> {
    return axios
        .post(API.GENERATE_RECIPE, {}, {timeout: complexOperationsTimeout})
        .then(({data}) => {
            return data as RecipeAISuggestionResp;
        }).catch((reason) => {
            return {recipes: [], errorCode: reason.response !== undefined? reason.response.status : reason.request.status } as RecipeAISuggestionResp;
        });
}

// endregion