import json
from pydantic import BaseModel
from supabase import create_client, Client
from enum import Enum
import os
from dotenv import load_dotenv
import random

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

supabase: Client = create_client(supabase_url, supabase_key)

group_names = {
    row["group_name"]
    for row in supabase.table("item_metadata").select("group_name").execute().data
}


# REALLY didnt wanna hardcode this, let's fix it if there's time
class FoodGroupID(str, Enum):
    BREAKFAST = "breakfast"
    PASTA = "pasta"
    HISPANIC = "hispanic"
    PIZZA = "pizza"
    BURGER = "burger"
    FRIED_FOOD = "fried_food"
    DESSERT = "dessert"


# FoodGroupID = Literal[tuple('FoodGroupID', {k.upper(): k.lower() for k in group_names})]


class FoodItem(BaseModel):
    name: str
    display_name: str
    group_name: str
    image_url: str | None # temp
    spawn_chance: float


def spawn_item(group_name: FoodGroupID) -> FoodItem:
    items = (
        supabase.table("item_metadata")
        .select("*")
        .eq("group_name", group_name)
        .execute()
        .data
    )
    breakpoint()
    total_weight = sum(i["spawn_weight"] for i in items)
    random_value = random.uniform(0, total_weight)

    current_weight = 0
    for item in items:
        current_weight += item["spawn_weight"]
        if random_value <= current_weight:
            return FoodItem(
                name=item["name"],
                display_name=item["display_name"],
                group_name=item["group_name"],
                image_url=item["image_url"],
                spawn_chance=item["spawn_weight"] / total_weight,
            )
