/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LeftMiniBar from './components/LeftMiniBar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProbeManagement from './components/ProbeManagement';
import RuleManagement from './components/RuleManagement';

export default function App() {
  const [activeItem, setActiveItem] = useState('探针管理');

  const renderContent = () => {
    switch (activeItem) {
      case '探针管理':
        return <ProbeManagement />;
      case '应用管理':
        return <RuleManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
               <div className="w-8 h-8 border-2 border-slate-200 border-dashed rounded-full"></div>
            </div>
            <span>{activeItem} 正在开发中...</span>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans selection:bg-sky-100 selection:text-sky-900 text-slate-800">
      {/* 1. Far Left Mini Sidebar */}
      <LeftMiniBar />

      {/* 2. Main Navigation Sidebar */}
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeItem={activeItem} />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {renderContent()}
        </main>
      </div>

      {/* Floating Robot Background Helper (Visual only) */}
      <div className="fixed bottom-4 right-4 w-12 h-12 bg-sky-100 border border-sky-200 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
        <div className="w-8 h-8 bg-sky-400 rounded-full opacity-20 absolute animate-ping"></div>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-sky-500 fill-current">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
        </svg>
      </div>
    </div>
  );
}
