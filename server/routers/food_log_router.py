from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy import select, func

from database.database_connector import get_db_session, get_async_db_session
from routers.req_data_types.food_log_req_data_types import NewFoodLogData, UpdateFoodLogData, ProductTemplateSearchData
from utils.auth_utils import get_current_user_id
from utils.ai_utils import analyze_dish
from database.models import UserMeal, ProductTemplate
from routers.res_data_types.food_log_res_data_types import GetFoodLogResp, UpdateFoodLogResp, TemplateSearchResp, AISuggestionResp


food_log_router = APIRouter()

@food_log_router.get('/', response_model=GetFoodLogResp)
def get_food_log_entries(user_id: int = Depends(get_current_user_id), session = Depends(get_db_session), ):
    food_log_entries = session.query(UserMeal).filter(UserMeal.user_id == user_id).all()
    return {'food_log': [f.to_dict() for f in food_log_entries]}


@food_log_router.post('/', response_model=UpdateFoodLogResp)
def create_food_log_entry(data: NewFoodLogData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    new_log = UserMeal(user_id=user_id, name=data.name, meal_time=data.meal_time, actual_calories=data.actual_calories, actual_proteins=data.actual_proteins, actual_fats=data.actual_fats, actual_carbs=data.actual_carbs, actual_portion_grams=data.actual_portion_grams, source_type=data.source_type)
    session.add(new_log)
    session.commit()

    food_log_entries = session.query(UserMeal).filter(UserMeal.user_id == user_id).all()
    return {'success': True, 'food_log': [f.to_dict() for f in food_log_entries]}


@food_log_router.put('/{log_id}', response_model=UpdateFoodLogResp)
def update_food_log_entry(log_id: int, data: UpdateFoodLogData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    old_log = session.get(UserMeal, log_id)
    if old_log and old_log.user_id == user_id:
        old_log.meal_time=data.meal_time
        old_log.actual_calories=data.actual_calories
        old_log.actual_proteins=data.actual_proteins
        old_log.actual_fats=data.actual_fats
        old_log.actual_carbs=data.actual_carbs
        old_log.actual_portion_grams=data.actual_portion_grams

        session.commit()

    food_log_entries = session.query(UserMeal).filter(UserMeal.user_id == user_id).all()
    return {'success': old_log is not None, 'food_log': [f.to_dict() for f in food_log_entries]}


@food_log_router.delete('/{log_id}', response_model=UpdateFoodLogResp)
def delete_food_log_entry(log_id: int, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    old_log = session.get(UserMeal, log_id)
    if old_log and old_log.user_id == user_id:
        session.delete(old_log)
        session.commit()

    food_log_entries = session.query(UserMeal).filter(UserMeal.user_id == user_id).all()
    return {'success': old_log is not None, 'food_log': [f.to_dict() for f in food_log_entries]}


@food_log_router.post('/search', response_model=TemplateSearchResp)
def search_prod_template(data: ProductTemplateSearchData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    words = data.query.strip().split()
    tsquery = ' & '.join(f"{w}:*" for w in words)

    stmt = (
        select(ProductTemplate)
        .where(func.to_tsvector('simple', ProductTemplate.name).match(tsquery, postgresql_regconfig='simple'))
        .order_by(func.length(ProductTemplate.name))
        .limit(10)
    )

    result = session.execute(stmt)
    return {"results": [r.to_dict() for r in result.scalars().all()]}

@food_log_router.post('/recognize', response_model=AISuggestionResp)
async def recognize_meal(file: UploadFile, user_id: int = Depends(get_current_user_id)):
    dish = await analyze_dish(file)
    nutrients = dish.get('nutrients_per_100g', {})
    return {
        "name": dish.get('name'),
        "default_calories": float(nutrients.get('kcal')) if nutrients.get('kcal') else None,
        "default_proteins": float(nutrients.get('protein')) if nutrients.get('protein') else None,
        "default_fats": float(nutrients.get('fat')) if nutrients.get('fat') else None,
        "default_carbs": float(nutrients.get('carbs')) if nutrients.get('carbs') else None,
        "default_portion_grams": float(dish.get('approx_weight_grams')) if dish.get('approx_weight_grams') else None
    }
