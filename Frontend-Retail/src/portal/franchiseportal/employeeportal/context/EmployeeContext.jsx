import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';

export const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const { user } = useContext(AuthContext);
  
  const [inventory, setInventory] = useState([]);
  const [storeProfileData, setStoreProfileData] = useState(null);
  
  // Initialize cart from sessionStorage for persistence
  const [globalCart, setGlobalCart] = useState(() => {
    const savedCart = sessionStorage.getItem('employee_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('employee_cart', JSON.stringify(globalCart));
  }, [globalCart]);

  const refreshData = async () => {
    if (!user?.storeId) return;
    try {
      const inventoryRes = await axios.get(`http://localhost:5000/api/inventory/${user.storeId}`);
      if (inventoryRes.data.success) {
        setInventory(inventoryRes.data.data);
      }
      
      // Fetch store profile data so the employee has access to store details (for invoices, etc.)
      const profileRes = await axios.get(`http://localhost:5000/api/franchise/${user.storeId}/profile`);
      if (profileRes.data.success) {
        setStoreProfileData(profileRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch employee inventory", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const addToGlobalCart = (item) => {
    setGlobalCart(prev => {
      const itemId = item._id || item.id;
      const existing = prev.find(i => (i._id || i.id) === itemId);
      if (existing) {
        if (existing.quantity >= item.availableStock) return prev;
        return prev.map(i => (i._id || i.id) === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateGlobalCartQuantity = (id, delta) => {
    setGlobalCart(prev => prev.map(item => {
      const itemId = item._id || item.id;
      if (itemId === id) {
        const newQty = item.quantity + delta;
        const inventoryItem = inventory.find(i => (i._id || i.id) === id);
        if (inventoryItem && newQty > inventoryItem.availableStock) return item;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeGlobalCartItem = (id) => {
    setGlobalCart(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const clearGlobalCart = () => {
    setGlobalCart([]);
    sessionStorage.removeItem('employee_cart');
  };

  const processSale = async (cartItems, customerDetails, totalAmount) => {
    if (!user?.storeId || !user?.userId) {
      console.error("Missing user details for sale");
      return null;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/sales/checkout', {
        cart: cartItems,
        customer: customerDetails,
        employeeId: user.userId, 
        storeId: user.storeId
      });

      if (response.data.success) {
        // Refresh inventory after successful sale
        refreshData();
        return response.data.invoice;
      } else {
        console.error("Sale failed:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error processing sale:", error);
      return null;
    }
  };

  return (
    <EmployeeContext.Provider value={{
      inventory,
      storeProfileData,
      globalCart,
      addToGlobalCart,
      updateGlobalCartQuantity,
      removeGlobalCartItem,
      clearGlobalCart,
      processSale,
      refreshData
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export const useEmployee = () => useContext(EmployeeContext);
