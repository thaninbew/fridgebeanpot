import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const StorageContext = createContext();

export function useStorage() {
  return useContext(StorageContext);
}

export function StorageProvider({ children }) {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [fridgeResponse, inventoryResponse] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);

      if (fridgeResponse.error) throw fridgeResponse.error;
      if (inventoryResponse.error) throw inventoryResponse.error;

      setFridgeItems(fridgeResponse.data || []);
      setInventoryItems(inventoryResponse.data || []);
      
      // Check if this is a new user (both fridge and inventory are empty)
      if ((!fridgeResponse.data || fridgeResponse.data.length === 0) && 
          (!inventoryResponse.data || inventoryResponse.data.length === 0)) {
        console.log('New user detected, adding welcome item to fridge...');
        const welcomeResponse = await storageAPI.addFridgeItem('buttermilk_pancakes');
        if (welcomeResponse.error) throw welcomeResponse.error;
        
        const updatedFridgeResponse = await storageAPI.getFridgeItems();
        if (updatedFridgeResponse.error) throw updatedFridgeResponse.error;
        setFridgeItems(updatedFridgeResponse.data || []);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch items once when user is available
  useEffect(() => {
    let mounted = true;

    if (user && mounted) {
      fetchItems();
    }

    return () => {
      mounted = false;
    };
  }, [user?.id]); // Only refetch if user ID changes

  const value = {
    fridgeItems,
    inventoryItems,
    loading,
    error,
    refreshItems: fetchItems,
    setFridgeItems,
    setInventoryItems
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
} 