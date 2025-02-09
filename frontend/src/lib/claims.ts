import { Restaurant } from "./backendApi";
import { storageAPI } from "./storageApi";

export interface FoodItem {
    name: string;
    display_name: string;
    group_name: string;
    image_url: string|null;
    spawn_chance: number;
}

interface FoodItemResponse extends FoodItem {
    spawn_weight: number;
}

export const claimsHandler = {
    getFoodItem: async (foodGroup: string): Promise<FoodItem> => {
        const groupMembers = (await storageAPI.getGroupMembers(foodGroup) as { data }).data as any as FoodItemResponse[];
        console.log(groupMembers);
        const totalRarity = groupMembers.reduce((sum, row) => sum + row.spawn_weight, 0);
        const randomValue = Math.random() * totalRarity;

        let cumulativeRarity = 0;
        for (const row of groupMembers) {
            cumulativeRarity += row.spawn_weight;
            if (randomValue <= cumulativeRarity) {
                row.spawn_chance = row.spawn_weight / totalRarity;
                return row;
            }
        }

        throw new Error("Couldn't generate food item");
    },

    claimRestaurant: async (restaurant: Restaurant): Promise<FoodItem> => {
        const foodItem = await claimsHandler.getFoodItem(restaurant.llm_info.matching_item_group);
        storageAPI.addInventoryItem(foodItem.name);

        return foodItem;
    }
}