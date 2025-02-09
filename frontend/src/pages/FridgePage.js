import React, { useState, useEffect, useRef } from 'react';
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
import { useStorage } from '../contexts/StorageContext';
import { useLocation } from 'react-router-dom';

export default function FridgePage() {
  const { fridgeItems, inventoryItems, loading, error, setFridgeItems, setInventoryItems } = useStorage();
  const [activeId, setActiveId] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const closeTimerRef = useRef(null);

  // Handle opening inventory if navigated from another page
  useEffect(() => {
    const shouldOpenInventory = location.state?.openInventory;
    if (shouldOpenInventory && !loading) {
      setIsInventoryOpen(true);
    }
  }, [location.state, loading]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    
    if (isInventoryOpen && event.active.data.current?.container === 'inventory') {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      closeTimerRef.current = setTimeout(() => {
        setIsInventoryOpen(false);
      }, 600);
    }
  };

  const handleDragEnd = async (event) => {
    // Clear the close timer if it exists
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

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
          // When moving to fridge, check if target position is occupied
          const occupiedItem = fridgeItems.find(item => item.position === position);
          
          if (occupiedItem) {
            // If position is occupied, swap the items
            // First move the fridge item to inventory
            const moveToInventoryResponse = await storageAPI.moveToInventory(occupiedItem.id);
            if (moveToInventoryResponse?.error) throw moveToInventoryResponse.error;
            
            // Then move the inventory item to the fridge at the specific position
            const moveToFridgeResponse = await storageAPI.moveToFridge(active.id, position);
            if (moveToFridgeResponse?.error) throw moveToFridgeResponse.error;
          } else {
            // Position is empty, move directly there
            const response = await storageAPI.moveToFridge(active.id, position);
            if (response?.error) throw response.error;
          }
        } else {
          // Moving to inventory - keep the same position in inventory
          const activeItem = fridgeItems.find(item => item.id === active.id);
          
          // First update the position of the item being moved to inventory
          const response = await storageAPI.moveToInventory(active.id);
          if (response?.error) throw response.error;

          // Then ensure remaining fridge items keep their positions
          const remainingFridgeItems = fridgeItems.filter(item => item.id !== active.id);
          for (const item of remainingFridgeItems) {
            const updateResponse = await storageAPI.updateFridgeItemPosition(item.id, item.position);
            if (updateResponse?.error) throw updateResponse.error;
          }
        }
      }

      // Update local state based on API response
      const [newFridgeItems, newInventoryItems] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);
      
      setFridgeItems(newFridgeItems.data || []);
      setInventoryItems(newInventoryItems.data || []);

    } catch (err) {
      console.error('Error handling drag and drop:', err);
      console.error('Full error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
    }
  };

  // Add cleanup for drag cancel
  const handleDragCancel = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveId(null);
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
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="container mx-auto px-4 py-8 pt-16 min-h-screen touch-none pb-24">
        <h1 className="text-4xl font-bold mb-8 mt-16 pl-4">My Fridge</h1>
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