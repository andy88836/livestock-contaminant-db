import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PollutantList } from './components/PollutantList';
import { PollutantDetail } from './components/PollutantDetail';
import { ToxicityComparison } from './components/ToxicityComparison';
import { Pollutant, ViewState } from './types';
import * as mockDb from './services/mockDb';

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [pollutants, setPollutants] = useState<Pollutant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const data = await mockDb.getPollutants();
    setPollutants(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectPollutant = (id: string) => {
    setSelectedId(id);
    setView('DETAIL');
  };

  const handleBack = () => {
    setSelectedId(null);
    setCompareIds([]);
    setView('LIST');
  };

  const handleCompare = (ids: string[]) => {
      setCompareIds(ids);
      setView('COMPARE');
  };

  const handleExport = async () => {
      const data = await mockDb.getFullExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pollutants_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Database exported successfully (JSON format).');
  };

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading Database...</div>;

    switch (view) {
      case 'DASHBOARD':
        return <Dashboard pollutants={pollutants} />;
      case 'LIST':
        return (
            <PollutantList 
                pollutants={pollutants} 
                onSelect={handleSelectPollutant} 
                onRefresh={refreshData}
                onCompare={handleCompare}
            />
        );
      case 'DETAIL':
        const selected = pollutants.find(p => p.id === selectedId);
        if (!selected) return <div>Pollutant not found</div>;
        return <PollutantDetail pollutant={selected} onBack={handleBack} />;
      case 'COMPARE':
          return <ToxicityComparison ids={compareIds} pollutants={pollutants} onBack={handleBack} />;
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <Layout currentView={view} setView={setView} onExport={handleExport}>
        {renderContent()}
    </Layout>
  );
}
