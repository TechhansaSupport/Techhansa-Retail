import React, { useState } from 'react';
import { useFranchise } from '../context/FranchiseContext';
import { Plus, UserX, CheckCircle, Edit, X } from 'lucide-react';

export default function Employees() {
  const { employees, addEmployee, updateEmployee, toggleEmployeeStatus, invoices } = useFranchise();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', name: '', phone: '', email: '', password: '' });
  
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', email: '', password: '' });

  const employeeSalesMap = React.useMemo(() => {
    if (!invoices) return {};
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const salesMap = {};
    invoices.forEach(inv => {
      const invDate = new Date(inv.createdAt);
      if (invDate >= startOfMonth && inv.employeeId) {
        salesMap[inv.employeeId] = (salesMap[inv.employeeId] || 0) + inv.amount;
      }
    });
    return salesMap;
  }, [invoices]);

  const getEmployeeSales = (emp) => {
    const empId = emp.userId || emp.id;
    return employeeSalesMap[empId] || 0;
  };

  const handleToggleStatus = async (id) => {
    await toggleEmployeeStatus(id);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const newEmp = {
      userId: formData.userId || `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    
    const res = await addEmployee(newEmp);
    if (res.success) {
      setShowAddForm(false);
      setFormData({ userId: '', name: '', phone: '', email: '', password: '' });
    } else {
      alert(res.message || 'Failed to add employee');
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditFormData({
      name: emp.name || '',
      phone: emp.phone || '',
      email: emp.email || '',
      password: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const empId = editingEmployee._id || editingEmployee.userId || editingEmployee.id;
    const res = await updateEmployee(empId, {
      name: editFormData.name,
      phone: editFormData.phone,
      email: editFormData.email,
      password: editFormData.password || undefined // Only send if not empty
    });

    if (res.success) {
      setEditingEmployee(null);
    } else {
      alert(res.message || 'Failed to update employee');
    }
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
              <label className="block text-sm font-semibold text-slate-600 mb-1">User ID</label>
              <input required type="text" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} placeholder="e.g. employee123" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
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
              <tr key={emp.userId || emp.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{emp.name}</div>
                  <div className="text-xs text-slate-500">{emp.email} • {emp.phone}</div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-800">{emp.userId || emp.id}</td>
                <td className="px-6 py-4 text-right font-medium text-indigo-600">₹{getEmployeeSales(emp).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${(emp.status || 'Active') === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {emp.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => openEditModal(emp)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(emp._id || emp.userId || emp.id)}
                      className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${(emp.status || 'Active') === 'Active' ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                    >
                      {(emp.status || 'Active') === 'Active' ? <><UserX size={14} /> Deactivate</> : <><CheckCircle size={14} /> Reactivate</>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Edit Employee</h2>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                <input required type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
                <input required type="tel" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
                <input required type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">New Password (leave blank to keep current)</label>
                <input type="password" value={editFormData.password} onChange={e => setEditFormData({...editFormData, password: e.target.value})} placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingEmployee(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
