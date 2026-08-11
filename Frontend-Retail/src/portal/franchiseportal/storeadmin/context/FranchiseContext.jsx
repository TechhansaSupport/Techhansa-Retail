import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  inventoryData as initialInventory, 
  salesData as initialSales, 
  summaryMetrics as initialMetrics, 
  orderData as initialOrders, 
  storeProfile as initialStoreProfile,
  techhansaCatalog,
  b2bInvoices as initialB2BInvoices,
  walletTransactions as initialWalletTransactions,
  employeesData as initialEmployeesData
} from '../../mockData';

export const FranchiseContext = createContext();

export function FranchiseProvider({ children }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [salesHistory, setSalesHistory] = useState(initialSales);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [storeProfileData, setStoreProfileData] = useState(initialStoreProfile);
  const [globalCart, setGlobalCart] = useState([]);
  
  const [b2bInvoices, setB2bInvoices] = useState(initialB2BInvoices);
  const [walletTransactions, setWalletTransactions] = useState(initialWalletTransactions);
  const [employees, setEmployees] = useState(initialEmployeesData);

  const addToGlobalCart = (item) => {
    setGlobalCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.availableStock) return prev;
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateGlobalCartQuantity = (id, delta) => {
    setGlobalCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        const inventoryItem = inventory.find(i => i.id === id);
        if (inventoryItem && newQty > inventoryItem.availableStock) return item;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeGlobalCartItem = (id) => {
    setGlobalCart(prev => prev.filter(item => item.id !== id));
  };

  const clearGlobalCart = () => {
    setGlobalCart([]);
  };

  const updateStoreProfile = (newProfile) => {
    setStoreProfileData(newProfile);
  };

  const addFundsToWallet = (amount) => {
    const numAmount = Number(amount);
    setMetrics(prev => ({ ...prev, walletBalance: prev.walletBalance + numAmount }));
    
    const newTxn = {
      id: `TXN-${Date.now()}`,
      date: new Date().toLocaleDateString('en-CA'),
      type: 'Credit In',
      amount: numAmount,
      status: 'Success',
      closingBalance: metrics.walletBalance + numAmount
    };
    
    setWalletTransactions(prev => [newTxn, ...prev]);
  };

  const addInventoryItem = (newItem) => {
    setInventory(prev => [{ ...newItem, id: `PROD-${Date.now()}` }, ...prev]);
  };

  const updateInventoryItem = (id, updatedFields) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const requestNewStock = (items, totalAmount) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-CA'),
      items: items.reduce((acc, item) => acc + item.quantity, 0),
      total: totalAmount,
      status: 'Pending',
      expectedDelivery: 'TBD'
    };
    setOrders([newOrder, ...orders]);
  };

  // Automated Inventory Update & Sales Processing
  const processSale = (cartItems, customerDetails, totalAmount) => {
    // 1. Update Inventory (decrement available stock)
    const updatedInventory = inventory.map(item => {
      const cartItem = cartItems.find(c => c.id === item.id);
      if (cartItem) {
        return {
          ...item,
          availableStock: item.availableStock - cartItem.quantity
        };
      }
      return item;
    });

    setInventory(updatedInventory);

    // 2. Update Sales History (Assuming today's date for simplicity)
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const todayIndex = salesHistory.findIndex(s => s.date === todayStr);

    let updatedSalesHistory = [...salesHistory];

    if (todayIndex >= 0) {
      updatedSalesHistory[todayIndex] = {
        ...updatedSalesHistory[todayIndex],
        sales: updatedSalesHistory[todayIndex].sales + totalAmount,
        orders: updatedSalesHistory[todayIndex].orders + 1
      };
    } else {
      updatedSalesHistory.push({
        date: todayStr,
        sales: totalAmount,
        orders: 1
      });
    }

    setSalesHistory(updatedSalesHistory);

    // 3. Update Metrics
    const totalItemsSold = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setMetrics(prev => ({
      ...prev,
      availableStock: prev.availableStock - totalItemsSold,
      todaysSales: prev.todaysSales + totalAmount,
      monthlySales: prev.monthlySales + totalAmount,
      completedOrders: prev.completedOrders + 1
    }));

    // 4. Save Invoice
    const newInvoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleString(),
      customer: customerDetails,
      items: cartItems,
      total: totalAmount
    };

    setInvoices(prev => [newInvoice, ...prev]);

    return newInvoice;
  };

  return (
    <FranchiseContext.Provider value={{
      inventory,
      salesHistory,
      metrics,
      setMetrics,
      orders,
      invoices,
      storeProfileData,
      globalCart,
      techhansaCatalog,
      b2bInvoices,
      setB2bInvoices,
      walletTransactions,
      setWalletTransactions,
      employees,
      setEmployees,
      processSale,
      updateStoreProfile,
      requestNewStock,
      addToGlobalCart,
      updateGlobalCartQuantity,
      removeGlobalCartItem,
      clearGlobalCart,
      addInventoryItem,
      updateInventoryItem,
      addFundsToWallet
    }}>
      {children}
    </FranchiseContext.Provider>
  );
}

export const useFranchise = () => useContext(FranchiseContext);
