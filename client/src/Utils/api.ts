class API{
    static BASE_URL: string = process.env.REACT_APP_SERVER_BASE_URL ?? '/api/'; //'http://192.168.31.15:8005/api/'; //'/api/' || (process.env.REACT_APP_SERVER_BASE_URL || "http://192.168.0.102:8000/");
    static PING: string = API.BASE_URL+"ping";

    static LOGIN: string = API.BASE_URL+"auth/log-in";
    static GOOGLE_LOGIN: string = API.BASE_URL+"auth/google-log-in";
    static SIGNUP: string = API.BASE_URL+"auth/sign-up";
    static VERIFY_EMAIL: string = API.BASE_URL+"auth/verify/";
    static VERIFY_TOKEN: string = API.BASE_URL+"auth/verify-token";
    static LOGOUT: string = API.BASE_URL+"auth/log-out";

    static PROFILE: string = API.BASE_URL+"profile/";
    static PROFILE_STATS: string = API.BASE_URL+"profile/stats";
    static PROFILE_NAME: string = API.BASE_URL+"profile/name";
    static PROFILE_AGE: string = API.BASE_URL+"profile/age";
    static PROFILE_PASSWORD: string = API.BASE_URL+"profile/password";
    static PROFILE_SEX: string = API.BASE_URL+"profile/sex";
    static PROFILE_DIET_TYPE: string = API.BASE_URL+"profile/diet-type";
    static PROFILE_WEIGHT: string = API.BASE_URL+"profile/weight";
    static PROFILE_HEIGHT: string = API.BASE_URL+"profile/height";
    static PROFILE_GOAL_CALORIES: string = API.BASE_URL+"profile/goal-calories";
    static PROFILE_GOAL_PROTEIN: string = API.BASE_URL+"profile/goal-protein";
    static PROFILE_GOAL_FAT: string = API.BASE_URL+"profile/goal-fat";
    static PROFILE_GOAL_CARBS: string = API.BASE_URL+"profile/goal-carbs";
    static PROFILE_INTOLERANCES: string = API.BASE_URL+"profile/intolerances/";

    static FOOD_LOG: string = API.BASE_URL+"food-log/";
    static FOOD_TEMPLATE_SEARCH: string = API.BASE_URL+"food-log/search";
    static RECOGNIZE_MEAL: string = API.BASE_URL+"food-log/recognize";
    static STATISTICS: string = API.BASE_URL+"food-log/stats";

    static INGREDIENTS: string = API.BASE_URL+"ingredients/";
    static RECOGNIZE_INGREDIENT: string = API.BASE_URL+"ingredients/recognize";

    static RECIPES: string = API.BASE_URL+"recipes/";
    static GENERATE_RECIPE: string = API.BASE_URL+"recipes/generate";

    static LOGS: string = API.BASE_URL+"logs/";
}

export default API;