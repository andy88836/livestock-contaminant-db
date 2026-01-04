import React, { useEffect, useState } from 'react';
import { Pollutant, ToxicityData, AOPData } from '../types';
import * as mockDb from '../services/mockDb';
import * as geminiService from '../services/gemini';
import { AOPGraph } from './AOPGraph';

interface DetailProps {
  pollutant: Pollutant;
  onBack: () => void;
}

export const PollutantDetail: React.FC<DetailProps> = ({ pollutant, onBack }) => {
  const [toxicity, setToxicity] = useState<ToxicityData[]>([]);
  const [aop, setAop] = useState<AOPData | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    mockDb.getToxicityData(pollutant.id).then(setToxicity);
    mockDb.getAOPData(pollutant.id).then(setAop);
    setAiSummary(null);
  }, [pollutant]);

  const handleAiGenerate = async () => {
    setLoadingAi(true);
    const summary = await geminiService.generatePollutantSummary(pollutant, toxicity);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Directory
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{pollutant.name}</h1>
                <div className="flex gap-2 text-sm text-slate-500">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">CAS: {pollutant.casNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">{pollutant.category}</span>
                </div>
            </div>
            <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${pollutant.riskLevel === 'High' ? 'bg-red-100 text-red-800' : pollutant.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                    {pollutant.riskLevel} Risk
                </span>
            </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description & Usage</h3>
                <p className="text-slate-700 leading-relaxed">{pollutant.usage}</p>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Chemical Structure (SMILES)</h3>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs break-all text-slate-600">
                    {pollutant.smiles || 'N/A'}
                </div>
            </div>
            
            {/* AI Summary Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Risk Insight
                    </h3>
                    {!aiSummary && (
                        <button 
                            onClick={handleAiGenerate} 
                            disabled={loadingAi || !geminiService.isAiAvailable()}
                            className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAi ? 'Analyzing...' : 'Generate Analysis'}
                        </button>
                    )}
                </div>
                <div className="text-sm text-indigo-800 min-h-[80px]">
                    {aiSummary ? (
                        <p className="whitespace-pre-line">{aiSummary}</p>
                    ) : (
                        <p className="text-indigo-400 italic">
                            {geminiService.isAiAvailable() ? "Click generate to get an AI-powered toxicological summary using Gemini." : "AI Service not configured (Missing API Key)."}
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* AOP Visualization */}
      {aop ? (
        <AOPGraph data={aop} />
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
            No Adverse Outcome Pathway (AOP) data modeled for this pollutant yet.
        </div>
      )}

      {/* Toxicity Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Toxicity Data Points</h3>
            <span className="text-xs text-slate-500">{toxicity.length} records found</span>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-500 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Organism</th>
                    <th className="px-6 py-3 font-medium">Endpoint</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Reference</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {toxicity.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-900 font-medium">{t.toxicityType}</td>
                        <td className="px-6 py-3 text-slate-600 italic">{t.testOrganism}</td>
                        <td className="px-6 py-3 text-slate-600">{t.endpoint}</td>
                        <td className="px-6 py-3 text-slate-900 font-mono">{t.value} {t.unit}</td>
                        <td className="px-6 py-3 text-slate-500 text-xs">{t.reference}</td>
                    </tr>
                ))}
                {toxicity.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No toxicity data recorded.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};
