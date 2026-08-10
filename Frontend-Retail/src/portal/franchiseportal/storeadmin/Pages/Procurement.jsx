import React, { useState } from 'react';
import { useFranchise } from '../context/FranchiseContext';

export default function Procurement() {
  const { techhansaCatalog, b2bInvoices } = useFranchise();
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">B2B Procurement</h1>
        <p className="text-slate-500">Order new stock from Techhansa or approve pending invoices.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          className={`py-3 px-6 font-semibold text-sm ${activeTab === 'catalog' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Catalog / New Order
        </button>
        <button
          className={`py-3 px-6 font-semibold text-sm ${activeTab === 'approvals' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Specs</th>
                <th className="px-4 py-3 text-right">B2B Price</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {techhansaCatalog.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{item.specs}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{item.b2bPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100">
                      Place Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b2bInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{inv.id}</td>
                  <td className="px-4 py-3 text-sm">{inv.date}</td>
                  <td className="px-4 py-3 text-right font-medium text-rose-600">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {inv.status === 'Pending' && (
                      <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100">
                        Approve & Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
