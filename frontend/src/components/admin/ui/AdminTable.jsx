import React from 'react';
import { ChevronLeft, ChevronRight, Search, Download, Upload } from 'lucide-react';
import { AdminButton } from './AdminButton';

export function AdminTable({ 
  columns, 
  data, 
  isLoading, 
  onSearch, 
  pagination, 
  onPageChange,
  bulkActions,
  title
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-4 flex-1">
          {title && <h3 className="font-semibold text-gray-900 hidden sm:block">{title}</h3>}
          {onSearch && (
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          )}
        </div>
        
        {/* Bulk Action Placeholders (Architecture) */}
        {bulkActions && (
          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" size="sm" icon={<Upload size={14} />}>
              Import
            </AdminButton>
            <AdminButton variant="secondary" size="sm" icon={<Download size={14} />}>
              Export
            </AdminButton>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 w-4">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/50" />
              </th>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 font-semibold">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  <div className="animate-pulse flex justify-center items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/50" />
                  </td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm px-2">Page {pagination.page} of {pagination.total_pages}</span>
            <button 
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="p-1.5 rounded bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
