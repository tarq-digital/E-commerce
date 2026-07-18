'use client';

import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';

export default function ReportsDashboard() {
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const { token } = useAuth();

  const handleExport = async (reportType) => {
    setIsExporting(reportType);
    try {
      let query = '';
      if (dateRange === 'CUSTOM' && customStart && customEnd) {
          query = `?startDate=${new Date(customStart).toISOString()}&endDate=${new Date(customEnd).toISOString()}`;
      } else if (dateRange !== 'ALL_TIME' && dateRange !== 'CUSTOM') {
          const end = new Date();
          const start = new Date();
          if (dateRange === 'LAST_30_DAYS') start.setDate(start.getDate() - 30);
          if (dateRange === 'LAST_7_DAYS') start.setDate(start.getDate() - 7);
          query = `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/analytics/export/${reportType}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to generate export or no data available.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('An error occurred during export.');
    } finally {
      setIsExporting(false);
    }
  };

  const reports = [
    {
      id: 'SALES_REPORT',
      title: 'Sales & Revenue Report',
      description: 'Daily aggregated breakdown of orders, gross revenue, and applied discounts.',
      icon: <FileSpreadsheet className="text-emerald-500" size={24} />
    },
    {
      id: 'PRODUCT_REPORT',
      title: 'Top Products Report',
      description: 'Export top 50 performing products based on units sold and total generated revenue.',
      icon: <FileText className="text-blue-500" size={24} />
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Data Exports & Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and download CSV reports. All exports are securely logged.</p>
        </div>
      </div>

      <AdminCard>
         <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Filter size={18} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700 w-32">Global Date Filter:</h3>
            <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-primary outline-none"
            >
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="ALL_TIME">All Time</option>
                <option value="CUSTOM">Custom Range</option>
            </select>
            
            {dateRange === 'CUSTOM' && (
                <div className="flex items-center gap-2">
                    <input type="date" value={customStart} onChange={(e)=>setCustomStart(e.target.value)} className="text-sm border border-gray-300 rounded-md px-3 py-2"/>
                    <span className="text-gray-500 text-sm">to</span>
                    <input type="date" value={customEnd} onChange={(e)=>setCustomEnd(e.target.value)} className="text-sm border border-gray-300 rounded-md px-3 py-2"/>
                </div>
            )}
         </div>

         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                            {report.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs text-gray-400 font-mono">Format: CSV</span>
                        <AdminButton 
                            variant="secondary" 
                            onClick={() => handleExport(report.id)}
                            disabled={isExporting !== false}
                            className="flex items-center gap-2 text-sm"
                        >
                            <Download size={16} />
                            {isExporting === report.id ? 'Exporting...' : 'Export'}
                        </AdminButton>
                    </div>
                </div>
            ))}
         </div>
      </AdminCard>
    </div>
  );
}
