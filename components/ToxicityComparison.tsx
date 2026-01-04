import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pollutant, ToxicityData } from '../types';
import * as mockDb from '../services/mockDb';

interface ComparisonProps {
  ids: string[];
  pollutants: Pollutant[];
  onBack: () => void;
}

export const ToxicityComparison: React.FC<ComparisonProps> = ({ ids, pollutants, onBack }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allData: ToxicityData[] = await mockDb.getAllToxicityData();
      
      // We need to normalize data to compare meaningful endpoints.
      // Let's filter for common endpoints like LC50 or EC50 and take the lowest (most toxic) value found per pollutant.
      
      const targets = pollutants.filter(p => ids.includes(p.id));
      const chartData = targets.map(p => {
          const pData = allData.filter(d => d.pollutantId === p.id);
          
          // Find lowest LC50/EC50 to represent "Acute Toxicity Potential"
          const values = pData
            .filter(d => ['LC50', 'EC50', 'IC50'].includes(d.endpoint))
            .map(d => d.value);
            
          const minTox = values.length > 0 ? Math.min(...values) : 0;
          
          return {
              name: p.name,
              value: minTox,
              unit: 'mg/L',
              count: pData.length
          };
      });
      
      setData(chartData);
    };
    loadData();
  }, [ids, pollutants]);

  return (
    <div className="space-y-6">
       <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center text-sm font-medium">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Directory
      </button>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-2">Pollutant Toxicity Comparison</h2>
          <p className="text-slate-500 mb-6">Comparing minimum recorded Effect Concentrations (LC50/EC50). Lower values indicate higher potency/toxicity.</p>
          
          <div className="h-96 w-full">
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" label={{ value: 'Concentration (mg/L)', position: 'insideBottom', offset: -5 }} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip 
                        formatter={(value: number) => [`${value} mg/L`, 'Min Effect Conc.']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Min. Effect Concentration (LC50/EC50)" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 bg-slate-50 p-4 rounded text-sm text-slate-600">
              <strong>Note:</strong> Comparison is based on the lowest observed adverse effect concentration available in the database across all test organisms. This serves as a conservative risk screen.
          </div>
      </div>
    </div>
  );
};
