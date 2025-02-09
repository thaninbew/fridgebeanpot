import googlemaps
import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field
from enum import Enum
import instructor
from typing import List

load_dotenv()

gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_KEY"))

pplx_client = OpenAI(
    api_key=os.getenv("PPLX_KEY"), base_url="https://api.perplexity.ai"
)

openai_client = instructor.from_openai(OpenAI(api_key=os.getenv("OPENAI_KEY")))


class FoodItemID(str, Enum):
    PANCAKES = "pancakes"
    SUSHI = "sushi"
    RAMEN = "ramen"
    FRIED_CHICKEN = "fried_chicken"
    PIZZA = "pizza"
    BURGER = "burger"
    SANDWICH = "sandwich"
    TACO = "taco"
    MYSTERY = "mystery_box"


class LLMLocationInfo(BaseModel):
    name: str = Field(description="the name of the restaurant")
    address: str = Field(description="the address of the restaurant")
    is_local: bool = Field(
        description="whether the given restaurant is a local restaurant and not a large chain"
    )
    reasoning: str = Field(
        description="one-sentence explanation of your response to is_local"
    )
    matching_item: FoodItemID = Field(
        description="the available food item which most closely aligns with the restaurant"
    )


class LLMLocationInfoArray(BaseModel):
    content: List[LLMLocationInfo]


def format_places(places: List[dict]) -> str:
    return "\n".join([f" - \"{r['name']}\" at {r['address']}" for r in places])


# get structured info about list of places
def get_llm_location_info(
    places: List[dict], overview: str = None
) -> List[LLMLocationInfo]:
    if not overview:
        overview = get_llm_location_overview(places)
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are integrated in a restaurant discovery app. "
                    "You will receive lists of restaurants along with an AI-generated overview of the list. "
                    "You must produce a response according to the provided JSON schema based on this information. "
                    "For the `matching_item` field, choose one of the existing food item IDs which best relates to "
                    "each given restaurant, even if it is not a perfect match."
                ),
            },
            {
                "role": "user",
                "content": f"User-provided restaurants:\n{format_places(places)}\n\nAI-generated overview:\n\n{overview}",
            },
        ],
        response_model=LLMLocationInfoArray,
    )
    return response.content


# get a free-form response about the restaurants from perplexity
def get_llm_location_overview(places: List[dict]) -> str:
    response = pplx_client.chat.completions.create(
        model="sonar",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are integrated in a restaurant discovery app. "
                    "You will receive lists of restaurants, and must determine the following about each:\n"
                    "- Whether the restaurant is a local restaurant and not a large chain along with a short, one-sentence explanation\n"
                    "- A list of 1-3 food items which may be available at the restaurant\n"
                ),
            },
            {
                "role": "user",
                "content": "Restaurant names and locations:\n" + format_places(places),
            },
        ],
    )

    return response.choices[0].message.content


def find_locations(
    location, radius_meters=500, max_results=10, filter_local: bool = True
):
    # First geocode the location to get coordinates
    geocode_result = gmaps.geocode(location)

    if not geocode_result:
        raise Exception("Location not found")

    # Get the latitude and longitude
    lat = geocode_result[0]["geometry"]["location"]["lat"]
    lng = geocode_result[0]["geometry"]["location"]["lng"]

    # Search for restaurants using Places API
    places_result = gmaps.places_nearby(
        location=(lat, lng),
        radius=radius_meters,
        type="restaurant",
        keyword="local"
        # rank_by='rating'  # This will prioritize better-rated places
    )

    restaurants = []
    # Process results
    for place in places_result.get("results", [])[:max_results]:
        # Get additional details for each place
        place_details = gmaps.place(
            place["place_id"],
            fields=[
                "name",
                "formatted_address",
                "rating",
                "price_level",
                "user_ratings_total",
                "opening_hours",
                "website",
            ],
        )["result"]

        restaurant = {
            "name": place_details.get("name"),
            "address": place_details.get("formatted_address"),
            "rating": place_details.get("rating"),
            "total_ratings": place_details.get("user_ratings_total"),
            "price_level": place_details.get("price_level"),
            "phone": place_details.get("formatted_phone_number"),
            "website": place_details.get("website"),
            "is_open_now": place_details.get("opening_hours", {}).get("open_now"),
            "location": {
                "lat": place["geometry"]["location"]["lat"],
                "lng": place["geometry"]["location"]["lng"],
            },
        }
        # restaurant.llm_info = get_llm_location_info(restaurant['name'], restaurant['address'])
        restaurants.append(restaurant)

    llm_info = {v.name: v for v in get_llm_location_info(restaurants)}

    ret = [
        r | {"llm_info": llm_info[r["name"]]}
        for r in restaurants
        if (llm_info[r["name"]].is_local or not filter_local)
    ]

    return ret


