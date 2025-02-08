import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import FridgeContainer from '../components/FridgeContainer';
import InventoryContainer from '../components/InventoryContainer';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function FridgePage() {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { user } = useAuth();

  // Configure sensors for both mouse and touch with better mobile settings
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px of movement required before drag starts
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100, // Small delay for touch to differentiate from scroll
      tolerance: 5, // Allow small amount of movement before activation
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

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
    
    // Get position from either the slot or the item we're dropping onto
    const position = over.data.current?.type === 'slot' 
      ? over.data.current.position 
      : over.data.current?.item?.position;

    console.log('Container Info:', {
      sourceContainer,
      destinationContainer,
      position,
      overData: over.data.current
    });

    // Only require position for fridge-to-fridge moves
    const isFridgeToFridge = sourceContainer === 'fridge' && destinationContainer === 'fridge';
    if (!sourceContainer || !destinationContainer || (isFridgeToFridge && typeof position !== 'number')) {
      console.log('Missing required drop information', { 
        sourceContainer, 
        destinationContainer, 
        position,
        isFridgeToFridge,
        overData: over.data.current 
      });
      return;
    }

    try {
      if (sourceContainer === destinationContainer) {
        // Moving within the same container
        if (sourceContainer === 'fridge') {
          const activeItem = fridgeItems.find(item => item.id === active.id);
          const targetItem = fridgeItems.find(item => item.position === position);

          // Don't swap if trying to drop onto itself
          if (activeItem.id === targetItem?.id) {
            console.log('Dropping item onto itself, ignoring');
            return;
          }

          console.log('Attempting to swap items:', {
            activeItem: {
              id: activeItem?.id,
              name: activeItem?.item_name,
              position: activeItem?.position
            },
            targetItem: {
              id: targetItem?.id,
              name: targetItem?.item_name,
              position: targetItem?.position
            }
          });

          if (targetItem) {
            // If there's a target item, swap positions
            const response = await storageAPI.swapFridgePositions(activeItem.id, targetItem.id);
            if (response?.error) throw response.error;
          } else {
            // If moving to an empty slot, just update position
            const response = await storageAPI.updateFridgeItemPosition(active.id, position);
            if (response?.error) throw response.error;
          }
        }
        // For inventory, we don't need to update positions
      } else {
        // Moving between containers
        console.log('Moving between containers:', {
          from: sourceContainer,
          to: destinationContainer,
          itemId: active.id,
          position: position
        });
        if (destinationContainer === 'fridge') {
          // When moving to fridge, we need the target position
          if (typeof position !== 'number') {
            console.log('Missing position for fridge move');
            return;
          }
          const response = await storageAPI.moveToFridge(active.id, position);
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
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="container mx-auto px-4 py-8 min-h-screen touch-none pb-24">
        <h1 className="text-3xl font-bold mb-8">My Fridge</h1>
        <div>
          <FridgeContainer items={fridgeItems} />
        </div>
        <InventoryContainer 
          items={inventoryItems} 
          isOpen={isInventoryOpen} 
          onClose={() => setIsInventoryOpen(false)} 
        />
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="fixed aspect-square rounded-lg border-2 bg-blue-50 border-blue-300 flex items-center justify-center p-2 shadow-lg w-[80px] h-[80px] touch-none">
            <div className="text-center">
              <span className="text-blue-600 font-medium break-words">
                {activeItem.item_name}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
      <Navbar 
        onInventoryClick={() => setIsInventoryOpen(!isInventoryOpen)} 
        isInventoryOpen={isInventoryOpen}
      />
    </DndContext>
  );
} 