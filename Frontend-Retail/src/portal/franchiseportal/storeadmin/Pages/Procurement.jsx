import React, { useState } from 'react';
import { useFranchise } from '../context/FranchiseContext';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Procurement() {
  const { techhansaCatalog, b2bInvoices, approveB2BInvoice, orders, submitOrderRequest, metrics } = useFranchise();
  const [activeTab, setActiveTab] = useState('catalog');
  const navigate = useNavigate();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  
  const initialFormState = {
    catalogItemId: '',
    hardwareType: '',
    brand: '',
    quantity: 1,
    specs: {},
    comments: '',
    price: 0,
    amount: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const categories = [...new Set(techhansaCatalog.map(item => item.category).filter(Boolean))];
  const brands = [...new Set(techhansaCatalog.filter(item => !selectedCategory || item.category === selectedCategory).map(item => item.brand).filter(Boolean))];
  const models = [...new Set(techhansaCatalog.filter(item => 
    (!selectedCategory || item.category === selectedCategory) && 
    (!selectedBrand || item.brand === selectedBrand)
  ).map(item => item.model).filter(Boolean))];
  
  const specifications = techhansaCatalog.filter(item => 
    (!selectedCategory || item.category === selectedCategory) && 
    (!selectedBrand || item.brand === selectedBrand) &&
    (!selectedModel || item.model === selectedModel)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'quantity') {
        updated.amount = updated.price * Number(value);
      }
      return updated;
    });
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }));
  };

  const handleHardwareTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      hardwareType: value,
      specs: {} // Reset specs when hardware type changes
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.catalogItemId || !formData.quantity) {
      toast.error("Please select a product and quantity");
      return;
    }
    setOrderItems(prev => [...prev, { ...formData, id: Date.now() }]);
    setFormData(initialFormState);
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedModel('');
    toast.success("Item added to order list");
  };

  const handleRemoveItem = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Order list is empty. Add items first.");
      return;
    }
    
    // Add to submitted orders via context
    const success = await submitOrderRequest(orderItems);

    if (success) {
      toast.success("Order request sent to Techhansa Admin for verification.");
      setIsModalOpen(false);
      setOrderItems([]);
      setFormData(initialFormState);
      setSelectedCategory('');
      setSelectedBrand('');
      setSelectedModel('');
    } else {
      toast.error("Failed to submit order request. Please try again.");
    }
  };

  const renderDynamicSpecs = () => {
    return null;
  }

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">B2B Procurement</h1>
        <p className="text-slate-500">Order new stock from Techhansa or approve pending invoices.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          className={`py-3 px-6 font-semibold text-sm ${activeTab === 'catalog' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Order Requests
        </button>
        <button
          className={`py-3 px-6 font-semibold text-sm ${activeTab === 'approvals' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Your Recent Requests</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Order Request
            </button>
          </div>
          
          {/* Submitted Orders Section */}
          {orders.length > 0 ? (
            <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id || order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 mr-4">Request {order.requestId || order.id}</span>
                        <span className="text-sm text-slate-500">Submitted on: {order.date}</span>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        {order.status}
                      </span>
                    </div>
                    <div className="p-6">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-400 text-xs uppercase border-b border-slate-100">
                            <th className="pb-3 font-semibold">Hardware</th>
                            <th className="pb-3 font-semibold">Brand</th>
                            <th className="pb-3 font-semibold">Specifications</th>
                            <th className="pb-3 font-semibold text-center">Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {Array.isArray(order.items) ? order.items.map((item, idx) => (
                            <tr key={item._id || item.id || idx}>
                              <td className="py-3 font-medium text-slate-800">
                                {item.hardwareType === 'Others' ? item.otherType : item.hardwareType}
                              </td>
                              <td className="py-3 text-slate-600">{item.brand}</td>
                              <td className="py-3 text-sm text-slate-500">
                                {Object.keys(item.specs).length > 0 ? (
                                  Object.entries(item.specs).map(([key, val]) => (
                                    val ? <span key={key} className="block"><span className="font-medium text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {val}</span> : null
                                  ))
                                ) : (
                                  <span className="text-slate-400 italic">None</span>
                                )}
                                {item.comments && <span className="block mt-1 italic">"{item.comments}"</span>}
                              </td>
                              <td className="py-3 text-center font-bold text-indigo-600">{item.quantity}</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="4" className="py-3 text-center text-slate-500 italic">
                                Legacy order items not structured for detailed view.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <ShoppingCart className="w-8 h-8 text-indigo-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">No active requests</h3>
               <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't submitted any B2B hardware requests yet. Click the button above to create your first order.</p>
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
               >
                 Create New Request
               </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Invoice</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b2bInvoices.map(inv => (
                <tr key={inv._id || inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{inv.requestId || 'N/A'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{inv.invoiceNo || inv.id}</td>
                  <td className="px-4 py-3 text-sm">{inv.date || new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-rose-600">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inv.invoiceFile ? (
                      <a href={`#${inv.invoiceFile}`} className="text-indigo-600 hover:underline flex items-center justify-center gap-1 text-sm font-medium">
                         📄 PDF
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inv.status === 'Pending' && (
                      <button 
                        onClick={() => navigate('/franchise/checkout', { state: { invoice: inv } })}
                        className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100"
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex overflow-hidden">
            
            {/* Left Column: Form to add items */}
            <div className="w-3/5 border-r border-slate-100 flex flex-col h-full bg-white min-h-0">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">Add Item to Order</h3>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-item-form" onSubmit={handleAddItem} className="space-y-5">
                  
                  {/* Catalog Selection & Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Category</label>
                      <select 
                        value={selectedCategory} 
                        onChange={e => {
                          setSelectedCategory(e.target.value);
                          setSelectedBrand('');
                          setSelectedModel('');
                          setFormData(prev => ({...prev, catalogItemId: '', specs: {}, hardwareType: '', brand: '', price: 0}));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Brand</label>
                      <select 
                        value={selectedBrand} 
                        onChange={e => {
                          setSelectedBrand(e.target.value);
                          setSelectedModel('');
                          setFormData(prev => ({...prev, catalogItemId: '', specs: {}, hardwareType: '', brand: '', price: 0}));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      >
                        <option value="">All Brands</option>
                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Model</label>
                      <select 
                        value={selectedModel} 
                        onChange={e => {
                          setSelectedModel(e.target.value);
                          setFormData(prev => ({...prev, catalogItemId: '', specs: {}, hardwareType: '', brand: '', price: 0}));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      >
                        <option value="">All Models</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Specification (Finalize)</label>
                      <select 
                        name="catalogItem"
                        value={formData.catalogItemId || ''}
                        onChange={(e) => {
                          const item = techhansaCatalog.find(i => i._id === e.target.value);
                          if (item) {
                            setFormData(prev => ({
                              ...prev,
                              catalogItemId: item._id,
                              hardwareType: item.name,
                              brand: item.brand || 'N/A',
                              specs: { Category: item.category, Model: item.model, Specs: item.specs },
                              price: item.sellingPrice || 0,
                              amount: (item.sellingPrice || 0) * formData.quantity
                            }));
                          }
                        }}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      >
                        <option value="" disabled>Select Specs...</option>
                        {specifications.map(item => (
                          <option key={item._id} value={item._id} disabled={item.availableStock <= 0}>
                            {item.specs ? item.specs.substring(0, 45) + (item.specs.length > 45 ? '...' : '') : item.name} {item.availableStock > 0 ? '' : '(Out of stock)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1 col-span-2">
                      <label className="text-sm font-semibold text-slate-700">Quantity</label>
                      <input 
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Comments / Extra Specs */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Additional Remarks (Optional)</label>
                    <textarea 
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      placeholder="Any specific requests or requirements..."
                      rows="2"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      className="px-5 py-2.5 font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Order List
                    </button>
                  </div>
                  
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary & Submission */}
            <div className="w-2/5 flex flex-col h-full bg-slate-50 min-h-0">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-indigo-600" />
                  Order Summary
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {orderItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="font-medium">No items added yet</p>
                    <p className="text-sm text-center mt-1">Fill the form and add items to your order list.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800">
                            {item.hardwareType === 'Others' ? item.otherType : item.hardwareType}
                          </h4>
                          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-semibold text-slate-700">Brand:</span> {item.brand}
                        </p>
                        
                        {/* Display Specs summary */}
                        {Object.keys(item.specs).length > 0 && (
                          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2 mb-1">
                            {Object.entries(item.specs).map(([key, val]) => (
                              val ? <div key={key}><span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {val}</div> : null
                            ))}
                          </div>
                        )}
                        
                        {item.comments && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">
                            "{item.comments}"
                          </p>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                          <p className="text-xs text-slate-500">Unit: ₹{item.price?.toLocaleString() || 0}</p>
                          <p className="text-sm font-bold text-slate-800">
                            Total: ₹{item.amount?.toLocaleString() || (item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-slate-600">Total Items:</span>
                  <span className="text-lg font-bold text-slate-800">{orderItems.reduce((acc, item) => acc + Number(item.quantity), 0)}</span>
                </div>
                <button 
                  onClick={handleSubmitOrder}
                  disabled={orderItems.length === 0}
                  className={`w-full py-3.5 rounded-xl font-bold shadow-sm transition-colors text-white ${
                    orderItems.length > 0 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Submit Order Request
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
