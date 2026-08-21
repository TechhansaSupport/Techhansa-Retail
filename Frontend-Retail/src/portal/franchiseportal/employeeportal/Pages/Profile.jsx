import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { User, Mail, Phone, MapPin, Building, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function EmployeeProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const [address, setAddress] = useState(user?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({ ...user, address });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">View and manage your account details</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Phone (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={user?.phone || ''} 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>
              
              {/* Company Name (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  Store / Company
                </label>
                <input 
                  type="text" 
                  value={user?.companyName || 'Not Assigned'} 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Address (Editable) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" />
                  Address
                </label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your address"
                />
              </div>

            </div>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-70"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
