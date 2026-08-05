import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area
} from 'recharts';

const RFP_STATUS_DATA = [
  { name: 'Draft', value: 4 },
  { name: 'Submitted', value: 8 },
  { name: 'Under Review', value: 5 },
  { name: 'Quotation Received', value: 3 },
  { name: 'Approved', value: 12 },
  { name: 'Rejected', value: 2 },
];
const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

const MONTHLY_TREND_DATA = [
  { name: 'Jan', value: 40000 },
  { name: 'Feb', value: 30000 },
  { name: 'Mar', value: 55000 },
  { name: 'Apr', value: 45000 },
  { name: 'May', value: 70000 },
  { name: 'Jun', value: 85000 },
];

const ORDER_STATUS_DATA = [
  { name: 'Pending', value: 15 },
  { name: 'Confirmed', value: 25 },
  { name: 'Processing', value: 10 },
  { name: 'Shipped', value: 30 },
  { name: 'Delivered', value: 128 },
];
const ORDER_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] text-slate-600 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default function SmartAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* SECTION 1: Procurement Trend */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Monthly Procurement Trend</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* SECTION 2: RFP Status Donut */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 mb-2">RFP Status</h2>
        <div className="flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie 
                data={RFP_STATUS_DATA} 
                cx="50%" 
                cy="45%" 
                innerRadius={70} 
                outerRadius={90} 
                paddingAngle={4} 
                dataKey="value"
                cornerRadius={5}
                stroke="none"
              >
                {RFP_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                itemStyle={{ color: '#1e293b', fontWeight: 500 }}
              />
              <Legend 
                content={renderCustomLegend}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