def generate_map_embed(locations: List[dict], center_location: dict = None, zoom: int = 14) -> str:
    if not locations:
        return None
        
    # Calculate center if not provided
    if not center_location:
        avg_lat = sum(loc['location']['lat'] for loc in locations) / len(locations)
        avg_lng = sum(loc['location']['lng'] for loc in locations) / len(locations)
        center_location = {'lat': avg_lat, 'lng': avg_lng}
    
    base_url = "https://maps.googleapis.com/maps/api/staticmap"
    
    # Create markers
    markers = []
    for i, loc in enumerate(locations):
        lat = loc['location']['lat']
        lng = loc['location']['lng']
        label = chr(65 + i)  # A, B, C, etc.
        markers.append(f"color:red|label:{label}|{lat},{lng}")
    
    # Build parameters
    params = {
        'center': f"{center_location['lat']},{center_location['lng']}",
        'zoom': str(zoom),
        'size': '600x400',
        'maptype': 'roadmap',
        'markers': markers,
        'key': os.getenv('MAPS_EMBED_KEY')  # Different API key may be needed
    }
    
    # Build URL
    embed_url = base_url + '?' + '&'.join(
        [f"{k}={','.join(v) if isinstance(v, list) else v}" for k, v in params.items()]
    )
    
    return embed_url


if __name__ == "__main__":
    example_places = [
        {
            "name": "University House of Pizza",
            "address": "452 Huntington Ave, Boston, MA 02115, USA",
            "rating": 3.9,
            "total_ratings": 536,
            "price_level": 1,
            "phone": None,
            "website": "https://www.myuhop.com/",
            "is_open_now": True,
            "location": {"lat": 42.3386018, "lng": -71.0929388},
        },
        {
            "name": "Panera Bread",
            "address": "289 Huntington Ave, Boston, MA 02115, USA",
            "rating": 3.9,
            "total_ratings": 737,
            "price_level": 2,
            "phone": None,
            "website": "https://www.panerabread.com/en-us/cafe/locations/ma/boston/289-huntington-avenue?utm_medium=local&utm_source=google&utm_campaign=dpm-dist&utm_term=202107&utm_content=main",
            "is_open_now": True,
            "location": {"lat": 42.341821, "lng": -71.086679},
        },
        {
            "name": "Cappy's Pizza & Subs",
            "address": "82 Westland Ave, Boston, MA 02115, USA",
            "rating": 3.8,
            "total_ratings": 506,
            "price_level": 1,
            "phone": None,
            "website": "https://www.cappyspizza.com/",
            "is_open_now": True,
            "location": {"lat": 42.34374589999999, "lng": -71.0896072},
        },
    ]

    example_overview = "Here's the information about each restaurant:\n\n1. **University House of Pizza**\n   - **Local or Chain**: Local restaurant, as it is not a widely recognized chain and is specific to the Boston area.\n   - **Food Items**:\n     - Cheese Pizza\n     - Buffalo Chicken Pizza\n     - The American Burger\n\n2. **Panera Bread**\n   - **Local or Chain**: Large chain, as Panera Bread is a well-known national brand with numerous locations across the U.S.\n   - **Food Items**:\n     - Broccoli Cheddar Soup\n     - Turkey Club Sandwich\n     - Cinnamon Crunch Bagel\n\n3. **Cappy's Pizza & Subs**\n   - **Local or Chain**: Local restaurant, as it appears to be a smaller, independent establishment specific to the Boston area.\n   - **Food Items**:\n     - Pizza Subs\n     - Meatball Subs\n     - Chicken Parmesan Subs\n\nNote: Specific menu items for \"Cappy's Pizza & Subs\" are not provided in the search results, so the items listed are typical for a pizza and subs establishment."
