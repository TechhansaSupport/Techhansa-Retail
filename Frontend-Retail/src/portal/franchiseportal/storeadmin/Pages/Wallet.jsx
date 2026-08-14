import React from 'react';
import { useFranchise } from '../context/FranchiseContext';
import { IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Wallet() {
  const { metrics, walletTransactions } = useFranchise();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Credit Wallet</h1>
        <p className="text-slate-500">Manage your B2B prepaid balance for Techhansa orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-semibold tracking-wider uppercase mb-1">Current Available Balance</p>
              <h2 className="text-5xl font-black flex items-center">
                <IndianRupee size={40} className="mr-1" />
                {metrics.walletBalance.toLocaleString()}
              </h2>
            </div>
            
            
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Transaction Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {walletTransactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">{txn.date}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-800">{txn.id}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-bold ${txn.type === 'Credit In' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {txn.type === 'Credit In' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">₹{txn.closingBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
