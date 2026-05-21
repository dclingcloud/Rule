/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Plus, RotateCcw, Trash2, Edit, Play, Pause, Monitor, Settings2, Database, Cpu } from 'lucide-react';
import { useState } from 'react';

export default function ProbeManagement() {
  const [activeTab, setActiveTab] = useState('探针管理');

  return (
    <div className="p-4 bg-slate-50 min-h-full">
      {/* Top Heading */}
      <div className="mb-4 bg-white p-4 py-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-2">
            探针监控
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-mono px-1.5 py-0.5 rounded border border-emerald-200/50 font-normal">
              ENGINE ACTIVE
            </span>
          </h2>
          <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0 border border-slate-200/55">
            {['探针管理', '版本信息'].map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/30' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Central Control Section */}
        <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">中控</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-2 font-medium">序号</th>
                  <th className="px-4 py-2 font-medium">中控IP地址</th>
                  <th className="px-4 py-2 font-medium">中控状态</th>
                  <th className="px-4 py-2 font-medium underline decoration-dotted">系统时间</th>
                  <th className="px-4 py-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-50">
                <tr>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">172.17.3.2</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>在线</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-500 text-[10px] font-bold mr-1">NTP</span>
                    2026-05-07 15:43:58
                  </td>
                  <td className="px-4 py-3">
                    <Monitor className="w-4 h-4 text-slate-400 cursor-pointer hover:text-sky-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Probe Section */}
        <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-800">探针</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3 py-1.5 bg-sky-500 text-white rounded text-sm flex items-center gap-1 hover:bg-sky-600">
                <Plus className="w-4 h-4" />
                <span>添加探针</span>
              </button>
              <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm flex items-center gap-1 hover:bg-slate-50">
                <RotateCcw className="w-4 h-4" />
                <span>批量同步</span>
              </button>
              <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-sm flex items-center gap-1 hover:bg-slate-50">
                <Trash2 className="w-4 h-4" />
                <span>批量删除</span>
              </button>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜索探针名称或IP"
                  className="pl-9 pr-3 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium whitespace-nowrap">
                <tr>
                  <th className="px-4 py-2 w-10">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-2 font-medium">序号</th>
                  <th className="px-4 py-2 font-medium">探针名称</th>
                  <th className="px-4 py-2 font-medium">探针类型</th>
                  <th className="px-4 py-2 font-medium">探针IP地址</th>
                  <th className="px-4 py-2 font-medium">探针状态</th>
                  <th className="px-4 py-2 font-medium underline decoration-dotted">系统时间</th>
                  <th className="px-4 py-2 font-medium">配置同步</th>
                  <th className="px-4 py-2 font-medium">分析任务</th>
                  <th className="px-4 py-2 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-50 whitespace-nowrap">
                {[
                  { id: 1, name: 'Probe', type: '经典', ip: '172.17.3.2', status: '在线', sync: '已同步', task: '运行中' },
                  { id: 2, name: '云探针', type: '云内流量采集', ip: '127.0.0.12', status: '在线', sync: '已同步', task: '运行中' },
                  { id: 3, name: '前置计算', type: '云内流量采集(ECU)', ip: '127.0.0.132', status: '在线', sync: '-', task: '-' },
                ].map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.name === 'Probe' ? (
                          <HardDrive className="w-4 h-4 text-sky-500" />
                        ) : item.name === '云探针' ? (
                          <Database className="w-4 h-4 text-sky-500" />
                        ) : (
                          <Cpu className="w-4 h-4 text-sky-500" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3 underline decoration-slate-200">{item.ip}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-green-500">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className="text-green-500 text-[10px] font-bold mr-1">NTP</span>
                      2026-05-07 15:43:58
                    </td>
                    <td className="px-4 py-3">
                      {item.sync !== '-' ? (
                        <div className="flex items-center gap-1 text-sky-500 border border-sky-200 px-1 rounded bg-sky-50 w-fit text-[10px]">
                          <RotateCcw className="w-3 h-3" />
                          <span>同步</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                       {item.task !== '-' ? (
                        <div className="flex items-center gap-1 text-white bg-green-500 px-2 py-0.5 rounded w-fit text-[10px]">
                          <Pause className="w-3 h-3 fill-current" />
                          <span>运行中</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Edit className="w-4 h-4 cursor-pointer hover:text-sky-500" />
                        <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                        <Pause className="w-4 h-4 cursor-pointer hover:text-amber-500" />
                        <Monitor className="w-4 h-4 cursor-pointer hover:text-sky-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              本页记录从 <span className="font-medium text-slate-800">1</span> 到 <span className="font-medium text-slate-800">3</span>, 总数 <span className="font-medium text-slate-800">3</span> 条
            </div>
            <div className="flex items-center gap-4">
              <select className="border border-slate-200 rounded px-2 py-1 bg-white outline-none">
                <option>100条/页</option>
              </select>
              <div className="flex items-center gap-1 cursor-pointer">
                 <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50">
                    &lt;
                 </button>
                 <button className="w-6 h-6 bg-sky-500 text-white rounded flex items-center justify-center">1</button>
                 <button className="p-1 rounded hover:bg-slate-100 disabled:opacity-50">
                    &gt;
                 </button>
              </div>
              <div className="flex items-center gap-1">
                <span>前往</span>
                <input type="text" value="1" className="w-8 border border-slate-200 rounded px-1 py-1 text-center outline-none" readOnly />
                <span>页</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const HardDrive = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01"/><path d="M10 18h.01"/><path d="M2 9v2c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V9c0-3.5-3-6-7-6h-4c-4 0-7 2.5-7 6Z"/></svg>
);
