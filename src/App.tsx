import React, { useState } from 'react';
import {
  Search,
  Maximize2,
  User,
  ChevronsRight,
  Eye,
  Layers,
  Network,
  Bell,
  FileText,
  Sliders,
  ChevronUp,
  ChevronDown,
  PanelLeftClose,
  RotateCcw,
  Pencil,
  Copy,
  Settings,
  Trash2,
  Plus,
  Filter,
  Columns3,
  GripVertical,
  ChevronLeft,
  SlidersHorizontal,
  X,
  PlusCircle,
} from 'lucide-react';

import { RULE_TYPES_58 } from './ruleConfigs';
import RuleConfigModal from './components/RuleConfigModal';
import AdvancedConfigModal from './components/AdvancedConfigModal';
import GlobalConfigModal from './components/GlobalConfigModal';
import ClearConfirmModal from './components/ClearConfirmModal';

// Data for Image 1 & 2 (规则管理: 支持以规则名称分组展示与展开具体规则)
interface RuleDetail {
  id: number;
  ruleId: string; // 规则ID (在展开下拉行中展示)
  destIp: string;
  destPort: string;
  packetLen: string;
  enabled: boolean;
  ruleName?: string;
  probeInterface?: string;
  protocol?: string;
  defineMode?: 'mixed' | 'single';
  srcIp?: string;
  srcPort?: string;
  srcIpExclude?: string;
  srcPortExclude?: string;
  destIpExclude?: string;
  destPortExclude?: string;
}

interface RuleGroup {
  id: string;
  groupName: string; // 规则名称 (按清单修改为 58 种规则类型)
  children: RuleDetail[];
}

