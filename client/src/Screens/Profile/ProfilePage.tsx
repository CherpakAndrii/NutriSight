import "./Profile.css";
import React, {useState} from "react";
import {
    addIntolerance,
    getProfile,
    removeIntolerance,
    updateProfileAge,
    updateProfileDietType,
    updateProfileGoalCalories,
    updateProfileGoalCarbs, updateProfileGoalFat,
    updateProfileGoalProtein,
    updateProfileHeight,
    updateProfileName,
    updateProfileSex,
    updateProfileWeight
} from "../../Utils/queries";
import {UserProfile} from "../../Utils/response-types";
import {DataLoadingStatus} from "../../Utils/enums";
import StringAttributeDisplay from "./StringAttributeDisplay";
import NumericAttributeDisplay from "./NumericAttributeDisplay";
import EnumAttributeDisplay from "./EnumAttributeDisplay";
import IntolerancesAttributeDisplay from "./IntolerancesAttributeDisplay";
import ChangePassword from "./ChangePassword";

const ProfilePage: React.FC = () => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.NotLoaded);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  if (dataLoadingStatus === DataLoadingStatus.NotLoaded) {
      setDataLoadingStatus(DataLoadingStatus.Loading);
        getProfile().then(resp => {
          if (resp.profile) {
              setUserProfile(resp.profile);
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }

  if (dataLoadingStatus !== DataLoadingStatus.Loaded) return (
      <div className="empty-page">
          <h3 className="empty-page-title">{dataLoadingStatus === DataLoadingStatus.Error? "Error loading your profile" : "Loading your profile..."}</h3>
      </div>
  );

    return (
        <div className="profile-page">
            <h2>Profile</h2>

            <StringAttributeDisplay
                label="Name"
                value={userProfile!.name}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileName}
      />
      <NumericAttributeDisplay
        label="Age"
        value={userProfile!.age}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileAge}
      />
      <NumericAttributeDisplay
        label="Weight"
        value={userProfile!.weight}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileWeight}
      />
      <NumericAttributeDisplay
        label="Height"
        value={userProfile!.height}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileHeight}
      />
      <EnumAttributeDisplay
        label="Sex"
        value={userProfile!.sex!}
        options={[
            { label: "Female", value: 0 },
            { label: "Male", value: 1 },
            { label: "Other", value: 2 },
        ]}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileSex}
      />
      <EnumAttributeDisplay
        label="Diet Type"
        value={userProfile!.diet_type!}
        options={[
            { label: "Unrestricted", value: 0 },
            { label: "Vegetarian", value: 1 },
            { label: "Lacto-Vegetarian", value: 2 },
            { label: "Ovo-Vegetarian", value: 3 },
            { label: "Lacto-Ovo-Vegetarian", value: 4 },
            { label: "Pescetarian", value: 5 },
            { label: "Pollotarian", value: 6 },
            { label: "Flexitarian", value: 7 },
            { label: "Vegan", value: 8 },
            { label: "Raw Vegan", value: 9 },
            { label: "Fruitarian", value: 10 },
            { label: "Halal", value: 11 },
            { label: "Kosher", value: 12 },
            { label: "Gluten-Free", value: 13 },
            { label: "Dairy-Free", value: 14 },
            { label: "Nut-Free", value: 15 },
            { label: "Low-Carb", value: 16 },
            { label: "Keto", value: 17 },
            { label: "Paleo", value: 18 },
            { label: "Whole30", value: 19 },
            { label: "Mediterranean", value: 20 },
            { label: "Low-Fat", value: 21 },
            { label: "Diabetic", value: 22 },
            { label: "Low-Sodium", value: 23 },
            { label: "Organic", value: 24 },
            { label: "Locavore", value: 25 },
            { label: "Carnivore", value: 26 },
            { label: "Plant-Based", value: 27 }
        ]}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileDietType}
      />
      <NumericAttributeDisplay
        label="Goal Calories"
        value={userProfile!.goal_calories}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileGoalCalories}
      />
      <NumericAttributeDisplay
        label="Goal Protein"
        value={userProfile!.goal_protein}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileGoalProtein}
      />
      <NumericAttributeDisplay
        label="Goal Fat"
        value={userProfile!.goal_fat}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileGoalFat}
      />
      <NumericAttributeDisplay
        label="Goal Carbs"
        value={userProfile!.goal_carbs}
        setUserProfile={setUserProfile}
        updateFunc={updateProfileGoalCarbs}
      />
      <IntolerancesAttributeDisplay
        label="Intolerances"
        value={userProfile!.intolerances!}
        setUserProfile={setUserProfile}
        addFunc={addIntolerance}
        removeFunc={removeIntolerance}
      />
      <ChangePassword auth_provider={userProfile!.auth_provider} />
    </div>
  );
};

export default ProfilePage
