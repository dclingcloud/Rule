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
  List,
  Clock,
  Layout,
  Wrench,
  Copy,
  ChevronUp,
  ChevronDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Lock,
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
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function RuleManagement() {
  const [protocol, setProtocol] = useState('IPV4应用');
  const [activeTab, setActiveTab] = useState('自定义应用(TCP)');
  const [selectedProbe, setSelectedProbe] = useState('所有接口');
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
  const [importSelectedInterfaces, setImportSelectedInterfaces] = useState<string[]>(['Probe / Lab']);
  const [importConflictStrategy, setImportConflictStrategy] = useState<'merge' | 'overwrite'>('merge');
  const [importedFile, setImportedFile] = useState<{ name: string; size: number } | null>(null);
  const [isImportProbeDropdownOpen, setIsImportProbeDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);


  // Dynamic Column Configurations State
  const [columns, setColumns] = useState<any[]>([
    { id: 'index', name: '序号', visible: true },
    { id: 'ruleId', name: '应用ID', visible: true },
    { id: 'name', name: '应用名称', visible: true },
    { id: 'port', name: '接口', visible: true },
    { id: 'dstIp', name: '目的IP', visible: true },
    { id: 'dstPort', name: '目的端口', visible: true },
    { id: 'srcIp', name: '源IP', visible: false },
    { id: 'srcPort', name: '源端口', visible: false },
  ]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [colDragOverIndex, setColDragOverIndex] = useState<number | null>(null);

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

  // Ensure activeTab is valid when protocol switches
  const handleProtocolChange = (p: string) => {
    setProtocol(p);
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
    // IPV4 L7 Layer
    { id: 13, ruleId: '70001', name: 'IPv4-L7-WeChat', protocol_type: 'TCP', port: '探针(Retx):接口1; 探针(SRV6):接口1; 探针(重传):接口1', priority: 1, protocol: 'IPV4应用', tab: 'L7应用', description: '深度解析微信通讯流指纹', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 14, ruleId: '70002', name: 'IPv4-L7-Amap', protocol_type: 'TCP', port: '探针(SRV6):接口1', priority: 2, protocol: 'IPV4应用', tab: 'L7应用', description: '高德地图时空定位API数据分析', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },

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
    // IPV6 L7
    { id: 22, ruleId: '80001', name: 'IPv6-L7-Douyin', protocol_type: 'TCP', port: '探针(重传):接口1', priority: 1, protocol: 'IPV6应用', tab: 'L7应用', description: '抖音短视频客户端点对点资源池', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 39, ruleId: '80002', name: 'IPv6-L7-Bilibili', protocol_type: 'TCP', port: '探针(SRV6):接口1', priority: 2, protocol: 'IPV6应用', tab: 'L7应用', description: '哔哩哔哩原生IPv6高画质画中画分流极速控制规则', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },
    { id: 40, ruleId: '80003', name: 'IPv6-L7-Alipay', protocol_type: 'TCP', port: '探针(Retx):接口1', priority: 3, protocol: 'IPV6应用', tab: 'L7应用', description: '支付宝金融应用原生IPv6可信网络通道保障', srcIp: 'any', srcPort: 'any', dstIp: 'any', dstPort: 'any' },

    // 混栈应用 (Dual Stack)
    { id: 23, ruleId: 'DS-201', name: 'DS-Custom-Web-Gateway', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: '混栈应用', tab: '自定义应用(TCP)', description: '混栈入包全链路路由控制接口', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.0.1 / 2001:db8:200::1', dstPort: '80, 443', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.0.1', dstIpV6: '2001:db8:200::1' },
    { id: 24, ruleId: 'DS-203', name: 'DS-Custom-Edge-API', protocol_type: 'TCP', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 2, protocol: '混栈应用', tab: '自定义应用(TCP)', description: '节点分流混栈策略应用', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.0.10 / 2409:8a0e:25::10', dstPort: '8443', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.0.10', dstIpV6: '2409:8a0e:25::10' },
    { id: 25, ruleId: 'DS-202', name: 'DS-Custom-NTP-Sync', protocol_type: 'UDP', port: '探针(SRV6):接口1; 探针(重传):接口1', priority: 1, protocol: '混栈应用', tab: '自定义应用(UDP)', description: '两层多时钟同步NTP网络适配', srcIp: 'any / any', srcPort: 'any', dstIp: '119.29.29.29 / 2402:f000:1:401::8', dstPort: '123', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '119.29.29.29', dstIpV6: '2402:f000:1:401::8' },
    { id: 26, ruleId: 'DS-204', name: 'DS-Custom-Telemetry', protocol_type: 'UDP', port: '所有接口', priority: 2, protocol: '混栈应用', tab: '自定义应用(UDP)', description: '混栈高速遥测采集任务通道', srcIp: 'any / any', srcPort: 'any', dstIp: '10.200.1.5 / 2001:db8:9999::5', dstPort: '2019', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: '10.200.1.5', dstIpV6: '2001:db8:9999::5' },
    { id: 27, ruleId: 'DS-301', name: 'DS-IP-ALL-Pass', protocol_type: 'ALL', port: '所有接口', priority: 1, protocol: '混栈应用', tab: 'IP应用', description: '放行层三层四通用控制包', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' },
    { id: 28, ruleId: 'DS-302', name: 'DS-IP-GRE-Bridge', protocol_type: 'GRE', port: '探针(Retx):接口1; 探针(SRV6):接口1', priority: 2, protocol: '混栈应用', tab: 'IP应用', description: '混栈网络GRE点对点虚拟链路', srcIp: '192.168.50.1 / fe80::5001', srcPort: 'any', dstIp: '192.168.50.2 / fe80::5002', dstPort: 'any', srcIpV4: '192.168.50.1', srcIpV6: 'fe80::5001', dstIpV4: '192.168.50.2', dstIpV6: 'fe80::5002' },
    { id: 29, ruleId: 'DS-401', name: 'DS-L7-QQ-Video', protocol_type: 'TCP', port: '所有接口', priority: 1, protocol: '混栈应用', tab: 'L7应用', description: 'QQ视频多媒体实时混通保障', srcIp: 'any / any', srcPort: 'any', dstIp: 'any / any', dstPort: 'any', srcIpV4: 'any', srcIpV6: 'any', dstIpV4: 'any', dstIpV6: 'any' }
  ]);

  // Filter variables
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterIp, setFilterIp] = useState('');
  const [filterPort, setFilterPort] = useState('');

  const [appliedFilterName, setAppliedFilterName] = useState('');
  const [appliedFilterIp, setAppliedFilterIp] = useState('');
  const [appliedFilterPort, setAppliedFilterPort] = useState('');

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
    let suffix = '';
    if (interfaceName.includes('Retx')) {
      offset = 120;
      suffix = 'R';
    } else if (interfaceName.includes('SRV6')) {
      offset = 240;
      suffix = 'S';
    } else if (interfaceName.includes('重传')) {
      offset = 360;
      suffix = 'C';
    }
    const num = parseInt(baseRuleId);
    if (isNaN(num)) return `${baseRuleId}-${suffix}`;
    return `${num + offset}${suffix}`;
  };

  // Filtered table data based on States & search triggers
  const filteredTableData = allRules.filter((item) => {
    // Check Protocol Match
    if (item.protocol !== protocol) return false;

    // Check Tab Match
    if (item.tab !== activeTab) return false;

    // Check Interface Match (Requirement 5!)
    const isKnown = item.tab ? item.tab.includes('已知应用') : false;
    if (selectedProbe !== '所有接口' && !isKnown) {
      const isAllPorts = item.port === '所有接口' || item.port === '所有探针' || item.port === '所有';
      if (!isAllPorts) {
        const itemPorts = (item.port || '')
          .split(';')
          .map((s: string) => s.trim())
          .filter(Boolean);
        if (!itemPorts.includes(selectedProbe)) return false;
      }
    }

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

  const [definitionMode, setDefinitionMode] = useState<'basic' | 'advanced'>('basic');
  const [modalTab, setModalTab] = useState('基础配置');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditId, setActiveEditId] = useState<number | null>(null);
  const [isProbeDropdownOpen, setIsProbeDropdownOpen] = useState(false);
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

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setActiveEditId(null);
    setDefinitionMode('basic');
    setModalTab('基础配置');
    setValidationError(null);
    const readOnly = activeTab.includes('已知应用');
    setIsReadOnly(readOnly);
    setFormData({
      name: '',
      description: '',
      protocolType: 'TCP',
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
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setIsEditMode(true);
    setActiveEditId(item.id);
    setDefinitionMode('basic');
    setModalTab('基础配置');
    setValidationError(null);
    const readOnly = item.tab ? item.tab.includes('已知应用') : false;
    setIsReadOnly(readOnly);
    const p2Vals = parseP2(item.p2);
    setFormData({
      name: item.name,
      description: item.description || `${item.name} 的详细应用描述信息，包含业务定义。`,
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
      storageLength: '64字节',
      timeout: item.timeout !== undefined ? String(item.timeout) : (item.protocol_type === 'UDP' ? '30' : '300'),
      p2: item.p2 !== undefined ? String(item.p2) : '配置项p2默认属性',
      ...p2Vals
    });
    setShowAddModal(true);
  };

  // Rule actions handlers
  const handleDeleteRule = (id: number) => {
    setAllRules(prev => prev.filter(r => r.id !== id));
  };

  const handleCopyRule = (item: any) => {
    const newId = Math.max(...allRules.map(r => r.id), 0) + 1;
    const randomRuleId = String(parseInt(item.ruleId) + 1 || Math.floor(10000 + Math.random() * 90000));
    const copiedRule = {
      ...item,
      id: newId,
      ruleId: randomRuleId,
      name: `${item.name}-copy`
    };
    setAllRules(prev => [...prev, copiedRule]);
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

  const moveRuleToTop = (index: number) => {
    reorderRules(index, 0);
    setActivePriorityMenu(null);
  };

  const moveRuleToBottom = (index: number) => {
    reorderRules(index, filteredTableData.length - 1);
    setActivePriorityMenu(null);
  };

  const moveRuleUp = (index: number) => {
    if (index > 0) {
      reorderRules(index, index - 1);
    }
    setActivePriorityMenu(null);
  };

  const moveRuleDown = (index: number) => {
    if (index < filteredTableData.length - 1) {
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

  const handleSaveModal = () => {
    if (!formData.name.trim()) return;

    if (protocol === '混栈应用') {
      const sV4 = formData.srcIpV4.trim();
      const sV6 = formData.srcIpV6.trim();
      const dV4 = formData.dstIpV4.trim();
      const dV6 = formData.dstIpV6.trim();

      const hasSourceBoth = sV4 !== '' && sV6 !== '';
      const hasDestBoth = dV4 !== '' && dV6 !== '';

      if (!hasSourceBoth && !hasDestBoth) {
        setValidationError('混栈应用规则校验不通过：源检测IP或目的检测IP一端，必须有一端同时输入IPv4和IPv6地址！');
        return;
      }
    }

    setValidationError(null);

    const p2Object = {
      p2GroupType: formData.p2GroupType,
      p2ShowClientIpPortSite: formData.p2ShowClientIpPortSite,
      p2DetailType: formData.p2DetailType,
      p2DetailKpiMetric: formData.p2DetailKpiMetric,
      p2DetailItems: formData.p2DetailItems,
      p2ServerDetailType: formData.p2ServerDetailType,
      p2ServerDetailKpiMetric: formData.p2ServerDetailKpiMetric,
      p2ServerDetailItems: formData.p2ServerDetailItems,
      p2IgnoreConnFailMeta: formData.p2IgnoreConnFailMeta,
      p2ConnFailDetails: formData.p2ConnFailDetails,
      p2ConnFailTopClients: formData.p2ConnFailTopClients,
      p2AppSessionDetails: formData.p2AppSessionDetails,
      p2CpuStatsCore: formData.p2CpuStatsCore,
      p2CpuLogCore: formData.p2CpuLogCore,
      p2GiantFrameThreshold: formData.p2GiantFrameThreshold,
      p2IgnoreClientRstFail: formData.p2IgnoreClientRstFail,
      p2Srv6Parsing: formData.p2Srv6Parsing,
      p2ConnInterStateHandling: formData.p2ConnInterStateHandling,
      p2RuleBalancing: formData.p2RuleBalancing
    };
    const p2Serialized = JSON.stringify(p2Object);

    if (isEditMode && activeEditId !== null) {
      setAllRules(prev => prev.map(r => {
        if (r.id === activeEditId) {
          return {
            ...r,
            name: formData.name,
            protocol_type: formData.protocolType,
            port: formData.probeMode === 'all' ? '所有接口' : (formData.selectedProbes.length > 0 ? formData.selectedProbes.join('; ') : '默认接口'),
            description: formData.description,
            timeout: formData.timeout,
            srcIp: protocol === '混栈应用' ? `${formData.srcIpV4 || 'any'} / ${formData.srcIpV6 || 'any'}` : formData.srcIp,
            srcPort: formData.srcPort,
            dstIp: protocol === '混栈应用' ? `${formData.dstIpV4 || 'any'} / ${formData.dstIpV6 || 'any'}` : formData.dstIp,
            dstPort: formData.dstPort,
            srcIpV4: formData.srcIpV4,
            srcIpV6: formData.srcIpV6,
            dstIpV4: formData.dstIpV4,
            dstIpV6: formData.dstIpV6,
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
        port: formData.probeMode === 'all' ? '所有接口' : (formData.selectedProbes.length > 0 ? formData.selectedProbes.join('; ') : '默认接口'),
        priority: 10 + filteredTableData.length,
        protocol: protocol,
        tab: activeTab,
        description: formData.description,
        timeout: formData.timeout,
        srcIp: protocol === '混栈应用' ? `${formData.srcIpV4 || 'any'} / ${formData.srcIpV6 || 'any'}` : formData.srcIp,
        srcPort: formData.srcPort,
        dstIp: protocol === '混栈应用' ? `${formData.dstIpV4 || 'any'} / ${formData.dstIpV6 || 'any'}` : formData.dstIp,
        dstPort: formData.dstPort,
        srcIpV4: formData.srcIpV4,
        srcIpV6: formData.srcIpV6,
        dstIpV4: formData.dstIpV4,
        dstIpV6: formData.dstIpV6,
        p2: p2Serialized
      };
      setAllRules(prev => [...prev, newRule]);
    }

    setShowAddModal(false);
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
  };

  const ipv4Count = allRules.filter(r => r.protocol === 'IPV4应用').length;
  const ipv6Count = allRules.filter(r => r.protocol === 'IPV6应用').length;
  const dsCount = allRules.filter(r => r.protocol === '混栈应用').length;

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
              应用管理
              <span className="text-[10px] bg-sky-50 text-sky-600 font-mono px-1.5 py-0.5 rounded border border-sky-200/50 font-normal">
                PROBE v2.1
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-705 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新建流控规则</span>
            </button>
            
            <div className="w-[1px] h-6 bg-slate-200 hidden sm:block mx-1" />

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
            <label className="block text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider leading-none mb-1">物理监控接口 / 探针位置</label>
            <div className="flex items-center gap-2">
              <select 
                value={selectedProbe}
                onChange={(e) => setSelectedProbe(e.target.value)}
                className="text-xs bg-white text-slate-700 font-semibold border-0 p-0 pr-6 outline-none focus:ring-0 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <option>所有接口</option>
                <option>探针(Retx):接口1</option>
                <option>探针(SRV6):接口1</option>
                <option>探针(重传):接口1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center w-full md:w-auto overflow-x-auto no-scrollbar gap-1 shrink-0">
          {[
            { id: 'IPV4应用', label: 'IPv4 规则簇', count: ipv4Count },
            { id: 'IPV6应用', label: 'IPv6 规则簇', count: ipv6Count },
            { id: '混栈应用', label: '混栈 规则簇', count: dsCount },
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
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {p.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* L2 Classification Sub-Tabs and Meta Options */}
        <div className="flex flex-col lg:flex-row items-center border-b border-slate-200/60 bg-white">
          <div className="flex overflow-x-auto no-scrollbar w-full lg:w-auto border-b lg:border-b-0 border-slate-100 p-1">
            <div className="flex items-center bg-slate-50 p-1 rounded-lg gap-0.5">
              {tabs.map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      handleResetFilter(); // Reset filter when switching tabs
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
                      {columns.map((col, idx) => (
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



        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left text-[13px]" style={{ minWidth: activeTab === 'IP应用' ? '1065px' : '985px' }}>
            <thead className="bg-[#f8fafc] text-slate-500 border-b border-slate-200/60">
              <tr>
                <th className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center">
                  <input type="checkbox" className="rounded border-slate-300 animate-none cursor-pointer text-sky-500 focus:ring-sky-500" />
                </th>

                {columns.filter(c => c.visible).map((col) => {
                  if (col.id === 'index') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[70px] min-w-[70px] max-w-[70px]">序号</th>;
                  }
                  if (col.id === 'ruleId') {
                    return <th key={col.id} className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[110px] min-w-[110px] max-w-[110px]">应用ID</th>;
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
                
                {/* Protocol Column is ONLY shown for 'IP应用' */}
                {activeTab === 'IP应用' && (
                  <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center w-[80px] min-w-[80px] max-w-[80px]">层三协议</th>
                )}

                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-center border-l border-slate-100 w-[120px] min-w-[120px] max-w-[120px]">基本维护</th>
              </tr>

              {showFilterRow && (
                <tr className="bg-slate-50/50 border-b border-slate-150">
                  <th className="px-4 py-2 w-[45px] min-w-[45px] max-w-[45px] text-center">
                    <span className="text-[10px] text-slate-400 font-mono">过滤</span>
                  </th>

                  {columns.filter(c => c.visible).map((col) => {
                    if (col.id === 'index') {
                      return <th key="f-index" className="px-4 py-2 w-[70px] min-w-[70px] max-w-[70px]" />;
                    }
                    if (col.id === 'ruleId') {
                      return <th key="f-ruleId" className="px-4 py-2 w-[110px] min-w-[110px] max-w-[110px]" />;
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

                  {activeTab === 'IP应用' && (
                    <th key="f-protocol" className="px-4 py-2 w-[80px] min-w-[80px] max-w-[80px]" />
                  )}

                  <th className="px-4 py-2 border-l border-slate-100 text-center w-[120px] min-w-[120px] max-w-[120px]">
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
              {filteredTableData.map((item, index) => (
                <tr 
                  key={item.id} 
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
                    const srcIdx = parseInt(e.dataTransfer.getData('text/plain'));
                    if (!isNaN(srcIdx)) {
                      reorderRules(srcIdx, index);
                    }
                    setDragOverIndex(null);
                  }}
                >
                  <td className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center">
                    <input type="checkbox" className="rounded border-slate-300 animate-none" />
                  </td>

                  {columns.filter(c => c.visible).map((col) => {
                    if (col.id === 'index') {
                      return (
                        <td key={col.id} className="px-4 py-2.5 text-slate-500 whitespace-nowrap select-none relative w-[70px] min-w-[70px] max-w-[70px]">
                          <div className="flex items-center gap-1.5 flex-row justify-center">
                            {!isKnownApp && (
                              <div className="relative inline-block">
                                <button
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', String(index));
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
                        <td key={col.id} className="px-4 py-2.5 whitespace-nowrap text-center w-[110px] min-w-[110px] max-w-[110px]">
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
                              className="font-mono bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 text-xs transition-colors inline-block max-w-[90px] truncate cursor-help"
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
                  
                  {/* Protocol Cell content is ONLY rendered helper for 'IP应用' */}
                  {activeTab === 'IP应用' && (
                    <td className="px-4 py-2.5 text-center w-[80px] min-w-[80px] max-w-[80px]">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.protocol_type === 'TCP' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                        item.protocol_type === 'UDP' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                        item.protocol_type === 'ICMP' || item.protocol_type === 'ICMPV6' ? 'bg-teal-50 text-teal-600 border border-teal-100' :
                        'bg-slate-50 text-slate-600 border border-slate-200/60'
                      }`}>
                        {item.protocol_type}
                      </span>
                    </td>
                  )}

                  <td className="px-4 py-2.5 border-l border-slate-100 w-[120px] min-w-[120px] max-w-[120px]">
                    <div className="flex items-center justify-center gap-2.5 text-slate-400">
                      {isKnownApp ? (
                        <Edit 
                          className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500" 
                          title="编辑" 
                          onClick={() => handleOpenEdit(item)} 
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
                          <Trash2 
                            className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" 
                            title="删除" 
                            onClick={() => handleDeleteRule(item.id)}
                          />
                          <Lock className="w-3.5 h-3.5 cursor-pointer hover:text-sky-500" title="锁定" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {/* Fill with empty rows to maintain height */}
              {Array.from({ length: Math.max(0, 15 - filteredTableData.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="h-[41px]">
                  <td className="px-4 py-2.5 w-[45px] min-w-[45px] max-w-[45px] text-center"><div className="w-4 h-4 rounded border border-slate-100 opacity-0 mx-auto"></div></td>
                  <td className="px-4 py-2.5" colSpan={columns.filter(c => c.visible).length + (activeTab === 'IP应用' ? 1 : 0) + 1}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
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
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-slate-200 rounded shadow-2xl w-full max-w-5xl overflow-hidden max-h-[95vh] flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="text-base font-medium text-slate-800">{isEditMode ? "编辑应用" : "新增应用"}</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-white p-8">
                {/* Internal Tabs */}
                <div className="flex items-center gap-8 border-b border-slate-100 mb-8">
                   {["基础配置", "高级配置"].map(t => (
                      <button 
                        key={t}
                        onClick={() => setModalTab(t)}
                        className={`pb-2 text-sm font-medium border-b-2 transition-all ${
                          modalTab === t ? "border-sky-500 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {t}
                      </button>
                   ))}
                </div>
                {modalTab === '高级配置' ? (
                  <div className="space-y-6 max-w-4xl py-2 max-h-[58vh] overflow-y-auto pr-2 no-scrollbar">
                    {/* 第一块：连接超时基本参数 */}
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 space-y-4">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        基础超时配置
                      </div>
                      <div className="grid grid-cols-[170px_1fr] items-center gap-y-4 text-xs">
                        <label className="text-slate-600 text-right pr-4 font-medium">连接超时阈值</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[280px] flex items-center border border-slate-200 rounded px-3 py-1.5 bg-white focus-within:border-sky-400 transition-all">
                            <input 
                              type="number" 
                              disabled={isReadOnly}
                              className="w-full outline-none text-slate-700 placeholder:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed text-xs" 
                              placeholder="单位：秒 (TCP默认300, UDP默认30)" 
                              value={formData.timeout}
                              onChange={(e) => setFormData({...formData, timeout: e.target.value})}
                            />
                            <span className="text-slate-400 pl-2 ml-2 border-l border-slate-150 whitespace-nowrap text-xs">秒</span>
                          </div>
                          <div className="text-[11px] text-slate-400 whitespace-nowrap">
                            {formData.protocolType === 'TCP' ? '(TCP协议默认300s)' : formData.protocolType === 'UDP' ? '(UDP协议默认30s)' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 第二块：客户端集合与详单分析 */}
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 space-y-4">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        客户端集合与详单分析
                      </div>
                      <div className="grid grid-cols-[170px_1fr] items-center gap-y-4 text-xs">
                        {/* 分组类型 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">分组类型</label>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-semibold">客户端按站点分组</span>
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              disabled={isReadOnly}
                              checked={formData.p2ShowClientIpPortSite}
                              onChange={(e) => setFormData({...formData, p2ShowClientIpPortSite: e.target.checked})}
                              className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-600 font-normal">显示客户端IP+Port+Site</span>
                            <Info 
                              onMouseEnter={(e) => showTooltip("控制客户端详单与页面数据抓取时，是否全面展示IP实例、应用实例端口与物理站线的匹配标签", e)}
                              onMouseLeave={hideTooltip}
                              className="w-3.5 h-3.5 text-slate-400 cursor-help"
                            />
                          </label>
                        </div>

                        {/* 详单类型 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">详单类型</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2DetailType"
                              checked={formData.p2DetailType === 'Top KPI'}
                              onChange={() => setFormData({...formData, p2DetailType: 'Top KPI'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">Top KPI</span>
                          </label>
                          {formData.p2DetailType === 'Top KPI' && (
                            <select 
                              disabled={isReadOnly}
                              value={formData.p2DetailKpiMetric}
                              onChange={(e) => setFormData({...formData, p2DetailKpiMetric: e.target.value})}
                              className="border border-slate-200 rounded px-2 py-1 bg-white text-xs outline-none focus:border-sky-400 cursor-pointer"
                            >
                              <option>流量</option>
                              <option>会话</option>
                              <option>包数</option>
                              <option>丢包率</option>
                            </select>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2DetailType"
                              checked={formData.p2DetailType === '顺序排名'}
                              onChange={() => setFormData({...formData, p2DetailType: '顺序排名'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">顺序排名</span>
                          </label>
                        </div>

                        {/* 详单条目 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">详单条目</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            min="0"
                            max="100"
                            className="w-32 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2DetailItems}
                            onChange={(e) => setFormData({...formData, p2DetailItems: e.target.value})}
                          />
                          <span className="text-slate-400 font-normal">(0-100 之间)</span>
                        </div>

                        {/* 服务器详单类型 */}
                        <label className="text-slate-600 text-right pr-4 font-medium font-medium">服务器详单类型</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2ServerDetailType"
                              checked={formData.p2ServerDetailType === 'Top KPI'}
                              onChange={() => setFormData({...formData, p2ServerDetailType: 'Top KPI'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">Top KPI</span>
                          </label>
                          {formData.p2ServerDetailType === 'Top KPI' && (
                            <select 
                              disabled={isReadOnly}
                              value={formData.p2ServerDetailKpiMetric}
                              onChange={(e) => setFormData({...formData, p2ServerDetailKpiMetric: e.target.value})}
                              className="border border-slate-200 rounded px-2 py-1 bg-white text-xs outline-none focus:border-sky-400 cursor-pointer"
                            >
                              <option>流量</option>
                              <option>会话</option>
                              <option>包数</option>
                              <option>丢包率</option>
                            </select>
                          )}
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2ServerDetailType"
                              checked={formData.p2ServerDetailType === '顺序排名'}
                              onChange={() => setFormData({...formData, p2ServerDetailType: '顺序排名'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">顺序排名</span>
                          </label>
                        </div>

                        {/* 服务器详单条目 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">服务器详单条目</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            min="0"
                            max="100"
                            className="w-32 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2ServerDetailItems}
                            onChange={(e) => setFormData({...formData, p2ServerDetailItems: e.target.value})}
                          />
                          <span className="text-slate-400 font-normal">(0-100之间)</span>
                        </div>
                      </div>
                    </div>

                    {/* 第三块：建连异常与性能分析 */}
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 space-y-4">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        建连异常与指标分析
                      </div>
                      <div className="grid grid-cols-[170px_1fr] items-center gap-y-4 text-xs">
                        {/* 忽略建连失败的meta/srvMeta详单 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">忽略建连失败的meta/srvMeta详单</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2IgnoreConnFailMeta"
                              checked={formData.p2IgnoreConnFailMeta === '开启'}
                              onChange={() => setFormData({...formData, p2IgnoreConnFailMeta: '开启'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">开启</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2IgnoreConnFailMeta"
                              checked={formData.p2IgnoreConnFailMeta === '关闭'}
                              onChange={() => setFormData({...formData, p2IgnoreConnFailMeta: '关闭'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">关闭</span>
                          </label>
                        </div>

                        {/* 建连失败详单 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">建连失败详单</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            className="w-32 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2ConnFailDetails}
                            onChange={(e) => setFormData({...formData, p2ConnFailDetails: e.target.value})}
                          />
                          <span className="text-slate-400 font-normal">(0-1000之间)</span>
                        </div>

                        {/* 建连失败数Top客户端数量 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">建连失败数Top客户端数量</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            className="w-32 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2ConnFailTopClients}
                            onChange={(e) => setFormData({...formData, p2ConnFailTopClients: e.target.value})}
                          />
                          <span className="text-slate-400 font-normal">(0-1000之间)</span>
                        </div>

                        {/* AppSession详单 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">AppSession详单</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            className="w-32 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2AppSessionDetails}
                            onChange={(e) => setFormData({...formData, p2AppSessionDetails: e.target.value})}
                          />
                          <span className="text-slate-400 font-normal">(0-1000000之间)</span>
                        </div>
                      </div>
                    </div>

                    {/* 第四块：CPU分配与网流物理加速 */}
                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 space-y-4">
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
                        硬件CPU分配与底层参数调优
                      </div>
                      <div className="grid grid-cols-[170px_1fr] items-center gap-y-4 text-xs">
                        {/* CPU分配(Statistics core ID) */}
                        <label className="text-slate-600 text-right pr-4 font-medium">CPU分配(Statistics core ID)</label>
                        <input 
                          type="text" 
                          disabled={isReadOnly}
                          className="w-48 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                          placeholder="请输入核心 ID (选填)"
                          value={formData.p2CpuStatsCore}
                          onChange={(e) => setFormData({...formData, p2CpuStatsCore: e.target.value})}
                        />

                        {/* CPU分配(Log core ID) */}
                        <label className="text-slate-600 text-right pr-4 font-medium">CPU分配(Log core ID)</label>
                        <input 
                          type="text" 
                          disabled={isReadOnly}
                          className="w-48 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                          value={formData.p2CpuLogCore}
                          onChange={(e) => setFormData({...formData, p2CpuLogCore: e.target.value})}
                        />

                        {/* 应用巨帧包长阈值 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">应用巨帧包长阈值</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            disabled={isReadOnly}
                            className="w-48 border border-slate-200 rounded px-2.5 py-1 text-xs outline-none focus:border-sky-400 bg-white placeholder:text-slate-300 disabled:bg-slate-50"
                            value={formData.p2GiantFrameThreshold}
                            onChange={(e) => setFormData({...formData, p2GiantFrameThreshold: e.target.value})}
                          />
                          <Info 
                            onMouseEnter={(e) => showTooltip("控制针对巨帧（Giant Packet）包长的过滤条件。通常当以太网二层网络MTU大于1500时配置该数值，可有效过滤巨型载荷帧。", e)}
                            onMouseLeave={hideTooltip}
                            className="w-3.5 h-3.5 text-slate-400 cursor-help"
                          />
                        </div>

                        {/* 忽略客户端RST建连失败 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">忽略客户端RST建连失败</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2IgnoreClientRstFail"
                              checked={formData.p2IgnoreClientRstFail === '开启'}
                              onChange={() => setFormData({...formData, p2IgnoreClientRstFail: '开启'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">开启</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2IgnoreClientRstFail"
                              checked={formData.p2IgnoreClientRstFail === '关闭'}
                              onChange={() => setFormData({...formData, p2IgnoreClientRstFail: '关闭'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">关闭</span>
                          </label>
                        </div>

                        {/* SRv6解析 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">SRv6解析</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2Srv6Parsing"
                              checked={formData.p2Srv6Parsing === '开启'}
                              onChange={() => setFormData({...formData, p2Srv6Parsing: '开启'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">开启</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2Srv6Parsing"
                              checked={formData.p2Srv6Parsing === '关闭'}
                              onChange={() => setFormData({...formData, p2Srv6Parsing: '关闭'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">关闭</span>
                          </label>
                        </div>

                        {/* 连接中间状态处理 */}
                        <label className="text-slate-600 text-right pr-4 font-medium font-medium font-medium">连接中间状态处理</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2ConnInterStateHandling"
                              checked={formData.p2ConnInterStateHandling === '开启'}
                              onChange={() => setFormData({...formData, p2ConnInterStateHandling: '开启'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">开启</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2ConnInterStateHandling"
                              checked={formData.p2ConnInterStateHandling === '关闭'}
                              onChange={() => setFormData({...formData, p2ConnInterStateHandling: '关闭'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">关闭</span>
                          </label>
                        </div>

                        {/* 规则平衡 */}
                        <label className="text-slate-600 text-right pr-4 font-medium">规则平衡</label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2RuleBalancing"
                              checked={formData.p2RuleBalancing === '未配置'}
                              onChange={() => setFormData({...formData, p2RuleBalancing: '未配置'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">未配置</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2RuleBalancing"
                              checked={formData.p2RuleBalancing === '开启'}
                              onChange={() => setFormData({...formData, p2RuleBalancing: '开启'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">开启</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="radio"
                              disabled={isReadOnly}
                              name="p2RuleBalancing"
                              checked={formData.p2RuleBalancing === '关闭'}
                              onChange={() => setFormData({...formData, p2RuleBalancing: '关闭'})}
                              className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50"
                            />
                            <span className="text-slate-700">关闭</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-4xl">
                    {/* Form Grid */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-y-6 text-sm">
                    <label className="text-slate-600 text-right pr-4">应用名称</label>
                    <input 
                      type="text" 
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed" 
                      placeholder="输入应用名称"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />

                    <label className="text-slate-600 text-right pr-4">应用描述</label>
                    <input 
                      type="text" 
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 focus:border-sky-400 outline-none transition-all placeholder:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed" 
                      placeholder="输入应用描述"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />

                    {/* Probes - Moved up and updated with logic */}
                    <label className="text-slate-600 text-right pr-4">探针接口</label>
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-8">
                         <label className="flex items-center gap-2 cursor-pointer group font-medium">
                           <input 
                             type="radio" 
                             name="probe_sel" 
                             disabled={isReadOnly}
                             checked={formData.probeMode === 'all'}
                             onChange={() => setFormData({...formData, probeMode: 'all'})}
                             className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50" 
                           />
                           <span className={formData.probeMode === 'all' ? 'text-sky-600 font-medium' : 'text-slate-500 font-medium'}>全选</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer group font-medium">
                           <input 
                             type="radio" 
                             name="probe_sel" 
                             disabled={isReadOnly}
                             checked={formData.probeMode === 'custom'}
                             onChange={() => setFormData({...formData, probeMode: 'custom'})}
                             className="text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 disabled:opacity-50" 
                           />
                           <span className={formData.probeMode === 'custom' ? 'text-sky-600' : 'text-slate-500'}>自定义</span>
                         </label>
                       </div>
                       
                       {formData.probeMode === 'custom' && (
                         <div className="relative w-full">
                            <div 
                              onClick={() => !isReadOnly && setIsProbeDropdownOpen(!isProbeDropdownOpen)}
                              className={`w-full border border-slate-200 rounded px-3 py-1.5 flex items-center justify-between ${
                                isReadOnly ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'bg-white cursor-pointer hover:bg-slate-50'
                              } transition-all select-none`}
                            >
                              <span className="text-slate-700 text-xs font-semibold">
                                {formData.selectedProbes.length > 0 
                                  ? formData.selectedProbes.join('; ') 
                                  : '选择探针接口 (支持多选)'}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${isProbeDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </div>

                            {isProbeDropdownOpen && (
                              <>
                                {/* Backdrop to dismiss when clicking outside */}
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setIsProbeDropdownOpen(false)} 
                                />
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-2xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                                  {['探针(Retx):接口1', '探针(SRV6):接口1', '探针(重传):接口1'].map((probe) => {
                                    const isSelected = formData.selectedProbes.includes(probe);
                                    return (
                                      <label 
                                        key={probe} 
                                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs select-none"
                                      >
                                        <input 
                                          type="checkbox"
                                          disabled={isReadOnly}
                                          checked={isSelected}
                                          onChange={() => {
                                            if (isReadOnly) return;
                                            let nextSelected = [...formData.selectedProbes];
                                            if (isSelected) {
                                              nextSelected = nextSelected.filter(p => p !== probe);
                                            } else {
                                              nextSelected.push(probe);
                                            }
                                            setFormData({ ...formData, selectedProbes: nextSelected });
                                          }}
                                          className="rounded text-sky-500 focus:ring-sky-500 w-3.5 h-3.5 border-slate-300 cursor-pointer disabled:opacity-50"
                                        />
                                        <span className={isSelected ? "text-sky-600 font-semibold" : "text-slate-600"}>
                                          {probe}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                         </div>
                       )}
                    </div>

                    <label className="text-slate-600 text-right pr-4">协议类型</label>
                    <select 
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      value={formData.protocolType}
                      onChange={(e) => {
                        const newProto = e.target.value;
                        let nextTimeout = formData.timeout;
                        if (newProto === 'TCP') {
                          nextTimeout = '300';
                        } else if (newProto === 'UDP') {
                          nextTimeout = '30';
                        }
                        setFormData({
                          ...formData,
                          protocolType: newProto,
                          timeout: nextTimeout
                        });
                      }}
                    >
                      <option>TCP</option>
                      <option>UDP</option>
                      <option>IGMP</option>
                      <option>GRE</option>
                      <option>ESP</option>
                      <option>AH</option>
                      <option>ICMPV6</option>
                      <option>EIGRP</option>
                      <option>OSPF</option>
                      <option>ALL</option>
                    </select>

                    <label className="text-slate-600 text-right pr-4">应用定义</label>
                    <div className="flex items-center space-x-0">
                      <button 
                        onClick={() => setDefinitionMode('basic')}
                        className={`px-8 py-1.5 text-xs font-medium border transition-all ${
                          definitionMode === 'basic' ? 'bg-sky-500 border-sky-500 text-white rounded-l' : 'bg-white border-slate-200 text-slate-500 rounded-l hover:bg-slate-50'
                        }`}
                      >
                        基础定义
                      </button>
                      <button 
                         onClick={() => setDefinitionMode('advanced')}
                         className={`px-8 py-1.5 text-xs font-medium border-y border-r transition-all ${
                          definitionMode === 'advanced' ? 'bg-sky-500 border-sky-500 text-white rounded-r' : 'bg-white border-slate-200 text-slate-500 rounded-r hover:bg-slate-50'
                        }`}
                      >
                        高级定义
                      </button>
                    </div>

                    {/* Definition Content */}
                    <div className="col-start-2">
                       {definitionMode === 'basic' ? (
                        <div className="space-y-4 pt-2">
                           {[
                            { label: '源地址', ph: '支持单个IP、多个IP、IP范围', key: 'srcIp' },
                            { label: '源端口', ph: '支持单个端口、多个端口、端口范围', key: 'srcPort' },
                            { label: '目的地址', ph: '支持单个IP、多个IP、IP范围', key: 'dstIp' },
                            { label: '目的端口', ph: '支持单个端口、多个端口、端口范围', key: 'dstPort' },
                           ].map((f) => (
                             <div key={f.label} className="grid grid-cols-[80px_1fr] items-center gap-4">
                               <label className="text-slate-500 text-xs text-right">{f.label}</label>
                               <input 
                                 type="text" 
                                 disabled={isReadOnly}
                                 className="w-full border border-slate-200 rounded px-3 py-1.5 focus:border-sky-400 outline-none text-xs placeholder:text-slate-300 disabled:bg-slate-50" 
                                 placeholder={f.ph} 
                                 value={(formData as any)[f.key]}
                                 onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                               />
                             </div>
                           ))}
                        </div>
                       ) : (
                        <div className="space-y-3 pt-2">
                          {/* Row 1 */}
                          <div className="flex items-center gap-3">
                             <select disabled={isReadOnly} className="w-32 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>源IP</option>
                             </select>
                             <select disabled={isReadOnly} className="w-16 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none text-center focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>=</option>
                             </select>
                             <input 
                               type="text" 
                               disabled={isReadOnly}
                               className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-sky-400 placeholder:text-slate-300 disabled:bg-slate-50" 
                               placeholder="请输入IP" 
                               defaultValue={isEditMode ? '192.168.1.100' : ''}
                             />
                             <span className="text-xs text-slate-400 font-medium px-4">AND</span>
                             <Trash2 className={`w-4 h-4 text-slate-300 cursor-pointer ${isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-400'}`} />
                          </div>
                          {/* Row 2 */}
                          <div className="flex items-center gap-3">
                             <select disabled={isReadOnly} className="w-32 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>源IP</option>
                             </select>
                             <select disabled={isReadOnly} className="w-16 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none text-center focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>=</option>
                             </select>
                             <input 
                               type="text" 
                               disabled={isReadOnly}
                               className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-sky-400 placeholder:text-slate-300 disabled:bg-slate-50" 
                               placeholder="请输入IP"
                               defaultValue={isEditMode ? '10.0.0.5' : ''}
                             />
                             <button disabled={isReadOnly} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:border-sky-400 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">+AND</button>
                             <Trash2 className={`w-4 h-4 text-slate-300 cursor-pointer ${isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-400'}`} />
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold ml-2">OR</div>
                          {/* Row 3 */}
                          <div className="flex items-center gap-3">
                             <select disabled={isReadOnly} className="w-32 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>目的IP</option>
                             </select>
                             <select disabled={isReadOnly} className="w-16 border border-slate-200 rounded px-2 py-1.5 text-xs outline-none text-center focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed">
                                <option>=</option>
                             </select>
                             <input 
                               type="text" 
                               disabled={isReadOnly}
                               className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-sky-400 placeholder:text-slate-300 disabled:bg-slate-50" 
                               placeholder="请输入IP"
                               defaultValue={isEditMode ? '172.16.50.1' : ''}
                             />
                             <button disabled={isReadOnly} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:border-sky-400 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">+AND</button>
                             <Trash2 className={`w-4 h-4 text-slate-300 cursor-pointer ${isReadOnly ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-400'}`} />
                          </div>
                          <button disabled={isReadOnly} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 hover:border-sky-400 disabled:opacity-50 disabled:cursor-not-allowed">+OR</button>
                        </div>
                       )}
                    </div>

                    {/* Performance */}
                    <label className="text-slate-600 text-right pr-4">应用性能</label>
                    <div className="flex items-center gap-4 text-xs">
                       <span className="text-green-500">响应迅速</span>
                       <span className="text-slate-400">≤</span>
                       <div className="flex items-center border border-slate-200 rounded px-2 bg-white group focus-within:border-sky-400 transition-colors">
                          <input 
                            type="text" 
                            disabled={isReadOnly}
                            className="w-12 py-1 outline-none text-center disabled:bg-slate-50" 
                            value={formData.performanceRapid}
                            onChange={(e) => setFormData({...formData, performanceRapid: e.target.value})}
                          />
                          <span className="text-slate-400 px-1 border-l border-slate-100 ml-2">毫秒</span>
                       </div>
                       <span className="text-slate-400">{'<'}</span>
                       <span className="text-amber-500 whitespace-nowrap">响应正常</span>
                       <span className="text-slate-400">≤</span>
                       <div className="flex items-center border border-slate-200 rounded px-2 bg-white group focus-within:border-sky-400 transition-colors">
                          <input 
                            type="text" 
                            disabled={isReadOnly}
                            className="w-12 py-1 outline-none text-center disabled:bg-slate-50" 
                            value={formData.performanceNormal}
                            onChange={(e) => setFormData({...formData, performanceNormal: e.target.value})}
                          />
                          <span className="text-slate-400 px-1 border-l border-slate-100 ml-2">毫秒</span>
                       </div>
                       <span className="text-slate-400">{'<'}</span>
                       <span className="text-red-500 whitespace-nowrap">响应超时</span>
                    </div>

                    {/* Packet Length */}
                    <label className="text-slate-600 text-right pr-4">存包长度</label>
                    <select 
                      disabled={isReadOnly}
                      className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white outline-none focus:border-sky-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      value={formData.storageLength}
                      onChange={(e) => setFormData({...formData, storageLength: e.target.value})}
                    >
                      <option>64字节</option>
                      <option>全包</option>
                      <option>128字节</option>
                    </select>
                  </div>
                </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="px-6 py-6 flex justify-center gap-8 bg-white border-t border-slate-50">
                {isReadOnly ? (
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="px-12 py-2.5 bg-sky-500 text-white rounded font-medium hover:bg-sky-600 transition-all shadow-sm transform active:scale-95 text-xs cursor-pointer"
                  >
                    确定
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowAddModal(false)}
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
                  </>
                )}
              </div>
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
                disabled={activePriorityMenu.index === 0}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium whitespace-nowrap flex items-center justify-between ${
                  activePriorityMenu.index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
                }`}
              >
                <span>上移</span>
                <span className="text-[10px] text-slate-400">Up</span>
              </button>
              <button 
                onClick={() => moveRuleDown(activePriorityMenu.index)}
                disabled={activePriorityMenu.index === filteredTableData.length - 1}
                className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium whitespace-nowrap flex items-center justify-between ${
                  activePriorityMenu.index === filteredTableData.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 cursor-pointer'
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
