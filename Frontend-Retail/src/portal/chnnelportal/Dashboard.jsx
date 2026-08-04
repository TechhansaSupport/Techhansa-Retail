import React from 'react';
import {
  FileText,
  CheckCircle,
  Truck,
  Receipt,
  DollarSign,
  Plus,
  Eye,
  MapPin,
  FileDown,
  HeadphonesIcon,
  BarChart3
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const KPI_CARDS = [
  { title: 'Pending RFP', value: '12', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100', trend: '+2 this week' },
  { title: 'Approved Orders', value: '45', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100', trend: '+5 this week' },
  { title: 'Delivered Orders', value: '128', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100', trend: '98% on time' },
  { title: 'Invoices', value: '89', icon: Receipt, color: 'text-gray-500', bg: 'bg-gray-100', trend: '3 pending' },
  { title: 'Total Spending', value: '$1.2M', icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-100', trend: '+12% YTD' },
];

const RFP_STATUS_DATA = [
  { name: 'Draft', value: 4 },
  { name: 'Submitted', value: 8 },
  { name: 'Under Review', value: 5 },
  { name: 'Quotation Received', value: 3 },
  { name: 'Approved', value: 12 },
  { name: 'Rejected', value: 2 },
];
const COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ef4444'];

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
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#22c55e'];

const VENDOR_DATA = [
  { name: 'HP', value: 45 },
  { name: 'Dell', value: 35 },
  { name: 'Lenovo', value: 50 },
  { name: 'Samsung', value: 20 },
  { name: 'Apple', value: 15 },
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, John Doe. Here's your procurement overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/channel/rfp/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" /> Create New RFP
          </Link>
        </div>
      </div>

      {/* SECTION 1: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {KPI_CARDS.map((kpi, i) => (
          <Card key={i} className="flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
            <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
            <div className="mt-4 text-xs font-medium text-gray-400 bg-gray-50 -mx-5 -mb-5 px-5 py-3 border-t border-gray-100">
              {kpi.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* SECTION 2: Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <Eye className="w-4 h-4 text-blue-600" /> View Quotations
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <MapPin className="w-4 h-4 text-green-600" /> Track Orders
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <FileDown className="w-4 h-4 text-orange-600" /> Download Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <HeadphonesIcon className="w-4 h-4 text-purple-600" /> Raise Support Ticket
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <BarChart3 className="w-4 h-4 text-gray-600" /> View Reports
          </button>
        </div>
      </Card>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 3: RFP Status Analytics */}
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">RFP Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RFP_STATUS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {RFP_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SECTION 4: Monthly Procurement Trend */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Procurement Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 5: Order Status */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ORDER_STATUS_DATA} cx="50%" cy="50%" outerRadius={80} paddingAngle={1} dataKey="value">
                  {ORDER_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SECTION 6: Vendor / Brand Distribution */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Brand Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDOR_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* TABLES ROW */}
      <div className="grid grid-cols-1 gap-6">
        {/* SECTION 7: Recent RFP Table */}
        <Card className="overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent RFPs</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">RFP ID</th>
                  <th className="px-5 py-3 font-semibold">Created Date</th>
                  <th className="px-5 py-3 font-semibold">Expected Delivery</th>
                  <th className="px-5 py-3 font-semibold">Total Items</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: 'RFP-2023-089', date: 'Oct 12, 2023', ed: 'Oct 25, 2023', items: 15, status: 'Quotation Received', color: 'bg-purple-100 text-purple-700' },
                  { id: 'RFP-2023-088', date: 'Oct 10, 2023', ed: 'Oct 20, 2023', items: 4, status: 'Under Review', color: 'bg-orange-100 text-orange-700' },
                  { id: 'RFP-2023-087', date: 'Oct 05, 2023', ed: 'Oct 15, 2023', items: 25, status: 'Approved', color: 'bg-green-100 text-green-700' },
                  { id: 'RFP-2023-086', date: 'Oct 01, 2023', ed: 'Oct 10, 2023', items: 8, status: 'Draft', color: 'bg-gray-100 text-gray-700' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{row.id}</td>
                    <td className="px-5 py-4 text-gray-600">{row.date}</td>
                    <td className="px-5 py-4 text-gray-600">{row.ed}</td>
                    <td className="px-5 py-4 text-gray-600">{row.items}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-medium">View</button>
                        <button className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs font-medium">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* SECTION 8: Latest Quotations */}
        <Card className="overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Quotations</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">Quotation No</th>
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 font-semibold">RFP Reference</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Valid Until</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { qno: 'QT-9921', vendor: 'Tech Data Corp', ref: 'RFP-2023-089', amt: '$12,450.00', valid: 'Oct 20, 2023', status: 'Pending', color: 'bg-orange-100 text-orange-700' },
                  { qno: 'QT-9920', vendor: 'Ingram Micro', ref: 'RFP-2023-087', amt: '$45,200.00', valid: 'Oct 15, 2023', status: 'Approved', color: 'bg-green-100 text-green-700' },
                  { qno: 'QT-9918', vendor: 'Synnex', ref: 'RFP-2023-085', amt: '$8,900.00', valid: 'Oct 10, 2023', status: 'Rejected', color: 'bg-red-100 text-red-700' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{row.qno}</td>
                    <td className="px-5 py-4 text-gray-900">{row.vendor}</td>
                    <td className="px-5 py-4 text-blue-600 hover:underline cursor-pointer">{row.ref}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{row.amt}</td>
                    <td className="px-5 py-4 text-gray-600">{row.valid}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {row.status === 'Pending' && (
                          <>
                            <button className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-200">Approve</button>
                            <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-200">Reject</button>
                          </>
                        )}
                        <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-medium">PDF</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* SECTION 10 & 11: Tracking & Delivery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Deliveries</h2>
          <div className="space-y-4">
            {[
              { id: 'ORD-5541', loc: 'In Transit - Local Hub, NY', courier: 'FedEx', progress: 75 },
              { id: 'ORD-5532', loc: 'Processing at Warehouse', courier: 'UPS', progress: 25 },
            ].map((delivery, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">{delivery.id}</span>
                  <span className="text-sm font-medium text-gray-500">{delivery.courier}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> {delivery.loc}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${delivery.progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Dispatched</span>
                  <span>Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SECTION 12: Notifications */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
            {[
              { text: 'Admin approved Quotation QT-9920', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500 bg-green-100' },
              { text: 'Order ORD-5541 dispatched via FedEx', time: '5 hours ago', icon: Truck, color: 'text-blue-500 bg-blue-100' },
              { text: 'Invoice INV-2023-112 generated', time: '1 day ago', icon: Receipt, color: 'text-gray-500 bg-gray-100' },
              { text: 'New quotation received for RFP-2023-089', time: '1 day ago', icon: FileDown, color: 'text-orange-500 bg-orange-100' },
            ].map((act, i) => (
              <div key={i} className="pl-6 relative">
                <span className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center ${act.color} ring-4 ring-white`}>
                  <act.icon className="w-3 h-3" />
                </span>
                <p className="text-sm text-gray-900 font-medium">{act.text}</p>
                <p className="text-xs text-gray-500 mt-1">{act.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
