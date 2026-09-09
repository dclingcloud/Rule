/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ChevronsRight, 
  Search, 
  BarChart, 
  Box, 
  Database, 
  Shield, 
  Settings,
  Brain,
  Layers,
  Monitor,
  Menu
} from 'lucide-react';

export default function LeftMiniBar() {
  const items = [
    { icon: ChevronsRight },
    { icon: Search },
    { icon: BarChart },
    { icon: Box },
    { icon: Layers },
    { icon: Shield },
    { icon: Brain },
    { icon: Monitor },
  ];

  return (
    <div className="w-12 bg-[#3c3c3c] flex flex-col items-center py-3 gap-5 flex-shrink-0 overflow-y-auto no-scrollbar">
      {items.map((item, idx) => (
        <item.icon 
          key={idx} 
          className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" 
        />
      ))}
      <div className="mt-auto flex flex-col gap-5 items-center">
        <Menu className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}
