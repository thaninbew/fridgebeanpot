import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from './AuthContext';

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
      // Fetch both fridge and inventory items
      const [fridgeResponse, inventoryResponse] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);

      // Handle fridge items
      if (fridgeResponse.error) throw fridgeResponse.error;
      setFridgeItems(fridgeResponse.data || []);

      // Handle inventory items
      if (inventoryResponse.error) throw inventoryResponse.error;
      setInventoryItems(inventoryResponse.data || []);
      
      // Check if this is a new user (both fridge and inventory are empty)
      if ((!fridgeResponse.data || fridgeResponse.data.length === 0) && 
          (!inventoryResponse.data || inventoryResponse.data.length === 0)) {
        console.log('New user detected, adding welcome item to fridge...');
        const welcomeResponse = await storageAPI.addFridgeItem('Welcome Bean! 🫘');
        if (welcomeResponse.error) throw welcomeResponse.error;
        
        // Refresh items to show the welcome item
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

  // Fetch items when user changes
  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

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