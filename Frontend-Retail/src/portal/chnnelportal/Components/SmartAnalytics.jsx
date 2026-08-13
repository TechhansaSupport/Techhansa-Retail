import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area
} from 'recharts';

const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
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
  const { user } = useContext(AuthContext) || { user: null };
  const navigate = useNavigate();
  const [rfpData, setRfpData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      try {
        const [rfpRes, reportsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp?userId=${user.userId}`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/reports?userId=${user.userId}`)
        ]);

        if (rfpRes.ok) {
          const rfps = await rfpRes.json();
          const counts = { 'Draft': 0, 'Pending Admin Approval': 0, 'Under Review': 0, 'Quotation Received': 0, 'Approved': 0, 'Rejected': 0 };
          rfps.forEach(r => { 
            const statusLabel = r.status === 'Submitted' ? 'Pending Admin Approval' : r.status;
            if (counts[statusLabel] !== undefined) counts[statusLabel]++; 
          });
          setRfpData(Object.entries(counts).map(([name, value]) => ({ 
            name, 
            originalStatus: name === 'Pending Admin Approval' ? 'Submitted' : name,
            value 
          })));
        }

        if (reportsRes.ok) {
          const reports = await reportsRes.json();
          if (reports.monthly) {
            setTrendData(reports.monthly.reverse().map(m => ({ name: m.name, value: m.spend })));
          }
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* SECTION 1: Procurement Trend */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Monthly Procurement Trend</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isLoading ? (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* SECTION 2: RFP Status Donut */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 mb-2">RFP Status</h2>
        <div className="flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {isLoading ? (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg mt-4"></div>
            ) : (
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie 
                data={rfpData} 
                cx="50%" 
                cy="45%" 
                innerRadius={70} 
                outerRadius={90} 
                paddingAngle={4} 
                dataKey="value"
                cornerRadius={5}
                stroke="none"
              >
                {rfpData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]} 
                    onClick={() => navigate('/channel/rfp-management', { state: { filter: entry.originalStatus } })}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  />
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
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
