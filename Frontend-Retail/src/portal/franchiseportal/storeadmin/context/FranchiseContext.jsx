import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const FranchiseContext = createContext();

export function FranchiseProvider({ children }) {
  const STORE_ID = 'STORE-001';

  const [inventory, setInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [metrics, setMetrics] = useState({ todaysSales: 0, monthlySales: 0, walletBalance: 0, completedOrders: 0, pendingOrders: 0 });
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeProfileData, setStoreProfileData] = useState(null);
  const [globalCart, setGlobalCart] = useState([]);
  
  const [techhansaCatalog, setTechhansaCatalog] = useState([]);
  const [b2bInvoices, setB2bInvoices] = useState([]);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [employees, setEmployees] = useState([]);

  const refreshData = async () => {
    try {
      const [profileRes, inventoryRes, walletRes, invoicesRes, employeesRes, catalogRes, requestsRes, salesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/franchise/${STORE_ID}/profile`),
        axios.get(`http://localhost:5000/api/inventory/${STORE_ID}`),
        axios.get(`http://localhost:5000/api/franchise/${STORE_ID}/wallet`),
        axios.get(`http://localhost:5000/api/franchise/${STORE_ID}/b2b-invoices`),
        axios.get(`http://localhost:5000/api/franchise/${STORE_ID}/employees`),
        axios.get(`http://localhost:5000/api/franchise/catalog/all`),
        axios.get(`http://localhost:5000/api/franchise/${STORE_ID}/requests`),
        axios.get(`http://localhost:5000/api/sales/store/${STORE_ID}`) // Fetch Store Sales
      ]);

      if (profileRes.data.success) {
         setStoreProfileData(profileRes.data.data);
         setMetrics({
           todaysSales: profileRes.data.data.todaysSales || 0,
           monthlySales: profileRes.data.data.monthlySales || 0,
           walletBalance: profileRes.data.data.walletBalance || 0,
           completedOrders: profileRes.data.data.completedOrders || 0,
           pendingOrders: profileRes.data.data.pendingOrders || 0,
         });
      }
      if (inventoryRes.data.success) setInventory(inventoryRes.data.data);
      if (walletRes.data.success) setWalletTransactions(walletRes.data.data);
      if (invoicesRes.data.success) setB2bInvoices(invoicesRes.data.data);
      if (employeesRes.data.success) setEmployees(employeesRes.data.data);
      if (catalogRes.data.success) setTechhansaCatalog(catalogRes.data.data);
      if (requestsRes.data.success) setOrders(requestsRes.data.data);
      if (salesRes.data.success) setInvoices(salesRes.data.data); // Set Sales Invoices

    } catch (error) {
      console.error("Failed to fetch franchise data", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
  };

  const updateStoreProfile = (newProfile) => {
    setStoreProfileData(newProfile);
  };

  const addFundsToWallet = async (amount) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/franchise/${STORE_ID}/wallet/add`, { amount });
      if (res.data.success) {
        setMetrics(prev => ({ ...prev, walletBalance: res.data.newBalance }));
        setWalletTransactions(prev => [res.data.data, ...prev]);
        return true;
      }
    } catch (error) {
      console.error("Failed to add funds", error);
      return false;
    }
  };

  const approveB2BInvoice = async (invoiceId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/franchise/${STORE_ID}/b2b-invoices/${invoiceId}/approve`);
      if (res.data.success) {
        await refreshData();
        return true;
      }
    } catch (error) {
      console.error("Failed to approve invoice", error);
      throw error;
    }
  };

  const requestNewStock = (items, totalAmount) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('en-CA'),
      items: items,
      total: totalAmount,
      status: 'Pending',
      expectedDelivery: 'TBD'
    };
    setOrders([newOrder, ...orders]);
  };

  const submitOrderRequest = async (orderItems) => {
    try {
      const payload = {
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: orderItems,
        total: 0 // Calculate if needed, but backend can handle or leave 0 for requests
      };
      const res = await axios.post(`http://localhost:5000/api/franchise/${STORE_ID}/requests`, payload);
      if (res.data.success) {
        setOrders(prev => [res.data.data, ...prev]);
        return true;
      }
    } catch (error) {
      console.error("Failed to submit order request", error);
      return false;
    }
  };

  const processSale = async (cartItems, customerDetails, totalAmount) => {
    try {
      const response = await axios.post('http://localhost:5000/api/sales/checkout', {
        cart: cartItems,
        customer: customerDetails,
        employeeId: STORE_ID,
        storeId: STORE_ID
      });

      if (response.data.success) {
        // Refresh inventory after successful sale
        await refreshData();
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
  const addInventoryItem = async (newItem) => {
    try {
      const payload = { ...newItem, storeId: STORE_ID };
      const res = await axios.post(`http://localhost:5000/api/inventory/${STORE_ID}`, payload);
      if (res.data.success) {
        setInventory(prev => [res.data.data, ...prev]);
        return true;
      }
    } catch (error) {
      console.error("Failed to add inventory item", error);
      return false;
    }
  };

  const updateInventoryItem = async (id, updatedFields) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/inventory/${STORE_ID}/${id}`, updatedFields);
      if (res.data.success) {
        // Use the server response to update state so we have the true data
        setInventory(prev => prev.map(item => (item._id === id || item.id === id) ? res.data.data : item));
        return true;
      }
    } catch (error) {
      console.error("Failed to update inventory item", error);
      return false;
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/franchise/${STORE_ID}/employees`, employeeData);
      if (res.data.success) {
        setEmployees(prev => [res.data.data, ...prev]);
        return { success: true };
      }
      return { success: false, message: 'Failed to add employee' };
    } catch (error) {
      console.error("Failed to add employee", error);
      return { success: false, message: error.response?.data?.message || 'Server error' };
    }
  };

  const toggleEmployeeStatus = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/franchise/${STORE_ID}/employees/${id}/status`);
      if (res.data.success) {
        setEmployees(prev => prev.map(emp => (emp._id === id || emp.id === id) ? { ...emp, status: res.data.data.status } : emp));
        return true;
      }
    } catch (error) {
      console.error("Failed to toggle employee status", error);
      return false;
    }
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
      addFundsToWallet,
      submitOrderRequest,
      refreshData,
      approveB2BInvoice,
      addInventoryItem,
      updateInventoryItem,
      addEmployee,
      toggleEmployeeStatus
    }}>
      {children}
    </FranchiseContext.Provider>
  );
}

export const useFranchise = () => useContext(FranchiseContext);
