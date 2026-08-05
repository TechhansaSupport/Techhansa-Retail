import React, { useState } from 'react';
import { Plus, Trash2, FileUp, Save, Send, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateRFP() {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [requirementName, setRequirementName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [products, setProducts] = useState([
    { id: 1, category: '', brand: '', model: '', config: '', qty: 1, remarks: '' }
  ]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const addRow = () => {
    setProducts([...products, { id: Date.now(), category: '', brand: '', model: '', config: '', qty: 1, remarks: '' }]);
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
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `RFP-${year}-${randomNum}`;
  };

  // Validate form
  const validateForm = () => {
    if (!title.trim()) return 'RFP Title is required.';
    if (!requirementName.trim()) return 'Requirement Name is required.';
    if (!expectedDeliveryDate) return 'Expected Delivery Date is required.';

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
      rfpId: generateRfpId(),
      title: title.trim(),
      requirementName: requirementName.trim(),
      expectedDeliveryDate,
      priority,
      remarks: remarks.trim(),
      status,
      products: products.map(p => ({
        category: p.category,
        brand: p.brand.trim(),
        model: p.model.trim(),
        configuration: p.config.trim(),
        quantity: Number(p.qty),
        remarks: p.remarks.trim()
      }))
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
      const response = await fetch('http://localhost:5000/api/procurement/rfp', {
        method: 'POST',
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

      const response = await fetch('http://localhost:5000/api/procurement/rfp', {
        method: 'POST',
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
          <Link to="/channel/rfp" className="text-sm text-blue-600 hover:underline mb-2 block">&larr; Back to RFP Management</Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New RFP</h1>
          <p className="text-gray-500 text-sm mt-1">Submit a new procurement request for quotation.</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
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
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 bg-white px-3 py-1.5 rounded-md font-medium transition-colors shadow-sm">
                  <FileUp className="w-4 h-4 text-blue-600" /> Import Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-48">Category</th>
                    <th className="px-4 py-3 font-semibold w-32">Brand</th>
                    <th className="px-4 py-3 font-semibold w-40">Model</th>
                    <th className="px-4 py-3 font-semibold min-w-[200px]">Configuration</th>
                    <th className="px-4 py-3 font-semibold w-24">Qty</th>
                    <th className="px-4 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-2 align-top">
                        <select
                          value={p.category}
                          onChange={(e) => updateProduct(i, 'category', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="">Select...</option>
                          <option>Laptops</option>
                          <option>Desktops</option>
                          <option>Monitors</option>
                          <option>Printers</option>
                          <option>Servers</option>
                          <option>Networking</option>
                          <option>Storage</option>
                          <option>Accessories</option>
                        </select>
                      </td>
                      <td className="p-2 align-top">
                        <input
                          type="text"
                          value={p.brand}
                          onChange={(e) => updateProduct(i, 'brand', e.target.value)}
                          placeholder="Brand"
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 align-top">
                        <input
                          type="text"
                          value={p.model}
                          onChange={(e) => updateProduct(i, 'model', e.target.value)}
                          placeholder="Model"
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 align-top">
                        <input
                          type="text"
                          value={p.config}
                          onChange={(e) => updateProduct(i, 'config', e.target.value)}
                          placeholder="i7, 16GB, 512GB SSD..."
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 align-top">
                        <input
                          type="number"
                          min="1"
                          value={p.qty}
                          onChange={(e) => updateProduct(i, 'qty', e.target.value)}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="p-2 align-top text-center">
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
                <span className="font-semibold text-gray-900">{totalQty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Priority</span>
                <span className={`font-semibold text-sm px-2 py-0.5 rounded-full ${priority === 'High' ? 'bg-red-50 text-red-700' : priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{priority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Expected Delivery</span>
                <span className="font-medium text-gray-900 text-sm">{expectedDeliveryDate || 'Not set'}</span>
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
