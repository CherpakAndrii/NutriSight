import enum


class Sex(enum.Enum):
    Female = 0
    Male = 1
    PreferNotToSay = 2


class MealTime(enum.Enum):
    Breakfast = 0
    Lunch = 1
    Dinner = 2
    Snack = 3


class SourceType(enum.Enum):
    Manual = 0
    Photo = 1
    AISuggestion = 2


class DietType(enum.Enum):
  unrestricted = 0 # omnivore
  vegetarian = 1
  lacto_vegetarian = 2
  ovo_vegetarian = 3
  lacto_ovo_vegetarian = 4
  pescetarian = 5
  pollotarian = 6
  flexitarian = 7
  vegan = 8
  raw_vegan = 9
  fruitarian = 10
  halal = 11
  kosher = 12
  gluten_free = 13
  dairy_free = 14
  nut_free = 15
  low_carb = 16
  keto = 17
  paleo = 18
  whole30 = 19
  mediterranean = 20
  low_fat = 21
  diabetic = 22
  low_sodium = 23
  organic = 24
  locavore = 25
  carnivore = 26
  plant_based = 27
