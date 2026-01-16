import React, { useEffect, useState } from 'react';
import { ToxicityRecord } from '../types';
import * as toxicityDb from '../services/toxicityDb';

interface ToxicityTableProps {
  onBack?: () => void;
}

const ITEMS_PER_PAGE = 20;

/**
 * Chicken Oral Acute Toxicity LD50 Database
 */
export const ToxicityTable: React.FC<ToxicityTableProps> = ({ onBack }) => {
  const [data, setData] = useState<ToxicityRecord[]>([]);
  const [filteredData, setFilteredData] = useState<ToxicityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'Toxicity Value' | 'Name'>('Toxicity Value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await toxicityDb.getToxicityData();
      setData(result);
      setFilteredData(result);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Failed to load toxicity data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate risk level based on toxicity value
  const getRiskLevel = (value: number): string => {
    if (value < 50) return 'High';
    if (value < 500) return 'Moderate';
    if (value < 5000) return 'Low';
    return 'Very Low';
  };

  const getRiskColor = (value: number): string => {
    if (value < 50) return 'bg-red-100 text-red-700 border border-red-300';
    if (value < 500) return 'bg-orange-100 text-orange-700 border border-orange-300';
    if (value < 5000) return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    return 'bg-green-100 text-green-700 border border-green-300';
  };

  useEffect(() => {
    let filtered = [...data];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.Name?.toLowerCase().includes(term) ||
        record['IUPAC Name']?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      if (sortBy === 'Toxicity Value') {
        aVal = a['Toxicity Value'];
        bVal = b['Toxicity Value'];
      } else {
        aVal = a.Name?.toLowerCase() || '';
        bVal = b.Name?.toLowerCase() || '';
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: 'Toxicity Value' | 'Name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    const csv = [
      ['TAID', 'Name', 'IUPAC Name', 'PubChem CID', 'Canonical SMILES', 'InChIKey', 'Toxicity Value'].join(','),
      ...filteredData.map(r => [
        r.TAID,
        r.Name,
        r['IUPAC Name'] || '',
        r['PubChem CID'] || '',
        r['Canonical SMILES'] || '',
        r.InChIKey || '',
        r['Toxicity Value']
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toxicity_data_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading toxicity data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Load Failed</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = {
    total: data.length,
    high: data.filter(d => d['Toxicity Value'] < 50).length,
    moderate: data.filter(d => d['Toxicity Value'] >= 50 && d['Toxicity Value'] < 500).length,
    low: data.filter(d => d['Toxicity Value'] >= 500 && d['Toxicity Value'] < 5000).length,
    veryLow: data.filter(d => d['Toxicity Value'] >= 5000).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Chicken Oral Acute Toxicity LD50 Database
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Acute Toxicity - Chicken Oral LD50
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded"
          >
            Back
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-500">Total Records</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.high}</div>
          <div className="text-xs text-red-500">High (&lt;50)</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{stats.moderate}</div>
          <div className="text-xs text-orange-500">Moderate (50-500)</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.low}</div>
          <div className="text-xs text-yellow-500">Low (500-5000)</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.veryLow}</div>
          <div className="text-xs text-green-500">Very Low (&gt;5000)</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Search by chemical name, IUPAC name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-500">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} records
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {/* Horizontal scroll container */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('Name')}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 whitespace-nowrap"
                >
                  Chemical Name
                  {sortBy === 'Name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  IUPAC Name
                </th>
                <th
                  onClick={() => handleSort('Toxicity Value')}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 whitespace-nowrap"
                >
                  LD50 (mg/kg)
                  {sortBy === 'Toxicity Value' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Risk Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  PubChem CID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  SMILES
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  InChIKey
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  TAID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((record) => (
                <tr key={record.TAID} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                    {record.Name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={record['IUPAC Name'] || ''}>
                    {record['IUPAC Name'] || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 font-mono whitespace-nowrap">
                    {record['Toxicity Value'].toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRiskColor(record['Toxicity Value'])}`}>
                      {getRiskLevel(record['Toxicity Value'])}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                    {record['PubChem CID'] ? (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${record['PubChem CID']}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {record['PubChem CID']}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 font-mono max-w-xs truncate" title={record['Canonical SMILES'] || ''}>
                    {record['Canonical SMILES'] || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 font-mono max-w-xs truncate" title={record.InChIKey || ''}>
                    {record.InChIKey || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {record.TAID}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No records found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-slate-600">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