// 预设具体子规则示例数据
const sampleChildrenMap: Record<string, RuleDetail[]> = {
  'HS UTF2(TCP)': [
    {
      id: 101,
      ruleId: '37072',
      ruleName: 'HS UTF2(TCP)',
      probeInterface: 'DataCenter-SH/Interface 1',
      protocol: 'HS UTF2(TCP)',
      defineMode: 'mixed',
      srcIp: '192.168.1.0/24',
      srcPort: '1024-65535',
      destIp: '172.17.84.35',
      destPort: '11-15',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'HS UTF2(UDP)': [
    {
      id: 102,
      ruleId: '37073',
      ruleName: 'HS UTF2(UDP)',
      probeInterface: 'DataCenter-SH/Interface 1',
      protocol: 'HS UTF2(UDP)',
      defineMode: 'mixed',
      srcIp: '192.168.1.0/24',
      srcPort: '1024-65535',
      destIp: '172.17.84.35',
      destPort: '11-15',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'HTTP Pattern': [
    {
      id: 103,
      ruleId: '38338',
      ruleName: 'HTTP Pattern',
      probeInterface: 'DataCenter-SH/Interface 1',
      protocol: 'HTTP Pattern',
      defineMode: 'mixed',
      srcIp: '192.168.2.0/24',
      srcPort: '1024-65535',
      destIp: '172.17.3.2',
      destPort: '8080-8080',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'DNS': [
    {
      id: 104,
      ruleId: '44895',
      ruleName: 'DNS',
      probeInterface: 'DataCenter-SH/Interface 1',
      protocol: 'DNS',
      defineMode: 'mixed',
      srcIp: '10.0.0.0/16',
      srcPort: '1024-65535',
      destIp: '11.194.8.19,11.194.8.20',
      destPort: '53-53',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'HTTP': [
    {
      id: 105,
      ruleId: '45609',
      ruleName: 'HTTP',
      probeInterface: 'DataCenter-SH/Interface 1',
      protocol: 'HTTP',
      defineMode: 'mixed',
      srcIp: '10.0.0.0/16',
      srcPort: '1024-65535',
      destIp: '172.17.3.2',
      destPort: '80-80,8080-8080',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'MySQL': [
    {
      id: 106,
      ruleId: '38328',
      ruleName: 'MySQL',
      probeInterface: 'DataCenter-SH/Interface 2',
      protocol: 'MySQL',
      defineMode: 'mixed',
      srcIp: '10.20.0.0/16',
      srcPort: '1024-65535',
      destIp: '10.20.30.40',
      destPort: '3306-3306',
      packetLen: '全包',
      enabled: true,
    },
  ],
  'Oracle': [
    {
      id: 107,
      ruleId: '38330',
      ruleName: 'Oracle',
      probeInterface: 'DataCenter-SH/Interface 2',
      protocol: 'Oracle',
      defineMode: 'mixed',
      srcIp: '10.20.0.0/16',
      srcPort: '1024-65535',
      destIp: '10.20.30.41',
      destPort: '1521-1521',
      packetLen: '全包',
      enabled: true,
    },
  ],
};

const initialRuleGroups: RuleGroup[] = RULE_TYPES_58.map((typeName) => ({
  id: typeName,
  groupName: typeName,
  children: sampleChildrenMap[typeName] || [],
}));

// Data for Image 1 (脱敏配置)
interface MaskingItem {
  id: number;
  name: string;
  desc: string;
  regex: string;
  replacement: string;
}

const initialMaskingData: MaskingItem[] = [
  { id: 1, name: '姓名', desc: '姓名脱敏规则', regex: '(?<=^.).(?=$)|(?<=^.).+(?=.+$)', replacement: '*' },
  { id: 2, name: '邮箱', desc: '邮箱脱敏规则', regex: '(?<=^.).*?(?=@)', replacement: '***' },
  { id: 3, name: '身份证号', desc: '身份证号脱敏规则', regex: '(?<=^\\d{6})\\d+(?=\\d{3}[0-9Xx]$)', replacement: '******' },
  { id: 4, name: '银行卡号', desc: '银行卡号脱敏规则', regex: '(?<=^.{4}).+(?=.+$)', replacement: '******' },
  { id: 5, name: '公司名', desc: '公司名脱敏规则', regex: '^((?=.{7})(..).*(....)$|^((?=. {1,6})(.).*(.)$', replacement: '$1$3***$2$4' },
];

export default function App() {
  // Navigation State - Default to '规则管理' as requested!
  const [activeMenu, setActiveMenu] = useState<string>('规则管理');

  // Groups collapse
  const [isManageOpen, setIsManageOpen] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(true);

  // Interface dropdown
  const [interfaceVal, setInterfaceVal] = useState('DataCenter-SH/Interface 1');

  // Rule Groups State & Expanded groups (默认展开 HS UTF2(TCP)，展示具体规则)
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>(initialRuleGroups);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['HS UTF2(TCP)']);

  // 规则配置弹窗状态（点击设置出现对应58种规则弹窗）
  const [configModalRuleType, setConfigModalRuleType] = useState<string | null>(null);

  // 高级配置弹窗状态（点击图1中按钮位置出现，展示图2内容，UI参考图3）
  const [advancedConfigTarget, setAdvancedConfigTarget] = useState<{
    groupName: string;
    ruleId?: string;
    packetLen?: string;
  } | null>(null);

  // 全局配置弹窗状态（点击工具栏全局配置按钮出现，结合图1与图2内容）
  const [showGlobalConfigModal, setShowGlobalConfigModal] = useState(false);

  // 一键清空提示弹窗状态与 Toast 提示
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmClear = () => {
    setRuleGroups([]);
    setSelectedGroupIds([]);
    setSelectedRuleIds([]);
    setShowClearConfirmModal(false);
    setToastMessage('清空成功，当前接口相关规则已移除！');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Selected checkboxes
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<number[]>([]);

  // Masking Config State (Image 1)
  const [businessMaskingEnabled, setBusinessMaskingEnabled] = useState(false);
  const [maskingList] = useState<MaskingItem[]>(initialMaskingData);

  // Pagination states
  const [pageSizeRules, setPageSizeRules] = useState('100');
  const [pageSizeMasking, setPageSizeMasking] = useState('20');
  const [jumpPage, setJumpPage] = useState('1');

  // Modal states for 新增规则
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showInterfaceDropdown, setShowInterfaceDropdown] = useState(false);

  // Probe interface groups across different probes
  const probeGroups = [
    {
      name: '上海数据中心探针 (DataCenter-SH)',
      interfaces: [
        'DataCenter-SH/Interface 1',
        'DataCenter-SH/Interface 2',
        'DataCenter-SH/Interface 3',
      ],
    },
    {
      name: '北京数据中心探针 (DataCenter-BJ)',
      interfaces: [
        'DataCenter-BJ/Interface 1',
        'DataCenter-BJ/Interface 2',
      ],
    },
    {
      name: '广州数据中心探针 (DataCenter-GZ)',
      interfaces: [
        'DataCenter-GZ/Interface 1',
        'DataCenter-GZ/Interface 2',
      ],
    },
    {
      name: '边缘探针节点 (Edge-Probe)',
      interfaces: [
        'Edge-Probe-01/Interface 1',
        'Edge-Probe-02/Interface 1',
      ],
    },
  ];

  // Form fields inside 新增规则 modal - 默认为当前外部配置中的接口选择
  const [formAppName, setFormAppName] = useState('');
  const [formInterface, setFormInterface] = useState('DataCenter-SH/Interface 1');
  const [formProtocol, setFormProtocol] = useState('HS UTF2(TCP)');
  const [appDefineMode, setAppDefineMode] = useState<'mixed' | 'single'>('mixed');
  const [srcIp, setSrcIp] = useState('');
  const [srcIpExclude, setSrcIpExclude] = useState('');
  const [showSrcIpExclude, setShowSrcIpExclude] = useState(false);
  const [srcPort, setSrcPort] = useState('');
  const [srcPortExclude, setSrcPortExclude] = useState('');
  const [showSrcPortExclude, setShowSrcPortExclude] = useState(false);
  const [destIp, setDestIp] = useState('');
  const [destIpExclude, setDestIpExclude] = useState('');
  const [showDestIpExclude, setShowDestIpExclude] = useState(false);
  const [destPort, setDestPort] = useState('');
  const [destPortExclude, setDestPortExclude] = useState('');
  const [showDestPortExclude, setShowDestPortExclude] = useState(false);
  const [formPacketLen, setFormPacketLen] = useState('全包');

  const protocolOptions = RULE_TYPES_58;

  // 当前编辑的规则信息（点击图1中编辑icon打开对应规则配置）
  const [editingRuleInfo, setEditingRuleInfo] = useState<{
    groupId: string;
    rule: RuleDetail;
  } | null>(null);

  // 打开新增规则弹窗时，默认为当前外部配置中的接口选择
  const handleOpenAddModal = () => {
    setEditingRuleInfo(null);
    setFormAppName('');
    setFormInterface(interfaceVal);
    setFormProtocol('HS UTF2(TCP)');
    setAppDefineMode('mixed');
    setSrcIp('');
    setSrcPort('');
    setSrcIpExclude('');
    setShowSrcIpExclude(false);
    setSrcPortExclude('');
    setShowSrcPortExclude(false);
    setDestIp('');
    setDestPort('');
    setDestIpExclude('');
    setShowDestIpExclude(false);
    setDestPortExclude('');
    setShowDestPortExclude(false);
    setFormPacketLen('全包');
    setShowInterfaceDropdown(false);
    setShowAddAppModal(true);
  };

  // 点击编辑icon打开对应规则当前该规则的规则配置，可进行修改
  const handleOpenEditRule = (group: RuleGroup, child: RuleDetail) => {
    setEditingRuleInfo({
      groupId: group.id,
      rule: child,
    });
    setFormAppName(child.ruleName || group.groupName);
    setFormInterface(child.probeInterface || interfaceVal);
    setFormProtocol(child.protocol || group.groupName);
    setAppDefineMode(child.defineMode || 'mixed');
    setSrcIp(child.srcIp || '');
    setSrcPort(child.srcPort || '');
    setSrcIpExclude(child.srcIpExclude || '');
    setShowSrcIpExclude(Boolean(child.srcIpExclude));
    setSrcPortExclude(child.srcPortExclude || '');
    setShowSrcPortExclude(Boolean(child.srcPortExclude));
    setDestIp(child.destIp || '');
    setDestPort(child.destPort || '');
    setDestIpExclude(child.destIpExclude || '');
    setShowDestIpExclude(Boolean(child.destIpExclude));
    setDestPortExclude(child.destPortExclude || '');
    setShowDestPortExclude(Boolean(child.destPortExclude));
    setFormPacketLen(child.packetLen || '全包');
    setShowInterfaceDropdown(false);
    setShowAddAppModal(true);
  };

  const handleSaveRule = () => {
    if (!formAppName.trim()) return;

    if (editingRuleInfo) {
      // 修改现有规则配置
      setRuleGroups((prev) =>
        prev.map((g) => {
          if (g.id !== editingRuleInfo.groupId) return g;
          return {
            ...g,
            children: g.children.map((c) => {
              if (c.id !== editingRuleInfo.rule.id) return c;
              return {
                ...c,
                ruleName: formAppName.trim(),
                probeInterface: formInterface,
                protocol: formProtocol,
                defineMode: appDefineMode,
                srcIp,
                srcPort,
                srcIpExclude,
                srcPortExclude,
                destIp: destIp.trim() || c.destIp,
                destPort: destPort.trim() || c.destPort,
                destIpExclude,
                destPortExclude,
                packetLen: formPacketLen,
              };
            }),
          };
        })
      );
      setEditingRuleInfo(null);
      setShowAddAppModal(false);
    } else {
      const newId = Date.now();
      const newRuleId = String(Math.floor(20000 + Math.random() * 30000));
      const targetGroupName = formAppName.trim();

      setRuleGroups((prev) => {
        const found = prev.find((g) => g.groupName === targetGroupName);
        if (found) {
          return prev.map((g) =>
            g.groupName === targetGroupName
              ? {
                  ...g,
                  children: [
                    ...g.children,
                    {
                      id: newId,
                      ruleId: newRuleId,
                      ruleName: targetGroupName,
                      probeInterface: formInterface,
                      protocol: formProtocol,
                      defineMode: appDefineMode,
                      srcIp,
                      srcPort,
                      srcIpExclude,
                      srcPortExclude,
                      destIp: destIp.trim() || '0.0.0.0/0',
                      destPort: destPort.trim() || '8080-8080',
                      destIpExclude,
                      destPortExclude,
                      packetLen: formPacketLen,
                      enabled: true,
                    },
                  ],
                }
              : g
          );
        } else {
          return [
            {
              id: targetGroupName,
              groupName: targetGroupName,
              children: [
                {
                  id: newId,
                  ruleId: newRuleId,
                  ruleName: targetGroupName,
                  probeInterface: formInterface,
                  protocol: formProtocol,
                  defineMode: appDefineMode,
                  srcIp,
                  srcPort,
                  srcIpExclude,
                  srcPortExclude,
                  destIp: destIp.trim() || '0.0.0.0/0',
                  destPort: destPort.trim() || '8080-8080',
                  destIpExclude,
                  destPortExclude,
                  packetLen: formPacketLen,
                  enabled: true,
                },
              ],
            },
            ...prev,
          ];
        }
      });

      // Auto expand the group
      setExpandedGroups((prev) =>
        prev.includes(targetGroupName) ? prev : [...prev, targetGroupName]
      );
      setShowAddAppModal(false);
    }

    // Reset form
    setFormAppName('');
    setSrcIp('');
    setSrcPort('');
    setDestIp('');
    setDestPort('');
  };

  // Expand / collapse single group
  const toggleExpandGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedGroupIds(ruleGroups.map((g) => g.id));
      setSelectedRuleIds(ruleGroups.flatMap((g) => g.children.map((c) => c.id)));
    } else {
      setSelectedGroupIds([]);
      setSelectedRuleIds([]);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSelectChild = (childId: number) => {
    setSelectedRuleIds((prev) =>
      prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId]
    );
  };

  const toggleChildEnabled = (groupId: string, childId: number) => {
    setRuleGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map((c) =>
                c.id === childId ? { ...c, enabled: !c.enabled } : c
              ),
            }
          : g
      )
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0f2f5] text-[#333333] font-sans select-none text-[13px]">
      {/* 1. TOP HEADER BAR */}
      <header className="h-[48px] bg-[#1d212a] flex items-center justify-between px-4 text-white z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg tracking-wider font-mono text-white">NGPM</span>
        </div>
        <div className="flex items-center space-x-5 text-gray-300">
          <button className="hover:text-white transition-colors cursor-pointer" title="搜索">
            <Search size={16} />
          </button>
          <button className="hover:text-white transition-colors cursor-pointer" title="全屏">
            <Maximize2 size={15} />
          </button>
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <User size={14} className="text-gray-300" />
            </div>
            <span className="text-sm font-normal text-gray-200">admin</span>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* Leftmost dark rail */}
        <aside className="w-[48px] bg-[#1e222a] flex flex-col items-center py-2 shrink-0 border-r border-[#15181f] z-20">
          <button className="p-2.5 text-gray-400 hover:text-white mb-2 cursor-pointer transition-colors" title="展开/收起">
            <ChevronsRight size={16} />
          </button>

          <div className="flex flex-col space-y-1 w-full items-center">
            <button className="w-full flex justify-center py-3 text-gray-400 hover:text-gray-200 hover:bg-[#272c36] cursor-pointer transition-colors" title="仪表盘">
              <Eye size={17} />
            </button>
            <button className="w-full flex justify-center py-3 text-gray-400 hover:text-gray-200 hover:bg-[#272c36] cursor-pointer transition-colors" title="服务器">
              <Layers size={17} />
            </button>
            <button className="w-full flex justify-center py-3 text-gray-400 hover:text-gray-200 hover:bg-[#272c36] cursor-pointer transition-colors" title="网络">
              <Network size={17} />
            </button>
            <button className="w-full flex justify-center py-3 text-gray-400 hover:text-gray-200 hover:bg-[#272c36] cursor-pointer transition-colors" title="告警">
              <Bell size={17} />
            </button>
            <button className="w-full flex justify-center py-3 text-gray-400 hover:text-gray-200 hover:bg-[#272c36] cursor-pointer transition-colors" title="报告">
              <FileText size={17} />
            </button>
            {/* Active Config rail item */}
            <div className="w-full relative flex justify-center py-3 text-white bg-[#14171d] cursor-pointer" title="配置">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0091ff]" />
              <Sliders size={17} className="text-[#0091ff]" />
            </div>
          </div>
        </aside>

        {/* Secondary Navigation (功能配置) */}
        <aside className="w-[190px] bg-white border-r border-[#e8e8e8] flex flex-col shrink-0 overflow-y-auto">
          {/* Header */}
          <div className="h-[44px] flex items-center justify-between px-4 border-b border-[#f0f0f0]">
            <span className="font-semibold text-gray-800 text-[13px]">功能配置</span>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer" title="折叠面板">
              <PanelLeftClose size={15} />
            </button>
          </div>

          {/* Menus */}
          <div className="py-2">
            {/* Group 1: 管理 */}
            <div>
              <div
                onClick={() => setIsManageOpen(!isManageOpen)}
                className="flex items-center justify-between px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-50 text-[13px]"
              >
                <span>管理</span>
                <ChevronUp
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isManageOpen ? '' : 'rotate-180'
                  }`}
                />
              </div>

              {isManageOpen && (
                <div className="flex flex-col">
                  {/* 脱敏配置 */}
                  <div
                    onClick={() => setActiveMenu('脱敏配置')}
                    className={`pl-8 pr-4 py-2 cursor-pointer text-[13px] transition-colors ${
                      activeMenu === '脱敏配置'
                        ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    脱敏配置
                  </div>

                  {/* 规则管理 - Newly Added & Selected by Default as required! */}
                  <div
                    onClick={() => setActiveMenu('规则管理')}
                    className={`pl-8 pr-4 py-2 cursor-pointer text-[13px] transition-colors ${
                      activeMenu === '规则管理'
                        ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    规则管理
                  </div>

                  {/* 智能基线 */}
                  <div
                    onClick={() => setActiveMenu('智能基线')}
                    className={`pl-8 pr-4 py-2 cursor-pointer text-[13px] transition-colors ${
                      activeMenu === '智能基线'
                        ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    智能基线
                  </div>

                  {/* 节点统计 */}
                  <div
                    onClick={() => setActiveMenu('节点统计')}
                    className={`pl-8 pr-4 py-2 cursor-pointer text-[13px] transition-colors ${
                      activeMenu === '节点统计'
                        ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    节点统计
                  </div>
                </div>
              )}
            </div>

            {/* Group 2: 模型配置 */}
            <div className="mt-1">
              <div
                onClick={() => setIsModelOpen(!isModelOpen)}
                className="flex items-center justify-between px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-50 text-[13px]"
              >
                <span>模型配置</span>
                <ChevronUp
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isModelOpen ? '' : 'rotate-180'
                  }`}
                />
              </div>

              {isModelOpen && (
                <div className="flex flex-col">
                  {['DUBBO', 'App String Pattern', '银联', 'UnionPay ATM', '二代支付'].map((item) => (
                    <div
                      key={item}
                      onClick={() => setActiveMenu(item)}
                      className={`pl-8 pr-4 py-2 cursor-pointer text-[13px] transition-colors ${
                        activeMenu === item
                          ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Breadcrumb / Top sub-bar */}
          <div className="h-[44px] bg-white border-b border-[#e8e8e8] flex items-center px-4 shrink-0 space-x-2">
            <SlidersHorizontal size={16} className="text-[#1890ff]" />
            <span className="font-semibold text-gray-800 text-[14px]">配置</span>
          </div>

          {/* Content View Switching: Default is 规则管理 (Image 2 without Image 3 tabs) */}
          {activeMenu === '规则管理' ? (
            /* =================== VIEW 2: 规则管理 (Image 2 style) =================== */
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              {/* Top Controls Bar: 接口选择与所有操作按钮（新增规则、批量操作、过滤、控制按钮、全局配置、一键清空）放在同一行 */}
              <div className="flex items-center justify-between pb-3 shrink-0 flex-wrap gap-2">
                {/* Left: 接口 selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-[13px]">接口</span>
                  <div className="relative">
                    <select
                      value={interfaceVal}
                      onChange={(e) => setInterfaceVal(e.target.value)}
                      className="border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-2.5 py-1 text-[13px] bg-white text-gray-700 cursor-pointer outline-none pr-8 appearance-none min-w-[240px]"
                    >
                      {probeGroups.map((group) => (
                        <optgroup key={group.name} label={group.name}>
                          {group.interfaces.map((iface) => (
                            <option key={iface} value={iface}>
                              {iface}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Right: 新增规则按钮、批量操作按钮、过滤、控制按钮、全局配置、一键清空按钮放在同一行 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOpenAddModal}
                    className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-3 py-1 rounded-[3px] text-[13px] flex items-center space-x-1 cursor-pointer transition-colors font-normal shadow-sm"
                  >
                    <Plus size={15} />
                    <span>新增规则</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowBatchModal(!showBatchModal)}
                      className="border border-[#d9d9d9] hover:border-[#40a9ff] hover:text-[#1890ff] text-gray-700 px-2.5 py-1 rounded-[3px] text-[13px] flex items-center space-x-1 cursor-pointer transition-colors bg-white"
                    >
                      <span>批量操作</span>
                      <ChevronDown size={13} className="text-gray-400" />
                    </button>
                    {showBatchModal && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 shadow-md rounded-[3px] py-1 z-30">
                        <div className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-gray-700">批量启用</div>
                        <div className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-gray-700">批量禁用</div>
                        <div className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-red-600">批量删除</div>
                      </div>
                    )}
                  </div>

                  <button
                    className="border border-[#d9d9d9] hover:border-[#40a9ff] hover:text-[#1890ff] p-1.5 rounded-[3px] text-gray-600 cursor-pointer transition-colors bg-white"
                    title="过滤"
                  >
                    <Filter size={14} />
                  </button>

                  <button
                    className="border border-[#d9d9d9] hover:border-[#40a9ff] hover:text-[#1890ff] p-1.5 rounded-[3px] text-gray-600 cursor-pointer transition-colors bg-white"
                    title="控制按钮"
                  >
                    <Columns3 size={14} />
                  </button>

                  <button
                    onClick={() => setShowGlobalConfigModal(true)}
                    className="border border-[#d9d9d9] hover:border-[#40a9ff] hover:text-[#1890ff] text-gray-700 px-3 py-1 rounded-[3px] text-[13px] cursor-pointer transition-colors bg-white"
                  >
                    全局配置
                  </button>

                  <button
                    onClick={() => setShowClearConfirmModal(true)}
                    className="border border-[#d9d9d9] hover:border-red-400 hover:text-red-500 text-gray-700 px-3 py-1 rounded-[3px] text-[13px] flex items-center space-x-1 cursor-pointer transition-colors bg-white"
                  >
                    <Trash2 size={14} className="text-gray-500" />
                    <span>一键清空</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto border border-[#e8e8e8] rounded-[2px] bg-white">
                <table className="w-full text-left border-collapse table-auto">
                  <thead className="bg-[#fafafa] text-[#555555] text-[13px] font-medium sticky top-0 z-10 border-b border-[#e8e8e8]">
                    <tr>
                      <th className="py-2.5 px-3 w-[40px] text-center border-r border-[#f0f0f0]">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedGroupIds.length === ruleGroups.length && ruleGroups.length > 0}
                          className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-1 w-[28px] border-r border-[#f0f0f0]"></th>
                      <th className="py-2.5 px-3 w-[60px] border-r border-[#f0f0f0]">序号</th>
                      <th className="py-2.5 px-4 w-[120px] border-r border-[#f0f0f0]">规则ID</th>
                      <th className="py-2.5 px-4 min-w-[200px] border-r border-[#f0f0f0]">目的IP段</th>
                      <th className="py-2.5 px-4 min-w-[180px] border-r border-[#f0f0f0]">目的端口</th>
                      <th className="py-2.5 px-4 w-[120px] border-r border-[#f0f0f0]">截包长度</th>
                      <th className="py-2.5 px-4 min-w-[210px] text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0] text-gray-700 text-[13px]">
                    {ruleGroups.map((group) => {
                      const isExpanded = expandedGroups.includes(group.id);
                      const isGroupSelected = selectedGroupIds.includes(group.id);

                      return (
                        <React.Fragment key={group.id}>
                          {/* 规则分组行（完全匹配图1样式: Checkbox + [+]加号展开 + 规则名称 + 右侧设置） */}
                          <tr
                            className={`border-b border-[#f0f0f0] transition-colors ${
                              isExpanded ? 'bg-[#f0f7ff]' : 'hover:bg-[#fafafa] bg-white'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2 px-3 text-center border-r border-[#f0f0f0]">
                              <input
                                type="checkbox"
                                checked={isGroupSelected}
                                onChange={() => handleSelectGroup(group.id)}
                                className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                              />
                            </td>

                            {/* Group row content across columns */}
                            <td colSpan={6} className="py-2 px-3 border-r border-[#f0f0f0]">
                              <div className="flex items-center space-x-2">
                                {/* 加号/减号展开切换按钮 */}
                                <button
                                  onClick={() => toggleExpandGroup(group.id)}
                                  className={`w-[15px] h-[15px] rounded-[2px] flex items-center justify-center cursor-pointer text-[12px] leading-none transition-colors select-none ${
                                    isExpanded
                                      ? 'border border-[#1890ff] text-[#1890ff] bg-white font-bold'
                                      : 'border border-[#bfbfbf] text-gray-500 bg-white hover:border-[#1890ff] hover:text-[#1890ff]'
                                  }`}
                                  title={isExpanded ? '收起' : '展开'}
                                >
                                  {isExpanded ? '−' : '+'}
                                </button>

                                <span className="text-gray-800 text-[13px] font-normal">
                                  {group.groupName}
                                </span>
                              </div>
                            </td>

                            {/* 操作列: 设置按钮 (点击出现58种规则弹窗) */}
                            <td className="py-2 px-4 text-center">
                              <button
                                onClick={() => setConfigModalRuleType(group.groupName)}
                                className="inline-flex items-center space-x-1 text-gray-500 hover:text-[#1890ff] cursor-pointer text-[12px] transition-colors"
                                title="设置"
                              >
                                <Settings size={14} className="text-gray-400" />
                                <span>设置</span>
                              </button>
                            </td>
                          </tr>

                          {/* 展开的具体规则行 (具体规则在下拉列表中展示，包含规则ID、规则名称等) */}
                          {isExpanded &&
                            (group.children.length > 0 ? (
                              group.children.map((child, idx) => {
                                const isChildSelected = selectedRuleIds.includes(child.id);
                                return (
                                  <tr
                                    key={child.id}
                                    className={`border-b border-[#f0f0f0] hover:bg-[#f7fbff] transition-colors ${
                                      isChildSelected ? 'bg-[#e6f7ff]' : 'bg-white'
                                    }`}
                                  >
                                  {/* Checkbox */}
                                  <td className="py-2 px-3 text-center border-r border-[#f0f0f0]">
                                    <input
                                      type="checkbox"
                                      checked={isChildSelected}
                                      onChange={() => handleSelectChild(child.id)}
                                      className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                                    />
                                  </td>

                                  {/* Grip */}
                                  <td className="py-2 px-1 text-center border-r border-[#f0f0f0]">
                                    <GripVertical
                                      size={13}
                                      className="text-gray-300 cursor-grab mx-auto hover:text-gray-500"
                                    />
                                  </td>

                                  {/* 序号 */}
                                  <td className="py-2 px-3 text-gray-600 border-r border-[#f0f0f0]">{idx + 1}</td>

                                  {/* 规则ID (在下拉展开行中展示) */}
                                  <td className="py-2 px-4 text-gray-700 font-mono text-[12px] border-r border-[#f0f0f0]">
                                    {child.ruleId}
                                  </td>


                                  {/* 目的IP段 */}
                                  <td className="py-2 px-4 text-gray-700 font-mono text-[12px] border-r border-[#f0f0f0]">
                                    {child.destIp}
                                  </td>

                                  {/* 目的端口 */}
                                  <td className="py-2 px-4 text-gray-700 font-mono text-[12px] border-r border-[#f0f0f0]">
                                    {child.destPort}
                                  </td>

                                  {/* 截包长度 */}
                                  <td className="py-2 px-4 text-gray-700 border-r border-[#f0f0f0]">{child.packetLen}</td>

                                  {/* 操作 */}
                                  <td className="py-2 px-4 text-center">
                                    <div className="flex items-center justify-center space-x-2.5 text-gray-400">
                                      <button className="hover:text-[#1890ff] cursor-pointer transition-colors" title="重置/回滚">
                                        <RotateCcw size={15} />
                                      </button>
                                      <button
                                        onClick={() => handleOpenEditRule(group, child)}
                                        className="hover:text-[#1890ff] cursor-pointer transition-colors"
                                        title="编辑规则"
                                      >
                                        <Pencil size={15} />
                                      </button>
                                      <button className="hover:text-[#1890ff] cursor-pointer transition-colors" title="复制">
                                        <Copy size={15} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          setAdvancedConfigTarget({
                                            groupName: group.groupName,
                                            ruleId: child.ruleId,
                                            packetLen: child.packetLen,
                                          })
                                        }
                                        className="hover:text-[#1890ff] cursor-pointer transition-colors"
                                        title="高级配置"
                                      >
                                        <Settings size={15} />
                                      </button>
                                      <button className="hover:text-red-500 cursor-pointer transition-colors" title="删除">
                                        <Trash2 size={15} />
                                      </button>

                                      {/* Active Switch */}
                                      <div
                                        onClick={() => toggleChildEnabled(group.id, child.id)}
                                        className={`w-[38px] h-[20px] rounded-full p-[2px] cursor-pointer transition-colors flex items-center ${
                                          child.enabled ? 'bg-[#1890ff] justify-end' : 'bg-gray-300 justify-start'
                                        }`}
                                      >
                                        <div className="w-[16px] h-[16px] rounded-full bg-white shadow-sm" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr className="border-b border-[#f0f0f0] bg-white">
                              <td colSpan={8} className="py-2.5 text-center text-xs text-gray-400">
                                暂无具体规则数据
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                    {ruleGroups.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <span>当前接口暂无关联规则</span>
                            <button
                              onClick={() => setRuleGroups(initialRuleGroups)}
                              className="text-xs text-[#1890ff] hover:underline cursor-pointer"
                            >
                              恢复默认规则
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination Bar */}
              <div className="flex items-center justify-between pt-3 text-[13px] text-gray-600 shrink-0">
                <div>
                  本页记录从 <span className="text-gray-800">{ruleGroups.length > 0 ? 1 : 0}</span> 到 <span className="text-gray-800">{ruleGroups.length}</span>, 总数 <span className="font-semibold text-gray-800">{ruleGroups.length}</span> 条
                </div>

                <div className="flex items-center space-x-2">
                  {/* Page size selector */}
                  <div className="relative">
                    <select
                      value={pageSizeRules}
                      onChange={(e) => setPageSizeRules(e.target.value)}
                      className="border border-[#d9d9d9] hover:border-[#40a9ff] rounded-[3px] px-2 py-0.5 bg-white text-gray-700 outline-none pr-6 appearance-none cursor-pointer text-[12px]"
                    >
                      <option value="20">20条/页</option>
                      <option value="50">50条/页</option>
                      <option value="100">100条/页</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-1.5 top-2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Prev / Page 1 / Next */}
                  <div className="flex items-center space-x-1">
                    <button className="w-6 h-6 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-6 h-6 bg-[#1890ff] text-white rounded-[2px] flex items-center justify-center font-medium text-[12px] shadow-sm">
                      1
                    </button>
                    <button className="w-6 h-6 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                      <ChevronsRight size={14} />
                    </button>
                  </div>

                  {/* Jump to page */}
                  <div className="flex items-center space-x-1 ml-2 text-[12px]">
                    <span>前往</span>
                    <input
                      type="text"
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value)}
                      className="w-8 h-6 border border-[#d9d9d9] focus:border-[#1890ff] rounded-[2px] text-center text-gray-700 outline-none text-[12px]"
                    />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =================== VIEW 1: 脱敏配置 (Image 1 style) =================== */
            <div className="flex-1 flex flex-col overflow-hidden p-5">
              <div className="space-y-4">
                {/* Section 1: 脱敏配置 Title & Switch */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-[14px] mb-3">脱敏配置</h3>
                  <div className="flex items-center space-x-3 text-[13px] text-gray-700">
                    <span>业务分析脱敏</span>
                    <div
                      onClick={() => setBusinessMaskingEnabled(!businessMaskingEnabled)}
                      className={`w-[38px] h-[20px] rounded-full p-[2px] cursor-pointer transition-colors flex items-center ${
                        businessMaskingEnabled ? 'bg-[#1890ff] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-[16px] h-[16px] rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Section 2: 脱敏规则管理 Title & Button */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-[14px]">脱敏规则管理</h3>
                    <button className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-3 py-1 rounded-[3px] text-[13px] cursor-pointer transition-colors">
                      添加规则
                    </button>
                  </div>

                  {/* Masking Table */}
                  <div className="border border-[#e8e8e8] rounded-[2px] bg-white overflow-x-auto">
                    <table className="w-full text-left border-collapse table-auto">
                      <thead className="bg-[#fafafa] text-[#555555] text-[13px] font-medium border-b border-[#e8e8e8]">
                        <tr>
                          <th className="py-2.5 px-4 w-[70px] border-r border-[#f0f0f0]">ID</th>
                          <th className="py-2.5 px-4 w-[180px] border-r border-[#f0f0f0]">脱敏规则名称</th>
                          <th className="py-2.5 px-4 w-[240px] border-r border-[#f0f0f0]">描述</th>
                          <th className="py-2.5 px-4 min-w-[280px] border-r border-[#f0f0f0]">匹配表达式</th>
                          <th className="py-2.5 px-4 min-w-[160px] border-r border-[#f0f0f0]">替换表达式</th>
                          <th className="py-2.5 px-4 w-[80px] text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f0] text-gray-700 text-[13px]">
                        {maskingList.map((row) => (
                          <tr key={row.id} className="hover:bg-[#f7fbff] transition-colors">
                            <td className="py-2 px-4 text-gray-600 border-r border-[#f0f0f0]">{row.id}</td>
                            <td className="py-2 px-4 text-gray-800 border-r border-[#f0f0f0]">{row.name}</td>
                            <td className="py-2 px-4 text-gray-600 border-r border-[#f0f0f0]">{row.desc}</td>
                            <td className="py-2 px-4 text-gray-700 font-mono text-[12px] border-r border-[#f0f0f0]">{row.regex}</td>
                            <td className="py-2 px-4 text-gray-700 font-mono text-[12px] border-r border-[#f0f0f0]">{row.replacement}</td>
                            <td className="py-2 px-4 text-center">
                              <button className="text-gray-400 hover:text-[#1890ff] cursor-pointer" title="编辑">
                                <Pencil size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Masking Pagination */}
                  <div className="flex items-center justify-between pt-4 text-[13px] text-gray-600">
                    <div>
                      本页记录从1到5,总数 <span className="font-semibold text-gray-800">5</span>条
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <select
                          value={pageSizeMasking}
                          onChange={(e) => setPageSizeMasking(e.target.value)}
                          className="border border-[#d9d9d9] hover:border-[#40a9ff] rounded-[3px] px-2 py-0.5 bg-white text-gray-700 outline-none pr-6 appearance-none cursor-pointer text-[12px]"
                        >
                          <option value="20">20条/页</option>
                          <option value="50">50条/页</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-1.5 top-2 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="w-6 h-6 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                          <ChevronLeft size={14} />
                        </button>
                        <button className="w-6 h-6 bg-[#1890ff] text-white rounded-[2px] flex items-center justify-center font-medium text-[12px] shadow-sm">
                          1
                        </button>
                        <button className="w-6 h-6 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                          <ChevronsRight size={14} />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 ml-2 text-[12px]">
                        <span>前往</span>
                        <input
                          type="text"
                          defaultValue="1"
                          className="w-8 h-6 border border-[#d9d9d9] focus:border-[#1890ff] rounded-[2px] text-center text-gray-700 outline-none text-[12px]"
                        />
                        <span>页</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog: 新建应用 / 新增规则 (matches image.png) */}
      {showAddAppModal && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[890px] max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header: 新增规则 / 规则配置 (编辑模式展示规则ID) */}
            <div className="flex items-center justify-between px-7 py-4 border-b border-[#f0f0f0] shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="font-semibold text-gray-800 text-[15px]">
                  {editingRuleInfo ? '规则配置' : '新增规则'}
                </span>
                {editingRuleInfo && (
                  <span className="text-xs text-[#1890ff] bg-[#e6f7ff] border border-[#91d5ff] px-2 py-0.5 rounded-[2px] font-mono">
                    规则ID: {editingRuleInfo.rule.ruleId}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setShowAddAppModal(false);
                  setEditingRuleInfo(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
                title="关闭"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-7 overflow-y-auto space-y-4 flex-1 text-[13px]">
              {/* 1. 规则名称 (修改自应用名称) */}
              <div className="flex items-center">
                <label className="w-[75px] text-gray-700 shrink-0">规则名称</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formAppName}
                    onChange={(e) => setFormAppName(e.target.value)}
                    placeholder="请输入规则名称"
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 outline-none text-[13px] text-gray-800 placeholder:text-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* 2. 探针接口 (下拉选择不同探针下的接口，默认为当前外部配置中的接口选择) */}
              <div className="flex items-center">
                <label className="w-[75px] text-gray-700 shrink-0">探针接口</label>
                <div className="flex-1 relative">
                  <div
                    onClick={() => setShowInterfaceDropdown(!showInterfaceDropdown)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-2.5 py-1 flex items-center justify-between bg-white min-h-[34px] cursor-pointer"
                  >
                    {formInterface ? (
                      <div className="flex items-center space-x-1 bg-[#e6f7ff] border border-[#91d5ff] text-[#1890ff] px-2 py-0.5 rounded-[2px] text-[12px]">
                        <span>{formInterface}</span>
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormInterface('');
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-[13px]">请选择探针接口</span>
                    )}
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${showInterfaceDropdown ? 'rotate-180' : ''}`}
                    />
                  </div>

                  {showInterfaceDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#d9d9d9] shadow-lg rounded-[3px] z-50 max-h-[220px] overflow-y-auto py-1">
                      {probeGroups.map((group) => (
                        <div key={group.name}>
                          <div className="px-3 py-1.5 text-xs text-gray-400 font-medium bg-[#fafafa]">
                            {group.name}
                          </div>
                          {group.interfaces.map((iface) => (
                            <div
                              key={iface}
                              onClick={() => {
                                setFormInterface(iface);
                                setShowInterfaceDropdown(false);
                              }}
                              className={`px-5 py-1.5 text-[13px] cursor-pointer flex items-center justify-between transition-colors ${
                                formInterface === iface
                                  ? 'bg-[#e6f7ff] text-[#1890ff] font-medium'
                                  : 'text-gray-700 hover:bg-[#f5f5f5]'
                              }`}
                            >
                              <span>{iface}</span>
                              {formInterface === iface && <span className="text-[#1890ff] text-xs">✓</span>}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. 协议类型 (新增字段，参考图2、图3、图4，下拉单选) */}
              <div className="flex items-center">
                <label className="w-[75px] text-gray-700 shrink-0">协议类型</label>
                <div className="flex-1 relative">
                  <select
                    value={formProtocol}
                    onChange={(e) => setFormProtocol(e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    {protocolOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 4. 规则定义 (修改自应用定义) */}
              <div className="flex items-start">
                <label className="w-[75px] text-gray-700 shrink-0 pt-1">规则定义</label>
                <div className="flex-1 space-y-3">
                  {/* Mode Radios */}
                  <div className="flex items-center space-x-7 py-0.5">
                    <label
                      onClick={() => setAppDefineMode('mixed')}
                      className="flex items-center space-x-2 cursor-pointer text-gray-800 text-[13px]"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-[#1890ff] flex items-center justify-center">
                        {appDefineMode === 'mixed' && (
                          <span className="w-2 h-2 rounded-full bg-[#1890ff]" />
                        )}
                      </span>
                      <span>混合模式</span>
                    </label>

                    <label
                      onClick={() => setAppDefineMode('single')}
                      className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center">
                        {appDefineMode === 'single' && (
                          <span className="w-2 h-2 rounded-full bg-[#1890ff]" />
                        )}
                      </span>
                      <span>单一模式</span>
                    </label>
                  </div>

                  {/* Gray Box 1: 源IP */}
                  <div className="bg-[#f7f8fa] border border-[#f0f0f0] rounded-[3px] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium text-[13px]">源IP</span>
                      <button
                        onClick={() => setShowSrcIpExclude(!showSrcIpExclude)}
                        className="text-gray-400 hover:text-[#1890ff] cursor-pointer flex items-center space-x-1 text-[12px] transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={srcIp}
                      onChange={(e) => setSrcIp(e.target.value)}
                      placeholder='支持单个IP、离散IP、IP段以及IP/子网掩码,离散IP用","分隔,IP段用"-"连接'
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    {showSrcIpExclude && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={srcIpExclude}
                          onChange={(e) => setSrcIpExclude(e.target.value)}
                          placeholder="请输入排除的源IP..."
                          className="w-full bg-white border border-[#ffa39e] rounded-[3px] px-3 py-1 text-[12px] text-gray-700 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Gray Box 2: 源端口 */}
                  <div className="bg-[#f7f8fa] border border-[#f0f0f0] rounded-[3px] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium text-[13px]">源端口</span>
                      <button
                        onClick={() => setShowSrcPortExclude(!showSrcPortExclude)}
                        className="text-gray-400 hover:text-[#1890ff] cursor-pointer flex items-center space-x-1 text-[12px] transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={srcPort}
                      onChange={(e) => setSrcPort(e.target.value)}
                      placeholder='支持单个端口、端口段以及离散端口，多个端口用","分隔，端口段用"-"连接'
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    {showSrcPortExclude && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={srcPortExclude}
                          onChange={(e) => setSrcPortExclude(e.target.value)}
                          placeholder="请输入排除的源端口..."
                          className="w-full bg-white border border-[#ffa39e] rounded-[3px] px-3 py-1 text-[12px] text-gray-700 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Gray Box 3: 目的IP */}
                  <div className="bg-[#f7f8fa] border border-[#f0f0f0] rounded-[3px] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium text-[13px]">目的IP</span>
                      <button
                        onClick={() => setShowDestIpExclude(!showDestIpExclude)}
                        className="text-gray-400 hover:text-[#1890ff] cursor-pointer flex items-center space-x-1 text-[12px] transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={destIp}
                      onChange={(e) => setDestIp(e.target.value)}
                      placeholder='支持单个IP、离散IP、IP段以及IP/子网掩码,"分隔,IP段用"-"连接'
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    {showDestIpExclude && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={destIpExclude}
                          onChange={(e) => setDestIpExclude(e.target.value)}
                          placeholder="请输入排除的目的IP..."
                          className="w-full bg-white border border-[#ffa39e] rounded-[3px] px-3 py-1 text-[12px] text-gray-700 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Gray Box 4: 目的端口 */}
                  <div className="bg-[#f7f8fa] border border-[#f0f0f0] rounded-[3px] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium text-[13px]">目的端口</span>
                      <button
                        onClick={() => setShowDestPortExclude(!showDestPortExclude)}
                        className="text-gray-400 hover:text-[#1890ff] cursor-pointer flex items-center space-x-1 text-[12px] transition-colors"
                      >
                        <PlusCircle size={13} />
                        <span>添加排除</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={destPort}
                      onChange={(e) => setDestPort(e.target.value)}
                      placeholder='支持单个端口、端口段以及离散端口，多个端口用","分隔，端口段用"-"连接'
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[12px] text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    {showDestPortExclude && (
                      <div className="pt-1">
                        <input
                          type="text"
                          value={destPortExclude}
                          onChange={(e) => setDestPortExclude(e.target.value)}
                          placeholder="请输入排除的目的端口..."
                          className="w-full bg-white border border-[#ffa39e] rounded-[3px] px-3 py-1 text-[12px] text-gray-700 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. 截包长度 (选项参考图5: 全包, 不存包, 包头64, 包头128) */}
              <div className="flex items-center">
                <label className="w-[75px] text-gray-700 shrink-0">截包长度</label>
                <div className="flex-1 relative">
                  <select
                    value={formPacketLen}
                    onChange={(e) => setFormPacketLen(e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="全包">全包</option>
                    <option value="不存包">不存包</option>
                    <option value="包头64">包头64</option>
                    <option value="包头128">包头128</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modal Footer (Centered buttons) */}
            <div className="py-4 border-t border-[#f0f0f0] flex items-center justify-center space-x-3 bg-white shrink-0">
              <button
                onClick={() => {
                  setShowAddAppModal(false);
                  setEditingRuleInfo(null);
                }}
                className="px-6 py-1.5 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555555] rounded-[3px] text-[13px] cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveRule}
                className="px-6 py-1.5 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-[3px] text-[13px] cursor-pointer transition-colors shadow-sm font-normal"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 规则配置弹窗（根据md文档58种规则类型配置） */}
      {configModalRuleType && (
        <RuleConfigModal
          ruleType={configModalRuleType}
          onClose={() => setConfigModalRuleType(null)}
        />
      )}

      {/* 高级配置弹窗（点击图1中按钮位置出现，展示图2内容，UI样式参考图3） */}
      {advancedConfigTarget && (
        <AdvancedConfigModal
          ruleGroup={advancedConfigTarget.groupName}
          ruleId={advancedConfigTarget.ruleId}
          initialValues={{
            packetLength:
              advancedConfigTarget.packetLen === '全包'
                ? '全包'
                : advancedConfigTarget.packetLen || '64字节',
          }}
          onClose={() => setAdvancedConfigTarget(null)}
          onSave={(values) => {
            console.log('Saved advanced config:', values);
            setAdvancedConfigTarget(null);
          }}
        />
      )}
      {/* 全局配置弹窗（结合图1与图2内容） */}
      {showGlobalConfigModal && (
        <GlobalConfigModal
          onClose={() => setShowGlobalConfigModal(false)}
        />
      )}

      {/* 一键清空确认弹窗（参考用户截图 image_3c2735a2.png） */}
      {showClearConfirmModal && (
        <ClearConfirmModal
          onClose={() => setShowClearConfirmModal(false)}
          onConfirm={handleConfirmClear}
        />
      )}

      {/* 全局操作 Toast 提示 */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#f6ffed] border border-[#b7eb8f] text-[#52c41a] px-4 py-2 rounded shadow-lg text-[13px] flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
