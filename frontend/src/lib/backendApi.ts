export interface Restaurant {
  name: string;
  address: string;
  location: {
    lat: number;
    long: number;
  };
  llm_info: {
    is_local: boolean;
    reasoning: string;
    matching_item_group: string;
  };
}

export const restaurantCache = {
  cacheKey: "localRestaurantCache",

  getAllRestaurants: (): Restaurant[] => {
    const data = localStorage.getItem(restaurantCache.cacheKey);
    return data ? JSON.parse(data) : [];
  },

  addRestaurant: (restaurant: Restaurant) => {
    const data = restaurantCache.getAllRestaurants();
    data.push(restaurant);
    restaurantCache.updateCache(data);
  },

  removeRestaurant: (name: string) => {
    restaurantCache.updateCache(
      restaurantCache.getAllRestaurants().filter((r) => r.name !== name)
    );
  },

  clearCache: () => {
    localStorage.setItem(restaurantCache.cacheKey, "[]");
  },

  updateCache: (restaurants: Restaurant[]) => {
    localStorage.setItem(restaurantCache.cacheKey, JSON.stringify(restaurants));
  },
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const backendApi = {
  normalizeLatLong: (lat: number, long: number): string => {
    return `${lat},${long}`;
  },

  getCurrentPosition: async (): Promise<GeolocationPosition> => {
    return await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },

  // getLocalRestaurants: async (
  //   location: string | null
  // ): Promise<Restaurant[]> => {
  //   // Wrap geolocation in a Promise
  //   const position = await backendApi.getCurrentPosition();

  //   const coords = position.coords;
  //   const cachedRestaurants = restaurantCache.getAllRestaurants();

  //   const normalizedLocation = backendApi.normalizeLatLong(
  //     coords.latitude,
  //     coords.longitude
  //   );

  //   return sortedRestaurants;
  // },

  fetchLocalRestaurants: async (
    location: string | null
  ): Promise<Restaurant[]> => {
    console.log(BACKEND_URL);
    let normalizedLocation: string;
    if (!location) {
      const position = await backendApi.getCurrentPosition();
      const coords = position.coords;
      normalizedLocation = backendApi.normalizeLatLong(
        coords.latitude,
        coords.longitude
      );
    }
    else {
      normalizedLocation = location;
    }
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/get-restaurants?${new URLSearchParams({
        location: normalizedLocation,
      })}`,
      {
        method: "get",
      }
    );

    const newRestaurants = await backendResponse.json() as any as Restaurant[];

    restaurantCache.updateCache(newRestaurants);

    return newRestaurants;
  },
};
