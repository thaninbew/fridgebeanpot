import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from '../contexts/AuthContext';
import Fridge from '../components/Fridge';
import Inventory from '../components/Inventory';

export default function FridgePage() {
  const { user } = useAuth();
  const [fridgeItems, setFridgeItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    console.log('Fetching items for user:', user?.id);
    try {
      const [fridgeResponse, inventoryResponse] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);

      console.log('Raw fridge response:', fridgeResponse);
      console.log('Raw inventory response:', inventoryResponse);
      console.log('Actual fridge items:', fridgeResponse.data);
      console.log('Actual inventory items:', inventoryResponse.data);

      if (fridgeResponse.error) throw fridgeResponse.error;
      if (inventoryResponse.error) throw inventoryResponse.error;

      setFridgeItems(fridgeResponse.data || []);
      setInventoryItems(inventoryResponse.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching items...');
      fetchItems();
    } else {
      console.log('No user found, skipping fetch');
      setLoading(false);
    }
  }, [user]);

  const handleDragEnd = async (result) => {
    console.log('Drag ended:', result);
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) {
      console.log('Dropped outside valid droppable area');
      return;
    }

    try {
      // Moving from inventory to fridge
      if (source.droppableId === 'inventory' && destination.droppableId.startsWith('fridge-slot-')) {
        const slotIndex = parseInt(destination.droppableId.split('-')[2]);
        console.log('Moving from inventory to fridge slot:', slotIndex);
        await storageAPI.moveToFridge(draggableId, slotIndex);
        await fetchItems();
      }
      // Moving from fridge to inventory
      else if (source.droppableId.startsWith('fridge-slot-') && destination.droppableId === 'inventory') {
        console.log('Moving from fridge to inventory:', draggableId);
        await storageAPI.moveToInventory(draggableId);
        await fetchItems();
      }
    } catch (error) {
      console.error('Error handling drag end:', error);
    }
  };

  const handleRemoveFromFridge = async (itemId) => {
    try {
      console.log('Removing item from fridge:', itemId);
      await storageAPI.moveToInventory(itemId);
      await fetchItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please log in to view your storage
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Storage</h1>
          <div className="text-sm text-gray-500">
            User ID: {user.id}
          </div>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex justify-between">
            <Fridge 
              items={fridgeItems} 
              onRemoveItem={handleRemoveFromFridge}
            />
            <Inventory items={inventoryItems} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
