import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Pollutant, RiskLevel } from '../types';

interface DashboardProps {
  pollutants: Pollutant[];
}

export const Dashboard: React.FC<DashboardProps> = ({ pollutants }) => {
  const riskCounts = pollutants.reduce((acc, p) => {
    acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'High Risk', value: riskCounts[RiskLevel.HIGH] || 0, color: '#ef4444' },
    { name: 'Medium Risk', value: riskCounts[RiskLevel.MEDIUM] || 0, color: '#f59e0b' },
    { name: 'Low Risk', value: riskCounts[RiskLevel.LOW] || 0, color: '#22c55e' },
  ].filter(d => d.value > 0);

  const categoryCounts = pollutants.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryCounts).map(([key, value]) => ({ name: key, count: value }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Risk Assessment Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Risk Level Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            Total Pollutants: {pollutants.length}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Pollutants by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
        <div className="text-blue-500 mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
            <h4 className="font-semibold text-blue-900">System Alert</h4>
            <p className="text-sm text-blue-800 mt-1">
                {riskCounts[RiskLevel.HIGH] || 0} pollutants are classified as <strong>High Risk</strong> due to endocrine disruption potential or low LC50 values. Recommended immediate review of discharge pathways.
            </p>
        </div>
      </div>
    </div>
  );
};
