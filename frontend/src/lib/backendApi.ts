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

const BACKEND_URL = process.env.BACKEND_URL;

// export const backendApi = {

//   normalizeLatLong: (lat: number, long: number): string => {
//     return `${lat},${long}`;
//   },

//   getLocalRestaurants: async (location: string|null): Promise<Restaurant[]> => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {

//       }
//     );
//     const cached = restaurantCache.getAllRestaurants();
//     return [];
//   },
    
//   fetchLocalRestaurants: async (location: string|null): Promise<Restaurant[]> => {
//     return [];
//   },
// };