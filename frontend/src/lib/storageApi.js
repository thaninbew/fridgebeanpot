import { supabase } from './supabase';
// import { backendApi, restaurantCache } from './backendApi.ts';
// import { claimsHandler } from './claims.ts';

const handleStorageError = (error) => {
  console.log('Storage API error:', error);
  const messages = {
    'Fridge full': 'Fridge is full (max 12 items)',
    'not found': 'Item not found',
    'default': 'Operation failed. Please try again.'
  };

  if (!error) return null;
  return { error: { message: messages[error.message] || messages.default } };
};

// Unified API calls
export const storageAPI = {
  // Fridge
  getFridgeItems: async () => {
    console.log('Calling getFridgeItems RPC...');
    const { data, error } = await supabase.rpc('get_fridge_items');
    console.log('getFridgeItems response:', { data, error });
    return error ? handleStorageError(error) : { data };
  },

  addFridgeItem: async (itemName) => {
    console.log('Calling addFridgeItem RPC with:', itemName);
    const { data, error } = await supabase.rpc('add_fridge_item', { item_name: itemName });
    console.log('addFridgeItem response:', { data, error });
    return error ? handleStorageError(error) : { data };
  },

  updateFridgeItemPosition: async (itemId, newPosition) => {
    console.log('Calling updateFridgePosition RPC:', { itemId, newPosition });
    const { error } = await supabase.rpc('update_fridge_pos', {
      item_id: itemId,
      new_pos: newPosition
    });
    console.log('updateFridgePosition response:', { error });
    return handleStorageError(error);
  },

  swapFridgePositions: async (item1Id, item2Id) => {
    console.log('Calling swapFridgePositions RPC:', { item1Id, item2Id });
    const { error } = await supabase.rpc('swap_fridge_positions', {
      item1_id: item1Id,
      item2_id: item2Id
    });
    console.log('swapFridgePositions response:', { error });
    return handleStorageError(error);
  },

  removeFridgeItem: async (itemId) => {
    console.log('Calling removeFridgeItem RPC:', itemId);
    const { error } = await supabase.rpc('remove_fridge_item', { item_id: itemId });
    console.log('removeFridgeItem response:', { error });
    return handleStorageError(error);
  },

  // Inventory
  getInventoryItems: async () => {
    console.log('Calling getInventoryItems RPC...');
    const { data, error } = await supabase.rpc('get_inventory_items');
    console.log('getInventoryItems response:', { data, error });
    return error ? handleStorageError(error) : { data };
  },

  addInventoryItem: async (itemName) => {
    console.log('Calling addInventoryItem RPC with:', itemName);
    const { data, error } = await supabase.rpc('add_inventory_item', { item_name: itemName, created_at: new Date().toISOString(),  });
    console.log('addInventoryItem response:', { data, error });
    return error ? handleStorageError(error) : { data };
  },

  removeInventoryItem: async (itemId) => {
    console.log('Calling removeInventoryItem RPC:', itemId);
    const { error } = await supabase.rpc('remove_inventory_item', { item_id: itemId });
    console.log('removeInventoryItem response:', { error });
    return handleStorageError(error);
  },

  // Move items between fridge and inventory
  moveToFridge: async (itemId, position) => {
    console.log('Calling moveToFridge RPC:', { itemId, position });
    const { error } = await supabase.rpc('move_to_fridge', { 
      item_id: itemId,
      target_position: position 
    });
    console.log('moveToFridge response:', { error });
    return handleStorageError(error);
  },

  moveToInventory: async (itemId) => {
    console.log('Calling moveToInventory RPC:', itemId);
    const { error } = await supabase.rpc('move_to_inventory', { item_id: itemId });
    console.log('moveToInventory response:', { error });
    return handleStorageError(error);
  },

  getGroupMembers: async (groupName) => {
    console.log("Calling getGroupMembers RPC:", groupName);
    const { data, error } = await supabase.rpc("get_group_members", { query_group: groupName });
    console.log("getGroupMembers response:", { error });
    return error ? handleStorageError(error) : { data };
  }
};

// window.restaurantCache = restaurantCache;
// window.backendApi = backendApi;
// window.storageAPI = storageAPI;
// window.claimsHandler = claimsHandler;