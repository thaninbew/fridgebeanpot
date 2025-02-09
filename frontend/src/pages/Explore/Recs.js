import ExploreNavBar from "./ExploreNavBar";
import RecComponent from "./RecComponent";
import { restaurantCache } from "../../lib/backendApi.ts";
import { useEffect, useState } from "react";

export default function Recs() {
    const [restaurants, setRestaurants] = useState([]);
    
    useEffect(() => {
        // Get all restaurants from cache
        const allRestaurants = restaurantCache.getAllRestaurants();
        setRestaurants(allRestaurants);
    }, []);

    // Split restaurants randomly but evenly between recommended and discover (SCAMMINGS!)
    const splitRestaurants = () => {
        const shuffled = [...restaurants].sort(() => Math.random() - 0.5);
        const halfPoint = Math.ceil(shuffled.length / 2);
        return {
            recommended: shuffled.slice(0, halfPoint),
            discover: shuffled.slice(halfPoint)
        };
    };

    const { recommended, discover } = splitRestaurants();

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
                    <p className="text-gray-500 text-lg pl-4">No small local restaurants nearby at the moment :(</p>
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
                    <p className="text-gray-500 text-lg pl-4">No small local restaurants nearby at the moment</p>
                )}
            </div>
        </div>
    );
}