/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ChevronDown, 
  ChevronRight,
  ClipboardList,
  Network,
  Activity,
  FileText,
  Shield,
  Search,
  HardDrive,
  Users,
  Settings,
  Database,
  Brain,
  Link,
  TableProperties
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_DATA: { category: string; items: string[] }[] = [
  {
    category: '管理',
    items: ['探针管理', '接口管理', '探针健康', '探针巡检']
  },
  {
    category: '配置',
    items: ['虚链路配置', '分析组配置', '应用配置', '裁包配置', '本地网络配置']
  },
  {
    category: '数据',
    items: ['离线分析', '实时基线', '智能基线']
  },
  {
    category: '用户',
    items: ['用户', '权限组配置', '大屏访问策略']
  },
  {
    category: '系统',
    items: ['集成', '系统配置', '定时任务']
  },
  {
    category: '第三方接口配置',
    items: ['CMDB接口', '日志对接']
  },
  {
    category: '智能体',
    items: ['智能体配置', '工作流配置']
  }
];

export const getMenuItemCategory = (item: string) => {
  for (const cat of MENU_DATA) {
    if (cat.items.includes(item)) return cat.category;
  }
  return '管理';
};

interface SidebarProps {
  onSelect: (item: string) => void;
  activeItem: string;
}

export default function Sidebar({ onSelect, activeItem }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['管理', '配置', '数据', '用户', '系统', '第三方接口配置', '智能体']);
  const itemCategory = getMenuItemCategory(activeItem);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="w-56 h-screen bg-white border-r border-slate-200 overflow-y-auto no-scrollbar flex-shrink-0">
      <div className="p-4 flex items-center gap-2 border-b border-slate-100">
        <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-slate-800">配置</span>
        <div className="ml-auto flex gap-1">
          <span className="text-slate-400 text-xs">
            / {itemCategory === '配置' ? activeItem : `${itemCategory} / ${activeItem}`}
          </span>
        </div>
      </div>

      <div className="py-2">
        {MENU_DATA.map((cat) => (
          <div key={cat.category} className="mb-1">
            <button 
              onClick={() => toggleCategory(cat.category)}
              className="w-full px-4 py-2 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-semibold">{cat.category}</span>
              {expandedCategories.includes(cat.category) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <AnimatePresence>
              {expandedCategories.includes(cat.category) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => onSelect(item)}
                      className={`w-full pl-8 pr-4 py-2 text-left text-sm transition-colors ${
                        activeItem === item 
                          ? 'text-sky-500 bg-sky-50 border-r-2 border-sky-500' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
