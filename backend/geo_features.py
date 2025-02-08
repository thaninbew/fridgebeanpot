import googlemaps
import os
from dotenv import load_dotenv
from datetime import datetime
from openai import OpenAI
from pydantic import BaseModel
import json

load_dotenv()

gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_KEY"))

openai_client = OpenAI(
    api_key=os.getenv("PPLX_KEY"), base_url="https://api.perplexity.ai"
)


class IsLocalResponse(BaseModel):
    is_local: bool
    reasoning: str


def is_local(place_name: str, address: str):
    response = openai_client.beta.chat.completions.parse(
        model="sonar-pro",
        messages=[
            {
                "role": "system",
                "content": (
                    "You will determine whether user-provided information about a restaurant indicates that it is a local establishment or not."
                    "You will respond with a JSON object containing two fields:"
                    "- `is_local`: a boolean representing whether the given restaurant is a local restaurant and not a large chain"
                    "- `reasoning`: a string which is a one-sentence explanation of your response to is_local"
                ),
            },
            {
                "role": "user",
                "content": f'Is "{place_name}" at {address} a local restaurant (and not a large chain)?',
            },
        ],
        response_format=IsLocalResponse,
    )
    parsed = IsLocalResponse(**json.loads(response.choices[0].message.content))
    breakpoint()
    return parsed.is_local



def find_locations(location, radius_meters=1000, max_results=20):
    """
    Search for local small restaurants within a given radius of a location.

    Args:
        location (str): Address or location to search around
        radius_meters (int): Search radius in meters (default: 1000)
        max_results (int): Maximum number of results to return (default: 20)

    Returns:
        list: List of restaurant details including name, address, rating, etc.
    """
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
                "formatted_phone_number",
                "website",
                "opening_hours",
                "reviews",
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
        restaurants.append(restaurant)

    return restaurants
