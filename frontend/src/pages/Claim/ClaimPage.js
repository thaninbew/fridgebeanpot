import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ClaimComponent from "./ClaimComponent";
import { BiSearch } from "react-icons/bi";
import { restaurantCache } from "../../lib/backendApi.ts";

export default function ClaimPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setIsLoading(true);
        const allRestaurants = await restaurantCache.getAllRestaurants();
        setRestaurants(allRestaurants || []);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.llm_info?.matching_item_group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pt-16 pb-24">
        <div className="mb-8 text-center">
          <h1 className="text-[10vw] font-extrabold">Claim</h1>
          <p className="font-medium">
            Visit a local restaurant to claim rewards.
          </p>
        </div>

        <div className="w-[80vw] mb-6 mx-auto relative">
          <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Where do you want to eat today?"
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-center gap-3 pb-20">
          {isLoading ? (
            <div className="text-gray-500 text-lg">Loading restaurants...</div>
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant, index) => (
              <ClaimComponent
                key={index}
                name={restaurant.name}
                photo={restaurant.image || "/freaky-bean.svg"}
                location={restaurant.address || "Address not available"}
              />
            ))
          ) : (
            <div className="text-gray-500 text-lg">No restaurants found</div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
}
