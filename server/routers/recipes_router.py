from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database.database_connector import get_db_session, get_async_db_session
from routers.req_data_types.recipes_req_data_types import AddRecipeData
from utils.auth_utils import get_current_user_id
from utils.ai_utils import generate_recipe
from database.models import UserRecipe, User
from routers.res_data_types.recipes_res_data_types import GetRecipesResp, AddRecipeResp, AISuggestionResp


recipes_router = APIRouter()

@recipes_router.get('/', response_model=GetRecipesResp)
def get_user_recipes(user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_recipes = session.query(UserRecipe).filter(UserRecipe.user_id == user_id).all()
    return {'recipes': [f.to_dict() for f in user_recipes]}


@recipes_router.post('/', response_model=AddRecipeResp)
def create_user_recipe(data: AddRecipeData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    new_recipe = UserRecipe(user_id=user_id, name=data.name, ingredients=data.ingredients, instructions=data.instructions, calories=data.calories, protein=data.protein, fat=data.fat, carbs=data.carbs)
    session.add(new_recipe)
    session.commit()

    user_recipes = session.query(UserRecipe).filter(UserRecipe.user_id == user_id).all()
    return {'success': True, 'recipes': [f.to_dict() for f in user_recipes]}


@recipes_router.delete('/{recipe_id}', response_model=AddRecipeResp)
def delete_user_recipe(recipe_id: int, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    old_recipe = session.get(UserRecipe, recipe_id)
    if old_recipe and old_recipe.user_id == user_id:
        session.delete(old_recipe)
        session.commit()

    user_recipes = session.query(UserRecipe).filter(UserRecipe.user_id == user_id).all()
    return {'success': True, 'recipes': [f.to_dict() for f in user_recipes]}


@recipes_router.post('/generate', response_model=AISuggestionResp)
async def create_recipe(user_id: int = Depends(get_current_user_id), a_session = Depends(get_async_db_session)):
    stmt = (
        select(User)
        .options(
            selectinload(User.intolerances),
            selectinload(User.ingredients),
        )
        .filter_by(user_id=user_id)
    )

    result = await a_session.execute(stmt)
    user = result.scalar_one()

    recipes = await generate_recipe(user)
    return {"recipes": recipes}
