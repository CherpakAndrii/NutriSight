import os
import requests
import pyarrow as pa
import pyarrow.parquet as pq

from database.database_connector import DATA_FOLDER
from utils.logging_utils import logger


OFF_SOURCE_URL = "https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet?download=true"
SOURCE_FILE = os.path.join(DATA_FOLDER, "food.parquet")
OFF_OUTPUT_FILE = os.path.join(DATA_FOLDER, "openfoodfacts_small.parquet")
get_scode = lambda code: f"{code[:3]}/{code[3:6]}/{code[6:9]}/{code[9:]}"
image_url = lambda code, key, rev: f"https://images.openfoodfacts.net/images/products/{get_scode(code)}/{key}.{rev}.full.jpg"
BATCH_SIZE = 1025


def download_file(url, filename):
    if os.path.exists(filename):
        return

    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)


def extract_value(nutriments, key):
    """Шукає значення нутрієнта за його name."""
    if not nutriments:
        return None
    for n in nutriments:
        if n.get("name") == key:
            val = n.get("value")
            if val is None:
                val = n.get("serving")
            try:
                return float(val)
            except (TypeError, ValueError):
                return None
    return None

def extract_product_name(data):
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                text = item.get("text")
                if text:
                    return text
    return None

def extract_image_url(images, code):
    valid_images = {}
    for image in images:
        key, rev = image.get("key"), image.get("rev")
        if key and rev:
            valid_images[key] = image_url(code, key, rev)

    valid_images = {k: v for (k, v) in valid_images.items() if "front_" in k} or valid_images
    valid_images = {k: v for (k, v) in valid_images.items() if "_en" in k} or valid_images

    for k, v in valid_images.items():
        return v

    return None

def extract_portion(row):
    val = row.get("serving_quantity")
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        try:
            return float(val)
        except ValueError:
            pass
    size = row.get("serving_size")
    if isinstance(size, str) and size.lower().endswith("g"):
        try:
            return float(size.lower().replace("g", ""))
        except ValueError:
            pass
    return None


def process_parquet(input_path, output_path, batch_size=5000):
    reader = pq.ParquetFile(input_path)

    schema = pa.schema([
        ("name", pa.string()),
        ("default_calories", pa.float32()),
        ("default_proteins", pa.float32()),
        ("default_fats", pa.float32()),
        ("default_carbs", pa.float32()),
        ("default_portion_grams", pa.float32()),
        ("image_url", pa.string()),
    ])

    writer = None
    seen_names = set()
    idx = 1
    batches = reader.num_row_groups

    for batch in reader.iter_batches(batch_size=batch_size):
        if idx % 10 == 0:
            logger.info(f"\t{idx} / {batches} batches preprocessed")
        batch_dict = batch.to_pylist()
        rows = []
        for row in batch_dict:
            name = extract_product_name(row.get("product_name"))
            if not name or name in seen_names:
                continue
            seen_names.add(name)
            nutr = row.get("nutriments", [])
            rows.append({
                "name": name,
                "default_calories": extract_value(nutr, "energy-kcal"),
                "default_proteins": extract_value(nutr, "proteins"),
                "default_fats": extract_value(nutr, "fat"),
                "default_carbs": extract_value(nutr, "carbohydrates"),
                "default_portion_grams": extract_portion(row),
                "image_url": extract_image_url(row.get("images"), row.get("code")),
            })

        table = pa.Table.from_pylist(rows, schema=schema)
        if writer is None:
            writer = pq.ParquetWriter(output_path, schema=schema)
        writer.write_table(table)
        idx += 1

    if writer is not None:
        writer.close()


def init_off_data():
    if os.path.exists(OFF_OUTPUT_FILE):
        return
    download_file(OFF_SOURCE_URL, SOURCE_FILE)
    process_parquet(SOURCE_FILE, OFF_OUTPUT_FILE, batch_size=BATCH_SIZE)
    if os.path.exists(SOURCE_FILE):
        os.remove(SOURCE_FILE)

def delete_off_pq():
    if os.path.exists(OFF_OUTPUT_FILE):
        os.remove(OFF_OUTPUT_FILE)

if __name__ == "__main__":
    init_off_data()
