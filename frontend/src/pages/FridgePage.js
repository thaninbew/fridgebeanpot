import React, { useState, useEffect } from 'react';
import FridgeContainer from '../components/FridgeContainer';
import InventoryContainer from '../components/InventoryContainer';
import { getFridgeItems, checkAndAddFirstLoginItem } from '../lib/fridgeApi';
import { useAuth } from '../contexts/AuthContext';

export default function FridgePage() {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Check and add welcome item for first-time users
        await checkAndAddFirstLoginItem();
        
        // Fetch fridge items
        const { data: fridgeData, error: fridgeError } = await getFridgeItems();
        if (fridgeError) throw fridgeError;
        setFridgeItems(fridgeData || []);

        // For now, inventory items are empty until we implement the inventory API
        setInventoryItems([]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchItems();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Fridge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Fridge Storage</h2>
          <FridgeContainer items={fridgeItems} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <InventoryContainer items={inventoryItems} />
        </div>
      </div>
    </div>
  );
} 