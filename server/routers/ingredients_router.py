from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy import select, func

from database.database_connector import get_db_session, get_async_db_session
from routers.req_data_types.ingredients_req_data_types import AddIngredientData
from utils.auth_utils import get_current_user_id
from utils.ai_utils import analyze_ingredient
from database.models import UserIngredient
from routers.res_data_types.ingredients_res_data_types import GetIngredientsResp, AddIngredientResp, AISuggestionResp


ingredients_router = APIRouter()

@ingredients_router.get('/', response_model=GetIngredientsResp)
def get_user_ingredients(user_id: int = Depends(get_current_user_id), session = Depends(get_db_session), ):
    user_ingredients = session.query(UserIngredient).filter(UserIngredient.user_id == user_id).all()
    return {'ingredients': [f.to_dict() for f in user_ingredients]}


@ingredients_router.post('/', response_model=AddIngredientResp)
def create_user_ingredient(data: AddIngredientData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    new_ingredient = UserIngredient(user_id=user_id, name=data.name, quantity_available_grams=data.portion_grams, source_type=data.source_type)
    session.add(new_ingredient)
    session.commit()

    user_ingredients = session.query(UserIngredient).filter(UserIngredient.user_id == user_id).all()
    return {'success': True, 'ingredients': [f.to_dict() for f in user_ingredients]}


@ingredients_router.delete('/{ingredient_id}', response_model=AddIngredientResp)
def delete_user_ingredient(ingredient_id: int, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    old_ingredient = session.get(UserIngredient, ingredient_id)
    if old_ingredient and old_ingredient.user_id == user_id:
        session.delete(old_ingredient)
        session.commit()

    user_ingredients = session.query(UserIngredient).filter(UserIngredient.user_id == user_id).all()
    return {'success': True, 'ingredients': [f.to_dict() for f in user_ingredients]}


@ingredients_router.post('/recognize', response_model=AISuggestionResp)
async def recognize_ingredient(file: UploadFile, user_id: int = Depends(get_current_user_id)):
    ingredient = await analyze_ingredient(file)
    return {
        "name": ingredient.get('name'),
        "portion_grams": float(ingredient.get('approx_weight_grams')) if ingredient.get('approx_weight_grams') else None
    }
