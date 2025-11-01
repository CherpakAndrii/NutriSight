class API{
    static BASE_URL: string = process.env.REACT_APP_SERVER_BASE_URL ?? '/api/'; //'http://192.168.31.15:8005/api/'; //'/api/' || (process.env.REACT_APP_SERVER_BASE_URL || "http://192.168.0.102:8000/");
    static PING: string = API.BASE_URL+"ping";

    static LOGIN: string = API.BASE_URL+"auth/log-in";
    static GOOGLE_LOGIN: string = API.BASE_URL+"auth/google-log-in";
    static SIGNUP: string = API.BASE_URL+"auth/sign-up";
    static VERIFY_EMAIL: string = API.BASE_URL+"auth/verify/";
    static VERIFY_TOKEN: string = API.BASE_URL+"auth/verify-token";
    static LOGOUT: string = API.BASE_URL+"auth/log-out";

    static PROFILE: string = API.BASE_URL+"auth/profile/";
    static PROFILE_STATS: string = API.BASE_URL+"auth/profile/stats";
    static PROFILE_NAME: string = API.BASE_URL+"auth/profile/name";
    static PROFILE_AGE: string = API.BASE_URL+"auth/profile/age";
    static PROFILE_PASSWORD: string = API.BASE_URL+"auth/profile/password";
    static PROFILE_SEX: string = API.BASE_URL+"auth/profile/sex";
    static PROFILE_DIET_TYPE: string = API.BASE_URL+"auth/profile/diet-type";
    static PROFILE_WEIGHT: string = API.BASE_URL+"auth/profile/weight";
    static PROFILE_HEIGHT: string = API.BASE_URL+"auth/profile/height";
    static PROFILE_GOAL_CALORIES: string = API.BASE_URL+"auth/profile/goal-calories";
    static PROFILE_GOAL_PROTEIN: string = API.BASE_URL+"auth/profile/goal-protein";
    static PROFILE_GOAL_FAT: string = API.BASE_URL+"auth/profile/goal-fat";
    static PROFILE_GOAL_CARBS: string = API.BASE_URL+"auth/profile/goal-carbs";
    static PROFILE_INTOLERANCES: string = API.BASE_URL+"auth/profile/intolerances/";

    static FOOD_LOG: string = API.BASE_URL+"auth/food-log/";
    static FOOD_TEMPLATE_SEARCH: string = API.BASE_URL+"auth/food-log/search";
    static RECOGNIZE_MEAL: string = API.BASE_URL+"auth/food-log/recognize";
    static STATISTICS: string = API.BASE_URL+"auth/food-log/stats";

    static INGREDIENTS: string = API.BASE_URL+"auth/ingredients/";
    static RECOGNIZE_INGREDIENT: string = API.BASE_URL+"auth/ingredients/recognize";

    static RECIPES: string = API.BASE_URL+"auth/recipes/";
    static GENERATE_RECIPE: string = API.BASE_URL+"auth/recipes/generate";

    static LOGS: string = API.BASE_URL+"logs/";
}

export default API;