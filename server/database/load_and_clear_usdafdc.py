import requests
import pyarrow as pa
import pyarrow.parquet as pq
import csv
import os
import zipfile
from collections import defaultdict

from database.database_connector import DATA_FOLDER
from utils.logging_utils import logger


urls = [
    ("sr_legacy_food", "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip"),
    ("foundation_food", "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_csv_2025-04-24.zip")
]
SRL_OUTPUT_FILE = os.path.join(DATA_FOLDER, "sr_legacy_food.parquet")
F_OUTPUT_FILE = os.path.join(DATA_FOLDER, "foundation_food.parquet")
needed_files = ["nutrient.csv", "food_nutrient.csv", "food.csv", "food_portion.csv"]
BATCH_SIZE = 1025


def download_file(url, extract_to):
    if not os.path.exists(extract_to):
        os.makedirs(extract_to)

    local_zip = os.path.join(extract_to, "data.zip")
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_zip, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

    with zipfile.ZipFile(local_zip, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    os.remove(local_zip)

    unzipped_folder = os.path.join(extract_to, os.listdir(extract_to)[0])
    for needed_file in needed_files:
        with open(os.path.join(unzipped_folder, needed_file), "rb") as fr, open(os.path.join(extract_to, needed_file), "wb") as fw:
            fw.write(fr.read())

    for f_name in os.listdir(unzipped_folder):
        os.remove(os.path.join(unzipped_folder, f_name))
    os.rmdir(unzipped_folder)


def get_nutrients_map(tmp_dir):
    nutrient_map = {}
    with open(os.path.join(tmp_dir, "nutrient.csv"), encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["name"].lower()
            unit = row["unit_name"].lower()
            if "energy" in name and any("kcal" in att for att in [name, unit]):
                nutrient_map[row["id"]] = "calories"
            elif "protein" in name:
                nutrient_map[row["id"]] = "proteins"
            elif "fat" in name and "total" in name:
                nutrient_map[row["id"]] = "fats"
            elif "carbohydrate" in name and "total" in name:
                nutrient_map[row["id"]] = "carbs"

    return nutrient_map


def get_food_map(tmp_dir):
    food_name_map = {}
    with open(os.path.join(tmp_dir, "food.csv"), encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fdc_id = row["fdc_id"]
            food_name_map[fdc_id] = row["description"].strip()
    return food_name_map


def get_portion_data(tmp_dir):
    portion_data = {}
    with open(os.path.join(tmp_dir, "food_portion.csv"), encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fdc_id = row["fdc_id"]
            if row.get("gram_weight"):
                portion_data[fdc_id] = float(row["gram_weight"])
    return portion_data


def get_food_nutrients(tmp_dir, nutrient_map):
    food_nutrients = defaultdict(dict)
    with open(os.path.join(tmp_dir, "food_nutrient.csv"), encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            fid = row["fdc_id"]
            nid = row["nutrient_id"]
            if nid in nutrient_map:
                try:
                    food_nutrients[fid][nutrient_map[nid]] = float(row["amount"])
                except:
                    food_nutrients[fid][nutrient_map[nid]] = None
    return food_nutrients


def write_data_to_pq(food_name_map, food_nutrients, portion_data, schema, writer):
    batch = []
    b_ctr = 0
    seen_names = set()

    for fdc_id, name in sorted(list(food_name_map.items()), key=lambda x: -len(food_nutrients.get(x[0], {}))):
        if name in seen_names:
            continue
        vals = food_nutrients.get(fdc_id, {})
        row = {
            'name': name[:500],
            'default_calories': vals.get("calories"),
            'default_proteins': vals.get("proteins"),
            'default_fats': vals.get("fats"),
            'default_carbs': vals.get("carbs"),
            'default_portion_grams': portion_data.get(fdc_id),
            'image_url': None
        }
        batch.append(row)

        if len(batch) >= BATCH_SIZE:
            table = pa.Table.from_pylist(batch, schema=schema)
            writer.write_table(table)
            batch.clear()
            b_ctr += 1
            if b_ctr % 10 == 0:
                logger.info(f"\t\t{b_ctr} batches preprocessed")

    if batch:
        table = pa.Table.from_pylist(batch, schema=schema)
        writer.write_table(table)



def init_usdafdc_data():
    if os.path.exists(F_OUTPUT_FILE) and os.path.exists(SRL_OUTPUT_FILE) :
        return

    for df_idx, (kw, url) in enumerate(urls):
        logger.info(f"\tClearing datafile {df_idx + 1} / {len(urls)}")
        tmp_dir = os.path.join(DATA_FOLDER, kw)
        download_file(url, tmp_dir)

        food_name_map = get_food_map(tmp_dir)
        portion_data = get_portion_data(tmp_dir)
        nutrient_map = get_nutrients_map(tmp_dir)
        food_nutrients = get_food_nutrients(tmp_dir, nutrient_map)
        del nutrient_map

        schema = pa.schema([
            ('name', pa.string()),
            ('default_calories', pa.float32()),
            ('default_proteins', pa.float32()),
            ('default_fats', pa.float32()),
            ('default_carbs', pa.float32()),
            ('default_portion_grams', pa.float32()),
            ('image_url', pa.string())
        ])

        with pq.ParquetWriter(os.path.join(DATA_FOLDER, f"{kw}.parquet"), schema) as writer:
            write_data_to_pq(food_name_map, food_nutrients, portion_data, schema, writer)

        if os.path.exists(tmp_dir):
            for f_name in os.listdir(tmp_dir):
                os.remove(os.path.join(tmp_dir, f_name))
            os.rmdir(tmp_dir)

def delete_usdafdc_pq():
    if os.path.exists(F_OUTPUT_FILE):
        os.remove(F_OUTPUT_FILE)
    if os.path.exists(SRL_OUTPUT_FILE):
        os.remove(SRL_OUTPUT_FILE)

if __name__ == "__main__":
    init_usdafdc_data()
