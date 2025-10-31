import json

from fastapi import UploadFile
from google import genai
from google.genai.types import Content, Part

from constants import GEMINI_API_KEY
from database.models import User
from utils.logging_utils import logger


client = genai.Client(api_key=GEMINI_API_KEY)

async def analyze_dish(file: UploadFile):
    image_bytes = await file.read()

    prompt = """
    You are a nutrition expert. Analyze the dish in the photo.
    Return only a JSON object like this with approximate data without any additional info:
    {
      "name": "string",
      "approx_weight_grams": number,
      "nutrients_per_100g": {
        "kcal": number,
        "protein": number,
        "fat": number,
        "carbs": number
      }
    }
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            Content(
                parts=[
                    Part(text=prompt),
                    Part.from_bytes(data=image_bytes, mime_type=file.content_type),
                ]
            )
        ],
    )

    logger.debug(response.text)
    return json.loads(response.text.strip('`json'))

async def analyze_ingredient(file: UploadFile):
    image_bytes = await file.read()

    prompt = """
    You are a nutrition expert. Analyze the food ingredient in the photo.
    Return only a JSON object like this with approximate data without any additional info:
    {
      "name": "string",
      "approx_weight_grams": number
    }
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            Content(
                parts=[
                    Part(text=prompt),
                    Part.from_bytes(data=image_bytes, mime_type=file.content_type),
                ]
            )
        ],
    )

    logger.debug(response.text)
    return json.loads(response.text.strip('`json'))


async def generate_recipe(user: User):
    prompt = f"""
        You are a professional nutritionist and chef.
        Generate 3 healthy recipes based on the following data:

        Available ingredients: {[{'name': i.name, 'available_grams': i.quantity_available_grams} for i in user.ingredients]}
        Dietary restrictions: {user.diet_type.name}
        Intolerances: {[i.intolerance_name for i in user.intolerances]}
        Target calories per day: {user.goal_calories}
        
        You don't need to use all the ingredients. You can also include another ingredients if needed.

        Return a list of JSON objects like this:
        [{{
            "name": "string",
            "ingredients": [{{"name": "string", "amount": number, "unit": "string"}}]
            "calories": number,
            "protein": number,
            "fat": number,
            "carbs": number,
            "instructions": "string"
        }}]

        Respond ONLY with valid JSON array.
        """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            Content(
                parts=[
                    Part(text=prompt)
                ]
            )
        ],
    )

    logger.debug(response.text)
    recipes = json.loads(response.text.strip('`json'))
    return recipes
