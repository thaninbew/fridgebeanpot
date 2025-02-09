import React, { useState, useEffect, useRef } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import FridgeContainer from '../components/FridgeContainer';
import InventoryContainer from '../components/InventoryContainer';
import { storageAPI } from '../lib/storageApi';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { useStorage } from '../contexts/StorageContext';
import { useLocation } from 'react-router-dom';
import { GiKnapsack } from "react-icons/gi";

export default function FridgePage() {
  const { fridgeItems, inventoryItems, loading, error, setFridgeItems, setInventoryItems } = useStorage();
  const [activeId, setActiveId] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const closeTimerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle opening inventory if navigated from another page
  useEffect(() => {
    const shouldOpenInventory = location.state?.openInventory;
    if (shouldOpenInventory && !loading) {
      setIsInventoryOpen(true);
    }
  }, [location.state, loading]);

  // Run cleanup when page loads
  useEffect(() => {
    if (!loading) {
      storageAPI.cleanupStorage().then(() => {
        // Refresh items after cleanup
        Promise.all([
          storageAPI.getFridgeItems(),
          storageAPI.getInventoryItems()
        ]).then(([fridgeResponse, inventoryResponse]) => {
          setFridgeItems(fridgeResponse.data || []);
          setInventoryItems(inventoryResponse.data || []);
        });
      });
    }
  }, [loading]);

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

  // Add inventory drop zone
  const { setNodeRef: setInventoryDropZoneRef } = useDroppable({
    id: 'inventory-drop-zone',
    data: {
      container: 'inventory',
      type: 'slot',
      position: inventoryItems.length
    }
  });

  // Helper function to reorganize inventory items
  const reorganizeInventory = async (optimisticItems = null) => {
    // If we have optimistic items, update UI immediately
    if (optimisticItems) {
      setInventoryItems(optimisticItems);
    }

    try {
      // Sort inventory items by position
      const sortedItems = optimisticItems || [...inventoryItems].sort((a, b) => a.position - b.position);
      
      // Update positions in database
      const updates = sortedItems.map((item, index) => {
        if (item.position !== index) {
          return storageAPI.updateInventoryItemPosition(item.id, index);
        }
        return Promise.resolve();
      });
      
      await Promise.all(updates);
      
      // Only fetch from database if we didn't do optimistic update
      if (!optimisticItems) {
        const newInventoryItems = await storageAPI.getInventoryItems();
        setInventoryItems(newInventoryItems.data || []);
      }
    } catch (err) {
      console.error('Error reorganizing inventory:', err);
      // If error occurs, fetch fresh data to ensure consistency
      const newInventoryItems = await storageAPI.getInventoryItems();
      setInventoryItems(newInventoryItems.data || []);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsDragging(true);
    
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

    setIsDragging(false);
    setActiveId(null);

    const { active, over } = event;
    
    if (!over) {
      return;
    }

    const sourceContainer = active.data.current?.container;
    const destinationContainer = over.data.current?.container;
    
    // Get position from either the slot or the item we're dropping onto
    const position = over.data.current?.type === 'slot' 
      ? over.data.current.position 
      : over.data.current?.item?.position;

    // Only require position for fridge-to-fridge moves
    const isFridgeToFridge = sourceContainer === 'fridge' && destinationContainer === 'fridge';
    if (!sourceContainer || !destinationContainer || (isFridgeToFridge && typeof position !== 'number')) {
      return;
    }

    try {
      if (sourceContainer === destinationContainer) {
        if (sourceContainer === 'fridge') {
          const activeItem = fridgeItems.find(item => item.id === active.id);
          const targetItem = fridgeItems.find(item => item.position === position);

          if (activeItem.id === targetItem?.id) return;

          // Optimistic update for fridge swaps
          const newFridgeItems = [...fridgeItems];
          if (targetItem) {
            // Swap positions in frontend immediately
            const activeIndex = newFridgeItems.findIndex(item => item.id === activeItem.id);
            const targetIndex = newFridgeItems.findIndex(item => item.id === targetItem.id);
            [newFridgeItems[activeIndex].position, newFridgeItems[targetIndex].position] = 
            [newFridgeItems[targetIndex].position, newFridgeItems[activeIndex].position];
            setFridgeItems(newFridgeItems);

            // Update database
            await storageAPI.swapFridgePositions(activeItem.id, targetItem.id);
          } else {
            // Update position in frontend immediately
            const activeIndex = newFridgeItems.findIndex(item => item.id === activeItem.id);
            newFridgeItems[activeIndex].position = position;
            setFridgeItems(newFridgeItems);

            // Update database
            await storageAPI.updateFridgeItemPosition(active.id, position);
          }
        }
      } else {
        if (destinationContainer === 'inventory') {
          // Moving to inventory - Optimistic update
          const activeItem = fridgeItems.find(item => item.id === active.id);
          const newFridgeItems = fridgeItems.filter(item => item.id !== active.id);
          setFridgeItems(newFridgeItems);

          // Calculate next inventory position
          const nextPosition = inventoryItems.length > 0
            ? Math.max(12, Math.max(...inventoryItems.map(item => item.position)) + 1)
            : 12;

          const newInventoryItems = [...inventoryItems, { ...activeItem, position: nextPosition }]
            .sort((a, b) => a.position - b.position);
          
          await reorganizeInventory(newInventoryItems);

          // Update database
          await storageAPI.moveToInventory(active.id);
          
          // Update remaining fridge positions
          const updates = newFridgeItems
            .sort((a, b) => a.position - b.position)
            .map((item, index) => 
              storageAPI.updateFridgeItemPosition(item.id, index)
            );
          await Promise.all(updates);
        } else if (destinationContainer === 'fridge') {
          const occupiedItem = fridgeItems.find(item => item.position === position);
          
          if (occupiedItem) {
            // Optimistic updates for swap between containers
            const newFridgeItems = fridgeItems.filter(item => item.id !== occupiedItem.id);
            const activeItem = inventoryItems.find(item => item.id === active.id);
            activeItem.position = position;
            newFridgeItems.push(activeItem);
            setFridgeItems(newFridgeItems);

            // Optimistic inventory update
            const newInventoryItems = inventoryItems.filter(item => item.id !== active.id);
            occupiedItem.position = activeItem.position;
            newInventoryItems.push(occupiedItem);
            
            // Sort and reposition inventory items
            const sortedInventoryItems = newInventoryItems.sort((a, b) => a.position - b.position)
              .map((item, index) => ({ ...item, position: index }));
            
            // Update UI immediately
            await reorganizeInventory(sortedInventoryItems);

            // Update database
            await storageAPI.moveToInventory(occupiedItem.id);
            await storageAPI.moveToFridge(active.id, position);
          } else {
            // Optimistic updates for moving to empty fridge slot
            const newFridgeItems = [...fridgeItems];
            const activeItem = inventoryItems.find(item => item.id === active.id);
            activeItem.position = position;
            newFridgeItems.push(activeItem);
            setFridgeItems(newFridgeItems);

            const newInventoryItems = inventoryItems.filter(item => item.id !== active.id)
              .sort((a, b) => a.position - b.position)
              .map((item, index) => ({ ...item, position: index }));
            
            await reorganizeInventory(newInventoryItems);

            // Update database
            await storageAPI.moveToFridge(active.id, position);
          }
        }
      }

      // Run cleanup after drag operations
      await storageAPI.cleanupStorage();
      
      // Final fetch to ensure consistency
      const [finalFridgeItems, finalInventoryItems] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);
      
      setFridgeItems(finalFridgeItems.data || []);
      setInventoryItems(finalInventoryItems.data || []);

    } catch (err) {
      console.error('Error handling drag and drop:', err);
      // On error, fetch fresh data to ensure consistency
      const [newFridgeItems, newInventoryItems] = await Promise.all([
        storageAPI.getFridgeItems(),
        storageAPI.getInventoryItems()
      ]);
      
      setFridgeItems(newFridgeItems.data || []);
      setInventoryItems(newInventoryItems.data || []);
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
        <h1 className="font-bold text-4xl m-11 mb-2 text-center">My Fridge</h1>
        <p className="text-gray-600 text-xl mx-11 mb-6 text-center">Collect your tasty treasures and arrange them just right!</p>
        <div>
          <FridgeContainer items={fridgeItems} isDragging={isDragging} />
        </div>

        {/* Inventory Button or Drop Zone */}
        <div className="mt-6">
          {isDragging && activeId && fridgeItems.find(item => item.id === activeId) ? (
            <div 
              ref={setInventoryDropZoneRef}
              className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center border-gray-600"
            >
              <div className="text-center">
                <span className="text-gray-500 font-medium">
                  ↓ Inventory ↓
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end float-end">
              <button
                onClick={() => setIsInventoryOpen(true)}
                className="w-20 h-20 bg-[#84A59D] rounded-[50px] mt-[10%] border-2 border-black flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 "
              >
                <GiKnapsack className="text-4xl"/>
              </button>
            </div>
          )}
        </div>

        <InventoryContainer 
          items={inventoryItems} 
          isOpen={isInventoryOpen} 
          onClose={() => setIsInventoryOpen(false)} 
        />
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="fixed aspect-square flex items-center justify-center w-[120px] h-[120px] touch-none transform -translate-x-1/2 -translate-y-1/2">
            {activeItem.image_url ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <img 
                  src={activeItem.image_url} 
                  alt={activeItem.display_name || activeItem.item_name}
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: 'scale(1.2)' }}
                  draggable="false"
                />
              </div>
            ) : (
              <div className="text-center w-full">
                <span className="text-blue-600 font-medium break-words">
                  {activeItem.display_name || activeItem.item_name}
                </span>
              </div>
            )}
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