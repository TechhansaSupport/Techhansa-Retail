import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BarChart2, PieChart } from 'lucide-react';
import { printReport } from '../../../utils/printUtils';
import { exportToCSV } from '../../../utils/exportUtils';

const reports = [
  { id: 1, name: 'Procurement Summary (YTD)', type: 'PDF', icon: FileText, date: 'Generated Oct 25, 2024' },
  { id: 2, name: 'Vendor Performance Analysis', type: 'Excel', icon: BarChart2, date: 'Generated Oct 20, 2024' },
  { id: 3, name: 'Spending by Category (Q3)', type: 'PDF', icon: PieChart, date: 'Generated Oct 01, 2024' },
  { id: 4, name: 'Order Fulfillment Metrics', type: 'Excel', icon: BarChart2, date: 'Generated Sep 15, 2024' }
];

export default function Reports() {
  const handleDownload = (report) => {
    const dummyData = [
      { Category: 'IT Equipment', TotalSpend: '₹15,00,000', Growth: '+5%', Status: 'Active' },
      { Category: 'Software Licenses', TotalSpend: '₹8,50,000', Growth: '+2%', Status: 'Active' },
      { Category: 'Office Supplies', TotalSpend: '₹2,30,000', Growth: '-1%', Status: 'Review' },
      { Category: 'Marketing Materials', TotalSpend: '₹5,00,000', Growth: '+10%', Status: 'Active' },
    ];
    
    if (report.type === 'PDF') {
      printReport(report.name, dummyData);
    } else {
      exportToCSV(`${report.name.replace(/\s+/g, '_').toLowerCase()}.csv`, dummyData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and download procurement reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {reports.map((report) => (
          <motion.div 
            key={report.id} 
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <report.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{report.name}</h3>
                <p className="text-sm text-slate-500">{report.date} • {report.type}</p>
              </div>
            </div>
            <button onClick={() => handleDownload(report)} className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <Download className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Need a custom report?</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">You can request custom analytics and data exports from the support team.</p>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
          Request Custom Report
        </button>
      </div>
    </div>
  );
}
