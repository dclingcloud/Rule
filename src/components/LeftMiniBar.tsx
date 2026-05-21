/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart, 
  Box, 
  Cpu, 
  Database, 
  LayoutDashboard, 
  Search, 
  Shield, 
  Settings,
  Brain,
  Layers,
  Monitor,
  Menu
} from 'lucide-react';

export default function LeftMiniBar() {
  const items = [
    { icon: LayoutDashboard },
    { icon: Search },
    { icon: BarChart },
    { icon: Box },
    { icon: Layers },
    { icon: Shield },
    { icon: Brain },
    { icon: Monitor },
  ];

  return (
    <div className="w-12 h-screen bg-[#1e293b] flex flex-col items-center py-4 gap-6 flex-shrink-0">
      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mb-4">
        <span className="text-white text-[10px] font-bold">NGPM</span>
      </div>
      {items.map((item, idx) => (
        <item.icon 
          key={idx} 
          className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" 
        />
      ))}
      <div className="mt-auto flex flex-col gap-6 items-center">
        <Menu className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}
