/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Search, 
  Plus, 
  RotateCcw, 
  Trash2, 
  Edit, 
  Upload, 
  Download, 
  FileDown, 
  X,
  Settings2,
  Settings,
  List,
  Clock,
  Layout,
  Wrench,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowUpToLine,
  ArrowDownToLine,
  ChevronRight,
  Info,
  FileText,
  GripVertical,
  Filter,
  Network,
  Activity,
  Cpu,
  Database,
  Layers,
  Shield
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PROBE_OPTIONS = [
  { value: '探针(Retx):接口1', label: '探针(Retx):接口1' },
  { value: '探针(SRV6):接口1', label: '探针(SRV6):接口1' },
  { value: '探针(重传):接口1', label: '探针(重传):接口1' },
];

const PROBE_SOURCE_OPTIONS = [
  { value: '实时探针接口', label: '实时探针接口' },
  { value: '离线任务', label: '离线任务' },
];

const ENABLED_OPTIONS = [
  { value: 'enabled', label: '启用' },
  { value: 'disabled', label: '不启用' },
];

type SearchableSelectOption = { value: string; label: string };

function SearchableSelect({
  value,
  options,
  onChange,
  placeholder = '请选择',
  className,
  disabled = false,
  menuZIndex = 80,
}: {
  value: string;
  options: SearchableSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  menuZIndex?: number;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(normalizedSearch) ||
      o.value.toLowerCase().includes(normalizedSearch),
  );

  const closeMenu = () => {
    setOpen(false);
    setSearch('');
  };

  useEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuRect({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  return (
    <>
      <div ref={triggerRef} className={`relative ${className || 'w-full max-w-[220px] min-w-[160px]'}`}>
        <div
          onClick={() => {
            if (disabled) return;
            setOpen((prev) => !prev);
          }}
          className={`w-full min-h-[38px] border rounded-lg px-3 py-2 flex items-center justify-between transition-all select-none text-xs font-medium ${
            disabled
              ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400'
              : open
                ? 'bg-white border-sky-400 ring-2 ring-sky-100 cursor-pointer'
                : 'bg-white border-slate-200 cursor-pointer hover:border-sky-300 text-slate-700'
          }`}
        >
          <span className="truncate pr-3">{selectedLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {open && menuRect && (
        <>
          <div className="fixed inset-0" style={{ zIndex: menuZIndex - 1 }} onClick={closeMenu} />
          <div
            className="fixed bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
            style={{ top: menuRect.top, left: menuRect.left, width: menuRect.width, zIndex: menuZIndex }}
          >
            <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1.5 bg-white focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="输入检索"
                  className="flex-1 text-xs outline-none bg-transparent placeholder:text-slate-300"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2.5 text-xs text-slate-400">无匹配项</div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        closeMenu();
                      }}
                      className={`w-full px-3 py-2.5 text-left text-xs flex items-center gap-2 transition-colors ${
                        isSelected ? 'text-sky-600 font-semibold' : 'text-slate-700'
                      } hover:bg-sky-500 hover:text-white hover:font-medium`}
                    >
                      <span className="w-3.5 shrink-0">{isSelected ? '✓' : ''}</span>
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const L7_MODAL_BODY = 'px-8 py-6 overflow-y-auto text-sm space-y-6';
const L7_MODAL_FOOTER = 'px-8 py-5 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/40';
const L7_MODAL_HEADER = 'px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0';
const L7_CONFIG_INPUT = 'w-full max-w-[220px] min-w-[120px] border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100';
const L7_CONFIG_INPUT_SM = 'w-28 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100';

function L7EnabledSelect({
  value,
  onChange,
  className,
}: {
  value: 'enabled' | 'disabled';
  onChange: (value: 'enabled' | 'disabled') => void;
  className?: string;
}) {
  return (
    <SearchableSelect
      value={value}
      options={ENABLED_OPTIONS}
      onChange={(v) => onChange(v as 'enabled' | 'disabled')}
      className={className}
    />
  );
}

function L7ConfigFormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-6 py-2.5">
      <span className="text-sm text-slate-600 w-[280px] shrink-0 text-left leading-snug pt-2">{label}</span>
      <div className="min-w-0 flex items-center flex-1">{children}</div>
    </div>
  );
}

function L7ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 px-6 py-6">
      <div className="text-sm font-semibold text-slate-700 -mt-9 ml-3 bg-white px-2 inline-block mb-1">{title}</div>
      <div className="pt-1">{children}</div>
    </div>
  );
}

function L7DataSourceRow({
  clickhouse,
  mongodb,
  onChange,
}: {
  clickhouse: boolean;
  mongodb: boolean;
  onChange: (next: { clickhouse: boolean; mongodb: boolean }) => void;
}) {
  return (
    <L7ConfigFormRow label="数据源调度">
      <div className="flex flex-wrap items-center gap-8">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={clickhouse}
            onChange={(e) => onChange({ clickhouse: e.target.checked, mongodb })}
            className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 w-4 h-4"
          />
          ClickHouse
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
          <input
            type="checkbox"
            checked={mongodb}
            onChange={(e) => onChange({ clickhouse, mongodb: e.target.checked })}
            className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 w-4 h-4"
          />
          MongoDB
        </label>
      </div>
    </L7ConfigFormRow>
  );
}

function L7ConfigSaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2.5 text-sm bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors shadow-sm"
    >
      修改
    </button>
  );
}

