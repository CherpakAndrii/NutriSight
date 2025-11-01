from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import delete

from database.enums import AuthProvider
from database.database_connector import get_db_session
from routers.req_data_types.user_profile_req_data_types import ChangeNameData, ChangeAgeData, ChangePasswordData, ChangeNumericFieldData, ChangeSexData, ChangeDietTypeData, AddIntoleranceData
from utils.auth_utils import get_current_user_id, hash_password
from database.models import User, Intolerance, user_intolerance
from routers.res_data_types.user_profile_res_data_types import GetUserProfileResp, ModifyUserProfileResp
from routers.res_data_types.res_data_types import SuccessResponse


user_profile_router = APIRouter()

@user_profile_router.get('/', response_model=GetUserProfileResp)
def get_my_profile(user_id: int = Depends(get_current_user_id), session = Depends(get_db_session), ):
    user_profile = session.get(User, user_id).to_dict()
    return {'profile': user_profile}

@user_profile_router.delete('/', response_model=SuccessResponse)
def delete_my_profile(user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        session.delete(user_profile)
        session.commit()

    response = JSONResponse(content={"success": True})
    response.delete_cookie("access_token")
    return response


@user_profile_router.put('/name', response_model=ModifyUserProfileResp)
def change_name(data: ChangeNameData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.name = data.name
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Name changed successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/age', response_model=ModifyUserProfileResp)
def change_age(data: ChangeAgeData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.age = data.age
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Name changed successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/password', response_model=ModifyUserProfileResp)
def change_password(data: ChangePasswordData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        if user_profile.auth_provider != AuthProvider.Google and hash_password(data.prev_pwd) != user_profile.password:
            return {'success': False, 'message': 'Incorrect previous password'}

        user_profile.password = hash_password(data.new_pwd)
        if user_profile.auth_provider == AuthProvider.Google:
            user_profile.auth_provider = AuthProvider.Both

        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Password changed successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/sex', response_model=ModifyUserProfileResp)
def change_sex(data: ChangeSexData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.sex = data.sex
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Sex specified successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/diet-type', response_model=ModifyUserProfileResp)
def change_diet_type(data: ChangeDietTypeData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.diet_type = data.dietType
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/weight', response_model=ModifyUserProfileResp)
def change_weight(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.weight = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/height', response_model=ModifyUserProfileResp)
def change_height(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.height = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/goal-calories', response_model=ModifyUserProfileResp)
def change_goal_calories(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.goal_calories = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/goal-protein', response_model=ModifyUserProfileResp)
def change_goal_protein(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.goal_protein = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/goal-fat', response_model=ModifyUserProfileResp)
def change_goal_fat(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.goal_fat = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.put('/goal-carbs', response_model=ModifyUserProfileResp)
def change_goal_carbs(data: ChangeNumericFieldData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        user_profile.goal_carbs = data.value
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Diet type selected successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}

@user_profile_router.post('/intolerances/', response_model=ModifyUserProfileResp)
def change_name(data: AddIntoleranceData, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    user_profile = session.get(User, user_id)
    if user_profile:
        intolerance = session.query(Intolerance).filter(Intolerance.intolerance_name == data.name).first()
        if not intolerance:
            intolerance = Intolerance(intolerance_name=data.name)
            session.add(intolerance)
            session.commit()
            session.refresh(intolerance)


        user_profile.intolerances.append(intolerance)
        session.commit()
        session.refresh(user_profile)
        return {'success': True, 'message': 'Intolerance added successfully', 'profile': user_profile.to_dict()}
    else:
        return {'success': False, 'message': 'User not found'}


@user_profile_router.delete('/intolerances/{intolerance_id}', response_model=ModifyUserProfileResp)
def delete_intolerance(intolerance_id: int, user_id: int = Depends(get_current_user_id), session = Depends(get_db_session)):
    stmt = delete(user_intolerance).where(
        user_intolerance.c.user_id == user_id,
        user_intolerance.c.intolerance_id == intolerance_id
    )

    session.execute(stmt)
    session.commit()

    user_profile = session.get(User, user_id)
    return {'success': True, 'message': 'Intolerance removed successfully', 'profile': user_profile.to_dict()}
