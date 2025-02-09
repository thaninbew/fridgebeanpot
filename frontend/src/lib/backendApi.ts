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

  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const data = localStorage.getItem(restaurantCache.cacheKey);
    const cachedData = data ? JSON.parse(data) as Restaurant[] : [];
    if (cachedData.length === 0) {
      return await backendApi.fetchLocalRestaurants();
    }
    return cachedData;
  },

  addRestaurant: async (restaurant: Restaurant) => {
    const data = await restaurantCache.getAllRestaurants();
    data.push(restaurant);
    restaurantCache.updateCache(data);
  },

  removeRestaurant: async (name: string) => {
    restaurantCache.updateCache(
      (await restaurantCache.getAllRestaurants()).filter((r) => r.name !== name)
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
    location?: string
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
