import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ToxicityTable } from './components/ToxicityTable';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');

  const renderContent = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'TOXICITY':
        return <ToxicityTable />;
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderContent()}
    </Layout>
  );
}
