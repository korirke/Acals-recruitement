"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Edit, Trash2, Eye, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Column<T = Record<string, unknown>> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  pagination?: Pagination;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  actions?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  onBulkDelete?: (ids: string[]) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearchChange?: (search: string) => void;
  title?: string;
  description?: string;
  getRowId?: (row: T) => string;
  customActions?: (row: T) => React.ReactNode;
}

export const DataTable = <T extends any>({
  columns,
  data,
  pagination,
  searchable = true,
  filterable = true,
  exportable = true,
  onEdit,
  onDelete,
  onView,
  actions = true,
  loading = false,
  onRefresh,
  onBulkDelete,
  onPageChange,
  onLimitChange,
  onSearchChange,
  title,
  description,
  getRowId = (row: any) => String(row.id || ''),
  customActions,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Use server pagination if provided, otherwise fall back to client-side
  const isServerPagination = !!pagination && !!onPageChange;
  
  // Client-side pagination state (fallback)
  const [clientPage, setClientPage] = useState(1);
  const [clientLimit, setClientLimit] = useState(10);

  const currentPage = isServerPagination ? pagination!.page : clientPage;
  const currentLimit = isServerPagination ? pagination!.limit : clientLimit;
  const totalItems = isServerPagination ? pagination!.total : data.length;
  const totalPages = isServerPagination ? pagination!.totalPages : Math.ceil(data.length / clientLimit);

  // Handle search with debounce
  useEffect(() => {
    if (!onSearchChange) return;
    
    const timeoutId = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  // Client-side filtering and sorting (only if not using server pagination)
  const processedData = isServerPagination ? data : (() => {
    let result = [...data];

    // Filter
    if (searchTerm) {
      result = result.filter((row: any) =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortField) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        const aStr = String(aValue);
        const bStr = String(bValue);
        
        if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Paginate
    const startIndex = (clientPage - 1) * clientLimit;
    return result.slice(startIndex, startIndex + clientLimit);
  })();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (isServerPagination && onPageChange) {
      onPageChange(newPage);
    } else {
      setClientPage(newPage);
    }
    setSelectedRows(new Set()); // Clear selections on page change
  };

  const handleLimitChange = (newLimit: number) => {
    if (isServerPagination && onLimitChange) {
      onLimitChange(newLimit);
      if (onPageChange) onPageChange(1); // Reset to first page
    } else {
      setClientLimit(newLimit);
      setClientPage(1);
    }
    setSelectedRows(new Set());
  };

  const toggleRowSelection = (rowId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === processedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(processedData.map(row => getRowId(row))));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedRows.size > 0) {
      if (confirm(`Are you sure you want to delete ${selectedRows.size} item(s)?`)) {
        onBulkDelete(Array.from(selectedRows));
        setSelectedRows(new Set());
      }
    }
  };

  const handleExport = () => {
    const csv = [
      columns.map(col => col.title).join(','),
      ...data.map((row: any) =>
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : String(value ?? '');
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = Math.min(startIndex + currentLimit, totalItems);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {onRefresh && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefresh}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              {filterable && (
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              )}
              {exportable && (
                <Button variant="outline" size="sm" onClick={handleExport} className="whitespace-nowrap">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Selected items actions */}
        {selectedRows.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                {onBulkDelete && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500 dark:text-blue-400" />
              <span className="text-neutral-600 dark:text-neutral-400">Loading data...</span>
            </div>
          </div>
        ) : processedData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No data found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No records available'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                {actions && onBulkDelete && (
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === processedData.length && processedData.length > 0}
                      onChange={toggleAllRows}
                      className="rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500 dark:bg-neutral-700"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:text-neutral-900 dark:hover:text-white select-none' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={`w-3 h-3 -mb-1 ${
                              sortField === column.key && sortDirection === 'asc' 
                                ? 'text-blue-500 dark:text-blue-400' 
                                : 'text-neutral-400 dark:text-neutral-600'
                            }`} 
                          />
                          <ChevronDown 
                            className={`w-3 h-3 -mt-1 ${
                              sortField === column.key && sortDirection === 'desc' 
                                ? 'text-blue-500 dark:text-blue-400' 
                                : 'text-neutral-400 dark:text-neutral-600'
                            }`} 
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider w-48">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {processedData.map((row: any) => {
                const rowId = getRowId(row);
                return (
                  <tr 
                    key={rowId} 
                    className={`hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                      selectedRows.has(rowId) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {actions && onBulkDelete && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowId)}
                          onChange={() => toggleRowSelection(rowId)}
                          className="rounded border-neutral-300 dark:border-neutral-600 text-blue-600 focus:ring-blue-500 dark:bg-neutral-700"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-sm">
                        {column.render ? (
                          column.render(row[column.key], row)
                        ) : (
                          <span className="text-neutral-900 dark:text-neutral-100">
                            {String(row[column.key] ?? '')}
                          </span>
                        )}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {customActions && customActions(row)}
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this item?')) {
                                  onDelete(row);
                                }
                              }}
                              className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && !loading && (
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-700 dark:text-neutral-300">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{endIndex}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </div>
              <select
                value={currentLimit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white px-3 py-1.5"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};