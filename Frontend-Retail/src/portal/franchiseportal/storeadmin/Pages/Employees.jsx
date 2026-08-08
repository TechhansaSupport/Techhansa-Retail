import React, { useState } from 'react';
import { useFranchise } from '../context/FranchiseContext';
import { Plus, UserX, CheckCircle } from 'lucide-react';

export default function Employees() {
  const { employees, setEmployees } = useFranchise();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '' });

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return emp;
    }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmp = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalSales: 0,
      status: 'Active'
    };
    setEmployees([newEmp, ...employees]);
    setShowAddForm(false);
    setFormData({ name: '', phone: '', email: '', password: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
          <p className="text-slate-500">Manage your store staff and view their performance.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Employee</h2>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Create Employee</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3 text-right">Total Sales (This Month)</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{emp.name}</div>
                  <div className="text-xs text-slate-500">{emp.email} • {emp.phone}</div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-800">{emp.id}</td>
                <td className="px-6 py-4 text-right font-medium text-indigo-600">₹{emp.totalSales.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleToggleStatus(emp.id)}
                    className={`flex items-center justify-center gap-1 mx-auto px-3 py-1.5 rounded-lg text-xs font-bold ${emp.status === 'Active' ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                  >
                    {emp.status === 'Active' ? <><UserX size={14} /> Deactivate</> : <><CheckCircle size={14} /> Reactivate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
