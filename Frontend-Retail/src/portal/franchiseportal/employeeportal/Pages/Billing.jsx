import React, { useState, useEffect, useContext } from 'react';
import { Search, User, Phone, Mail, ShoppingCart, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function EmployeeBilling() {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('employee_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real inventory
  useEffect(() => {
    if (user?.storeId) {
      fetch(`http://localhost:5000/api/inventory/${user.storeId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setInventory(data.data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch inventory", err);
          toast.error("Failed to fetch live inventory.");
        });
    }
  }, [user]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('employee_cart', JSON.stringify(cart));
  }, [cart]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const foundProduct = inventory.find(p => 
      p.sku?.toLowerCase() === searchQuery.toLowerCase() || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundProduct) {
      const existingItem = cart.find(item => item._id === foundProduct._id);
      if (existingItem) {
        setCart(cart.map(item => item._id === foundProduct._id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...foundProduct, quantity: 1 }]);
        toast.success(`${foundProduct.name} added to cart!`);
      }
      setSearchQuery('');
    } else {
      toast.error("Product not found in inventory.");
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        // Prevent exceeding available stock
        const newQuantity = Math.max(1, Math.min(item.availableStock, item.quantity + delta));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax;

  const handleGenerateInvoice = async () => {
    if (!customer.name || !customer.phone) {
      toast.error("Please fill in Customer Name and Phone Number.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/sales/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          customer,
          employeeId: user?.userId,
          storeId: user?.storeId
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        setCart([]);
        setCustomer({ name: '', phone: '', email: '' });
        localStorage.removeItem('employee_cart');
        toast.success("Checkout successful!");
        
        // Refresh inventory
        fetch(`http://localhost:5000/api/inventory/${user.storeId}`)
          .then(res => res.json())
          .then(d => { if(d.success) setInventory(d.data); });

        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast.error(data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error', error);
      toast.error('Network error during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Point of Sale (POS)</h1>
        <p className="text-slate-500">Create a new customer invoice quickly.</p>
      </div>

      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 size={24} />
          <div>
            <h4 className="font-bold">Invoice Generated Successfully!</h4>
            <p className="text-sm">Inventory has been updated and receipt is ready.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Customer & Product Search */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600"/> Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="tel" 
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Search size={20} className="text-indigo-600"/> Add Product to Cart
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Scan or type SKU / Name (e.g., LAP-HP-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button 
                onClick={handleSearch}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Cart Table */}
          {cart.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">Product details</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category} • {item.brand}</p>
                        <p className="text-xs text-indigo-600 mt-1">SKU: {item.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item._id, -1)} className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"><Minus size={14}/></button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 1)} className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-800">
                        ₹{(item.sellingPrice * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600"/> Summary
            </h3>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (18% GST)</span>
                <span className="font-medium text-slate-800">₹{tax.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-100 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-base">Grand Total</span>
                <span className="font-black text-indigo-700 text-xl">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleGenerateInvoice}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isSubmitting ? 'Processing...' : 'Generate Invoice'}
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Clicking generate will instantly update the inventory quantity and prevent duplicate sales.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
