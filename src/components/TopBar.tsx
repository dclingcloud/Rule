/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Maximize2, UserCircle } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-12 bg-[#2b2b2b] flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">NGPM</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-slate-300">
        <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        <div className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-white/10 transition-colors">
          <UserCircle className="w-5 h-5" />
          <span className="text-sm">admin</span>
        </div>
      </div>
    </header>
  );
}