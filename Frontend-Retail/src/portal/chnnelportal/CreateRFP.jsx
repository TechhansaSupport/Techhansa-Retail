import React, { useState, useContext, useEffect } from 'react';
import { Plus, Trash2, FileUp, Save, Send, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function CreateRFP() {
  const { user } = useContext(AuthContext) || { user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const rfp = location.state?.rfp;

  // Form state
  const [title, setTitle] = useState(rfp?.title || '');
  const [requirementName, setRequirementName] = useState(rfp?.requirementName || '');
  
  const [remarks, setRemarks] = useState(rfp?.remarks || '');
  const [products, setProducts] = useState(
    rfp?.products?.length ? 
      rfp.products.map((p, index) => ({
        id: index + 1,
        category: p.category || '',
        brand: p.brand || '',
        model: p.model || '',
        config: p.configuration || '',
        qty: p.quantity || 1,
        price: p.price || 0,
        remarks: p.remarks || ''
      })) : 
      [{ id: 1, category: '', brand: '', model: '', config: '', qty: 1, price: 0, remarks: '' }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const [catalog, setCatalog] = useState([]);
  
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/channel/catalog/all`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            setCatalog(resData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch catalog:", err);
      }
    };
    fetchCatalog();
  }, []);

  const addRow = () => {
    setProducts([...products, { id: Date.now(), catalogItemId: '', category: '', brand: '', model: '', config: '', qty: 1, remarks: '' }]);
  };

  const removeRow = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const totalQty = products.reduce((sum, p) => sum + (Number(p.qty) || 0), 0);

  // Generate unique RFP ID
  const generateRfpId = () => {
    if (rfp?.rfpId) return rfp.rfpId;
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `RFP-${year}-${randomNum}`;
  };

  // Validate form
  const validateForm = () => {
    if (!title.trim()) return 'RFP Title is required.';
    if (!requirementName.trim()) return 'Requirement Name is required.';

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (!p.category) return `Product row ${i + 1}: Category is required.`;
      if (!p.brand.trim()) return `Product row ${i + 1}: Brand is required.`;
      if (!p.model.trim()) return `Product row ${i + 1}: Model is required.`;
      if (!p.config.trim()) return `Product row ${i + 1}: Configuration is required.`;
      if (!p.qty || p.qty < 1) return `Product row ${i + 1}: Quantity must be at least 1.`;
    }

    return null;
  };

  // Build payload matching the backend RFP model
  const buildPayload = (status) => {
    return {
      userId: user?.userId,
      rfpId: generateRfpId(),
      title: title.trim(),
      requirementName: requirementName.trim(),
      expectedDeliveryDate: new Date().toISOString(),
      priority: 'Medium',
      remarks: remarks.trim(),
      status,
      products: products.map(p => ({
        category: p.category,
        brand: p.brand.trim(),
        model: p.model.trim(),
        configuration: p.config.trim(),
        quantity: Number(p.qty),
        price: Number(p.price) || 0,
        remarks: p.remarks.trim()
      })),
      estimatedTotal: products.reduce((acc, p) => acc + ((p.price || 0) * (parseInt(p.qty) || 0)), 0)
    };
  };

  // Submit RFP
  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload('Submitted');
      const isEdit = !!rfp;
      const url = isEdit ? `${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp/${rfp.rfpId}` : `${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit RFP.');
      }

      setSubmitSuccess('RFP submitted successfully! Redirecting...');
      setTimeout(() => {
        navigate('/channel/rfp');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!title.trim()) {
      setSubmitError('RFP Title is required to save a draft.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = buildPayload('Draft');
      // Fill required fields with defaults for draft
      if (!payload.requirementName) payload.requirementName = 'Draft';
      if (!payload.expectedDeliveryDate) payload.expectedDeliveryDate = new Date().toISOString();
      payload.products = payload.products.map(p => ({
        ...p,
        category: p.category || 'General',
        brand: p.brand || 'TBD',
        model: p.model || 'TBD',
        configuration: p.configuration || 'TBD',
        quantity: p.quantity || 1
      }));

      const isEdit = !!rfp;
      const url = isEdit ? `${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp/${rfp.rfpId}` : `${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save draft.');
      }

      setSubmitSuccess('Draft saved successfully!');
      setTimeout(() => {
        navigate('/channel/rfp');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          
          <h1 className="text-2xl font-bold text-gray-900">{rfp ? 'Edit Draft RFP' : 'Create New RFP'}</h1>
          <p className="text-gray-500 text-sm mt-1">{rfp ? 'Update your draft procurement request.' : 'Submit a new procurement request for quotation.'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit RFP
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-sm text-emerald-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          {submitSuccess}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main Form Area */}
        <div className="flex-1 space-y-6">

          {/* General Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">RFP Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Laptops Procurement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={requirementName}
                  onChange={(e) => setRequirementName(e.target.value)}
                  placeholder="e.g. Engineering Dept Upgrade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Special Instructions</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any specific requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Product Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Product Requirements</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th colSpan="4" className="px-4 py-3 font-semibold min-w-[300px]">Select Catalog Item</th>
                    <th className="px-4 py-3 font-semibold text-right">Est. Price</th>
                    <th className="px-4 py-3 font-semibold w-24 text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Est. Amount</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td colSpan="4" className="p-2 align-top">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={p.category || ''}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[i].category = e.target.value;
                              newProducts[i].brand = '';
                              newProducts[i].model = '';
                              newProducts[i].config = '';
                              newProducts[i].catalogItemId = '';
                              setProducts(newProducts);
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">All Categories</option>
                            {[...new Set(catalog.map(item => item.category?.trim()).filter(Boolean))].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>

                          <select
                            value={p.brand || ''}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[i].brand = e.target.value;
                              newProducts[i].model = '';
                              newProducts[i].config = '';
                              newProducts[i].catalogItemId = '';
                              setProducts(newProducts);
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">All Brands</option>
                            {[...new Set(catalog.filter(item => !p.category || item.category?.trim() === p.category).map(item => item.brand?.trim()).filter(Boolean))].map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>

                          <select
                            value={p.model || ''}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[i].model = e.target.value;
                              newProducts[i].config = '';
                              newProducts[i].catalogItemId = '';
                              setProducts(newProducts);
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">All Models</option>
                            {[...new Set(catalog.filter(item => 
                              (!p.category || item.category?.trim() === p.category) && 
                              (!p.brand || item.brand?.trim() === p.brand)
                            ).map(item => item.model?.trim()).filter(Boolean))].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>

                          <select
                            value={p.catalogItemId || ''}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const item = catalog.find(c => c._id === selectedId);
                              if (item) {
                                const newProducts = [...products];
                                newProducts[i].catalogItemId = item._id;
                                newProducts[i].category = item.category?.trim() || item.name?.trim();
                                newProducts[i].brand = item.brand?.trim() || 'N/A';
                                newProducts[i].model = item.model?.trim() || 'N/A';
                                newProducts[i].config = item.specs || 'N/A';
                                newProducts[i].price = item.sellingPrice || 0;
                                setProducts(newProducts);
                              }
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="">Select Specs...</option>
                            {catalog.filter(item => 
                              (!p.category || item.category?.trim() === p.category) && 
                              (!p.brand || item.brand?.trim() === p.brand) &&
                              (!p.model || item.model?.trim() === p.model)
                            ).map(item => (
                              <option key={item._id} value={item._id}>
                                {item.specs ? item.specs.substring(0, 45) + (item.specs.length > 45 ? '...' : '') : item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-2 align-middle text-right text-sm text-gray-700">
                        {p.price ? `₹${p.price.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-2 align-middle">
                        <input
                          type="number"
                          min="1"
                          value={p.qty}
                          onChange={(e) => updateProduct(i, 'qty', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 text-center"
                        />
                      </td>
                      <td className="p-2 align-middle text-right text-sm font-semibold text-gray-900">
                        {p.price ? `₹${(p.price * p.qty).toLocaleString()}` : '-'}
                      </td>
                      <td className="p-2 align-middle text-center">
                        <button
                          onClick={() => removeRow(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          disabled={products.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={addRow}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product Row
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">RFP Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Unique Items</span>
                <span className="font-semibold text-gray-900">{products.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Quantity</span>
                <span className="font-semibold text-gray-900">
                  {products.reduce((acc, p) => acc + (parseInt(p.qty) || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-gray-700 font-semibold">Estimated Total</span>
                <span className="font-bold text-blue-600 text-lg">
                  ₹{products.reduce((acc, p) => acc + ((p.price || 0) * (parseInt(p.qty) || 0)), 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <span className="font-semibold block mb-1">Information</span>
                Once submitted, this RFP will be sent to multiple approved vendors to receive the best quotations.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
