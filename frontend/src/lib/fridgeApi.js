import { supabase } from './supabase';

// check and add WELCOME ITEM to the fridge!!!!!!!!!! on first login
export const checkAndAddFirstLoginItem = async () => {
  try {
    // check if user has any items
    const { data: existingItems, error: checkError } = await supabase
      .from('fridge_items')
      .select('id')
      .limit(1);
    
    if (checkError) throw checkError;

    // if no items exist, add the first login item
    if (!existingItems || existingItems.length === 0) {
      const { data, error } = await supabase
        .from('fridge_items')
        .insert([
          {
            item_name: 'welcomeItem',
            position: 0,
            user_id: (await supabase.auth.getUser()).data.user.id
          }
        ])
        .select();

      if (error) throw error;
      return { data, error: null };
    }

    return { data: null, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getFridgeItems = async () => {
  try {
    const { data, error } = await supabase
      .from('fridge_items')
      .select('*')
      .order('position');
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// add item to fridge (max 12 items), some logic in postgreSQL function.
export const addFridgeItem = async (item) => {
  try {
    const { data: existingItems, error: countError } = await supabase
      .from('fridge_items')
      .select('id')
      .order('position');
    
    if (countError) throw countError;
    
    if (existingItems.length >= 12) {
      throw new Error('Fridge is full! Maximum 12 items allowed.');
    }

    const { data, error } = await supabase
      .from('fridge_items')
      .insert([
        { 
          item_name: item,
          position: existingItems.length,
          user_id: (await supabase.auth.getUser()).data.user.id
        }
      ])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const removeFridgeItem = async (itemId) => {
  try {
    const { error } = await supabase
      .from('fridge_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    
    // reorder remaining items to ensure no gaps in position (maybe change later since could be intentional for personalized ordering)
    await reorderFridgeItems();
    
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// update item position
export const updateItemPosition = async (itemId, newPosition) => {
  try {
    const { data: currentItems, error: fetchError } = await supabase
      .from('fridge_items')
      .select('*')
      .order('position');
    
    if (fetchError) throw fetchError;
    if (newPosition < 0 || newPosition >= currentItems.length) {
      throw new Error('Invalid position');
    }

    // get current position of the item
    const currentItem = currentItems.find(item => item.id === itemId);
    if (!currentItem) throw new Error('Item not found');
    
    const oldPosition = currentItem.position;

    // Update positions of all affected items
    if (oldPosition < newPosition) {
      // Moving item forward - shift items in between backwards (maybe change later since could be intentional for personalized ordering)
      for (let i = oldPosition + 1; i <= newPosition; i++) {
        await supabase
          .from('fridge_items')
          .update({ position: i - 1 })
          .eq('position', i);
      }
    } else if (oldPosition > newPosition) {
      // Moving item backward - shift items in between forward (maybe change later since could be intentional for personalized ordering)
      for (let i = newPosition; i < oldPosition; i++) {
        await supabase
          .from('fridge_items')
          .update({ position: i + 1 })
          .eq('position', i);
      }
    }

    // Update position of the target item
    const { error } = await supabase
      .from('fridge_items')
      .update({ position: newPosition })
      .eq('id', itemId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Helper function to reorder items after deletion (maybe change later since could be intentional for personalized ordering)
async function reorderFridgeItems() {
  const { data: items, error } = await supabase
    .from('fridge_items')
    .select('*')
    .order('position');
  
  if (error) throw error;

  // Update positions to ensure they are sequential (maybe change later since could be intentional for personalized ordering)
  for (let i = 0; i < items.length; i++) {
    if (items[i].position !== i) {
      await supabase
        .from('fridge_items')
        .update({ position: i })
        .eq('id', items[i].id);
    }
  }
} 