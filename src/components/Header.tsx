/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Maximize2, UserCircle, Bell } from 'lucide-react';
import { getMenuItemCategory } from './Sidebar';

interface HeaderProps {
  activeItem: string;
}

export default function Header({ activeItem }: HeaderProps) {
  const itemCategory = getMenuItemCategory(activeItem);

  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-slate-400">配置</span>
        {itemCategory !== '配置' && (
          <>
            <span>/</span>
            <span className="text-slate-400">{itemCategory === '管理' ? '管理' : itemCategory}</span>
          </>
        )}
        <span>/</span>
        <span className="text-slate-600 font-medium">{activeItem}</span>
      </div>

      <div className="flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
        <Maximize2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
        <div className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-slate-50">
          <UserCircle className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600">admin_RADIUS_USER</span>
        </div>
      </div>
    </header>
  );
}