export default function RuleManagement() {
  const [protocol, setProtocol] = useState('IPV4应用');
  const [activeTab, setActiveTab] = useState('自定义应用(TCP)');
  const L7_GROUP_PAGE_SIZE = 15;
  const [probeSourceType, setProbeSourceType] = useState('实时探针接口');
  const [selectedProbe, setSelectedProbe] = useState('探针(Retx):接口1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [activeMappingRule, setActiveMappingRule] = useState<any>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activePriorityMenu, setActivePriorityMenu] = useState<{
    id: number;
    index: number;
    top: number;
    left: number;
  } | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // States for the Import configuration modal (上传文件)
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingDeleteRule, setPendingDeleteRule] = useState<{ id: number; name: string } | null>(null);
  const [pendingEnableToggle, setPendingEnableToggle] = useState<{ id: number; name: string; nextEnabled: boolean } | null>(null);
  const [importSelectedInterfaces, setImportSelectedInterfaces] = useState<string[]>(['Probe / Lab']);
  const [importConflictStrategy, setImportConflictStrategy] = useState<'merge' | 'overwrite'>('merge');
  const [importedFile, setImportedFile] = useState<{ name: string; size: number } | null>(null);
  const [isImportProbeDropdownOpen, setIsImportProbeDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  type DnsConfig = {
    dnsResolution: 'enabled' | 'disabled';
    clickhouse: boolean;
    mongodb: boolean;
  };

  const defaultDnsConfig: DnsConfig = {
    dnsResolution: 'enabled',
    clickhouse: true,
    mongodb: false,
  };

  const [showDnsConfigModal, setShowDnsConfigModal] = useState(false);
  const [dnsConfigDraft, setDnsConfigDraft] = useState<DnsConfig>(defaultDnsConfig);
  const [l7ProtocolConfigs, setL7ProtocolConfigs] = useState<Record<string, DnsConfig>>({
    IPV4应用: { ...defaultDnsConfig },
    IPV6应用: { ...defaultDnsConfig },
    混栈应用: { ...defaultDnsConfig },
  });

  type EnabledFlag = 'enabled' | 'disabled';

  type HttpConfig = {
    fileSplitCycleHours: string;
    fileValidityHours: string;
    httpParsing: EnabledFlag;
    truncatedPacketAnalysis: EnabledFlag;
    parseFirstHttpOnly: EnabledFlag;
    onlyRuleMatchUrl: EnabledFlag;
    httpRequestHeaderDisplay: EnabledFlag;
    sessionRateLimit: string;
    clickhouse: boolean;
    mongodb: boolean;
    fileRestore: EnabledFlag;
    fileSizeMin: string;
    fileSizeMax: string;
    fileRestoreMode: string;
  };

  const defaultHttpConfig: HttpConfig = {
    fileSplitCycleHours: '24',
    fileValidityHours: '168',
    httpParsing: 'enabled',
    truncatedPacketAnalysis: 'disabled',
    parseFirstHttpOnly: 'disabled',
    onlyRuleMatchUrl: 'disabled',
    httpRequestHeaderDisplay: 'enabled',
    sessionRateLimit: '-1',
    clickhouse: true,
    mongodb: false,
    fileRestore: 'disabled',
    fileSizeMin: '',
    fileSizeMax: '',
    fileRestoreMode: '全部',
  };

  const [showHttpConfigModal, setShowHttpConfigModal] = useState(false);
  const [httpConfigDraft, setHttpConfigDraft] = useState<HttpConfig>(defaultHttpConfig);
  const [l7HttpConfigs, setL7HttpConfigs] = useState<Record<string, HttpConfig>>({
    IPV4应用: { ...defaultHttpConfig },
    IPV6应用: { ...defaultHttpConfig },
    混栈应用: { ...defaultHttpConfig },
  });

  type DbEnabledConfig<T extends string> = Record<T, EnabledFlag> & {
    clickhouse: boolean;
    mongodb: boolean;
  };

  type MysqlConfigKeys =
    | 'mysqlParsing'
    | 'recordSelect'
    | 'recordUpdate'
    | 'recordDelete'
    | 'recordInsert'
    | 'recordExecute'
    | 'recordPrepare'
    | 'recordOtherSql';

  const defaultMysqlConfig: DbEnabledConfig<MysqlConfigKeys> = {
    mysqlParsing: 'enabled',
    recordSelect: 'enabled',
    recordUpdate: 'enabled',
    recordDelete: 'enabled',
    recordInsert: 'enabled',
    recordExecute: 'enabled',
    recordPrepare: 'disabled',
    recordOtherSql: 'disabled',
    clickhouse: true,
    mongodb: false,
  };

  const [showMysqlConfigModal, setShowMysqlConfigModal] = useState(false);
  const [mysqlConfigDraft, setMysqlConfigDraft] = useState<DbEnabledConfig<MysqlConfigKeys>>(defaultMysqlConfig);
  const [l7MysqlConfigs, setL7MysqlConfigs] = useState<Record<string, DbEnabledConfig<MysqlConfigKeys>>>({
    IPV4应用: { ...defaultMysqlConfig },
    IPV6应用: { ...defaultMysqlConfig },
    混栈应用: { ...defaultMysqlConfig },
  });

  type OracleConfigKeys = 'oracleParsing' | 'recordSelect' | 'recordUpdate' | 'recordDelete' | 'recordInsert' | 'recordOtherSql';

  const defaultOracleConfig: DbEnabledConfig<OracleConfigKeys> = {
    oracleParsing: 'enabled',
    recordSelect: 'enabled',
    recordUpdate: 'enabled',
    recordDelete: 'enabled',
    recordInsert: 'enabled',
    recordOtherSql: 'disabled',
    clickhouse: true,
    mongodb: false,
  };

  const [showOracleConfigModal, setShowOracleConfigModal] = useState(false);
  const [oracleConfigDraft, setOracleConfigDraft] = useState<DbEnabledConfig<OracleConfigKeys>>(defaultOracleConfig);
  const [l7OracleConfigs, setL7OracleConfigs] = useState<Record<string, DbEnabledConfig<OracleConfigKeys>>>({
    IPV4应用: { ...defaultOracleConfig },
    IPV6应用: { ...defaultOracleConfig },
    混栈应用: { ...defaultOracleConfig },
  });

  type PgConfigKeys = 'pgParsing';

  const defaultPgConfig: DbEnabledConfig<PgConfigKeys> = {
    pgParsing: 'enabled',
    clickhouse: true,
    mongodb: false,
  };

  const [showPgConfigModal, setShowPgConfigModal] = useState(false);
  const [pgConfigDraft, setPgConfigDraft] = useState<DbEnabledConfig<PgConfigKeys>>(defaultPgConfig);
  const [l7PgConfigs, setL7PgConfigs] = useState<Record<string, DbEnabledConfig<PgConfigKeys>>>({
    IPV4应用: { ...defaultPgConfig },
    IPV6应用: { ...defaultPgConfig },
    混栈应用: { ...defaultPgConfig },
  });

  type SslDetailRecord = '全记录' | '只记录SNI' | '只记录证书';

  type SslConfig = {
    sslParsing: EnabledFlag;
    keywordDomainStats: EnabledFlag;
    clickhouse: boolean;
    mongodb: boolean;
    detailRecord: SslDetailRecord;
  };

  type SslDomainModel = {
    id: string;
    name: string;
    pattern: string;
    isRegex: boolean;
  };

  const defaultSslConfig: SslConfig = {
    sslParsing: 'enabled',
    keywordDomainStats: 'enabled',
    clickhouse: true,
    mongodb: false,
    detailRecord: '全记录',
  };

  const defaultSslDomainModels: SslDomainModel[] = [
    { id: 'ssl-domain-model-all1', name: 'all1', pattern: '.*', isRegex: true },
  ];

  const [showSslConfigModal, setShowSslConfigModal] = useState(false);
  const [sslConfigDraft, setSslConfigDraft] = useState<SslConfig>(defaultSslConfig);
  const [sslDomainModelsDraft, setSslDomainModelsDraft] = useState<SslDomainModel[]>(defaultSslDomainModels);
  const [sslNewDomainModel, setSslNewDomainModel] = useState<{ name: string; pattern: string; isRegex: boolean }>({
    name: '',
    pattern: '',
    isRegex: false,
  });
  const [l7SslConfigs, setL7SslConfigs] = useState<Record<string, { config: SslConfig; domainModels: SslDomainModel[] }>>({
    IPV4应用: { config: { ...defaultSslConfig }, domainModels: [...defaultSslDomainModels] },
    IPV6应用: { config: { ...defaultSslConfig }, domainModels: [...defaultSslDomainModels] },
    混栈应用: { config: { ...defaultSslConfig }, domainModels: [...defaultSslDomainModels] },
  });


  // Dynamic Column Configurations State
  const [columns, setColumns] = useState<any[]>([
    { id: 'index', name: '序号', visible: true },
    { id: 'ruleId', name: '应用ID', visible: true },
    { id: 'name', name: '应用名称', visible: true },
    { id: 'srcIp', name: '源IP', visible: false },
    { id: 'dstIp', name: '目的IP', visible: true },
    { id: 'srcPort', name: '源端口', visible: false },
    { id: 'dstPort', name: '目的端口', visible: true },
  ]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [colDragOverIndex, setColDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === 'IP应用') {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === 'srcIp' || col.id === 'dstIp') return { ...col, visible: true };
          if (col.id === 'srcPort' || col.id === 'dstPort') return { ...col, visible: false };
          return col;
        })
      );
      return;
    }
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === 'srcIp' || col.id === 'srcPort') return { ...col, visible: false };
        if (col.id === 'dstIp' || col.id === 'dstPort') return { ...col, visible: true };
        return col;
      })
    );
  }, [activeTab]);

  const handleColDragStart = (e: any, index: number) => {
    e.dataTransfer.setData('text/col-index', String(index));
  };

  const handleColDrop = (e: any, destIndex: number) => {
    e.preventDefault();
    const srcIndex = parseInt(e.dataTransfer.getData('text/col-index'));
    if (!isNaN(srcIndex) && srcIndex !== destIndex) {
      const updated = [...columns];
      const [dragged] = updated.splice(srcIndex, 1);
      updated.splice(destIndex, 0, dragged);
      setColumns(updated);
    }
    setColDragOverIndex(null);
  };

  // Dynamic Tabs definition per prompt instructions
  const getTabs = (p: string) => {
    if (p === '混栈应用') {
      // Dual-stack doesn't require "Known Applications", it has Custom (TCP/UDP) and L7 Apps. Let's support IP App as well in case they define it
      return ['自定义应用(TCP)', '自定义应用(UDP)', 'IP应用', 'L7应用'];
    }
    return ['自定义应用(TCP)', '自定义应用(UDP)', '已知应用(TCP)', '已知应用(UDP)', 'IP应用', 'L7应用'];
  };

  const tabs = getTabs(protocol);
  const isKnownApp = activeTab.includes('已知应用');
  const l7GroupOptions = ['HTTP', 'DNS', 'SSL', 'Oracle', 'MySQL', 'PostgreSQL'];
  const ipProtocolOptions = ['ICMP', 'IGMP', 'ESP', 'AH', 'EIGRP'];

  const getDefaultProtocolTypeByTab = (tab: string) => {
    if (tab.includes('TCP')) return 'TCP';
    if (tab.includes('UDP')) return 'UDP';
    if (tab.includes('IP应用')) return 'ICMP';
    return 'TCP';
  };

  const getIpProtocolOptionsForForm = (current: string) => {
    if (current && !ipProtocolOptions.includes(current)) {
      return [...ipProtocolOptions, current];
    }
    return ipProtocolOptions;
  };

  // Ensure activeTab is valid when protocol switches
  const handleProtocolChange = (p: string) => {
    setProtocol(p);
    setSelectedRuleIds([]);
    const newTabs = getTabs(p);
    if (!newTabs.includes(activeTab)) {
      setActiveTab(newTabs[0]); // Reset to first tab if current disappears
    }
  };

  // Full-featured Reactive Rules State
  const [allRules, setAllRules] = useState<any[]>([
    // IPV4 TCP
    { id: 1, ruleId: '22894', name: 'IPv4-Custom-Web', protocol_type: 'TCP', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 1, protocol: 'IPV4应用', tab: '自定义应用(TCP)', description: '基于TCP协议的Web服务数据流控规则', srcIp: '192.168.1.0/24', srcPort: 'any', dstIp: '10.0.0.5', dstPort: '80, 443' },
    { id: 2, ruleId: '22893', name: 'IPv4-Custom-DB-Sync', protocol_type: 'TCP', port: '探针(Retx):接口1', priority: 2, protocol: 'IPV4应用', tab: '自定义应用(TCP)', description: '高优先级数据库复制链路数据分析', srcIp: '192.168.1.100', srcPort: 'any', dstIp: '10.50.60.2', dstPort: '3306' },
    { id: 3, ruleId: '22851', name: 'IPv4-Custom-SSH', protocol_type: 'TCP', port: '探针(SRV6):接口1; 探针(重传):接口1', priority: 3, protocol: 'IPV4应用', tab: '自定义应用(TCP)', description: '远程管理端口堡垒机安全流监控', srcIp: '10.22.4.0/22', srcPort: 'any', dstIp: '10.22.5.11', dstPort: '22' },
    // IPV4 UDP
    { id: 4, ruleId: '22892', name: 'IPv4-Custom-DNS', protocol_type: 'UDP', port: '探针(Retx):接口1; 探针(重传):接口1', priority: 4, protocol: 'IPV4应用', tab: '自定义应用(UDP)', description: '内网解析DNS低时延数据探针流', srcIp: 'any', srcPort: 'any', dstIp: '114.114.114.114', dstPort: '53' },
    { id: 5, ruleId: '22852', name: 'IPv4-Custom-Syslog', protocol_type: 'UDP', port: '探针(重传):接口1', priority: 5, protocol: 'IPV4应用', tab: '自定义应用(UDP)', description: '统一日志服务器中继队列流控', srcIp: '172.16.8.99', srcPort: 'any', dstIp: '172.16.8.1', dstPort: '514' },
    // IPV4 Known TCP
    { id: 6, ruleId: '10001', name: 'IPv4-Known-HTTP', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: 'IPV4应用', tab: '已知应用(TCP)', description: '已知传统HTTP网页业务分析', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '80' },
    { id: 7, ruleId: '10002', name: 'IPv4-Known-FTP', protocol_type: 'TCP', port: '所有接口', priority: 2, protocol: 'IPV4应用', tab: '已知应用(TCP)', description: '已知传统FTP file transfer端口提取', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '21' },
    // IPV4 Known UDP
    { id: 8, ruleId: '10011', name: 'IPv4-Known-SNMP', protocol_type: 'UDP', port: '所有接口', priority: 1, protocol: 'IPV4应用', tab: '已知应用(UDP)', description: '已知标准SNMP网管轮询规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '161, 162' },
    { id: 9, ruleId: '10012', name: 'IPv4-Known-DHCP', protocol_type: 'UDP', port: '所有接口', priority: 2, protocol: 'IPV4应用', tab: '已知应用(UDP)', description: '已知DHCP地址分配报文镜像规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '67, 68' },
    // IPV4 IP Layer
    { id: 10, ruleId: '40001', name: 'IPv4-IP-ICMP-Rule', protocol_type: 'ICMP', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 1, protocol: 'IPV4应用', tab: 'IP应用', description: 'Ping监控ICMP流抓取规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 11, ruleId: '40002', name: 'IPv4-IP-OSPF-Rule', protocol_type: 'OSPF', port: '探针(Retx):接口1', priority: 2, protocol: 'IPV4应用', tab: 'IP应用', description: 'OSPF动态路由状态分析过滤器', srcIp: 'any', srcPort: 'any', dstIp: '224.0.0.5', dstPort: 'any' },
    { id: 12, ruleId: '40003', name: 'IPv4-IP-GRE-Rule', protocol_type: 'GRE', port: '探针(SRV6):接口1; 探针(重传):接口1', priority: 3, protocol: 'IPV4应用', tab: 'IP应用', description: 'GRE隧道封装协议流控模块', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 41, ruleId: '40101', name: 'ICMP (ICMP)', protocol_type: 'ICMP', port: '所有接口', priority: 4, protocol: 'IPV4应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：ICMP', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 42, ruleId: '40102', name: 'multicast_test (MULTICAST)', protocol_type: 'MULTICAST', port: '所有接口', priority: 5, protocol: 'IPV4应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：多播测试', srcIp: 'any', srcPort: 'any', dstIp: '224.0.0.0/4', dstPort: 'any' },
    { id: 43, ruleId: '40103', name: 'unicast_test (UNICAST)', protocol_type: 'UNICAST', port: '所有接口', priority: 6, protocol: 'IPV4应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：单播测试', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 44, ruleId: '40104', name: 'ip_other', protocol_type: 'OTHER', port: '所有接口', priority: 7, protocol: 'IPV4应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：其他协议流量', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    // IPV4 L7 Layer
    { id: 13, ruleId: '70001', name: 'IPv4-L7-WeChat', protocol_type: 'TCP', port: '探针(Retx):接口1; 探针(SRV6):接口1; 探针(重传):接口1', priority: 1, protocol: 'IPV4应用', tab: 'L7应用', l7Group: 'SSL', description: '深度解析微信通讯流指纹', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 14, ruleId: '70002', name: 'IPv4-L7-Amap', protocol_type: 'TCP', port: '探针(SRV6):接口1', priority: 2, protocol: 'IPV4应用', tab: 'L7应用', l7Group: 'HTTP', description: '高德地图时空定位API数据分析', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },

    // IPV6 TCP
    { id: 15, ruleId: '60001', name: 'IPv6-Custom-Cloud', protocol_type: 'TCP', port: '探针(重传):接口1', priority: 1, protocol: 'IPV6应用', tab: '自定义应用(TCP)', description: 'IPv6原生微服务应用管理网关', srcIp: '2001:db8::/32', srcPort: 'any', dstIp: '2001:db8:1::100', dstPort: '8080' },
    { id: 16, ruleId: '60003', name: 'IPv6-Custom-API', protocol_type: 'TCP', port: '探针(重传):接口1', priority: 2, protocol: 'IPV6应用', tab: '自定义应用(TCP)', description: 'IPv6分布式集群边缘API调度', srcIp: '2001:db8::/32', srcPort: 'any', dstIp: '2001:db8:1::200', dstPort: '9000' },
    { id: 31, ruleId: '60005', name: 'IPv6-Custom-MQTT-IoT', protocol_type: 'TCP', port: '探针(SRV6):接口1', priority: 3, protocol: 'IPV6应用', tab: '自定义应用(TCP)', description: '原生IPv6物联网高吞吐设备物联控制流', srcIp: '2409:8a1e::/32', srcPort: 'any', dstIp: '2409:8a1e:100a::5', dstPort: '1883' },
    { id: 32, ruleId: '60006', name: 'IPv6-Custom-K8s-Etcd', protocol_type: 'TCP', port: '探针(Retx):接口1', priority: 4, protocol: 'IPV6应用', tab: '自定义应用(TCP)', description: '双栈数据中心Kubernetes集群内部控制Etcd调用', srcIp: 'fe80::/64', srcPort: 'any', dstIp: 'fe80::100a:2c04', dstPort: '2379, 2380' },
    // IPV6 UDP
    { id: 17, ruleId: '60002', name: 'IPv6-Custom-UDP-Log', protocol_type: 'UDP', port: '探针(重传):接口1', priority: 1, protocol: 'IPV6应用', tab: '自定义应用(UDP)', description: 'IPv6高吞吐量UDP采集总线', srcIp: 'any', srcPort: 'any', dstIp: '2001:db8:2::50', dstPort: '514' },
    { id: 33, ruleId: '60010', name: 'IPv6-Custom-CoAP-Smart', protocol_type: 'UDP', port: '探针(SRV6):接口1', priority: 2, protocol: 'IPV6应用', tab: '自定义应用(UDP)', description: '海量无线传感器IPv6终端低能耗CoAP汇聚网关', srcIp: 'any', srcPort: 'any', dstIp: '2400:3200::1', dstPort: '5683' },
    // IPV6 Known TCP
    { id: 18, ruleId: '30001', name: 'IPv6-Known-HTTPS', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: 'IPV6应用', tab: '已知应用(TCP)', description: '原生安全IPv6双绞HTTPS业务段', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '443' },
    { id: 34, ruleId: '30002', name: 'IPv6-Known-SSHv6', protocol_type: 'TCP', port: '所有接口', priority: 2, protocol: 'IPV6应用', tab: '已知应用(TCP)', description: '企业专网IPv6通道高强度SSH远程外围巡检', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '22' },
    { id: 35, ruleId: '30003', name: 'IPv6-Known-LDAPv6', protocol_type: 'TCP', port: '所有接口', priority: 3, protocol: 'IPV6应用', tab: '已知应用(TCP)', description: '统一中心域控Active Directory跨地域验证LDAP-IPv6流量', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '389, 636' },
    // IPV6 Known UDP
    { id: 19, ruleId: '30011', name: 'IPv6-Known-QUIC', protocol_type: 'UDP', port: '所有接口', priority: 1, protocol: 'IPV6应用', tab: '已知应用(UDP)', description: '已知高并发QUIC/HTTP3协议支持', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '443' },
    { id: 36, ruleId: '30012', name: 'IPv6-Known-DNSv6', protocol_type: 'UDP', port: '所有接口', priority: 2, protocol: 'IPV6应用', tab: '已知应用(UDP)', description: '公共IPv6 DNS深度解析流镜像规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: '53' },
    // IPV6 IP
    { id: 20, ruleId: '50001', name: 'IPv6-IP-ICMPv6-Rule', protocol_type: 'ICMPV6', port: '探针(重传):接口1', priority: 1, protocol: 'IPV6应用', tab: 'IP应用', description: 'IPv6发现与寻址ICMPv6基础侦听', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 21, ruleId: '50002', name: 'IPv6-IP-ESP-Tunnel', protocol_type: 'ESP', port: '探针(重传):接口1', priority: 2, protocol: 'IPV6应用', tab: 'IP应用', description: 'IPSec隧道防泄密ESP流解析器', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 37, ruleId: '50003', name: 'IPv6-IP-OSPFv3-Routing', protocol_type: 'OSPF', port: '探针(SRV6):接口1', priority: 3, protocol: 'IPV6应用', tab: 'IP应用', description: '三层多链路 OSPFv3 动态协商路由会话探针', srcIp: 'any', srcPort: 'any', dstIp: 'ff02::5, ff02::6', dstPort: 'any' },
    { id: 38, ruleId: '50004', name: 'IPv6-IP-GREv6-Tunnel', protocol_type: 'GRE', port: '探针(Retx):接口1', priority: 4, protocol: 'IPV6应用', tab: 'IP应用', description: '跨广域分公司GREv6封装底层隧道检测', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 45, ruleId: '50101', name: 'ICMP (ICMP)', protocol_type: 'ICMP', port: '所有接口', priority: 5, protocol: 'IPV6应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：ICMP', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 46, ruleId: '50102', name: 'multicast_test (MULTICAST)', protocol_type: 'MULTICAST', port: '所有接口', priority: 6, protocol: 'IPV6应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：多播测试', srcIp: 'any', srcPort: 'any', dstIp: 'ff00::/8', dstPort: 'any' },
    { id: 47, ruleId: '50103', name: 'unicast_test (UNICAST)', protocol_type: 'UNICAST', port: '所有接口', priority: 7, protocol: 'IPV6应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：单播测试', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 48, ruleId: '50104', name: 'ip_other', protocol_type: 'OTHER', port: '所有接口', priority: 8, protocol: 'IPV6应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：其他协议流量', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    // IPV6 L7
    { id: 22, ruleId: '80001', name: 'IPv6-L7-Douyin', protocol_type: 'TCP', port: '探针(重传):接口1', priority: 1, protocol: 'IPV6应用', tab: 'L7应用', l7Group: 'HTTP', description: '抖音短视频客户端点对点资源池', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 39, ruleId: '80002', name: 'IPv6-L7-Bilibili', protocol_type: 'TCP', port: '探针(SRV6):接口1', priority: 2, protocol: 'IPV6应用', tab: 'L7应用', l7Group: 'HTTP', description: '哔哩哔哩原生IPv6高画质画中画分流极速控制规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 40, ruleId: '80003', name: 'IPv6-L7-Alipay', protocol_type: 'TCP', port: '探针(Retx):接口1', priority: 3, protocol: 'IPV6应用', tab: 'L7应用', l7Group: 'SSL', description: '支付宝金融应用原生IPv6可信网络通道保障', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },

    // 混栈应用 (Dual Stack)
    { id: 23, ruleId: '9201', name: 'DS-Custom-Web-Gateway', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: '混栈应用', tab: '自定义应用(TCP)', description: '混栈入包全链路路由控制接口', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.0.1 / 2001:db8:200::1', dstPort: '80, 443', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.0.1', dstIpV6: '2001:db8:200::1' },
    { id: 24, ruleId: '9203', name: 'DS-Custom-Edge-API', protocol_type: 'TCP', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 2, protocol: '混栈应用', tab: '自定义应用(TCP)', description: '节点分流混栈策略应用', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.0.10 / 2409:8a0e:25::10', dstPort: '8443', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.0.10', dstIpV6: '2409:8a0e:25::10' },
    { id: 25, ruleId: '9202', name: 'DS-Custom-NTP-Sync', protocol_type: 'UDP', port: '探针(SRV6):接口1; 探针(重传):接口1', priority: 1, protocol: '混栈应用', tab: '自定义应用(UDP)', description: '两层多时钟同步NTP网络适配', srcIp: 'any / any', srcPort: 'any', dstIp: '119.29.29.29 / 2402:f000:1:401::8', dstPort: '123', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '119.29.29.29', dstIpV6: '2402:f000:1:401::8' },
    { id: 26, ruleId: '9204', name: 'DS-Custom-Telemetry', protocol_type: 'UDP', port: '所有接口', priority: 2, protocol: '混栈应用', tab: '自定义应用(UDP)', description: '混栈高速遥测采集任务通道', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.1.5 / 2001:db8:9999::5', dstPort: '2019', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.1.5', dstIpV6: '2001:db8:9999::5' },
    { id: 27, ruleId: '9301', name: 'DS-IP-ALL-Pass', protocol_type: 'ALL', port: '所有接口', priority: 1, protocol: '混栈应用', tab: 'IP应用', description: '放行层三层四通用控制包', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' },
    { id: 28, ruleId: '9302', name: 'DS-IP-GRE-Bridge', protocol_type: 'GRE', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 2, protocol: '混栈应用', tab: 'IP应用', description: '混栈网络GRE点对点虚拟链路', srcIp: '192.168.50.1 / fe80::5001', srcPort: 'any', dstIp: '192.168.50.2 / fe80::5002', dstPort: 'any', srcIpV4: '192.168.50.1', srcIpV6: 'fe80::5001', dstIpV4: '192.168.50.2', dstIpV6: 'fe80::5002' },
    { id: 49, ruleId: '93101', name: 'ICMP (ICMP)', protocol_type: 'ICMP', port: '所有接口', priority: 3, protocol: '混栈应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：ICMP', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' },
    { id: 50, ruleId: '93102', name: 'multicast_test (MULTICAST)', protocol_type: 'MULTICAST', port: '所有接口', priority: 4, protocol: '混栈应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：多播测试', srcIp: 'any / any', srcPort: 'any', dstIp: '224.0.0.0/4 / ff00::/8', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '224.0.0.0/4', dstIpV6: 'ff00::/8' },
    { id: 51, ruleId: '93103', name: 'unicast_test (UNICAST)', protocol_type: 'UNICAST', port: '所有接口', priority: 5, protocol: '混栈应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：单播测试', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' },
    { id: 52, ruleId: '93104', name: 'ip_other', protocol_type: 'OTHER', port: '所有接口', priority: 6, protocol: '混栈应用', tab: 'IP应用', isDefaultIpApp: true, description: 'IP默认应用：其他协议流量', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' },
    { id: 29, ruleId: '9401', name: 'DS-L7-QQ-Video', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: '混栈应用', tab: 'L7应用', l7Group: 'HTTP', description: 'QQ视频多媒体实时混通保障', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' }
  ]);

  // Filter variables
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterIp, setFilterIp] = useState('');
  const [filterPort, setFilterPort] = useState('');

  const [appliedFilterName, setAppliedFilterName] = useState('');
  const [appliedFilterIp, setAppliedFilterIp] = useState('');
  const [appliedFilterPort, setAppliedFilterPort] = useState('');
  const [selectedRuleIds, setSelectedRuleIds] = useState<number[]>([]);

  const handleExecuteFilter = () => {
    setAppliedFilterName(filterName);
    setAppliedFilterIp(filterIp);
    setAppliedFilterPort(filterPort);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterIp('');
    setFilterPort('');
    setAppliedFilterName('');
    setAppliedFilterIp('');
    setAppliedFilterPort('');
  };

  // Hovered Tooltip State
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const showTooltip = (text: string, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTooltip({
      text: text,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const hideTooltip = () => {
    setHoveredTooltip(null);
  };

  // getPhysicalRuleId definition
  const getPhysicalRuleId = (baseRuleId: string, interfaceName: string) => {
    let offset = 0;
    if (interfaceName.includes('Retx')) {
      offset = 120;
    } else if (interfaceName.includes('SRV6')) {
      offset = 240;
    } else if (interfaceName.includes('重传')) {
      offset = 360;
    }
    const num = parseInt((baseRuleId || '').replace(/\D/g, ''), 10);
    if (isNaN(num)) return String(10000 + offset);
    return String(num + offset);
  };

  // Filtered table data based on States & search triggers
  const filteredTableData = allRules.filter((item) => {
    // Check Protocol Match
    if (item.protocol !== protocol) return false;

    // Check Tab Match
    if (item.tab !== activeTab) return false;

    // 接口下拉仅作为顶部筛选展示，不再联动下方规则列表。

    // Filter by Application Name (应用名称)
    if (appliedFilterName.trim() !== '') {
      if (!item.name.toLowerCase().includes(appliedFilterName.toLowerCase())) return false;
    }

    // Filter by Source or Destination IP (源IP / 目的IP)
    if (appliedFilterIp.trim() !== '') {
      const q = appliedFilterIp.toLowerCase();
      const matchSrc = (item.srcIp || '').toLowerCase().includes(q);
      const matchDst = (item.dstIp || '').toLowerCase().includes(q);
      if (!matchSrc && !matchDst) return false;
    }

    // Filter by Source or Destination Port (源端口 / 目的端口)
    if (appliedFilterPort.trim() !== '') {
      const q = appliedFilterPort.toLowerCase();
      const matchSrcPort = (item.srcPort || '').toLowerCase().includes(q);
      const matchDstPort = (item.dstPort || '').toLowerCase().includes(q);
      if (!matchSrcPort && !matchDstPort) return false;
    }

    return true;
  });

  const renderGrabPorts = (port: string) => {
    if (port === '所有接口' || port === '所有探针' || port === '所有') {
      return '探针(Retx):接口1; 探针(SRV6):接口1; 探针(重传):接口1';
    }
    return port;
  };

  const filteredIds = filteredTableData.map((r) => r.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedRuleIds.includes(id));
  const isReadonlyConfigRule = (item: any) => {
    return (item.tab || '').includes('已知应用') || (item.tab === 'IP应用' && !!item.isDefaultIpApp);
  };

  const visibleL7Groups = activeTab === 'L7应用'
    ? l7GroupOptions.filter((g) => filteredTableData.some((r) => (r.l7Group || '') === g))
    : [];
  const [collapsedL7GroupsByProtocol, setCollapsedL7GroupsByProtocol] = useState<Record<string, string[]>>({});
  const [l7GroupPageByProtocol, setL7GroupPageByProtocol] = useState<Record<string, number>>({});
  const collapsedL7Groups = collapsedL7GroupsByProtocol[protocol] || [];
  const isL7GroupCollapsed = (group: string) => collapsedL7Groups.includes(group);
  const toggleL7GroupCollapse = (group: string) => {
    setCollapsedL7GroupsByProtocol((prev) => {
      const current = prev[protocol] || [];
      const next = current.includes(group) ? current.filter((g) => g !== group) : [...current, group];
      return { ...prev, [protocol]: next };
    });
  };
  const getL7GroupPageKey = (group: string) => `${protocol}:${group}`;
  const getL7GroupPage = (group: string) => l7GroupPageByProtocol[getL7GroupPageKey(group)] || 1;
  const setL7GroupPage = (group: string, page: number) => {
    setL7GroupPageByProtocol((prev) => ({ ...prev, [getL7GroupPageKey(group)]: page }));
  };
  const defaultL7GroupRank = l7GroupOptions.reduce((acc: Record<string, number>, g, idx) => {
    acc[g] = idx;
    return acc;
  }, {});

  const displayedTableData = activeTab === 'L7应用'
    ? [...filteredTableData].sort((a, b) => {
        const ga = defaultL7GroupRank[a.l7Group || ''] ?? 999;
        const gb = defaultL7GroupRank[b.l7Group || ''] ?? 999;
        if (ga !== gb) return ga - gb;
        return (a.priority || 0) - (b.priority || 0);
      })
    : filteredTableData;

  const l7GroupSections = activeTab === 'L7应用'
    ? visibleL7Groups.map((group) => {
        const items = displayedTableData.filter((r) => (r.l7Group || '') === group);
        const totalPages = Math.max(1, Math.ceil(items.length / L7_GROUP_PAGE_SIZE));
        const currentPage = Math.min(getL7GroupPage(group), totalPages);
        const start = (currentPage - 1) * L7_GROUP_PAGE_SIZE;
        return {
          group,
          items,
          pageItems: items.slice(start, start + L7_GROUP_PAGE_SIZE),
          currentPage,
          totalPages,
          totalCount: items.length,
        };
      })
    : [];

  const tableColumns = columns.filter((col) => {
    if (!col.visible) return false;
    if (activeTab === 'IP应用' && (col.id === 'srcPort' || col.id === 'dstPort')) return false;
    return true;
  });

  const configurableColumns = activeTab === 'IP应用'
    ? columns.filter((col) => col.id !== 'srcPort' && col.id !== 'dstPort')
    : columns;

  const [isEditMode, setIsEditMode] = useState(false);
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [isAdvancedOnlyMode, setIsAdvancedOnlyMode] = useState(false);
  const [isBatchAdvancedMode, setIsBatchAdvancedMode] = useState(false);
  const [batchAdvancedRuleIds, setBatchAdvancedRuleIds] = useState<number[]>([]);
  const [activeEditId, setActiveEditId] = useState<number | null>(null);
  const [editLockedProbes, setEditLockedProbes] = useState<string[]>([]);
  const [activeAdvancedRuleId, setActiveAdvancedRuleId] = useState<number | null>(null);
  const [activeAdvancedRuleName, setActiveAdvancedRuleName] = useState('');
  const [activeAdvancedInterfaces, setActiveAdvancedInterfaces] = useState<string[]>([]);
  const [activeAdvancedInterface, setActiveAdvancedInterface] = useState('');
  const [advancedInterfaceDrafts, setAdvancedInterfaceDrafts] = useState<Record<string, any>>({});
  const [isProbeDropdownOpen, setIsProbeDropdownOpen] = useState(false);
  const [probeDropdownView, setProbeDropdownView] = useState<'all' | 'selected' | 'unselected'>('all');
  const [probeGroupCollapsed, setProbeGroupCollapsed] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const parseP2 = (p2Val: any) => {
    const defaultP2 = {
      p2GroupType: '客户端按站点分组',
      p2ShowClientIpPortSite: false,
      p2DetailType: 'Top KPI',
      p2DetailKpiMetric: '流量',
      p2DetailItems: '87',
      p2ServerDetailType: 'Top KPI',
      p2ServerDetailKpiMetric: '流量',
      p2ServerDetailItems: '50',
      p2IgnoreConnFailMeta: '关闭',
      p2ConnFailDetails: '10',
      p2ConnFailTopClients: '10',
      p2AppSessionDetails: '0',
      p2CpuStatsCore: '',
      p2CpuLogCore: '0',
      p2GiantFrameThreshold: '1460',
      p2IgnoreClientRstFail: '关闭',
      p2Srv6Parsing: '关闭',
      p2ConnInterStateHandling: '开启',
      p2RuleBalancing: '未配置'
    };
    if (!p2Val) return defaultP2;
    try {
      const parsed = JSON.parse(p2Val);
      if (parsed && typeof parsed === 'object') {
        return { ...defaultP2, ...parsed };
      }
    } catch (e) {
      // Not a JSON
    }
    return defaultP2;
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    l7Group: '',
    protocolType: 'TCP',
    probeMode: 'custom',
    selectedProbes: [] as string[],
    srcIp: '',
    srcPort: '',
    dstIp: '',
    dstPort: '',
    srcIpV4: '',
    srcIpV6: '',
    dstIpV4: '',
    dstIpV6: '',
    performanceRapid: '50',
    performanceNormal: '500',
    storageLength: '64字节',
    timeout: '300',
    p2: '',
    p2GroupType: '客户端按站点分组',
    p2ShowClientIpPortSite: false,
    p2DetailType: 'Top KPI',
    p2DetailKpiMetric: '流量',
    p2DetailItems: '87',
    p2ServerDetailType: 'Top KPI',
    p2ServerDetailKpiMetric: '流量',
    p2ServerDetailItems: '50',
    p2IgnoreConnFailMeta: '关闭',
    p2ConnFailDetails: '10',
    p2ConnFailTopClients: '10',
    p2AppSessionDetails: '0',
    p2CpuStatsCore: '',
    p2CpuLogCore: '0',
    p2GiantFrameThreshold: '1460',
    p2IgnoreClientRstFail: '关闭',
    p2Srv6Parsing: '关闭',
    p2ConnInterStateHandling: '开启',
    p2RuleBalancing: '未配置'
  });

  const createAdvancedItem = (value: string = '', mode: 'base' | 'exclude' = 'base') => ({
    id: Date.now() + Math.random(),
    value,
    mode,
  });

  const createInitialAdvancedGroups = (seed?: any) => ({
    srcIp: [createAdvancedItem(seed?.srcIp || '', 'base')],
    srcPort: [createAdvancedItem(seed?.srcPort || '', 'base')],
    dstIp: [createAdvancedItem(seed?.dstIp || '', 'base')],
    dstPort: [createAdvancedItem(seed?.dstPort || '', 'base')],
  });

  const [advancedGroups, setAdvancedGroups] = useState<any>(createInitialAdvancedGroups());

  const getRuleInterfaces = (portVal: string) => {
    if (portVal === '所有接口' || portVal === '所有探针' || portVal === '所有') {
      return [...probeOptions];
    }
    return (portVal || '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const isTcpUdpIpAdvancedTab = (tab: string) =>
    tab === '自定义应用(TCP)' || tab === '自定义应用(UDP)' || tab === 'IP应用';

  const pickAdvancedFields = (src: any) => ({
    timeout: src.timeout,
    performanceRapid: src.performanceRapid,
    performanceNormal: src.performanceNormal,
    storageLength: src.storageLength,
    p2GroupType: src.p2GroupType,
    p2ShowClientIpPortSite: src.p2ShowClientIpPortSite,
    p2DetailType: src.p2DetailType,
    p2DetailKpiMetric: src.p2DetailKpiMetric,
    p2DetailItems: src.p2DetailItems,
    p2ServerDetailType: src.p2ServerDetailType,
    p2ServerDetailKpiMetric: src.p2ServerDetailKpiMetric,
    p2ServerDetailItems: src.p2ServerDetailItems,
    p2IgnoreConnFailMeta: src.p2IgnoreConnFailMeta,
    p2ConnFailDetails: src.p2ConnFailDetails,
    p2ConnFailTopClients: src.p2ConnFailTopClients,
    p2AppSessionDetails: src.p2AppSessionDetails,
    p2CpuStatsCore: src.p2CpuStatsCore,
    p2CpuLogCore: src.p2CpuLogCore,
    p2GiantFrameThreshold: src.p2GiantFrameThreshold,
    p2IgnoreClientRstFail: src.p2IgnoreClientRstFail,
    p2Srv6Parsing: src.p2Srv6Parsing,
    p2ConnInterStateHandling: src.p2ConnInterStateHandling,
    p2RuleBalancing: src.p2RuleBalancing
  });

  const composeP2Serialized = (src: any) => JSON.stringify({
    p2GroupType: src.p2GroupType,
    p2ShowClientIpPortSite: src.p2ShowClientIpPortSite,
    p2DetailType: src.p2DetailType,
    p2DetailKpiMetric: src.p2DetailKpiMetric,
    p2DetailItems: src.p2DetailItems,
    p2ServerDetailType: src.p2ServerDetailType,
    p2ServerDetailKpiMetric: src.p2ServerDetailKpiMetric,
    p2ServerDetailItems: src.p2ServerDetailItems,
    p2IgnoreConnFailMeta: src.p2IgnoreConnFailMeta,
    p2ConnFailDetails: src.p2ConnFailDetails,
    p2ConnFailTopClients: src.p2ConnFailTopClients,
    p2AppSessionDetails: src.p2AppSessionDetails,
    p2CpuStatsCore: src.p2CpuStatsCore,
    p2CpuLogCore: src.p2CpuLogCore,
    p2GiantFrameThreshold: src.p2GiantFrameThreshold,
    p2IgnoreClientRstFail: src.p2IgnoreClientRstFail,
    p2Srv6Parsing: src.p2Srv6Parsing,
    p2ConnInterStateHandling: src.p2ConnInterStateHandling,
    p2RuleBalancing: src.p2RuleBalancing
  });

  const updateAdvancedItem = (groupKey: string, idx: number, patch: any) => {
    setAdvancedGroups((prev: any) => {
      const list = [...prev[groupKey]];
      list[idx] = { ...list[idx], ...patch };
      return { ...prev, [groupKey]: list };
    });
  };

  const addAdvancedItem = (groupKey: string) => {
    setAdvancedGroups((prev: any) => ({
      ...prev,
      [groupKey]: [...prev[groupKey], createAdvancedItem('', 'exclude')],
    }));
  };

  const serializeAdvancedGroup = (items: any[]) => {
    if (!items || items.length === 0) return '';
    const base = (items[0]?.value || '').trim();
    const excludes = items
      .slice(1)
      .map((it) => (it.value || '').trim())
      .filter((v) => v !== '');
    if (!base && excludes.length === 0) return '';
    if (!base) return `排除: ${excludes.join('; ')}`;
    if (excludes.length === 0) return base;
    return `${base} | 排除: ${excludes.join('; ')}`;
  };

  const probeOptions = PROBE_OPTIONS.map((o) => o.value);
  const effectiveSelectedProbes = formData.probeMode === 'all' ? probeOptions : formData.selectedProbes;
  const allProbeChecked = effectiveSelectedProbes.length === probeOptions.length;
  const filteredProbeOptions = probeOptions.filter((probe) => {
    if (probeDropdownView === 'selected') return effectiveSelectedProbes.includes(probe);
    if (probeDropdownView === 'unselected') return !effectiveSelectedProbes.includes(probe);
    return true;
  });

  const handleOpenAdd = () => {
    if (isKnownApp) {
      alert('已知应用不支持新增应用。');
      return;
    }
    setIsAdvancedOnlyMode(false);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setIsCopyMode(false);
    setIsEditMode(false);
    setActiveEditId(null);
    setEditLockedProbes([]);
    setValidationError(null);
    const readOnly = activeTab.includes('已知应用');
    setIsReadOnly(readOnly);
    setFormData({
      name: '',
      description: '',
      l7Group: '',
      protocolType: getDefaultProtocolTypeByTab(activeTab),
      probeMode: readOnly ? 'all' : 'custom',
      selectedProbes: [],
      srcIp: '',
      srcPort: '',
      dstIp: '',
      dstPort: '',
      srcIpV4: '',
      srcIpV6: '',
      dstIpV4: '',
      dstIpV6: '',
      performanceRapid: '50',
      performanceNormal: '500',
      storageLength: '64字节',
      timeout: '300',
      p2: '',
      p2GroupType: '客户端按站点分组',
      p2ShowClientIpPortSite: false,
      p2DetailType: 'Top KPI',
      p2DetailKpiMetric: '流量',
      p2DetailItems: '87',
      p2ServerDetailType: 'Top KPI',
      p2ServerDetailKpiMetric: '流量',
      p2ServerDetailItems: '50',
      p2IgnoreConnFailMeta: '关闭',
      p2ConnFailDetails: '10',
      p2ConnFailTopClients: '10',
      p2AppSessionDetails: '0',
      p2CpuStatsCore: '',
      p2CpuLogCore: '0',
      p2GiantFrameThreshold: '1460',
      p2IgnoreClientRstFail: '关闭',
      p2Srv6Parsing: '关闭',
      p2ConnInterStateHandling: '开启',
      p2RuleBalancing: '未配置'
    });
    setAdvancedGroups(createInitialAdvancedGroups());
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: any) => {
    if (isReadonlyConfigRule(item)) {
      alert('该应用不支持修改配置。');
      return;
    }
    setIsAdvancedOnlyMode(false);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setIsCopyMode(false);
    setIsEditMode(true);
    setActiveEditId(item.id);
    setValidationError(null);
    const readOnly = item.tab ? item.tab.includes('已知应用') : false;
    setIsReadOnly(readOnly);
    const locked = getRuleInterfaces(item.port || '');
    setEditLockedProbes(locked);
    const p2Vals = parseP2(item.p2);
    setFormData({
      name: item.name,
      description: item.description || `${item.name} 的详细应用描述信息，包含业务定义。`,
      l7Group: item.l7Group || '',
      protocolType: item.protocol_type,
      probeMode: readOnly ? 'all' : (item.port === '所有接口' ? 'all' : 'custom'),
      selectedProbes: item.port === '所有接口' ? [] : (item.port ? item.port.split(';').map((s: string) => s.trim()).filter(Boolean) : []),
      srcIp: item.srcIp || '192.168.1.1, 10.0.0.1-10.0.0.255',
      srcPort: item.srcPort || '80, 443, 8080-8090',
      dstIp: item.dstIp || '172.16.0.1/24',
      dstPort: item.dstPort || '1-65535',
      srcIpV4: item.srcIpV4 || '',
      srcIpV6: item.srcIpV6 || '',
      dstIpV4: item.dstIpV4 || '',
      dstIpV6: item.dstIpV6 || '',
      performanceRapid: '50',
      performanceNormal: '500',
      storageLength: item.storageLength || '64字节',
      timeout: item.timeout !== undefined ? String(item.timeout) : (item.protocol_type === 'UDP' ? '30' : '300'),
      p2: item.p2 !== undefined ? String(item.p2) : '配置项p2默认属性',
      ...p2Vals
    });
    setAdvancedGroups(createInitialAdvancedGroups({
      srcIp: item.srcIp || '',
      srcPort: item.srcPort || '',
      dstIp: item.dstIp || '',
      dstPort: item.dstPort || '',
    }));
    setShowAddModal(true);
  };

  const handleOpenKnownConfig = (item: any) => {
    setIsAdvancedOnlyMode(false);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setIsCopyMode(false);
    setIsEditMode(false);
    setActiveEditId(null);
    setValidationError(null);
    setIsReadOnly(true);
    setEditLockedProbes(getRuleInterfaces(item.port || ''));
    const p2Vals = parseP2(item.p2);
    setFormData({
      name: item.name,
      description: item.description || `${item.name} 的详细应用描述信息，包含业务定义。`,
      l7Group: item.l7Group || '',
      protocolType: item.protocol_type,
      probeMode: item.port === '所有接口' ? 'all' : 'custom',
      selectedProbes: item.port === '所有接口' ? [] : (item.port ? item.port.split(';').map((s: string) => s.trim()).filter(Boolean) : []),
      srcIp: item.srcIp || '192.168.1.1, 10.0.0.1-10.0.0.255',
      srcPort: item.srcPort || '80, 443, 8080-8090',
      dstIp: item.dstIp || '172.16.0.1/24',
      dstPort: item.dstPort || '1-65535',
      srcIpV4: item.srcIpV4 || '',
      srcIpV6: item.srcIpV6 || '',
      dstIpV4: item.dstIpV4 || '',
      dstIpV6: item.dstIpV6 || '',
      performanceRapid: item.performanceRapid !== undefined ? String(item.performanceRapid) : '50',
      performanceNormal: item.performanceNormal !== undefined ? String(item.performanceNormal) : '500',
      storageLength: item.storageLength || '64字节',
      timeout: item.timeout !== undefined ? String(item.timeout) : (item.protocol_type === 'UDP' ? '30' : '300'),
      p2: item.p2 !== undefined ? String(item.p2) : '配置项p2默认属性',
      ...p2Vals
    });
    setAdvancedGroups(createInitialAdvancedGroups({
      srcIp: item.srcIp || '',
      srcPort: item.srcPort || '',
      dstIp: item.dstIp || '',
      dstPort: item.dstPort || '',
    }));
    setShowAddModal(true);
  };

  // Rule actions handlers
  const handleDeleteRule = (id: number) => {
    setAllRules(prev => prev.filter(r => r.id !== id));
    setSelectedRuleIds((prev) => prev.filter((rid) => rid !== id));
  };

  const requestDeleteRule = (item: any) => {
    setPendingDeleteRule({
      id: item.id,
      name: item.name || '未命名应用',
    });
  };

  const confirmDeleteRule = () => {
    if (!pendingDeleteRule) return;
    handleDeleteRule(pendingDeleteRule.id);
    setPendingDeleteRule(null);
  };

  const requestToggleRuleEnabled = (item: any) => {
    const currentEnabled = item.enabled !== false;
    setPendingEnableToggle({
      id: item.id,
      name: item.name || '未命名应用',
      nextEnabled: !currentEnabled,
    });
  };

  const confirmToggleRuleEnabled = () => {
    if (!pendingEnableToggle) return;
    setAllRules((prev) =>
      prev.map((r) =>
        r.id === pendingEnableToggle.id ? { ...r, enabled: pendingEnableToggle.nextEnabled } : r
      )
    );
    setPendingEnableToggle(null);
  };

  const handleCopyRule = (item: any) => {
    setIsAdvancedOnlyMode(false);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setIsCopyMode(true);
    setIsEditMode(false);
    setActiveEditId(null);
    setEditLockedProbes([]);
    setValidationError(null);
    const readOnly = item.tab ? item.tab.includes('已知应用') : false;
    setIsReadOnly(readOnly);
    const p2Vals = parseP2(item.p2);
    setFormData({
      name: `副本-${item.name}`,
      description: item.description || `${item.name} 的详细应用描述信息，包含业务定义。`,
      l7Group: item.l7Group || '',
      protocolType: item.protocol_type,
      probeMode: readOnly ? 'all' : (item.port === '所有接口' ? 'all' : 'custom'),
      selectedProbes: item.port === '所有接口' ? [] : (item.port ? item.port.split(';').map((s: string) => s.trim()).filter(Boolean) : []),
      srcIp: item.srcIp || '192.168.1.1, 10.0.0.1-10.0.0.255',
      srcPort: item.srcPort || '80, 443, 8080-8090',
      dstIp: item.dstIp || '172.16.0.1/24',
      dstPort: item.dstPort || '1-65535',
      srcIpV4: item.srcIpV4 || '',
      srcIpV6: item.srcIpV6 || '',
      dstIpV4: item.dstIpV4 || '',
      dstIpV6: item.dstIpV6 || '',
      performanceRapid: '50',
      performanceNormal: '500',
      storageLength: item.storageLength || '64字节',
      timeout: item.timeout !== undefined ? String(item.timeout) : (item.protocol_type === 'UDP' ? '30' : '300'),
      p2: item.p2 !== undefined ? String(item.p2) : '配置项p2默认属性',
      ...p2Vals
    });
    setAdvancedGroups(createInitialAdvancedGroups({
      srcIp: item.srcIp || '',
      srcPort: item.srcPort || '',
      dstIp: item.dstIp || '',
      dstPort: item.dstPort || '',
    }));
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setIsAdvancedOnlyMode(false);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setActiveAdvancedRuleId(null);
    setActiveAdvancedRuleName('');
    setActiveAdvancedInterface('');
    setActiveAdvancedInterfaces([]);
    setAdvancedInterfaceDrafts({});
  };

  const handleOpenAdvancedConfig = (item: any) => {
    if (isReadonlyConfigRule(item)) {
      alert('该应用不支持修改配置。');
      return;
    }
    const interfaces = getRuleInterfaces(item.port || '');
    if (interfaces.length === 0) return;

    const p2Vals = parseP2(item.p2);
    const fallbackAdvanced = {
      timeout: item.timeout !== undefined ? String(item.timeout) : (item.protocol_type === 'UDP' ? '30' : '300'),
      performanceRapid: item.performanceRapid !== undefined ? String(item.performanceRapid) : '50',
      performanceNormal: item.performanceNormal !== undefined ? String(item.performanceNormal) : '500',
      storageLength: item.storageLength || '64字节',
      ...p2Vals
    };
    const existing = (item.interfaceAdvancedConfigs && typeof item.interfaceAdvancedConfigs === 'object')
      ? item.interfaceAdvancedConfigs
      : {};
    const drafts: Record<string, any> = {};
    interfaces.forEach((iface) => {
      drafts[iface] = { ...fallbackAdvanced, ...(existing[iface] || {}) };
    });
    const firstIface = interfaces[0];

    setIsAdvancedOnlyMode(true);
    setIsBatchAdvancedMode(false);
    setBatchAdvancedRuleIds([]);
    setIsCopyMode(false);
    setIsEditMode(false);
    setIsReadOnly(false);
    setActiveAdvancedRuleId(item.id);
    setActiveAdvancedRuleName(item.name || '');
    setActiveAdvancedInterfaces(interfaces);
    setActiveAdvancedInterface(firstIface);
    setAdvancedInterfaceDrafts(drafts);
    setFormData((prev) => ({
      ...prev,
      protocolType: item.protocol_type || prev.protocolType,
      ...drafts[firstIface]
    }));
    setShowAddModal(true);
  };

  const handleOpenBatchAdvancedConfig = () => {
    if (isKnownApp) {
      alert('已知应用不支持批量修改配置。');
      return;
    }
    const ids = selectedRuleIds.filter((id) => filteredIds.includes(id));
    if (ids.length === 0) {
      alert('请先勾选需要批量修改高级配置的应用。');
      return;
    }
    const firstRule = allRules.find((r) => r.id === ids[0]);
    if (!firstRule) return;
    const p2Vals = parseP2(firstRule.p2);
    setIsAdvancedOnlyMode(true);
    setIsBatchAdvancedMode(true);
    setBatchAdvancedRuleIds(ids);
    setIsCopyMode(false);
    setIsEditMode(false);
    setIsReadOnly(false);
    setActiveAdvancedRuleId(null);
    setActiveAdvancedRuleName(`批量(${ids.length}条)`);
    setActiveAdvancedInterfaces([]);
    setActiveAdvancedInterface('');
    setAdvancedInterfaceDrafts({});
    setFormData((prev) => ({
      ...prev,
      protocolType: firstRule.protocol_type || prev.protocolType,
      timeout: firstRule.timeout !== undefined ? String(firstRule.timeout) : (firstRule.protocol_type === 'UDP' ? '30' : '300'),
      performanceRapid: firstRule.performanceRapid !== undefined ? String(firstRule.performanceRapid) : '50',
      performanceNormal: firstRule.performanceNormal !== undefined ? String(firstRule.performanceNormal) : '500',
      storageLength: firstRule.storageLength || '64字节',
      ...p2Vals
    }));
    setShowAddModal(true);
  };

  const reorderRules = (srcIndex: number, destIndex: number) => {
    if (srcIndex === destIndex) return;
    const currentFiltered = [...filteredTableData];
    const draggedItem = currentFiltered[srcIndex];
    
    currentFiltered.splice(srcIndex, 1);
    currentFiltered.splice(destIndex, 0, draggedItem);
    
    const updatedRules = [...allRules];
    
    const originalIndexes = filteredTableData.map(item => 
      updatedRules.findIndex(r => r.id === item.id)
    ).filter(idx => idx !== -1);
    
    originalIndexes.forEach((originalIdx, i) => {
      updatedRules[originalIdx] = currentFiltered[i];
    });
    
    setAllRules(updatedRules);
  };

  const reorderL7RulesByDisplayIndexes = (srcIndex: number, destIndex: number) => {
    if (srcIndex === destIndex) return;
    const srcItem = displayedTableData[srcIndex];
    const destItem = displayedTableData[destIndex];
    if (!srcItem || !destItem) return;
    reorderL7RulesByIds(srcItem.id, destItem.id);
  };

  const reorderL7RulesByIds = (srcId: number, destId: number) => {
    if (srcId === destId) return;
    const srcItem = displayedTableData.find((r) => r.id === srcId);
    const destItem = displayedTableData.find((r) => r.id === destId);
    if (!srcItem || !destItem) return;
    const groupKey = srcItem.l7Group || '';
    if (!groupKey || groupKey !== (destItem.l7Group || '')) return;

    const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === groupKey);
    const srcGroupIdx = groupItems.findIndex((r) => r.id === srcItem.id);
    const dstGroupIdx = groupItems.findIndex((r) => r.id === destItem.id);
    if (srcGroupIdx < 0 || dstGroupIdx < 0) return;

    const nextGroupItems = [...groupItems];
    const [moved] = nextGroupItems.splice(srcGroupIdx, 1);
    nextGroupItems.splice(dstGroupIdx, 0, moved);
    const priorityMap = new Map<number, number>();
    nextGroupItems.forEach((r, idx) => priorityMap.set(r.id, idx + 1));

    setAllRules((prev) =>
      prev.map((r) => (priorityMap.has(r.id) ? { ...r, priority: priorityMap.get(r.id) } : r))
    );
  };

  const moveRuleToTop = (index: number) => {
    if (activeTab === 'L7应用') {
      const item = displayedTableData[index];
      if (!item) return;
      const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === (item.l7Group || ''));
      const srcIdx = groupItems.findIndex((r) => r.id === item.id);
      if (srcIdx > 0) {
        reorderL7RulesByDisplayIndexes(index, displayedTableData.findIndex((r) => r.id === groupItems[0].id));
      }
    } else {
      reorderRules(index, 0);
    }
    setActivePriorityMenu(null);
  };

  const moveRuleToBottom = (index: number) => {
    if (activeTab === 'L7应用') {
      const item = displayedTableData[index];
      if (!item) return;
      const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === (item.l7Group || ''));
      const srcIdx = groupItems.findIndex((r) => r.id === item.id);
      if (srcIdx > -1 && srcIdx < groupItems.length - 1) {
        const targetId = groupItems[groupItems.length - 1].id;
        reorderL7RulesByDisplayIndexes(index, displayedTableData.findIndex((r) => r.id === targetId));
      }
    } else {
      reorderRules(index, filteredTableData.length - 1);
    }
    setActivePriorityMenu(null);
  };

  const moveRuleUp = (index: number) => {
    if (activeTab === 'L7应用') {
      const item = displayedTableData[index];
      if (!item) return;
      const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === (item.l7Group || ''));
      const srcIdx = groupItems.findIndex((r) => r.id === item.id);
      if (srcIdx > 0) {
        const targetId = groupItems[srcIdx - 1].id;
        reorderL7RulesByDisplayIndexes(index, displayedTableData.findIndex((r) => r.id === targetId));
      }
    } else if (index > 0) {
      reorderRules(index, index - 1);
    }
    setActivePriorityMenu(null);
  };

  const moveRuleDown = (index: number) => {
    if (activeTab === 'L7应用') {
      const item = displayedTableData[index];
      if (!item) return;
      const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === (item.l7Group || ''));
      const srcIdx = groupItems.findIndex((r) => r.id === item.id);
      if (srcIdx > -1 && srcIdx < groupItems.length - 1) {
        const targetId = groupItems[srcIdx + 1].id;
        reorderL7RulesByDisplayIndexes(index, displayedTableData.findIndex((r) => r.id === targetId));
      }
    } else if (index < filteredTableData.length - 1) {
      reorderRules(index, index + 1);
    }
    setActivePriorityMenu(null);
  };

  const handleMoveUp = (index: number) => {
    moveRuleUp(index);
  };

  const handleMoveDown = (index: number) => {
    moveRuleDown(index);
  };

  const getL7MoveMeta = (index: number) => {
    const item = displayedTableData[index];
    if (!item) return { canUp: false, canDown: false };
    const groupItems = displayedTableData.filter((r) => (r.l7Group || '') === (item.l7Group || ''));
    const pos = groupItems.findIndex((r) => r.id === item.id);
    if (pos === -1) return { canUp: false, canDown: false };
    return {
      canUp: pos > 0,
      canDown: pos < groupItems.length - 1,
    };
  };

  const handleSaveModal = () => {
    if (isAdvancedOnlyMode) {
      if (isBatchAdvancedMode) {
        const batchAdvanced = pickAdvancedFields(formData);
        const p2Serialized = composeP2Serialized(batchAdvanced);
        setAllRules((prev) => prev.map((r) => {
          if (!batchAdvancedRuleIds.includes(r.id)) return r;
          const interfaces = getRuleInterfaces(r.port || '');
          const interfaceAdvancedConfigs: Record<string, any> = {};
          interfaces.forEach((iface) => {
            interfaceAdvancedConfigs[iface] = { ...batchAdvanced };
          });
          return {
            ...r,
            timeout: batchAdvanced.timeout,
            performanceRapid: batchAdvanced.performanceRapid,
            performanceNormal: batchAdvanced.performanceNormal,
            storageLength: batchAdvanced.storageLength,
            p2: p2Serialized,
            interfaceAdvancedConfigs
          };
        }));
        closeAddModal();
        return;
      }
      if (activeAdvancedRuleId === null) return;
      const activeAdvanced = pickAdvancedFields(formData);
      const p2Serialized = composeP2Serialized(activeAdvanced);
      setAllRules((prev) => prev.map((r) => {
        if (r.id !== activeAdvancedRuleId) return r;
        const interfaces = getRuleInterfaces(r.port || '');
        const interfaceAdvancedConfigs: Record<string, any> = {};
        interfaces.forEach((iface) => {
          interfaceAdvancedConfigs[iface] = { ...activeAdvanced };
        });
        return {
          ...r,
          timeout: activeAdvanced.timeout,
          performanceRapid: activeAdvanced.performanceRapid,
          performanceNormal: activeAdvanced.performanceNormal,
          storageLength: activeAdvanced.storageLength,
          p2: p2Serialized,
          interfaceAdvancedConfigs
        };
      }));
      closeAddModal();
      return;
    }

    if (!formData.name.trim()) return;
    if (activeTab === 'L7应用' && !formData.l7Group) {
      setValidationError('请先选择L7协议组（HTTP/DNS/SSL/Oracle/MySQL/PostgreSQL）。');
      return;
    }
    if (activeTab === 'IP应用' && !ipProtocolOptions.includes(formData.protocolType)) {
      setValidationError('请先选择IP协议（ICMP/IGMP/ESP/AH/EIGRP）。');
      return;
    }

    const resolvedSrcIp = serializeAdvancedGroup(advancedGroups.srcIp) || formData.srcIp;
    const resolvedSrcPort = activeTab === 'IP应用'
      ? 'any'
      : (serializeAdvancedGroup(advancedGroups.srcPort) || formData.srcPort);
    const resolvedDstIp = serializeAdvancedGroup(advancedGroups.dstIp) || formData.dstIp;
    const resolvedDstPort = activeTab === 'IP应用'
      ? 'any'
      : (serializeAdvancedGroup(advancedGroups.dstPort) || formData.dstPort);

    if (protocol === '混栈应用') {
      const ipText = `${resolvedSrcIp} ${resolvedDstIp}`;
      const hasV4 = /\b\d{1,3}(?:\.\d{1,3}){3}\b/.test(ipText);
      const hasV6 = /[a-fA-F0-9]*:[a-fA-F0-9:]+/.test(ipText);

      if (!hasV4 || !hasV6) {
        setValidationError('混栈应用规则校验不通过：源/目的IP中需至少同时包含一组 IPv4 与 IPv6 地址。');
        return;
      }
    }

    setValidationError(null);

    const p2Serialized = composeP2Serialized(formData);

    if (isEditMode && activeEditId !== null) {
      setAllRules(prev => prev.map(r => {
        if (r.id === activeEditId) {
          return {
            ...r,
            name: formData.name,
            protocol_type: formData.protocolType,
            l7Group: activeTab === 'L7应用' ? formData.l7Group : r.l7Group,
            port: formData.probeMode === 'all' ? '所有接口' : (formData.selectedProbes.length > 0 ? formData.selectedProbes.join('; ') : '默认接口'),
            description: formData.description,
            timeout: formData.timeout,
            srcIp: resolvedSrcIp,
            srcPort: resolvedSrcPort,
            dstIp: resolvedDstIp,
            dstPort: resolvedDstPort,
            srcIpV4: formData.srcIpV4,
            srcIpV6: formData.srcIpV6,
            dstIpV4: formData.dstIpV4,
            dstIpV6: formData.dstIpV6,
            storageLength: formData.storageLength,
            p2: p2Serialized
          };
        }
        return r;
      }));
    } else {
      const newId = Math.max(...allRules.map(r => r.id), 0) + 1;
      const randomRuleId = String(Math.floor(10000 + Math.random() * 90000));
      const newRule = {
        id: newId,
        ruleId: randomRuleId,
        name: formData.name,
        protocol_type: formData.protocolType,
        l7Group: activeTab === 'L7应用' ? formData.l7Group : undefined,
        port: formData.probeMode === 'all' ? '所有接口' : (formData.selectedProbes.length > 0 ? formData.selectedProbes.join('; ') : '默认接口'),
        priority: 10 + filteredTableData.length,
        protocol: protocol,
        tab: activeTab,
        description: formData.description,
        timeout: formData.timeout,
        srcIp: resolvedSrcIp,
        srcPort: resolvedSrcPort,
        dstIp: resolvedDstIp,
        dstPort: resolvedDstPort,
        srcIpV4: formData.srcIpV4,
        srcIpV6: formData.srcIpV6,
        dstIpV4: formData.dstIpV4,
        dstIpV6: formData.dstIpV6,
        storageLength: formData.storageLength,
        p2: p2Serialized
      };
      setAllRules(prev => [...prev, newRule]);
    }

    closeAddModal();
  };

  const handleOpenMappingModal = (item: any) => {
    setActiveMappingRule(item);
    setShowMappingModal(true);
  };

  const dragOverImport = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const dragLeaveImport = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const dropImport = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImportedFile({
        name: file.name,
        size: Math.round(file.size / 1024)
      });
    }
  };

  const fileSelectImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImportedFile({
        name: file.name,
        size: Math.round(file.size / 1024)
      });
    }
  };

  const handleConfirmImport = () => {
    if (!importedFile) {
      alert('请先选择或拖拽要导入的配置文件！');
      return;
    }
    // Simulate importing custom rule database expansion
    const preId = Math.max(...allRules.map(r => r.id), 0);
    const newRules = [
      { id: preId + 1, ruleId: String(Math.floor(61000 + Math.random() * 5000)), name: `${protocol === 'IPV6应用' ? 'IPv6' : protocol === '混栈应用' ? 'DS' : 'IPv4'}-Imported-API-Gateway`, protocol_type: 'TCP', port: importSelectedInterfaces.join('; '), priority: 11, protocol: protocol, tab: activeTab, description: '自选通道深度导入：分布式控制面高可用安全保障控制链路', srcIp: protocol === 'IPV6应用' ? '2409:8a1e::/32' : '10.0.0.0/8', srcPort: 'any', dstIp: protocol === 'IPV6应用' ? '2409:8a1e:200a::50' : '10.222.1.25', dstPort: '1883, 8080' },
      { id: preId + 2, ruleId: String(Math.floor(62000 + Math.random() * 5000)), name: `${protocol === 'IPV6应用' ? 'IPv6' : protocol === '混栈应用' ? 'DS' : 'IPv4'}-Imported-Metrics-Engine`, protocol_type: 'UDP', port: importSelectedInterfaces.join('; '), priority: 12, protocol: protocol, tab: activeTab, description: '自选通道深度导入：采集上报端超高并发UDP离线重连数据流', srcIp: 'any', srcPort: 'any', dstIp: protocol === 'IPV6应用' ? 'fe80::100a:2c04' : '172.50.10.12', dstPort: '514, 2019' }
    ];

    if (importConflictStrategy === 'overwrite') {
      // Overwrite: clear current protocol rules on this tab and insert
      setAllRules(prev => {
        const kept = prev.filter(r => r.protocol !== protocol || r.tab !== activeTab);
        return [...kept, ...newRules];
      });
    } else {
      // Merge: keep old and add new
      setAllRules(prev => [...prev, ...newRules]);
    }

    setShowImportModal(false);
    alert(`成功从 [${importedFile.name}] 导入 ${newRules.length} 条业务流控规则并分发到以下接口：\n${importSelectedInterfaces.join(', ')}`);
  };

  const handleClearAllRules = () => {
    setAllRules(prev => prev.filter(r => r.protocol !== protocol || r.tab !== activeTab));
    setSelectedRuleIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
  };

  const handleOpenL7GroupSettings = (group: string) => {
    if (group === 'DNS') {
      const cfg = l7ProtocolConfigs[protocol] || defaultDnsConfig;
      setDnsConfigDraft({ ...cfg });
      setShowDnsConfigModal(true);
      return;
    }
    if (group === 'HTTP') {
      const cfg = l7HttpConfigs[protocol] || defaultHttpConfig;
      setHttpConfigDraft({ ...cfg });
      setShowHttpConfigModal(true);
      return;
    }
    if (group === 'MySQL') {
      const cfg = l7MysqlConfigs[protocol] || defaultMysqlConfig;
      setMysqlConfigDraft({ ...cfg });
      setShowMysqlConfigModal(true);
      return;
    }
    if (group === 'Oracle') {
      const cfg = l7OracleConfigs[protocol] || defaultOracleConfig;
      setOracleConfigDraft({ ...cfg });
      setShowOracleConfigModal(true);
      return;
    }
    if (group === 'PostgreSQL') {
      const cfg = l7PgConfigs[protocol] || defaultPgConfig;
      setPgConfigDraft({ ...cfg });
      setShowPgConfigModal(true);
      return;
    }
    if (group === 'SSL') {
      const cfg = l7SslConfigs[protocol] || {
        config: { ...defaultSslConfig },
        domainModels: [...defaultSslDomainModels],
      };
      setSslConfigDraft({ ...cfg.config });
      setSslDomainModelsDraft(cfg.domainModels.map((m) => ({ ...m })));
      setSslNewDomainModel({ name: '', pattern: '', isRegex: false });
      setShowSslConfigModal(true);
    }
  };

  const activeAdvancedTab = isBatchAdvancedMode
    ? activeTab
    : (allRules.find((r) => r.id === activeAdvancedRuleId)?.tab || activeTab);
  const showCpuLogCoreInAdvanced = !isTcpUdpIpAdvancedTab(activeAdvancedTab);

  const tableRenderRows: Array<
    | { kind: 'l7-header'; group: string }
    | { kind: 'l7-pagination'; section: (typeof l7GroupSections)[number] }
    | { kind: 'rule'; item: any; index: number }
  > = [];

  if (activeTab === 'L7应用') {
    l7GroupSections.forEach((section) => {
      tableRenderRows.push({ kind: 'l7-header', group: section.group });
      if (!isL7GroupCollapsed(section.group)) {
        section.pageItems.forEach((item) => {
          const index = displayedTableData.findIndex((r) => r.id === item.id);
          tableRenderRows.push({ kind: 'rule', item, index });
        });
        if (section.totalCount > 0) {
          tableRenderRows.push({ kind: 'l7-pagination', section });
        }
      }
    });
  } else {
    displayedTableData.forEach((item, index) => {
      tableRenderRows.push({ kind: 'rule', item, index });
    });
  }

  return (
    <div className="p-4 bg-slate-50 min-h-full">
      {/* Top Header Controls (Unified Bento-Style Controller) */}
      <div className="bg-white p-4 py-5 rounded-xl border border-slate-200 shadow-sm mb-4 relative overflow-hidden">
        {/* Subtle high-tech decoration inside light theme */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-50 border border-sky-100 rounded-lg text-sky-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-2">
              应用配置
              <span className="text-[10px] bg-sky-50 text-sky-600 font-mono px-1.5 py-0.5 rounded border border-sky-200/50 font-normal">
                PROBE v2.1
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">

            <button 
              onClick={() => {
                setImportedFile(null);
                setImportConflictStrategy('merge');
                setImportSelectedInterfaces(['Probe / Lab']);
                setShowImportModal(true);
              }}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>导入配置</span>
            </button>
            <button 
              onClick={() => alert('已生成当前应用配置的导出文件并开始下载！')}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>导出配置</span>
            </button>
            <button 
              onClick={() => alert('已成功下载标准应用模版 (CSV/JSON 格式)。')}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-400" />
              <span>下载模板</span>
            </button>
            <button 
              onClick={handleClearAllRules}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>一键清空</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scope Filter Config Panel (L1 Switch & Probe Selection) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-1.5 bg-sky-50 border border-sky-100 rounded-lg text-sky-600">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <SearchableSelect
                value={probeSourceType}
                onChange={setProbeSourceType}
                options={PROBE_SOURCE_OPTIONS}
                className="min-w-[140px]"
                menuZIndex={50}
              />

              <SearchableSelect
                value={selectedProbe}
                onChange={setSelectedProbe}
                options={PROBE_OPTIONS}
                className="min-w-[200px]"
                menuZIndex={50}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full md:w-auto overflow-x-auto no-scrollbar gap-1 shrink-0">
          {[
            { id: 'IPV4应用', label: 'IPv4应用' },
            { id: 'IPV6应用', label: 'IPv6应用' },
            { id: '混栈应用', label: '混栈应用' },
          ].map((p) => {
            const isSelected = protocol === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleProtocolChange(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-205 cursor-pointer ${
                  isSelected 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 scale-[1.01]' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* L2 Classification Sub-Tabs and Meta Options */}
        <div className="flex flex-col border-b border-slate-200/60 bg-white">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex overflow-x-auto no-scrollbar w-full lg:w-auto border-b lg:border-b-0 border-slate-100 p-1">
              <div className="flex items-center bg-slate-50 p-1 rounded-lg gap-0.5">
                {tabs.map((tab) => {
                  const isSelected = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setSelectedRuleIds([]);
                        handleResetFilter();
                      }}
                      className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-md transition-all duration-150 ${
                        isSelected
                          ? 'bg-white text-sky-600 shadow-sm border border-slate-250/20 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3 p-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-100">
            <button
              onClick={handleOpenAdd}
              disabled={isKnownApp}
              className={`px-3 py-1.5 border rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all shadow-sm ${
                isKnownApp
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 border-sky-500 text-white hover:bg-sky-600 cursor-pointer'
              }`}
              title={isKnownApp ? "已知应用不支持新增" : "新增当前分类应用"}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增应用</span>
            </button>

            <button 
              onClick={() => setShowFilterRow(!showFilterRow)}
              className={`px-3 py-1.5 border rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer shadow-sm relative ${
                showFilterRow 
                  ? 'bg-sky-50 border-sky-300 text-sky-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-sky-500 hover:bg-slate-50'
              }`}
              title="展现过滤栏"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>表格过滤</span>
              {(appliedFilterName || appliedFilterIp || appliedFilterPort) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </button>

            <button
              onClick={handleOpenBatchAdvancedConfig}
              disabled={isKnownApp}
              className={`px-3 py-1.5 border rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all shadow-sm ${
                isKnownApp
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'cursor-pointer bg-white border-slate-200 text-slate-600 hover:text-sky-500 hover:bg-slate-50'
              }`}
              title={isKnownApp ? '已知应用不支持修改配置' : '批量高级配置'}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>批量高级配置</span>
              {selectedRuleIds.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100">{selectedRuleIds.length}</span>
              )}
            </button>
            
            <div className="h-4 w-[1px] bg-slate-200" />

            <div className="relative inline-block text-left">
              <button 
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-sky-500 transition-colors cursor-pointer bg-white flex items-center justify-center shadow-sm"
                title="表字段控制列"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <line x1="15" y1="8" x2="18" y2="8" />
                  <line x1="15" y1="12" x2="18" y2="12" />
                  <line x1="15" y1="16" x2="18" y2="16" />
                </svg>
              </button>
              <AnimatePresence>
                {showColumnDropdown && (
                  <>
                    <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setShowColumnDropdown(false)} />
                    <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl py-2 w-48 z-30 flex flex-col gap-0.5">
                      {configurableColumns.map((col, idx) => (
                        <div 
                          key={col.id}
                          draggable
                          onDragStart={(e) => handleColDragStart(e, idx)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (colDragOverIndex !== idx) setColDragOverIndex(idx);
                          }}
                          onDragLeave={() => {
                            if (colDragOverIndex === idx) setColDragOverIndex(null);
                          }}
                          onDrop={(e) => handleColDrop(e, idx)}
                          className={`flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 border-y border-transparent select-none cursor-grab active:cursor-grabbing transition-colors ${
                            colDragOverIndex === idx ? 'bg-sky-50 border-t-sky-400 border-b-sky-400' : ''
                          }`}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0 cursor-grab" />
                          <input 
                            type="checkbox"
                            checked={col.visible}
                            onChange={() => {
                              const updated = columns.map((c) => c.id === col.id ? { ...c, visible: !c.visible } : c);
                              setColumns(updated);
                            }}
                            className="rounded border-slate-300 w-3.5 h-3.5 text-sky-500 focus:ring-sky-500 cursor-pointer"
                          />
                          <span className="text-xs text-slate-700 font-medium">{col.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-[13px]" style={{ minWidth: '985px' }}>
            <thead className="bg-[#f8fafc] text-slate-500 border-b border-slate-200/60">
              <tr>
                <th className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center">
                  <input
                    type="checkbox"
                    disabled={isKnownApp}
                    checked={allFilteredSelected}
                    onChange={(e) => {
                      if (isKnownApp) return;
                      if (e.target.checked) {
                        setSelectedRuleIds(Array.from(new Set([...selectedRuleIds, ...filteredIds])));
                      } else {
                        setSelectedRuleIds(selectedRuleIds.filter((id) => !filteredIds.includes(id)));
                      }
                    }}
                    className="rounded border-slate-300 animate-none cursor-pointer text-sky-500 focus:ring-sky-500"
                  />
                </th>

                {tableColumns.map((col) => {
                  if (col.id === 'index') {
                    return <th key={col.id} className="px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[56px] min-w-[56px] max-w-[56px]">序号</th>;
                  }
                  if (col.id === 'ruleId') {
                    return <th key={col.id} className="px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[88px] min-w-[88px] max-w-[88px]">应用ID</th>;
                  }
                  if (col.id === 'name') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[160px] min-w-[160px] max-w-[160px]">应用名称</th>;
                  }
                  if (col.id === 'port') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[180px] min-w-[180px] max-w-[180px]">物理分配接口</th>;
                  }
                  if (col.id === 'dstIp') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[150px] min-w-[150px] max-w-[150px]">目的IP段</th>;
                  }
                  if (col.id === 'dstPort') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[110px] min-w-[110px] max-w-[110px]">目的端口</th>;
                  }
                  if (col.id === 'srcIp') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[150px] min-w-[150px] max-w-[150px]">源IP段</th>;
                  }
                  if (col.id === 'srcPort') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[110px] min-w-[110px] max-w-[110px]">源端口</th>;
                  }
                  return null;
                })}
                
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center border-l border-slate-100 w-[170px] min-w-[170px] max-w-[170px]">操作</th>
              </tr>

              {showFilterRow && (
                <tr className="bg-slate-50/50 border-b border-slate-150">
                  <th className="px-4 py-2 w-[45px] min-w-[45px] max-w-[45px] text-center">
                    <span className="text-[10px] text-slate-400 font-mono">过滤</span>
                  </th>

                  {tableColumns.map((col) => {
                    if (col.id === 'index') {
                      return <th key="f-index" className="px-3 py-2 w-[56px] min-w-[56px] max-w-[56px]" />;
                    }
                    if (col.id === 'ruleId') {
                      return <th key="f-ruleId" className="px-3 py-2 w-[88px] min-w-[88px] max-w-[88px]" />;
                    }
                    if (col.id === 'port') {
                      return <th key="f-port" className="px-4 py-2 w-[180px] min-w-[180px] max-w-[180px]" />;
                    }
                    if (col.id === 'name') {
                      return (
                        <th key="f-name" className="px-4 py-2 w-[160px] min-w-[160px] max-w-[160px]">
                          <input 
                            type="text"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleExecuteFilter();
                            }}
                            className="w-full text-xs font-normal border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-slate-700 placeholder-slate-400"
                            placeholder="过滤名称"
                          />
                        </th>
                      );
                    }
                    if (col.id === 'dstIp' || col.id === 'srcIp') {
                      return (
                        <th key={`f-${col.id}`} className="px-4 py-2 w-[150px] min-w-[150px] max-w-[150px]">
                          <input 
                            type="text"
                            value={filterIp}
                            onChange={(e) => setFilterIp(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleExecuteFilter();
                            }}
                            className="w-full text-xs font-normal border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-slate-700 font-mono placeholder-slate-400"
                            placeholder="过滤IP"
                          />
                        </th>
                      );
                    }
                    if (col.id === 'dstPort' || col.id === 'srcPort') {
                      return (
                        <th key={`f-${col.id}`} className="px-4 py-2 w-[110px] min-w-[110px] max-w-[110px]">
                          <input 
                            type="text"
                            value={filterPort}
                            onChange={(e) => setFilterPort(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleExecuteFilter();
                            }}
                            className="w-full text-xs font-normal border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-slate-700 font-mono placeholder-slate-400"
                            placeholder="过滤端口"
                          />
                        </th>
                      );
                    }
                    return null;
                  })}

                  <th className="px-4 py-2 border-l border-slate-100 text-center w-[170px] min-w-[170px] max-w-[170px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={handleExecuteFilter}
                        className="px-2 py-1 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-[10px] font-medium rounded transition-colors shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-0.5"
                        title="点击查询"
                      >
                        <Search className="w-2.5 h-2.5" />
                        <span>查询</span>
                      </button>
                      <button 
                        onClick={handleResetFilter}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 text-[10px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap"
                        title="点击重置"
                      >
                        <span>重置</span>
                      </button>
                    </div>
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRenderRows.map((row) => {
                if (row.kind === 'l7-header') {
                  return (
                    <tr key={`l7-header-${row.group}`} className="border-y border-sky-100 bg-sky-50/40">
                      <td colSpan={tableColumns.length + 2} className="px-4 py-2 text-xs font-semibold text-sky-700">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleL7GroupCollapse(row.group);
                              }}
                              className="p-1 hover:bg-sky-100 rounded text-slate-500 hover:text-sky-600 transition-colors inline-flex items-center justify-center shrink-0"
                              title={isL7GroupCollapsed(row.group) ? '展开协议组' : '收起协议组'}
                            >
                              {isL7GroupCollapsed(row.group) ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <span>协议组：{row.group}</span>
                          </div>
                          {['DNS', 'HTTP', 'MySQL', 'Oracle', 'PostgreSQL', 'SSL'].includes(row.group) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenL7GroupSettings(row.group);
                              }}
                              className="shrink-0 px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded transition-colors"
                            >
                              设置
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }

                if (row.kind === 'l7-pagination') {
                  const section = row.section;
                  const rangeStart = (section.currentPage - 1) * L7_GROUP_PAGE_SIZE + 1;
                  const rangeEnd = Math.min(section.currentPage * L7_GROUP_PAGE_SIZE, section.totalCount);
                  return (
                    <tr key={`l7-page-${section.group}`} className="bg-slate-50/30 border-b border-slate-100">
                      <td colSpan={tableColumns.length + 2} className="px-4 py-2.5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                          <span>
                            显示记录从{rangeStart}到{rangeEnd}，共 {section.totalCount} 条
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={section.currentPage <= 1}
                              onClick={() => setL7GroupPage(section.group, section.currentPage - 1)}
                              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            </button>
                            <span>第 {section.currentPage} / {section.totalPages} 页</span>
                            <button
                              type="button"
                              disabled={section.currentPage >= section.totalPages}
                              onClick={() => setL7GroupPage(section.group, section.currentPage + 1)}
                              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                const { item, index } = row;
                return (
                <React.Fragment key={item.id}>
                <tr 
                  className={`hover:bg-slate-50 group transition-all relative ${
                    dragOverIndex === index ? 'bg-sky-50/40 border-t-2 border-t-sky-500' : ''
                  }`}
                  onDragOver={(e) => {
                    if (isKnownApp) return;
                    e.preventDefault();
                    if (dragOverIndex !== index) {
                      setDragOverIndex(index);
                    }
                  }}
                  onDragLeave={() => {
                    if (isKnownApp) return;
                    if (dragOverIndex === index) {
                      setDragOverIndex(null);
                    }
                  }}
                  onDrop={(e) => {
                    if (isKnownApp) return;
                    e.preventDefault();
                    const transferred = e.dataTransfer.getData('text/plain');
                    if (activeTab === 'L7应用') {
                      const srcId = parseInt(transferred, 10);
                      if (!isNaN(srcId)) {
                        reorderL7RulesByIds(srcId, item.id);
                      }
                    } else {
                      const srcIdx = parseInt(transferred, 10);
                      if (!isNaN(srcIdx)) {
                        reorderRules(srcIdx, index);
                      }
                    }
                    setDragOverIndex(null);
                  }}
                >
                  <td className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center">
                    <input
                      type="checkbox"
                      disabled={isKnownApp}
                      checked={selectedRuleIds.includes(item.id)}
                      onChange={(e) => {
                        if (isKnownApp) return;
                        if (e.target.checked) {
                          setSelectedRuleIds(Array.from(new Set([...selectedRuleIds, item.id])));
                        } else {
                          setSelectedRuleIds(selectedRuleIds.filter((id) => id !== item.id));
                        }
                      }}
                      className="rounded border-slate-300 animate-none cursor-pointer text-sky-500 focus:ring-sky-500"
                    />
                  </td>

                  {tableColumns.map((col) => {
                    if (col.id === 'index') {
                      return (
                        <td key={col.id} className="px-3 py-2.5 text-slate-500 whitespace-nowrap select-none relative w-[56px] min-w-[56px] max-w-[56px]">
                          <div className="flex items-center gap-1.5 flex-row justify-center">
                            {!isKnownApp && (
                              <div className="relative inline-block">
                                <button
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                      'text/plain',
                                      activeTab === 'L7应用' ? String(item.id) : String(index)
                                    );
                                    setDragOverIndex(null);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    if (activePriorityMenu?.id === item.id) {
                                      setActivePriorityMenu(null);
                                    } else {
                                      setActivePriorityMenu({
                                        id: item.id,
                                        index: index,
                                        top: rect.bottom + 4,
                                        left: rect.left
                                      });
                                    }
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-sky-500 transition-colors cursor-move shrink-0 inline-flex items-center justify-center"
                                  title="拖动调整优先级 / 点击展开菜单"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            <span className="font-mono text-slate-500 font-medium">{index + 1}</span>
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'ruleId') {
                      const pId = getPhysicalRuleId(item.ruleId, selectedProbe);
                      return (
                        <td key={col.id} className="px-3 py-2.5 whitespace-nowrap text-center w-[88px] min-w-[88px] max-w-[88px]">
                          {selectedProbe === '所有接口' ? (
                            <div className="flex justify-center">
                              <button 
                                onClick={() => handleOpenMappingModal(item)}
                                className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded transition-all cursor-pointer inline-flex items-center justify-center border border-sky-100/50 animate-none"
                                title="多接口RuleID映射"
                              >
                                <FileText className="w-4 h-4 text-sky-505" />
                              </button>
                            </div>
                          ) : (
                            <span 
                              onMouseEnter={(e) => showTooltip(pId, e)}
                              onMouseLeave={hideTooltip}
                              className="font-mono bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 text-xs transition-colors inline-block max-w-[78px] truncate cursor-help"
                            >
                              {pId}
                            </span>
                          )}
                        </td>
                      );
                    }
                    if (col.id === 'name') {
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-600 font-medium whitespace-nowrap text-center w-[160px] min-w-[160px] max-w-[160px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(item.name, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[142px] truncate mx-auto cursor-help"
                          >
                            {item.name}
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'port') {
                      const displayedPort = renderGrabPorts(item.port);
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-center w-[180px] min-w-[180px] max-w-[180px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(displayedPort, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[162px] truncate mx-auto font-medium text-slate-600 text-[12px] cursor-help"
                          >
                            {displayedPort}
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'dstIp') {
                      const val = item.dstIp || 'any';
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-center font-mono text-xs text-slate-700 w-[150px] min-w-[150px] max-w-[150px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(val, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[132px] truncate mx-auto cursor-help"
                          >
                            {val}
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'dstPort') {
                      const val = item.dstPort || 'any';
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-center font-mono text-xs text-slate-700 w-[110px] min-w-[110px] max-w-[110px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(val, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[92px] truncate mx-auto cursor-help"
                          >
                            {val}
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'srcIp') {
                      const val = item.srcIp || 'any';
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-center font-mono text-xs text-slate-700 w-[150px] min-w-[150px] max-w-[150px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(val, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[132px] truncate mx-auto cursor-help"
                          >
                            {val}
                          </div>
                        </td>
                      );
                    }
                    if (col.id === 'srcPort') {
                      const val = item.srcPort || 'any';
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap text-center font-mono text-xs text-slate-700 w-[110px] min-w-[110px] max-w-[110px]">
                          <div 
                            onMouseEnter={(e) => showTooltip(val, e)}
                            onMouseLeave={hideTooltip}
                            className="max-w-[92px] truncate mx-auto cursor-help"
                          >
                            {val}
                          </div>
                        </td>
                      );
                    }
                    return null;
                  })}
                  
                  <td className="px-4 py-2.5 border-l border-slate-100 w-[170px] min-w-[170px] max-w-[170px]">
                    <div className="flex items-center justify-center gap-2.5 text-slate-400">
                      {isReadonlyConfigRule(item) ? (
                        <Edit
                          onClick={() => handleOpenKnownConfig(item)}
                          className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500"
                          title="配置"
                        />
                      ) : (
                        <>
                          <Copy 
                            className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500" 
                            title="复制" 
                            onClick={() => handleCopyRule(item)}
                          />
                          <Edit 
                            className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500" 
                            title="编辑" 
                            onClick={() => handleOpenEdit(item)} 
                          />
                          <Wrench
                            className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500"
                            title="高级配置"
                            onClick={() => handleOpenAdvancedConfig(item)}
                          />
                          <Trash2 
                            className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" 
                            title="删除" 
                            onClick={() => requestDeleteRule(item)}
                          />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => requestToggleRuleEnabled(item)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                          item.enabled === false ? 'bg-slate-300' : 'bg-sky-500'
                        }`}
                        title={item.enabled === false ? '当前：停用，点击启用' : '当前：启用，点击停用'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.enabled === false ? 'translate-x-0.5' : 'translate-x-4'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                </React.Fragment>
                );
              })}
              {/* Fill with empty rows to maintain height */}
              {activeTab !== 'L7应用' && Array.from({ length: Math.max(0, 15 - displayedTableData.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="h-[41px]">
                  <td className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center"><div className="w-4 h-4 rounded border border-slate-100 opacity-0 mx-auto"></div></td>
                  <td className="px-4 py-2.5" colSpan={tableColumns.length + 1}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {activeTab === 'L7应用' ? (
          <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
            共 {filteredTableData.length} 条 L7 应用，各协议组独立分页
          </div>
        ) : (
        <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span>每页显示条数</span>
                <select className="border border-slate-200 rounded px-1.5 py-1 bg-white outline-none">
                  <option>15</option>
                  <option>30</option>
                  <option>50</option>
                  <option>100</option>
                </select>
             </div>
             <div className="flex items-center gap-2">
                <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="w-3.5 h-3.5 rotate-180" /></button>
                <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="w-3.5 h-3.5 rotate-180" /></button>
                <span>第</span>
                <input type="text" value="1" className="w-10 border border-slate-200 rounded px-1 py-0.5 text-center outline-none" readOnly />
                <span>共 1 页</span>
                <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="w-3.5 h-3.5" /></button>
                <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="w-3.5 h-3.5" /></button>
                 <RotateCcw className="w-3.5 h-3.5 ml-2 cursor-pointer text-sky-500" />
              </div>
           </div>
           <div>显示记录从1到{filteredTableData.length}, 总数 {filteredTableData.length} 条</div>
        </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAddModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-slate-200 rounded shadow-2xl w-full max-w-5xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="text-base font-medium text-slate-800">
                  {isAdvancedOnlyMode ? "编辑高级配置" : (isEditMode ? "编辑应用" : isCopyMode ? "复制应用" : "新增应用")}
                  <span className="text-slate-500 font-normal">（协议：{formData.protocolType}）</span>
                  {isAdvancedOnlyMode && activeAdvancedRuleName && (
                    <span className="text-slate-500 font-normal"> - {activeAdvancedRuleName}</span>
                  )}
                </h3>
                <button 
                  onClick={closeAddModal}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-white p-8">
                {isAdvancedOnlyMode ? (
                  <div className="space-y-7 max-w-5xl py-2 max-h-[58vh] overflow-y-auto pr-2 no-scrollbar">
                    {isBatchAdvancedMode && (
                      <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-4 space-y-1">
                        <div className="text-xs font-medium text-slate-700">批量高级配置</div>
                        <div className="text-[11px] text-slate-500">将当前高级参数批量应用到已勾选的 {batchAdvancedRuleIds.length} 条应用，并覆盖其各接口高级配置。</div>
                      </div>
                    )}
                    {/* 第一块：连接超时基本参数 */}
                    <div className="bg-slate-50/50 p-5 rounded-lg border border-slate-100 space-y-5">
                      <div className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        基础超时配置
                      </div>
                      <div className="grid grid-cols-[220px_1fr] items-center gap-y-5 text-[13px]">
                        <label className="text-slate-600 text-right pr-5 font-medium">连接超时阈值</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[320px] flex items-center border border-slate-200 rounded px-3 py-2 bg-white focus-within:border-sky-400 transition-all">
                            <input 
                              type="number" 
                              disabled={isReadOnly}
                              className="w-full outline-none text-slate-700 placeholder:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed text-[13px]" 
                              placeholder="单位：秒 (TCP默认300, UDP默认30)" 
                              value={formData.timeout}
                              onChange={(e) => setFormData({...formData, timeout: e.target.value})}
                            />
                            <span className="text-slate-400 pl-2 ml-2 border-l border-slate-150 whitespace-nowrap text-[13px]">秒</span>
                          </div>
                          <div className="text-xs text-slate-400 whitespace-nowrap">
                            {formData.protocolType === 'TCP' ? '(TCP协议默认300s)' : formData.protocolType === 'UDP' ? '(UDP协议默认30s)' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 第二块：应用性能时延区间 */}
                    <div className="bg-slate-50/50 p-5 rounded-lg border border-slate-100 space-y-5">
                      <div className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span>
                        应用性能时延区间
                      </div>
                      <div className="grid grid-cols-[220px_1fr] items-center gap-y-5 text-[13px]">
                        <label className="text-slate-600 text-right pr-5 font-medium">应用性能</label>
                        <div className="flex flex-wrap items-center gap-3 text-[13px]">
                          <span className="text-green-500 whitespace-nowrap">响应迅速</span>
                          <span className="text-slate-400">≤</span>
                          <div className="flex items-center border border-slate-200 rounded px-2.5 py-1 bg-white group focus-within:border-sky-400 transition-colors">
                            <input
                              type="text"
                              disabled={isReadOnly}
                              className="w-14 py-1 outline-none text-center disabled:bg-slate-50"
                              value={formData.performanceRapid}
                              onChange={(e) => setFormData({ ...formData, performanceRapid: e.target.value })}
                            />
                            <span className="text-slate-400 px-1.5 border-l border-slate-100 ml-2">毫秒</span>
                          </div>
                          <span className="text-slate-400">{'<'}</span>
                          <span className="text-amber-500 whitespace-nowrap">响应正常</span>
                          <span className="text-slate-400">≤</span>
                          <div className="flex items-center border border-slate-200 rounded px-2.5 py-1 bg-white group focus-within:border-sky-400 transition-colors">
                            <input
                              type="text"
                              disabled={isReadOnly}
                              className="w-14 py-1 outline-none text-center disabled:bg-slate-50"
                              value={formData.performanceNormal}
                              onChange={(e) => setFormData({ ...formData, performanceNormal: e.target.value })}
                            />
                            <span className="text-slate-400 px-1.5 border-l border-slate-100 ml-2">毫秒</span>
                          </div>
                          <span className="text-slate-400">{'<'}</span>
                          <span className="text-red-500 whitespace-nowrap">响应超时</span>
                        </div>
                      </div>
                    </div>

                    {/* 第三块：底层参数调优 */}
                    <div className="bg-slate-50/50 p-5 rounded-lg border border-slate-100 space-y-5">
                      <div className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        底层参数调优
                      </div>
                      <div className="grid grid-cols-[220px_1fr] items-center gap-y-5 text-[13px]">
                        {/* CPU分配(Statistics core ID) */}
                        <label className="text-slate-600 text-right pr-5 font-medium">CPU分配(Statistics core ID)</label>
                        <input 
                          type="text" 
                          disabled={isReadOnly}
                          className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                          placeholder="请输入核心 ID (选填)"
                          value={formData.p2CpuStatsCore}
                          onChange={(e) => setFormData({...formData, p2CpuStatsCore: e.target.value})}
                        />

                        {showCpuLogCoreInAdvanced && (
                          <>
                            {/* CPU分配(Log core ID) */}
                            <label className="text-slate-600 text-right pr-5 font-medium">CPU分配(Log core ID)</label>
                            <input 
                              type="text" 
                              disabled={isReadOnly}
                              className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                              value={formData.p2CpuLogCore}
                              onChange={(e) => setFormData({...formData, p2CpuLogCore: e.target.value})}
                            />
                          </>
                        )}

                        {/* 应用巨帧包长阈值 */}
                        <label className="text-slate-600 text-right pr-5 font-medium">应用巨帧包长阈值</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2GiantFrameThreshold}
                            onChange={(e) => setFormData({...formData, p2GiantFrameThreshold: e.target.value})}
                          />
                          <Info 
                            onMouseEnter={(e) => showTooltip("控制针对巨帧（Giant Packet）包长的过滤条件。通常当以太网二层网络MTU大于1500时配置该数值，可有效过滤巨型载荷帧。", e)}
                            onMouseLeave={hideTooltip}
                            className="w-3.5 h-3.5 text-slate-400 cursor-help"
                          />
                        </div>

                        {/* SRv6解析 */}
                        <label className="text-slate-600 text-right pr-5 font-medium">SRv6解析</label>
                        <select
                          disabled={isReadOnly}
                          value={formData.p2Srv6Parsing}
                          onChange={(e) => setFormData({ ...formData, p2Srv6Parsing: e.target.value })}
                          className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                          <option value="开启">开启</option>
                          <option value="关闭">关闭</option>
                        </select>

                        {/* 连接中间状态处理 */}
                        <label className="text-slate-600 text-right pr-5 font-medium">连接中间状态处理</label>
                        <select
                          disabled={isReadOnly}
                          value={formData.p2ConnInterStateHandling}
                          onChange={(e) => setFormData({ ...formData, p2ConnInterStateHandling: e.target.value })}
                          className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                          <option value="开启">开启</option>
                          <option value="关闭">关闭</option>
                        </select>

                        {/* 规则平衡 */}
                        <label className="text-slate-600 text-right pr-5 font-medium">规则平衡</label>
                        <select
                          disabled={isReadOnly}
                          value={formData.p2RuleBalancing}
                          onChange={(e) => setFormData({ ...formData, p2RuleBalancing: e.target.value })}
                          className="w-72 border border-slate-200 rounded px-3 py-2 text-[13px] bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                          <option value="未配置">未配置</option>
                          <option value="开启">开启</option>
                          <option value="关闭">关闭</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-7 max-w-5xl">
                    {/* Form Grid */}
                    <div className="grid grid-cols-[120px_1fr] items-center gap-y-7 text-sm">
                    <label className="text-slate-600 text-right pr-4">应用名称</label>
                    <input 
                      type="text" 
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed" 
                      placeholder="输入应用名称"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />

                    {activeTab === 'L7应用' && (
                      <>
                        <label className="text-slate-600 text-right pr-4">L7协议组</label>
                        <select
                          disabled={isReadOnly}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed text-xs"
                          value={formData.l7Group}
                          onChange={(e) => setFormData({ ...formData, l7Group: e.target.value })}
                        >
                          <option value="">请选择协议组</option>
                          {l7GroupOptions.map((group) => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </>
                    )}

                    {activeTab === 'IP应用' && (
                      <>
                        <label className="text-slate-600 text-right pr-4">协议</label>
                        <select
                          disabled={isReadOnly}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed text-xs"
                          value={formData.protocolType}
                          onChange={(e) => setFormData({ ...formData, protocolType: e.target.value })}
                        >
                          <option value="">请选择协议</option>
                          {getIpProtocolOptionsForForm(formData.protocolType).map((proto) => (
                            <option key={proto} value={proto}>{proto}</option>
                          ))}
                        </select>
                      </>
                    )}

                    {/* Probes - Moved up and updated with logic */}
                    <label className="text-slate-600 text-right pr-4">探针接口</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative w-full">
                        <div
                          onClick={() => !isReadOnly && setIsProbeDropdownOpen(!isProbeDropdownOpen)}
                          className={`w-full min-h-[38px] border rounded-lg px-3 py-2 flex items-center justify-between ${
                            isReadOnly
                              ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400'
                              : 'bg-white border-slate-200 cursor-pointer hover:border-sky-300'
                          } transition-all select-none`}
                        >
                          <span className="text-slate-700 text-xs font-medium truncate pr-3">
                            {formData.probeMode === 'all'
                              ? `接口(${probeOptions.length}条)`
                              : formData.selectedProbes.length > 0
                                ? formData.selectedProbes.join('；')
                                : '请选择'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProbeDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isProbeDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProbeDropdownOpen(false)} />
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden">
                              <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center gap-3 text-[12px]">
                                <button
                                  type="button"
                                  onClick={() => setProbeDropdownView('selected')}
                                  className={`inline-flex items-center gap-1 ${probeDropdownView === 'selected' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                                  已选
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => setProbeDropdownView('unselected')}
                                  className={`inline-flex items-center gap-1 ${probeDropdownView === 'unselected' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-slate-300 border border-slate-400" />
                                  未选
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isReadOnly) return;
                                    if (isEditMode) {
                                      const locked = editLockedProbes;
                                      setFormData({
                                        ...formData,
                                        probeMode: locked.length === probeOptions.length ? 'all' : 'custom',
                                        selectedProbes: locked.length === probeOptions.length ? [] : locked,
                                      });
                                    } else {
                                      setFormData({ ...formData, probeMode: 'custom', selectedProbes: [] });
                                    }
                                    setProbeDropdownView('all');
                                  }}
                                  className="inline-flex items-center gap-1 text-slate-500 hover:text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  清除
                                </button>
                              </div>

                              <div className="max-h-56 overflow-y-auto">
                                <div className="flex items-center px-3 py-2.5 border-b border-slate-100 bg-slate-50">
                                  <input
                                    type="checkbox"
                                    disabled={isReadOnly}
                                    checked={allProbeChecked}
                                    onChange={() => {
                                      if (isReadOnly) return;
                                      if (isEditMode && allProbeChecked) return;
                                      if (allProbeChecked) {
                                        setFormData({ ...formData, probeMode: 'custom', selectedProbes: [] });
                                      } else {
                                        setFormData({ ...formData, probeMode: 'all', selectedProbes: [] });
                                      }
                                    }}
                                    className="rounded text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 border-slate-300 cursor-pointer disabled:opacity-50"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setProbeGroupCollapsed(!probeGroupCollapsed)}
                                    className="ml-2 flex-1 flex items-center justify-between text-left text-slate-700 text-[12px] font-medium"
                                  >
                                    <span>接口 ({probeOptions.length}条)</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${probeGroupCollapsed ? '-rotate-90' : ''}`} />
                                  </button>
                                </div>

                                {!probeGroupCollapsed && filteredProbeOptions.map((probe) => {
                                  const isSelected = effectiveSelectedProbes.includes(probe);
                                  const isLockedProbe = isEditMode && editLockedProbes.includes(probe);
                                  return (
                                    <label
                                      key={probe}
                                      className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-xs select-none border-b border-slate-100 last:border-b-0"
                                    >
                                      <input
                                        type="checkbox"
                                        disabled={isReadOnly || (isLockedProbe && isSelected)}
                                        checked={isSelected}
                                        onChange={() => {
                                          if (isReadOnly) return;
                                          if (isLockedProbe && isSelected) return;
                                          let nextSelected = formData.probeMode === 'all' ? [...probeOptions] : [...formData.selectedProbes];
                                          if (isSelected) {
                                            nextSelected = nextSelected.filter((p) => p !== probe);
                                          } else {
                                            nextSelected.push(probe);
                                          }
                                          setFormData({
                                            ...formData,
                                            probeMode: nextSelected.length === probeOptions.length ? 'all' : 'custom',
                                            selectedProbes: nextSelected.length === probeOptions.length ? [] : nextSelected,
                                          });
                                        }}
                                        className="rounded text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 border-slate-300 cursor-pointer disabled:opacity-50"
                                      />
                                      <Network className="w-3.5 h-3.5 text-sky-500" />
                                      <span className={isSelected ? 'text-sky-600 font-semibold' : 'text-slate-600'}>
                                        {probe.replace('探针(', '').replace(')', '')}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <label className="text-slate-600 text-right pr-4 self-start pt-2">应用定义</label>
                    <div className="space-y-4">
                      {protocol === '混栈应用' && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                          混栈应用规则要求：源/目的IP中需至少同时包含一组 <strong>IPv4 + IPv6</strong> 地址。
                        </div>
                      )}
                      {(activeTab === 'IP应用'
                        ? [
                            { key: 'srcIp', title: '源IP组', placeholder: protocol === '混栈应用' ? '输入源IP，支持 IPv4/IPv6' : '输入源IP，例如 192.168.1.10/24' },
                            { key: 'dstIp', title: '目的IP组', placeholder: protocol === '混栈应用' ? '输入目的IP，支持 IPv4/IPv6' : '输入目的IP，例如 10.0.0.5' },
                          ]
                        : [
                            { key: 'srcIp', title: '源IP组', placeholder: '输入源IP，例如 192.168.1.10/24' },
                            { key: 'srcPort', title: '源端口组', placeholder: '输入源端口，例如 80,443,1000-2000' },
                            { key: 'dstIp', title: '目的IP组', placeholder: '输入目的IP，例如 10.0.0.5' },
                            { key: 'dstPort', title: '目的端口组', placeholder: '输入目的端口，例如 53,8080' },
                          ]
                      ).map((group) => (
                        <div key={group.key} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-700">{group.title}</div>
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() => addAdvancedItem(group.key)}
                              className="px-2 py-1 border border-slate-200 rounded text-[11px] text-slate-600 hover:border-sky-300 hover:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              + 添加排除
                            </button>
                          </div>

                          {(advancedGroups[group.key] || []).map((row: any, idx: number) => (
                            <div key={row.id} className="space-y-2">
                              <div className="flex items-center gap-2">
                                {idx > 0 && (
                                  <span className="w-10 text-xs text-slate-500 text-center">排除</span>
                                )}
                                <input
                                  type="text"
                                  disabled={isReadOnly}
                                  className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-sky-400 placeholder:text-slate-300 disabled:bg-slate-50"
                                  placeholder={group.placeholder}
                                  value={row.value}
                                  onChange={(e) => updateAdvancedItem(group.key, idx, { value: e.target.value })}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <label className="text-slate-600 text-right pr-4">存包长度</label>
                    <select
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed text-xs"
                      value={formData.storageLength}
                      onChange={(e) => setFormData({ ...formData, storageLength: e.target.value })}
                    >
                      <option>64字节</option>
                      <option>128字节</option>
                      <option>全包</option>
                    </select>
                  </div>
                </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              {!isReadOnly && (
                <div className="px-6 py-6 flex justify-center gap-8 bg-white border-t border-slate-50">
                  <button 
                    onClick={closeAddModal}
                    className="px-12 py-2.5 bg-slate-300 text-slate-700 rounded font-medium hover:bg-slate-400/60 transition-all shadow-sm transform active:scale-95 text-xs cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                     onClick={handleSaveModal}
                     className="px-12 py-2.5 bg-sky-500 text-white rounded font-medium hover:bg-sky-600 transition-all shadow-sm transform active:scale-95 text-xs cursor-pointer"
                  >
                    确定
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Probe to App ID Mapping Modal for All Probes Selector */}
      <AnimatePresence>
        {showMappingModal && activeMappingRule && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowMappingModal(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative bg-white border border-slate-200 rounded shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
             >
               <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white text-xs font-semibold text-slate-800">
                 <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4 text-sky-500" />
                   <h3 className="text-sm font-semibold text-slate-800">
                     接口选择 ── 应用ID 映射
                   </h3>
                 </div>
                 <button 
                   onClick={() => setShowMappingModal(false)}
                   className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                 >
                   <X className="w-4 h-4 text-slate-400" />
                 </button>
               </div>
               
               <div className="p-5 bg-slate-50/50">
                <div className="mb-3 text-[11px] text-slate-500">
                  当前自定义应用: <span className="font-semibold text-slate-700">{activeMappingRule.name}</span>
                </div>
                
                <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-slate-500 border-b border-slate-150">
                      <tr>
                        <th className="px-4 py-2 pr-2 text-slate-600 font-semibold uppercase">接口名称</th>
                        <th className="px-4 py-2 text-slate-600 font-semibold text-right font-mono">分配应用ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(() => {
                        const rulePorts = !activeMappingRule.port || activeMappingRule.port === '所有接口' || activeMappingRule.port === '所有探针' || activeMappingRule.port === '所有'
                          ? ['探针(Retx):接口1', '探针(SRV6):接口1', '探针(重传):接口1']
                          : activeMappingRule.port.split(';').map((s: any) => s.trim()).filter(Boolean);

                        return rulePorts.map((probe: string, idx: number) => {
                          const rId = getPhysicalRuleId(activeMappingRule.ruleId, probe);

                          return (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="px-4 py-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                {probe}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">{rId}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100/60 rounded text-[11px] text-slate-500 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                  <span>
                    提示: 应用ID在不同接口物理实例下具有唯一的硬件分配段落。此处显示的是对应接口实例的流控映射数值。
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-white">
                <button 
                  onClick={() => setShowMappingModal(false)}
                  className="px-6 py-1.5 bg-sky-500 text-white rounded text-xs hover:bg-sky-600 transition-colors shadow-sm cursor-pointer font-medium"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {pendingDeleteRule && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingDeleteRule(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">删除确认</h3>
                <button
                  onClick={() => setPendingDeleteRule(null)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-5 py-4 text-sm text-slate-600">
                删除当前应用「<span className="font-semibold text-slate-800">{pendingDeleteRule.name}</span>」后，相关功能（如应用拓扑、应用组等）中的应用将会被取消关联，确认删除？
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setPendingDeleteRule(null)}
                  className="px-4 py-2 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteRule}
                  className="px-4 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DNS Config Modal */}
      <AnimatePresence>
        {showDnsConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDnsConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">DNS配置</h3>
                <button
                  type="button"
                  onClick={() => setShowDnsConfigModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="基本设置">
                  <L7ConfigFormRow label="DNS解析">
                    <L7EnabledSelect
                      value={dnsConfigDraft.dnsResolution}
                      onChange={(v) => setDnsConfigDraft((prev) => ({ ...prev, dnsResolution: v }))}
                    />
                  </L7ConfigFormRow>
                  <L7DataSourceRow
                    clickhouse={dnsConfigDraft.clickhouse}
                    mongodb={dnsConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setDnsConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                </L7ConfigSection>
              </div>
              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7ProtocolConfigs((prev) => ({ ...prev, [protocol]: { ...dnsConfigDraft } }));
                    setShowDnsConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HTTP Config Modal */}
      <AnimatePresence>
        {showHttpConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHttpConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">HTTP配置</h3>
                <button
                  type="button"
                  onClick={() => setShowHttpConfigModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="全局配置">
                  <L7ConfigFormRow label="文件目录拆分周期长度">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={httpConfigDraft.fileSplitCycleHours}
                        onChange={(e) => setHttpConfigDraft((prev) => ({ ...prev, fileSplitCycleHours: e.target.value }))}
                        className={L7_CONFIG_INPUT_SM}
                      />
                      <span className="text-slate-500 text-sm">(小时)</span>
                    </div>
                  </L7ConfigFormRow>
                  <L7ConfigFormRow label="文件有效时长限制">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={httpConfigDraft.fileValidityHours}
                        onChange={(e) => setHttpConfigDraft((prev) => ({ ...prev, fileValidityHours: e.target.value }))}
                        className={L7_CONFIG_INPUT_SM}
                      />
                      <span className="text-slate-500 text-sm">(小时)</span>
                    </div>
                  </L7ConfigFormRow>
                </L7ConfigSection>

                <L7ConfigSection title="基本设置">
                  {[
                    { key: 'httpParsing' as const, label: 'HTTP解析' },
                    { key: 'truncatedPacketAnalysis' as const, label: '截断包分析' },
                    { key: 'parseFirstHttpOnly' as const, label: '只解析第一个HTTP Request/Response' },
                    { key: 'onlyRuleMatchUrl' as const, label: '只统计匹配RuleMatch URL规则的HTTP Request/Response' },
                    { key: 'httpRequestHeaderDisplay' as const, label: 'HTTP请求头部展示' },
                  ].map((item) => (
                    <L7ConfigFormRow key={item.key} label={item.label}>
                      <L7EnabledSelect
                        value={httpConfigDraft[item.key]}
                        onChange={(v) => setHttpConfigDraft((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </L7ConfigFormRow>
                  ))}
                  <L7ConfigFormRow label="HTTP Session信息详单速率限制(条/秒)">
                    <input
                      type="text"
                      value={httpConfigDraft.sessionRateLimit}
                      onChange={(e) => setHttpConfigDraft((prev) => ({ ...prev, sessionRateLimit: e.target.value }))}
                      className={L7_CONFIG_INPUT_SM}
                    />
                  </L7ConfigFormRow>
                  <L7DataSourceRow
                    clickhouse={httpConfigDraft.clickhouse}
                    mongodb={httpConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setHttpConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                </L7ConfigSection>

                <L7ConfigSection title="还原配置">
                  <L7ConfigFormRow label="文件还原">
                    <L7EnabledSelect
                      value={httpConfigDraft.fileRestore}
                      onChange={(v) => setHttpConfigDraft((prev) => ({ ...prev, fileRestore: v }))}
                    />
                  </L7ConfigFormRow>
                  <L7ConfigFormRow label="文件大小限制(MB)">
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={httpConfigDraft.fileSizeMin}
                        onChange={(e) => setHttpConfigDraft((prev) => ({ ...prev, fileSizeMin: e.target.value }))}
                        className={L7_CONFIG_INPUT_SM}
                      />
                      <span className="text-slate-500 text-sm">&lt;= 文件大小 &lt;</span>
                      <input
                        type="text"
                        value={httpConfigDraft.fileSizeMax}
                        onChange={(e) => setHttpConfigDraft((prev) => ({ ...prev, fileSizeMax: e.target.value }))}
                        className={L7_CONFIG_INPUT_SM}
                      />
                    </div>
                  </L7ConfigFormRow>
                  <L7ConfigFormRow label="文件还原模式">
                    <SearchableSelect
                      value={httpConfigDraft.fileRestoreMode}
                      onChange={(v) => setHttpConfigDraft((prev) => ({ ...prev, fileRestoreMode: v }))}
                      options={[
                        { value: '全部', label: '全部' },
                        { value: '仅请求', label: '仅请求' },
                        { value: '仅响应', label: '仅响应' },
                      ]}
                    />
                  </L7ConfigFormRow>
                </L7ConfigSection>
              </div>
              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7HttpConfigs((prev) => ({ ...prev, [protocol]: { ...httpConfigDraft } }));
                    setShowHttpConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MySQL Config Modal */}
      <AnimatePresence>
        {showMysqlConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMysqlConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">MySQL配置</h3>
                <button type="button" onClick={() => setShowMysqlConfigModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="基本设置">
                  {[
                    { key: 'mysqlParsing' as const, label: 'MySQL解析' },
                    { key: 'recordSelect' as const, label: '记录Select语句' },
                    { key: 'recordUpdate' as const, label: '记录Update语句' },
                    { key: 'recordDelete' as const, label: '记录Delete语句' },
                    { key: 'recordInsert' as const, label: '记录Insert语句' },
                    { key: 'recordExecute' as const, label: '记录Execute语句' },
                    { key: 'recordPrepare' as const, label: '记录Prepare语句' },
                    { key: 'recordOtherSql' as const, label: '记录其它SQL语句' },
                  ].map((item) => (
                    <L7ConfigFormRow key={item.key} label={item.label}>
                      <L7EnabledSelect
                        value={mysqlConfigDraft[item.key]}
                        onChange={(v) => setMysqlConfigDraft((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </L7ConfigFormRow>
                  ))}
                  <L7DataSourceRow
                    clickhouse={mysqlConfigDraft.clickhouse}
                    mongodb={mysqlConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setMysqlConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                </L7ConfigSection>
              </div>
              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7MysqlConfigs((prev) => ({ ...prev, [protocol]: { ...mysqlConfigDraft } }));
                    setShowMysqlConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Oracle Config Modal */}
      <AnimatePresence>
        {showOracleConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOracleConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">Oracle配置</h3>
                <button type="button" onClick={() => setShowOracleConfigModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="基本设置">
                  {[
                    { key: 'oracleParsing' as const, label: 'Oracle解析' },
                    { key: 'recordSelect' as const, label: '记录Select语句' },
                    { key: 'recordUpdate' as const, label: '记录Update语句' },
                    { key: 'recordDelete' as const, label: '记录Delete语句' },
                    { key: 'recordInsert' as const, label: '记录Insert语句' },
                    { key: 'recordOtherSql' as const, label: '记录其它SQL语句' },
                  ].map((item) => (
                    <L7ConfigFormRow key={item.key} label={item.label}>
                      <L7EnabledSelect
                        value={oracleConfigDraft[item.key]}
                        onChange={(v) => setOracleConfigDraft((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </L7ConfigFormRow>
                  ))}
                  <L7DataSourceRow
                    clickhouse={oracleConfigDraft.clickhouse}
                    mongodb={oracleConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setOracleConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                </L7ConfigSection>
              </div>
              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7OracleConfigs((prev) => ({ ...prev, [protocol]: { ...oracleConfigDraft } }));
                    setShowOracleConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PostgreSQL Config Modal */}
      <AnimatePresence>
        {showPgConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPgConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">PostgreSQL配置</h3>
                <button type="button" onClick={() => setShowPgConfigModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="基本设置">
                  <L7ConfigFormRow label="PostgreSQL解析">
                    <L7EnabledSelect
                      value={pgConfigDraft.pgParsing}
                      onChange={(v) => setPgConfigDraft((prev) => ({ ...prev, pgParsing: v }))}
                    />
                  </L7ConfigFormRow>
                  <L7DataSourceRow
                    clickhouse={pgConfigDraft.clickhouse}
                    mongodb={pgConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setPgConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                </L7ConfigSection>
              </div>
              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7PgConfigs((prev) => ({ ...prev, [protocol]: { ...pgConfigDraft } }));
                    setShowPgConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SSL Config Modal (integrated) */}
      <AnimatePresence>
        {showSslConfigModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSslConfigModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={L7_MODAL_HEADER}>
                <h3 className="text-base font-semibold text-slate-800">SSL配置</h3>
                <button type="button" onClick={() => setShowSslConfigModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className={L7_MODAL_BODY}>
                <L7ConfigSection title="基本设置">
                  {[
                    { key: 'sslParsing' as const, label: 'SSL解析' },
                    { key: 'keywordDomainStats' as const, label: '关键域名统计' },
                  ].map((item) => (
                    <L7ConfigFormRow key={item.key} label={item.label}>
                      <L7EnabledSelect
                        value={sslConfigDraft[item.key]}
                        onChange={(v) => setSslConfigDraft((prev) => ({ ...prev, [item.key]: v }))}
                      />
                    </L7ConfigFormRow>
                  ))}
                  <L7DataSourceRow
                    clickhouse={sslConfigDraft.clickhouse}
                    mongodb={sslConfigDraft.mongodb}
                    onChange={({ clickhouse, mongodb }) => setSslConfigDraft((prev) => ({ ...prev, clickhouse, mongodb }))}
                  />
                  <L7ConfigFormRow label="详单记录">
                    <SearchableSelect
                      value={sslConfigDraft.detailRecord}
                      onChange={(v) => setSslConfigDraft((prev) => ({ ...prev, detailRecord: v as SslDetailRecord }))}
                      options={[
                        { value: '全记录', label: '全记录' },
                        { value: '只记录SNI', label: '只记录SNI' },
                        { value: '只记录证书', label: '只记录证书' },
                      ]}
                    />
                  </L7ConfigFormRow>
                </L7ConfigSection>

                <div className="rounded-lg border border-slate-200 px-6 py-6">
                  <div className="flex items-center gap-2 -mt-9 ml-3 bg-white px-2 inline-flex text-sm font-semibold text-slate-700 mb-2">
                    <span>域名模型</span>
                    <Info className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-[160px_1fr_72px_48px] gap-4 items-center mb-3">
                    <span className="text-sm text-slate-500 text-left">模型名称</span>
                    <span className="text-sm text-slate-500 text-left">模型</span>
                    <span className="text-sm text-slate-500 text-left">正则</span>
                    <span />
                  </div>

                  <div className="grid grid-cols-[160px_1fr_72px_48px] gap-4 items-center mb-4">
                    <input
                      type="text"
                      value={sslNewDomainModel.name}
                      onChange={(e) => setSslNewDomainModel((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="模型名称"
                      className={L7_CONFIG_INPUT}
                    />
                    <input
                      type="text"
                      value={sslNewDomainModel.pattern}
                      onChange={(e) => setSslNewDomainModel((prev) => ({ ...prev, pattern: e.target.value }))}
                      placeholder="模型"
                      className={`${L7_CONFIG_INPUT} max-w-none`}
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sslNewDomainModel.isRegex}
                        onChange={(e) => setSslNewDomainModel((prev) => ({ ...prev, isRegex: e.target.checked }))}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 w-4 h-4"
                      />
                      正则
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!sslNewDomainModel.name.trim() && !sslNewDomainModel.pattern.trim()) return;
                        setSslDomainModelsDraft((prev) => [
                          ...prev,
                          {
                            id: `ssl-domain-model-${Date.now()}`,
                            name: sslNewDomainModel.name.trim(),
                            pattern: sslNewDomainModel.pattern.trim(),
                            isRegex: sslNewDomainModel.isRegex,
                          },
                        ]);
                        setSslNewDomainModel({ name: '', pattern: '', isRegex: false });
                      }}
                      className="justify-self-end p-2 border border-slate-200 rounded-md hover:border-sky-300 hover:text-sky-600 transition-colors"
                      title="新增"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {sslDomainModelsDraft.map((row) => (
                      <div key={row.id} className="grid grid-cols-[160px_1fr_72px_48px] gap-4 items-center">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => setSslDomainModelsDraft((prev) => prev.map((x) => (x.id === row.id ? { ...x, name: e.target.value } : x)))}
                          className={L7_CONFIG_INPUT}
                        />
                        <input
                          type="text"
                          value={row.pattern}
                          onChange={(e) => setSslDomainModelsDraft((prev) => prev.map((x) => (x.id === row.id ? { ...x, pattern: e.target.value } : x)))}
                          className={`${L7_CONFIG_INPUT} max-w-none`}
                        />
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.isRegex}
                            onChange={(e) => setSslDomainModelsDraft((prev) => prev.map((x) => (x.id === row.id ? { ...x, isRegex: e.target.checked } : x)))}
                            className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 w-4 h-4"
                          />
                          正则
                        </label>
                        <button
                          type="button"
                          onClick={() => setSslDomainModelsDraft((prev) => prev.filter((x) => x.id !== row.id))}
                          className="justify-self-end p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-slate-500 pt-4">
                    说明：定义完成域名模型后，可以在L7分析下的&quot;SSL Pattern&quot;查看数据。
                  </div>
                </div>
              </div>

              <div className={L7_MODAL_FOOTER}>
                <L7ConfigSaveButton
                  onClick={() => {
                    setL7SslConfigs((prev) => ({
                      ...prev,
                      [protocol]: {
                        config: { ...sslConfigDraft },
                        domainModels: sslDomainModelsDraft.map((m) => ({ ...m })),
                      },
                    }));
                    setShowSslConfigModal(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enable Toggle Confirm Modal */}
      <AnimatePresence>
        {pendingEnableToggle && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingEnableToggle(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">状态切换确认</h3>
                <button
                  onClick={() => setPendingEnableToggle(null)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="px-5 py-4 text-sm text-slate-600">
                确认{pendingEnableToggle.nextEnabled ? '启用' : '停用'}应用「
                <span className="font-semibold text-slate-800">{pendingEnableToggle.name}</span>
                」吗？
              </div>
              <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setPendingEnableToggle(null)}
                  className="px-4 py-2 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={confirmToggleRuleEnabled}
                  className="px-4 py-2 text-xs bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors cursor-pointer"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload/Import Config Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col z-10 animate-none"
            >
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-white select-none">
                <h3 className="text-sm font-semibold text-slate-800">上传文件</h3>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-5 bg-white text-xs">
                {/* 接口 field */}
                <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                  <label className="text-slate-550 font-medium font-semibold text-xs text-slate-500">接口</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsImportProbeDropdownOpen(!isImportProbeDropdownOpen)}
                      className="min-h-[34px] border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white hover:border-slate-350 focus-within:border-sky-400 flex items-center justify-between cursor-pointer flex-wrap gap-1 shadow-sm transition-all animate-none"
                    >
                      <div className="flex flex-wrap gap-1 items-center">
                        {importSelectedInterfaces.map((item) => (
                          <span key={item} className="bg-slate-105 border border-slate-150 text-slate-650 text-[11px] rounded px-2 py-0.5 flex items-center gap-1 font-semibold select-none group">
                            {item}
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setImportSelectedInterfaces(prev => prev.filter(i => i !== item));
                              }}
                              className="text-slate-400 hover:text-red-500 font-bold ml-1 text-[13px] leading-none cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {importSelectedInterfaces.length === 0 && (
                          <span className="text-slate-300 text-[11px]">请选择目标接口...</span>
                        )}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none ml-1" />
                    </div>
                    <AnimatePresence>
                      {isImportProbeDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-45 bg-transparent" onClick={() => setIsImportProbeDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto py-1.5 z-50 flex flex-col gap-0.5">
                            {['Probe / Lab', '探针(Retx):接口1', '探针(SRV6):接口1', '探针(重传):接口1'].map((item) => {
                              const checked = importSelectedInterfaces.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    if (checked) {
                                      setImportSelectedInterfaces(prev => prev.filter(i => i !== item));
                                    } else {
                                      setImportSelectedInterfaces(prev => [...prev, item]);
                                    }
                                  }}
                                  className="px-3 py-1.5 text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer text-slate-700 font-semibold select-none text-[11px]"
                                >
                                  <span>{item}</span>
                                  {checked && <span className="text-sky-500 font-bold text-xs">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 同名规则导入 field */}
                <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                  <label className="text-slate-550 font-medium font-semibold text-xs text-slate-500">同名规则导入</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                      <input 
                        type="radio" 
                        name="conflictStrategy" 
                        checked={importConflictStrategy === 'merge'}
                        onChange={() => setImportConflictStrategy('merge')}
                        className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-slate-750 text-xs font-semibold group-hover:text-slate-900">合并配置</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                      <input 
                        type="radio" 
                        name="conflictStrategy" 
                        checked={importConflictStrategy === 'overwrite'}
                        onChange={() => setImportConflictStrategy('overwrite')}
                        className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-slate-750 text-xs font-semibold group-hover:text-slate-900">覆盖配置</span>
                    </label>
                  </div>
                </div>

                {/* Dashed upload zone */}
                <div 
                  onDragEnter={() => setDragActive(true)}
                  onDragOver={dragOverImport}
                  onDragLeave={dragLeaveImport}
                  onDrop={dropImport}
                  onClick={() => document.getElementById('config-file-upload')?.click()}
                  className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                    dragActive 
                      ? 'border-sky-450 bg-sky-50/10' 
                      : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/30 bg-slate-50/10'
                  }`}
                >
                  <input 
                    id="config-file-upload" 
                    type="file" 
                    accept=".txt,.excel,.csv,.xlsx,.xls"
                    className="hidden" 
                    onChange={fileSelectImport}
                  />
                  
                  {!importedFile ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-3">
                      <div className="p-2.5 bg-sky-50 text-sky-500 rounded-full">
                        <Upload className="w-6 h-6 animate-none" />
                      </div>
                      <div className="text-slate-450 font-semibold text-xs text-slate-500">
                        将文件拖到此处，或 <span className="text-sky-500 hover:underline cursor-pointer">点击上传</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal max-w-sm">
                        上传文件导入规则，支持上传txt，excel和csv格式
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 w-full" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg w-full max-w-md relative">
                        <FileText className="w-7 h-7 text-sky-500 shrink-0" />
                        <div className="flex-1 text-left min-w-0 pr-4">
                          <h4 className="text-xs text-slate-705 font-bold truncate select-all leading-tight">{importedFile.name}</h4>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">{importedFile.size} KB</p>
                          <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-1 rounded-full w-full animate-none" />
                          </div>
                        </div>
                        <button 
                          onClick={() => setImportedFile(null)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-550 rounded-full transition-colors shrink-0 cursor-pointer absolute top-2 right-2 flex items-center justify-center"
                          title="移除文件"
                        >
                          <X className="w-3 px-0 h-3 shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 flex justify-center gap-4 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg text-xs font-semibold shadow-sm border border-slate-200 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  取消
                </button>
                <button 
                  onClick={handleConfirmImport}
                  className="px-6 py-1.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Priority reorder dropdown popover */}
      <AnimatePresence>
        {activePriorityMenu !== null && (
          <>
            {/* Backdrop click to dismiss */}
            <div 
              className="fixed inset-0 z-[9998] bg-transparent" 
              onClick={() => setActivePriorityMenu(null)} 
            />
            {/* Dropdown list rendered in viewport absolute positioning */}
            <div 
              style={{ 
                position: 'fixed', 
                top: `${activePriorityMenu.top}px`, 
                left: `${activePriorityMenu.left}px` 
              }}
              className="w-28 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] py-1 divide-y divide-slate-100 text-xs text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => moveRuleToTop(activePriorityMenu.index)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium whitespace-nowrap cursor-pointer flex items-center justify-between"
              >
                <span>置顶</span>
                <span className="text-[10px] text-slate-400">Top</span>
              </button>
              <button 
                onClick={() => moveRuleUp(activePriorityMenu.index)}
                disabled={activeTab === 'L7应用' ? !getL7MoveMeta(activePriorityMenu.index).canUp : activePriorityMenu.index === 0}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium whitespace-nowrap flex items-center justify-between ${
                  (activeTab === 'L7应用' ? !getL7MoveMeta(activePriorityMenu.index).canUp : activePriorityMenu.index === 0) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
                }`}
              >
                <span>上移</span>
                <span className="text-[10px] text-slate-400">Up</span>
              </button>
              <button 
                onClick={() => moveRuleDown(activePriorityMenu.index)}
                disabled={activeTab === 'L7应用' ? !getL7MoveMeta(activePriorityMenu.index).canDown : activePriorityMenu.index === filteredTableData.length - 1}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium whitespace-nowrap flex items-center justify-between ${
                  (activeTab === 'L7应用' ? !getL7MoveMeta(activePriorityMenu.index).canDown : activePriorityMenu.index === filteredTableData.length - 1) ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
                }`}
              >
                <span>下移</span>
                <span className="text-[10px] text-slate-400">Down</span>
              </button>
              <button 
                onClick={() => moveRuleToBottom(activePriorityMenu.index)}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium whitespace-nowrap cursor-pointer flex items-center justify-between"
              >
                <span>置底</span>
                <span className="text-[10px] text-slate-400">Bottom</span>
              </button>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Hover Custom Tooltip */}
      {hoveredTooltip && (
        <div 
          className="fixed z-[99999] bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded shadow-xl pointer-events-none transition-all duration-100 max-w-sm break-all font-sans text-center leading-relaxed font-normal"
          style={{
            left: `${hoveredTooltip.x}px`,
            top: `${hoveredTooltip.y}px`,
            transform: 'translate(-50%, -100%) translateY(-8px)'
          }}
        >
          {hoveredTooltip.text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
