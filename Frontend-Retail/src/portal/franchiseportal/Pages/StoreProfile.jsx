import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { Store, MapPin, User, Clock, Phone, Mail, FileText, Users, Edit3 } from 'lucide-react';

export default function StoreProfile() {
  const { storeProfileData, updateStoreProfile } = useFranchise();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...storeProfileData });

  const handleSave = () => {
    updateStoreProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Store Profile</h1>
          <p className="text-slate-500">Manage your store's public information and contact details.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="w-full md:w-auto justify-center flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-1">
              <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Store size={40} />
              </div>
            </div>
          </div>
          
          <div className="pt-14 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{storeProfileData.storeName}</h2>
            <div className="flex items-start gap-2 text-slate-500 mb-6">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <p>{storeProfileData.address}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Store Manager</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <User size={18} className="text-indigo-500" />
                  {storeProfileData.manager}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Employees</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Users size={18} className="text-indigo-500" />
                  {storeProfileData.employees} Active Staff
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Operating Hours</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Clock size={18} className="text-indigo-500" />
                  {storeProfileData.timings}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">GST Registration</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <FileText size={18} className="text-indigo-500" />
                  {storeProfileData.gst}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Contact Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-800">{storeProfileData.contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{storeProfileData.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-sm font-bold text-amber-800 mb-1">Important</h4>
            <p className="text-xs text-amber-700">Any changes to the Store Name, Address, or GST requires administrative approval before taking effect.</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Edit Store Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                    <input type="text" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                    <input type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Operating Hours</label>
                    <input type="text" value={formData.timings} onChange={e => setFormData({...formData, timings: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employees</label>
                    <input type="number" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">GST Registration Number</label>
                    <input type="text" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
