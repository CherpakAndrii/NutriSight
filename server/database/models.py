import datetime

import pyarrow.parquet as pq
from sqlalchemy import Column, Integer, Float, String, Enum, ForeignKey, DateTime, Table, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.inspection import inspect
from sqlalchemy.dialects.postgresql import JSONB
from filelock import FileLock, Timeout

from database.enums import *
from database.database_connector import engine, Session
from database.load_and_clear_off_pq import init_off_data, delete_off_pq, OFF_OUTPUT_FILE, BATCH_SIZE
from database.load_and_clear_usdafdc import init_usdafdc_data, delete_usdafdc_pq, SRL_OUTPUT_FILE, F_OUTPUT_FILE
from utils.logging_utils import logger


Base = declarative_base()


user_intolerance = Table(
    "user_intolerance",
    Base.metadata,
    Column("user_id", ForeignKey("users.user_id", ondelete='CASCADE', onupdate='CASCADE'), primary_key=True),
    Column("intolerance_id", ForeignKey("intolerances.intolerance_id", ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
)


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True)
    email = Column(String(1000), nullable=False, unique=True)
    password = Column(String(50), nullable=True)
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.Local)
    name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    sex = Column(Enum(Sex), nullable=True, default=Sex.PreferNotToSay)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    goal_calories = Column(Float, nullable=True)
    goal_protein = Column(Float, nullable=True)
    goal_fat = Column(Float, nullable=True)
    goal_carbs = Column(Float, nullable=True)
    diet_type = Column(Enum(DietType), nullable=True)

    intolerances = relationship(
        "Intolerance",
        secondary=user_intolerance,
        back_populates="users",
        passive_deletes=True
    )
    meals = relationship("UserMeal", back_populates="user", passive_deletes=True)
    ingredients = relationship("UserIngredient", back_populates="user", passive_deletes=True)
    recipes = relationship("UserRecipe", back_populates="user", passive_deletes=True)

    def to_dict(self):
        return {key: getattr(self, key) for key in ['user_id', 'email', 'auth_provider', 'name', 'age', 'sex', 'weight', 'height', 'goal_calories', 'goal_protein', 'diet_type']} | {'intolerances': [i.to_dict() for i in self.intolerances]}


class Intolerance(Base):
    __tablename__ = "intolerances"

    intolerance_id = Column(Integer, primary_key=True)
    intolerance_name = Column(String(50), nullable=False, unique=True)

    users = relationship(
        "User",
        secondary=user_intolerance,
        back_populates="intolerances"
    )

    def to_dict(self):
        return {key: getattr(self, key) for key in ['intolerance_id', 'intolerance_name']}


class ProductTemplate(Base):
    __tablename__ = "product_templates"

    product_id = Column(Integer, primary_key=True)
    name = Column(String(500), index=True, nullable=False)
    default_calories = Column(Float, nullable=True)
    default_proteins = Column(Float, nullable=True)
    default_fats = Column(Float, nullable=True)
    default_carbs = Column(Float, nullable=True)
    default_portion_grams = Column(Float, nullable=True)
    image_url = Column(String(350), nullable=True)

    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


class UserMeal(Base):
    __tablename__ = "user_meals"

    meal_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    name = Column(String(500), nullable=False)
    actual_calories = Column(Float, nullable=True)
    actual_proteins = Column(Float, nullable=True)
    actual_fats = Column(Float, nullable=True)
    actual_carbs = Column(Float, nullable=True)
    actual_portion_grams = Column(Float, nullable=True)
    meal_time = Column(Enum(MealTime), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now)
    source_type = Column(Enum(SourceType), nullable=False)

    user = relationship("User", back_populates="meals")

    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs if c.key != 'user'}


class UserIngredient(Base):
    __tablename__ = "user_ingredients"

    ingredient_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    name = Column(String(200), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now)
    source_type = Column(Enum(SourceType), nullable=False)
    quantity_available_grams = Column(Integer, nullable=False)

    user = relationship("User", back_populates="ingredients")

    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


class UserRecipe(Base):
    __tablename__ = "user_recipes"

    recipe_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    name = Column(String(200), nullable=False)

    ingredients = Column(JSONB, nullable=False) # JSON [{name, amount, unit}]

    instructions = Column(String(8192), nullable=False)
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now)

    user = relationship("User", back_populates="recipes")




lock = FileLock("db-init.lock")
try:
    with lock.acquire(timeout=2*60*60, poll_interval=15*60):
        Base.metadata.create_all(engine)
        with Session() as session:
            if session.query(ProductTemplate).count() == 0:
                logger.info("Initializing the database")
                init_sequence = [
                    (init_off_data, [OFF_OUTPUT_FILE], delete_off_pq),
                    (init_usdafdc_data, [SRL_OUTPUT_FILE, F_OUTPUT_FILE], delete_usdafdc_pq)
                ]

                for ds_idx, (init_func, data_files, delete_func) in enumerate(init_sequence):
                    logger.info(f"Processing dataset {ds_idx+1} / {len(init_sequence)}")
                    init_func()

                    for df_idx, data_file in enumerate(data_files):
                        logger.info(f"\tProcessing datafile {df_idx + 1} / {len(data_files)}")
                        reader = pq.ParquetFile(data_file)
                        batches = reader.num_row_groups
                        b_idx = 1

                        for batch in reader.iter_batches(batch_size=BATCH_SIZE):
                            rows = batch.to_pylist()
                            objects = [
                                ProductTemplate(
                                    name=row.get("name"),
                                    default_calories=row.get("default_calories"),
                                    default_proteins=row.get("default_proteins"),
                                    default_fats=row.get("default_fats"),
                                    default_carbs=row.get("default_carbs"),
                                    default_portion_grams=row.get("default_portion_grams"),
                                    image_url=row.get("image_url"),
                                )
                                for row in rows
                                if row.get("name")
                            ]

                            session.bulk_save_objects(objects)
                            session.commit()
                            if b_idx % 10 == 0:
                                logger.info(f"\t\t{b_idx} / {batches} batches processed")
                            b_idx += 1

                    delete_func()
except Timeout as e:
    raise e

