import React, { useState } from 'react';
import { Pollutant, PollutantCategory, RiskLevel } from '../types';
import * as mockDb from '../services/mockDb';

interface PollutantListProps {
  pollutants: Pollutant[];
  onSelect: (id: string) => void;
  onRefresh: () => void;
  onCompare: (ids: string[]) => void;
}

export const PollutantList: React.FC<PollutantListProps> = ({ pollutants, onSelect, onRefresh, onCompare }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());

  // New Pollutant Form State
  const [newName, setNewName] = useState('');
  const [newCas, setNewCas] = useState('');
  const [newCategory, setNewCategory] = useState<PollutantCategory>(PollutantCategory.ANTIBIOTIC);
  const [newUsage, setNewUsage] = useState('');
  const [newSmiles, setNewSmiles] = useState('');

  const filtered = pollutants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.casNumber.includes(search);
    const matchCat = filterCat === 'ALL' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockDb.createPollutant({
        name: newName,
        casNumber: newCas,
        category: newCategory,
        usage: newUsage,
        smiles: newSmiles
    });
    setIsModalOpen(false);
    // Reset form
    setNewName(''); setNewCas(''); setNewCategory(PollutantCategory.ANTIBIOTIC); setNewUsage(''); setNewSmiles('');
    onRefresh();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm('Are you sure you want to delete this pollutant?')) {
          await mockDb.deletePollutant(id);
          onRefresh();
      }
  };

  const toggleCompare = (id: string) => {
      const next = new Set(selectedForCompare);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedForCompare(next);
  };

  const handleCompareClick = () => {
      onCompare(Array.from(selectedForCompare));
  };

  const getRiskColor = (level: RiskLevel) => {
      switch(level) {
          case RiskLevel.HIGH: return 'bg-red-100 text-red-800 border-red-200';
          case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
          case RiskLevel.LOW: return 'bg-green-100 text-green-800 border-green-200';
      }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Pollutants Directory</h2>
        <div className="flex gap-2">
            {selectedForCompare.size > 1 && (
                <button 
                    onClick={handleCompareClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition"
                >
                    Compare ({selectedForCompare.size})
                </button>
            )}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition flex items-center"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Pollutant
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
                type="text" 
                placeholder="Search by name, CAS, or similarity (mock)..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <select 
            className="border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
        >
            <option value="ALL">All Categories</option>
            {Object.values(PollutantCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                <tr>
                    <th className="px-6 py-3 w-10">
                        <span className="sr-only">Compare</span>
                    </th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">CAS Number</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Risk Level</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onSelect(p.id)}>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                                type="checkbox" 
                                checked={selectedForCompare.has(p.id)} 
                                onChange={() => toggleCompare(p.id)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                        <td className="px-6 py-4 font-mono text-xs">{p.casNumber}</td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {p.category}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(p.riskLevel)}`}>
                                {p.riskLevel}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={(e) => handleDelete(e, p.id)}
                                className="text-slate-400 hover:text-red-500 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
                {filtered.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            No pollutants found matching your criteria.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in-up">
                  <h3 className="text-xl font-bold mb-4">Add New Pollutant</h3>
                  <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input required className="mt-1 w-full border border-gray-300 rounded p-2" value={newName} onChange={e => setNewName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CAS Number</label>
                            <input required className="mt-1 w-full border border-gray-300 rounded p-2" value={newCas} onChange={e => setNewCas(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select className="mt-1 w-full border border-gray-300 rounded p-2" value={newCategory} onChange={e => setNewCategory(e.target.value as PollutantCategory)}>
                                {Object.values(PollutantCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Usage Description</label>
                          <textarea required className="mt-1 w-full border border-gray-300 rounded p-2" rows={2} value={newUsage} onChange={e => setNewUsage(e.target.value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">SMILES Structure</label>
                          <input className="mt-1 w-full border border-gray-300 rounded p-2 font-mono text-sm" value={newSmiles} onChange={e => setNewSmiles(e.target.value)} placeholder="e.g. CCO" />
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Pollutant</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
