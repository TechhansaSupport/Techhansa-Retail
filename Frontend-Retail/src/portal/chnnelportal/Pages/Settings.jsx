import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Shield, User, Globe, Mail } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto pb-12 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-sm text-slate-500">Update your basic profile information.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors mt-2">Save Changes</button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">Choose what alerts you want to receive.</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Email Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive daily summaries and critical updates via email.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Order Status Updates</p>
                <p className="text-xs text-slate-500 mt-0.5">Get notified when your order is approved, packed, or shipped.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Promotional Offers</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive news about special channel partner discounts.</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security</h2>
              <p className="text-sm text-slate-500">Manage your password and security settings.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div>
              <p className="font-semibold text-slate-800">Password</p>
              <p className="text-sm text-slate-500 mt-1">Last changed 3 months ago.</p>
            </div>
            <button className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm transition-colors">
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
