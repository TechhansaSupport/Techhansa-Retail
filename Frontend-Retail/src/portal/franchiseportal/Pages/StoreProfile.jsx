import React from 'react';
import { motion } from 'framer-motion';
import { storeProfile } from '../mockData';
import { Store, MapPin, User, Clock, Phone, Mail, FileText, Users, Edit3 } from 'lucide-react';

export default function StoreProfile() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Store Profile</h1>
          <p className="text-slate-500">Manage your store's public information and contact details.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
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
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{storeProfile.storeName}</h2>
            <div className="flex items-start gap-2 text-slate-500 mb-6">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <p>{storeProfile.address}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Store Manager</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <User size={18} className="text-indigo-500" />
                  {storeProfile.manager}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Employees</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Users size={18} className="text-indigo-500" />
                  {storeProfile.employees} Active Staff
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Operating Hours</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Clock size={18} className="text-indigo-500" />
                  {storeProfile.timings}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">GST Registration</p>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <FileText size={18} className="text-indigo-500" />
                  {storeProfile.gst}
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
                <p className="font-medium text-slate-800">{storeProfile.contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-800">{storeProfile.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-sm font-bold text-amber-800 mb-1">Important</h4>
            <p className="text-xs text-amber-700">Any changes to the Store Name, Address, or GST requires administrative approval before taking effect.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
