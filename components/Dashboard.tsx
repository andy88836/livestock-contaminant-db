import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import * as toxicityDb from '../services/toxicityDb';
import { ToxicityRecord } from '../types';

/**
 * Dashboard showing toxicity data statistics from Supabase
 */
export const Dashboard: React.FC = () => {
  const [data, setData] = useState<ToxicityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await toxicityDb.getToxicityData();
        setData(result);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate risk distribution
  const riskDistribution = data.reduce((acc, record) => {
    const value = record['Toxicity Value'];
    let level: string;
    if (value < 50) level = 'High';
    else if (value < 500) level = 'Moderate';
    else if (value < 5000) level = 'Low';
    else level = 'Very Low';

    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'High', value: riskDistribution.High || 0, color: '#ef4444', range: '< 50 mg/kg' },
    { name: 'Moderate', value: riskDistribution.Moderate || 0, color: '#f59e0b', range: '50-500 mg/kg' },
    { name: 'Low', value: riskDistribution.Low || 0, color: '#eab308', range: '500-5000 mg/kg' },
    { name: 'Very Low', value: riskDistribution['Very Low'] || 0, color: '#22c55e', range: '> 5000 mg/kg' },
  ].filter(d => d.value > 0);

  // Calculate toxicity value ranges distribution
  const rangeData = [
    { range: '< 50', count: data.filter(d => d['Toxicity Value'] < 50).length, color: '#ef4444' },
    { range: '50-100', count: data.filter(d => d['Toxicity Value'] >= 50 && d['Toxicity Value'] < 100).length, color: '#f97316' },
    { range: '100-500', count: data.filter(d => d['Toxicity Value'] >= 100 && d['Toxicity Value'] < 500).length, color: '#f59e0b' },
    { range: '500-1000', count: data.filter(d => d['Toxicity Value'] >= 500 && d['Toxicity Value'] < 1000).length, color: '#eab308' },
    { range: '1000-5000', count: data.filter(d => d['Toxicity Value'] >= 1000 && d['Toxicity Value'] < 5000).length, color: '#84cc16' },
    { range: '> 5000', count: data.filter(d => d['Toxicity Value'] >= 5000).length, color: '#22c55e' },
  ].filter(d => d.count > 0);

  // Calculate statistics
  const toxicityValues = data.map(d => d['Toxicity Value']);
  const stats = {
    total: data.length,
    min: toxicityValues.length > 0 ? Math.min(...toxicityValues) : 0,
    max: toxicityValues.length > 0 ? Math.max(...toxicityValues) : 0,
    avg: toxicityValues.length > 0 ? (toxicityValues.reduce((a, b) => a + b, 0) / toxicityValues.length).toFixed(1) : 0,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Toxicity Data Dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Chicken Oral Acute Toxicity LD50 - Statistical Overview
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-500">Total Records</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.min}</div>
          <div className="text-xs text-slate-500">Min LD50 (mg/kg)</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.max}</div>
          <div className="text-xs text-slate-500">Max LD50 (mg/kg)</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.avg}</div>
          <div className="text-xs text-slate-500">Average LD50</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Risk Level Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value} records (${props.payload.range})`,
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Toxicity Range Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">LD50 Value Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rangeData} margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} records`, 'Count']}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {rangeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {(riskDistribution.High || 0) > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
          <div className="text-red-500 mr-3 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-red-900">High Toxicity Alert</h4>
            <p className="text-sm text-red-800 mt-1">
              <strong>{riskDistribution.High}</strong> chemical(s) classified as <strong>High Risk</strong> (LD50 &lt; 50 mg/kg).
              These substances require careful handling and proper safety measures.
            </p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
        <div className="text-blue-500 mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-blue-900">About LD50</h4>
          <p className="text-sm text-blue-800 mt-1">
            LD50 (Lethal Dose 50%) is the amount of a substance required to cause death in 50% of test animals (chicken, oral administration).
            Lower values indicate higher toxicity. Data source: Supabase database "Acute Toxicity_chicken_oral_LD50".
          </p>
        </div>
      </div>
    </div>
  );
};
