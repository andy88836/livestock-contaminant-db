import React, { ReactNode } from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: ReactNode;
  currentView: ViewState;
  setView: (v: ViewState) => void;
  onExport: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, onExport }) => {
  const navClass = (view: ViewState) => 
    `px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${currentView === view ? 'bg-blue-700 text-white shadow' : 'text-blue-100 hover:bg-blue-600'}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                DB
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Livestock Contaminants</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setView('DASHBOARD')} className={navClass('DASHBOARD')}>Dashboard</button>
                <button onClick={() => setView('LIST')} className={navClass('LIST')}>Directory</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onExport}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 flex items-center"
                 >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Data
                 </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-400">
            © 2024 Livestock Emerging Contaminant Database System. 
            <br/>Designed for environmental risk assessment. Prototype Build.
          </p>
        </div>
      </footer>
    </div>
  );
};
