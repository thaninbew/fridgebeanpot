import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, pointerWithin } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import FridgeContainer from '../components/FridgeContainer';
import InventoryContainer from '../components/InventoryContainer';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from '../contexts/AuthContext';

export default function FridgePage() {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
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
      
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log('Drag End Event:', {
      activeId: active.id,
      activeData: active.data.current,
      overId: over?.id,
      overData: over?.data.current,
    });
    
    setActiveId(null);

    if (!over) {
      console.log('No valid drop target found');
      return;
    }

    const sourceContainer = active.data.current?.container;
    const destinationContainer = over.data.current?.container;
    const destinationIndex = over.data.current?.index ?? 0;

    console.log('Container Info:', {
      sourceContainer,
      destinationContainer,
      destinationIndex,
    });

    if (!sourceContainer || !destinationContainer) {
      console.log('Missing container information', { sourceContainer, destinationContainer });
      return;
    }

    try {
      if (sourceContainer === destinationContainer) {
        // Moving within the same container
        if (sourceContainer === 'fridge') {
          console.log('Attempting to update fridge position:', {
            itemId: active.id,
            newPosition: destinationIndex
          });
          const response = await storageAPI.updateFridgeItemPosition(active.id, destinationIndex);
          console.log('Update fridge position response:', response);
          if (response?.error) throw response.error;
        }
        // For inventory, we don't need to update positions
      } else {
        // Moving between containers
        console.log('Moving between containers:', {
          from: sourceContainer,
          to: destinationContainer,
          itemId: active.id
        });
        if (destinationContainer === 'fridge') {
          const response = await storageAPI.moveToFridge(active.id);
          if (response?.error) throw response.error;
        } else {
          const response = await storageAPI.moveToInventory(active.id);
          if (response?.error) throw response.error;
        }
      }

      // Refresh items after successful move
      await fetchItems();
    } catch (err) {
      console.error('Error handling drag and drop:', err);
      console.error('Full error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      setError(err.message);
    }
  };

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

  const activeItem = activeId ? 
    [...fridgeItems, ...inventoryItems].find(item => item.id === activeId) 
    : null;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
      modifiers={[restrictToWindowEdges]}
    >
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
      <DragOverlay>
        {activeItem ? (
          <div className="aspect-square rounded-lg border-2 bg-blue-50 border-blue-300 flex items-center justify-center p-2 shadow-lg">
            <div className="text-center">
              <span className="text-blue-600 font-medium break-words">
                {activeItem.item_name}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 