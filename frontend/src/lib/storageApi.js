import { supabase } from './supabase';
import { restaurantCache } from './backendApi.ts';

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
    const { data, error } = await supabase
      .from('fridge_items')
      .select(`
        id,
        item_name,
        position,
        user_id,
        item_metadata (
          name,
          display_name,
          group_name,
          image_url
        )
      `)
      .order('position');

    // Transform the data to flatten the item_metadata
    const transformedData = data?.map(item => ({
      ...item,
      display_name: item.item_metadata?.display_name,
      group_name: item.item_metadata?.group_name,
      image_url: item.item_metadata?.image_url
    }));

    return { data: transformedData, error };
  },

  addFridgeItem: async (name, position = 0) => {
    const { data, error } = await supabase
      .from('fridge_items')
      .insert({
        item_name: name,
        position
      });
    return { data, error };
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
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        id,
        item_name,
        position,
        user_id,
        item_metadata (
          name,
          display_name,
          group_name,
          image_url
        )
      `)
      .order('position');

    // Transform the data to flatten the item_metadata
    const transformedData = data?.map(item => ({
      ...item,
      display_name: item.item_metadata?.display_name,
      group_name: item.item_metadata?.group_name,
      image_url: item.item_metadata?.image_url
    }));

    return { data: transformedData, error };
  },

  addInventoryItem: async (itemName) => {
    console.log('Calling addInventoryItem RPC with:', itemName);
    const { data, error } = await supabase.rpc('add_inventory_item', { item_name: itemName });
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
    try {
      // First check if this item already exists in fridge
      const { data: itemToMove } = await supabase
        .from('inventory_items')
        .select('item_name')
        .eq('id', itemId)
        .single();

      if (itemToMove) {
        // Delete any other instances of this item from inventory
        await supabase
          .from('inventory_items')
          .delete()
          .neq('id', itemId)
          .eq('item_name', itemToMove.item_name);
      }

      // Now move the item to fridge
      console.log('Calling moveToFridge RPC:', { itemId, position });
      const { error } = await supabase.rpc('move_to_fridge', { 
        item_id: itemId,
        target_position: position 
      });
      console.log('moveToFridge response:', { error });
      return handleStorageError(error);
    } catch (err) {
      console.error('Error in moveToFridge:', err);
      return handleStorageError(err);
    }
  },

  moveToInventory: async (itemId) => {
    try {
      // Get all inventory items to find the highest position
      const { data: inventoryItems } = await supabase
        .from('inventory_items')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      // Calculate next position (minimum 12, or highest + 1)
      const nextPosition = inventoryItems?.length > 0 
        ? Math.max(12, (inventoryItems[0].position || 11) + 1)
        : 12;

      // First move the item to inventory
      console.log('Calling moveToInventory RPC:', itemId);
      const { error: moveError } = await supabase.rpc('move_to_inventory', { 
        item_id: itemId
      });

      if (!moveError) {
        // Then update its position
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ position: nextPosition })
          .eq('id', itemId);

        if (updateError) {
          console.error('Error updating inventory position:', updateError);
          return handleStorageError(updateError);
        }
      }

      return handleStorageError(moveError);
    } catch (err) {
      console.error('Error in moveToInventory:', err);
      return handleStorageError(err);
    }
  },

  getGroupMembers: async (groupName) => {
    console.log("Calling getGroupMembers RPC:", groupName);
    const { data, error } = await supabase.rpc("get_group_members", { query_group: groupName });
    console.log("getGroupMembers response:", { error });
    return error ? handleStorageError(error) : { data };
  },

  // Add a function to reorganize inventory positions
  reorganizeInventory: async () => {
    try {
      // Get all inventory items
      const { data: items } = await supabase
        .from('inventory_items')
        .select('id, position')
        .order('position');

      if (!items?.length) return;

      // Update positions to be sequential starting from 12
      const updates = items.map((item, index) => ({
        id: item.id,
        position: index + 12
      }));

      // Batch update all positions
      const { error } = await supabase
        .from('inventory_items')
        .upsert(updates);

      return handleStorageError(error);
    } catch (err) {
      console.error('Error reorganizing inventory:', err);
      return handleStorageError(err);
    }
  },

  // Add a cleanup function to fix duplicates and positions
  cleanupStorage: async () => {
    try {
      // Get all items from both containers
      const [{ data: fridgeItems }, { data: inventoryItems }] = await Promise.all([
        supabase.from('fridge_items').select('id, item_name, position'),
        supabase.from('inventory_items').select('id, item_name, position')
      ]);

      if (!fridgeItems || !inventoryItems) return;

      // First, move any fridge items with position > 11 to inventory
      const overflowFridgeItems = fridgeItems.filter(item => item.position > 11);
      if (overflowFridgeItems.length > 0) {
        for (const item of overflowFridgeItems) {
          await supabase.rpc('move_to_inventory', { item_id: item.id });
        }
      }

      // Refetch items after potential moves
      const [{ data: updatedFridgeItems }, { data: updatedInventoryItems }] = await Promise.all([
        supabase.from('fridge_items').select('id, item_name, position'),
        supabase.from('inventory_items').select('id, item_name, position')
      ]);

      if (!updatedFridgeItems || !updatedInventoryItems) return;

      // Find items that exist in both containers (duplicates)
      const duplicates = updatedFridgeItems.filter(fridgeItem => 
        updatedInventoryItems.some(invItem => invItem.item_name === fridgeItem.item_name)
      );

      // Remove duplicates from inventory (keep fridge items)
      if (duplicates.length > 0) {
        const duplicateNames = duplicates.map(item => item.item_name);
        await supabase
          .from('inventory_items')
          .delete()
          .in('item_name', duplicateNames);
      }

      // Fix fridge positions (should be 0-11)
      const fridgeUpdates = updatedFridgeItems
        .sort((a, b) => a.position - b.position)
        .map((item, index) => ({
          id: item.id,
          position: index
        }));

      // Fix inventory positions (should be 12+)
      const remainingInventoryItems = updatedInventoryItems.filter(invItem => 
        !duplicates.some(dupItem => dupItem.item_name === invItem.item_name)
      );

      const inventoryUpdates = remainingInventoryItems
        .sort((a, b) => a.position - b.position)
        .map((item, index) => ({
          id: item.id,
          position: index + 12
        }));

      // Apply updates
      if (fridgeUpdates.length > 0) {
        await supabase.from('fridge_items').upsert(fridgeUpdates);
      }
      if (inventoryUpdates.length > 0) {
        await supabase.from('inventory_items').upsert(inventoryUpdates);
      }

    } catch (err) {
      console.error('Error cleaning up storage:', err);
      return handleStorageError(err);
    }
  }
};

window.restaurantCache = restaurantCache;