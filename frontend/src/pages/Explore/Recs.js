import React, { useEffect, useState } from 'react';
import ExploreNavBar from "./ExploreNavBar";
import RecComponent from "./RecComponent";
import { restaurantCache, backendApi } from "../../lib/backendApi.ts";

export default function Recs() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchRestaurants() {
            try {
                setIsLoading(true);
                // Try to get current position first
                const position = await backendApi.getCurrentPosition();
                const location = backendApi.normalizeLatLong(
                    position.coords.latitude,
                    position.coords.longitude
                );
                const allRestaurants = await backendApi.fetchLocalRestaurants(location);
                setRestaurants(allRestaurants || []);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                // Fallback to cached data if available
                const cachedData = await restaurantCache.getAllRestaurants();
                setRestaurants(cachedData || []);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRestaurants();
    }, []);

    // Split restaurants randomly but evenly between recommended and discover
    const splitRestaurants = () => {
        if (!restaurants || restaurants.length === 0) {
            return { recommended: [], discover: [] };
        }
        const shuffled = [...restaurants].sort(() => Math.random() - 0.5);
        const halfPoint = Math.ceil(shuffled.length / 2);
        return {
            recommended: shuffled.slice(0, halfPoint),
            discover: shuffled.slice(halfPoint)
        };
    };

    const { recommended, discover } = splitRestaurants();

    if (isLoading) {
        return (
            <div>
                <ExploreNavBar />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Loading restaurants...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ExploreNavBar />
      
            <p className="font-bold text-2xl m-11 mb-4"> Recommended </p>
            <div className="w-auto overflow-x-scroll ml-[10px] p-[15px] pt-0 whitespace-nowrap flex flex-row">
                {recommended.length > 0 ? (
                    recommended.map((restaurant, index) => (
                        <RecComponent 
                            key={index}
                            rating="4.9"
                            restaurant={restaurant.name}
                            cuisine={restaurant.llm_info.matching_item_group}
                            image="/"
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-lg pl-4">No restaurants nearby at the moment</p>
                )}
            </div>

            <p className="font-bold text-2xl m-11 mt-6 mb-4"> Discover </p>
            <div className="w-auto overflow-x-scroll ml-[10px] p-[15px] pt-0 whitespace-nowrap flex flex-row">
                {discover.length > 0 ? (
                    discover.map((restaurant, index) => (
                        <RecComponent 
                            key={index}
                            rating="4.5"
                            restaurant={restaurant.name}
                            cuisine={restaurant.llm_info.matching_item_group}
                            image="/"
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-lg pl-4">No restaurants nearby at the moment</p>
                )}
            </div>
        </div>
    );
}