import React, { useState } from 'react';
import { X, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { RULE_CONFIG_MAP, RuleTypeConfig } from '../ruleConfigs';

export interface NTItem {
  id: string;
  name: string;
  type: string;
}

export interface DetailedFunctionItem {
  id: string;
  functionId: string;
  functionName: string;
  ntList: NTItem[];
}

interface RuleConfigModalProps {
  ruleType: string;
  onClose: () => void;
  onSave?: (ruleType: string, values: Record<string, any>) => void;
}

export default function RuleConfigModal({ ruleType, onClose, onSave }: RuleConfigModalProps) {
  const config: RuleTypeConfig = RULE_CONFIG_MAP[ruleType] || {
    name: ruleType,
    fields: [
      { name: `${ruleType}解析`, type: 'radio', defaultValue: '启用', options: ['启用', '不启用'] },
    ],
  };

  // Form states for general fields
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    return initial;
  });

  // HS UTF2 Detailed Config States
  const [functionItems, setFunctionItems] = useState<DetailedFunctionItem[]>([]);
  const [selectedFuncIds, setSelectedFuncIds] = useState<string[]>([]);
  const [currentFunctionId, setCurrentFunctionId] = useState('');
  const [currentFunctionName, setCurrentFunctionName] = useState('');
  const [currentNTList, setCurrentNTList] = useState<NTItem[]>([
    { id: '1', name: 'param1', type: '自动识别' },
  ]);

  // N&T Sub-modal state
  const [showNTModal, setShowNTModal] = useState(false);
  const [tempNTList, setTempNTList] = useState<NTItem[]>([]);

  // Editing existing function item
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Open N&T sub-modal
  const handleOpenNTModal = () => {
    setTempNTList(JSON.parse(JSON.stringify(currentNTList)));
    setShowNTModal(true);
  };

  // Add parameter in N&T sub-modal
  const handleAddNTParam = () => {
    setTempNTList((prev) => [
      ...prev,
      { id: String(Date.now()), name: '', type: '自动识别' },
    ]);
  };

  // Remove parameter in N&T sub-modal
  const handleRemoveNTParam = (id: string) => {
    setTempNTList((prev) => prev.filter((item) => item.id !== id));
  };

  // Save N&T sub-modal
  const handleSaveNTModal = () => {
    setCurrentNTList(tempNTList);
    setShowNTModal(false);
  };

  // Add / Update function item in detailed config
  const handleAddFunctionItem = () => {
    if (!currentFunctionId.trim() || !currentFunctionName.trim()) {
      alert('请输入必填的 functionId 和 functionName');
      return;
    }

    if (editingItemId) {
      setFunctionItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                functionId: currentFunctionId.trim(),
                functionName: currentFunctionName.trim(),
                ntList: currentNTList,
              }
            : item
        )
      );
      setEditingItemId(null);
    } else {
      const newItem: DetailedFunctionItem = {
        id: String(Date.now()),
        functionId: currentFunctionId.trim(),
        functionName: currentFunctionName.trim(),
        ntList: currentNTList,
      };
      setFunctionItems((prev) => [...prev, newItem]);
    }

    setCurrentFunctionId('');
    setCurrentFunctionName('');
    setCurrentNTList([{ id: '1', name: 'param1', type: '自动识别' }]);
  };

  const handleEditFunctionItem = (item: DetailedFunctionItem) => {
    setEditingItemId(item.id);
    setCurrentFunctionId(item.functionId);
    setCurrentFunctionName(item.functionName);
    setCurrentNTList(item.ntList || []);
  };

  const handleDeleteFunctionItem = (id: string) => {
    setFunctionItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedFuncIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSelectAllFunctions = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFuncIds(functionItems.map((item) => item.id));
    } else {
      setSelectedFuncIds([]);
    }
  };

  const handleSelectOneFunction = (id: string) => {
    setSelectedFuncIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveAll = () => {
    if (onSave) {
      onSave(ruleType, {
        ...formValues,
        ...(config.hasDetailedConfig ? { detailedConfigs: functionItems } : {}),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[860px] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#f0f0f0] shrink-0 bg-[#fafafa]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800 text-[15px]">{ruleType}</span>
            <span className="text-xs text-gray-400 font-normal">规则配置</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
            title="关闭"
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-[13px]">
          {/* Render defined fields */}
          <div className="space-y-4">
            {config.fields.map((field) => {
              // 1. Radio (启用 / 不启用)
              if (field.type === 'radio') {
                const val = formValues[field.name] || '启用';
                return (
                  <div key={field.name} className="flex items-center">
                    <label className="w-[200px] text-gray-700 shrink-0 text-[13px]">{field.name}</label>
                    <div className="flex items-center space-x-6">
                      {(field.options || ['启用', '不启用']).map((opt) => (
                        <label
                          key={opt}
                          onClick={() => setFormValues((prev) => ({ ...prev, [field.name]: opt }))}
                          className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                              val === opt ? 'border-[#1890ff]' : 'border-gray-300'
                            }`}
                          >
                            {val === opt && <span className="w-2 h-2 rounded-full bg-[#1890ff]" />}
                          </span>
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              // 2. Datasource Multi-checkbox (ClickHouse, MongoDB)
              if (field.type === 'datasource') {
                const selectedList: string[] = formValues[field.name] || [];
                const toggleDs = (ds: string) => {
                  setFormValues((prev) => {
                    const current = prev[field.name] || [];
                    const updated = current.includes(ds)
                      ? current.filter((x: string) => x !== ds)
                      : [...current, ds];
                    return { ...prev, [field.name]: updated };
                  });
                };

                return (
                  <div key={field.name} className="flex items-center">
                    <label className="w-[200px] text-gray-700 shrink-0 text-[13px]">{field.name}</label>
                    <div className="flex items-center space-x-6">
                      {['ClickHouse', 'MongoDB'].map((ds) => {
                        const checked = selectedList.includes(ds);
                        return (
                          <label
                            key={ds}
                            onClick={() => toggleDs(ds)}
                            className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                            />
                            <span>{ds}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 3. Number Input
              if (field.type === 'number') {
                const val = formValues[field.name] ?? 100;
                return (
                  <div key={field.name} className="flex items-center">
                    <label className="w-[200px] text-gray-700 shrink-0 text-[13px]">{field.name}</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          setFormValues((prev) => ({ ...prev, [field.name]: Number(e.target.value) }))
                        }
                        className="w-32 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1 outline-none text-[13px] text-gray-800 bg-white"
                      />
                      <span className="text-gray-400 text-xs">(默认 100)</span>
                    </div>
                  </div>
                );
              }

              // 4. Select dropdown
              if (field.type === 'select') {
                const val = formValues[field.name] || (field.options?.[0] ?? '');
                return (
                  <div key={field.name} className="flex items-center">
                    <label className="w-[200px] text-gray-700 shrink-0 text-[13px]">{field.name}</label>
                    <div className="relative min-w-[160px]">
                      <select
                        value={val}
                        onChange={(e) => setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                      >
                        {(field.options || ['MQ']).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                );
              }

              // 5. Pattern-Match Application Checkbox
              if (field.type === 'checkbox_pattern') {
                const checked = Boolean(formValues[field.name]);
                return (
                  <div key={field.name} className="flex items-center">
                    <label className="w-[200px] text-gray-700 shrink-0 text-[13px]">{field.name}</label>
                    <label
                      onClick={() => setFormValues((prev) => ({ ...prev, [field.name]: !checked }))}
                      className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                      />
                      <span>全选</span>
                    </label>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Section 3: Detailed Configuration for HS UTF2(TCP) / HS UTF2(UDP) */}
          {config.hasDetailedConfig && (
            <div className="border-t border-[#f0f0f0] pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800 text-[14px]">详细配置</span>
                <span className="text-xs text-gray-400">
                  {editingItemId ? '正在编辑项' : '添加新的 function 配置'}
                </span>
              </div>

              {/* Input Form Bar */}
              <div className="bg-[#f7f8fa] border border-[#f0f0f0] rounded-[3px] p-3.5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  {/* functionId */}
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-700 shrink-0 text-[12px]">
                      <span className="text-red-500 mr-0.5">*</span>functionId
                    </label>
                    <input
                      type="text"
                      value={currentFunctionId}
                      onChange={(e) => setCurrentFunctionId(e.target.value)}
                      placeholder="请输入functionId"
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-2.5 py-1 text-[12px] text-gray-800 outline-none"
                    />
                  </div>

                  {/* functionName */}
                  <div className="flex items-center space-x-2">
                    <label className="text-gray-700 shrink-0 text-[12px]">
                      <span className="text-red-500 mr-0.5">*</span>functionName
                    </label>
                    <input
                      type="text"
                      value={currentFunctionName}
                      onChange={(e) => setCurrentFunctionName(e.target.value)}
                      placeholder="请输入functionName"
                      className="w-full bg-white border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-2.5 py-1 text-[12px] text-gray-800 outline-none"
                    />
                  </div>

                  {/* N&T edit entrance + Add button */}
                  <div className="flex items-center space-x-2 justify-end">
                    <div className="flex items-center space-x-1.5 text-gray-700 text-[12px] mr-2">
                      <span>N&T:</span>
                      <button
                        onClick={handleOpenNTModal}
                        className="border border-[#d9d9d9] hover:border-[#40a9ff] hover:text-[#1890ff] bg-white text-gray-600 px-2.5 py-1 rounded-[3px] flex items-center space-x-1 cursor-pointer transition-colors"
                        title="点击编辑N&T配置"
                      >
                        <Pencil size={12} className="text-gray-500" />
                        <span>配置({currentNTList.length})</span>
                      </button>
                    </div>

                    <button
                      onClick={handleAddFunctionItem}
                      className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-3 py-1 rounded-[3px] text-[12px] flex items-center space-x-1 cursor-pointer transition-colors shadow-sm font-normal"
                    >
                      <Plus size={13} />
                      <span>{editingItemId ? '更新' : '添加'}</span>
                    </button>

                    {editingItemId && (
                      <button
                        onClick={() => {
                          setEditingItemId(null);
                          setCurrentFunctionId('');
                          setCurrentFunctionName('');
                          setCurrentNTList([{ id: '1', name: 'param1', type: '自动识别' }]);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-[3px] text-[12px] cursor-pointer"
                      >
                        取消编辑
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Table of Detailed Configs */}
              <div className="border border-[#e8e8e8] rounded-[2px] bg-white overflow-hidden">
                <table className="w-full text-left border-collapse table-auto text-[12px]">
                  <thead className="bg-[#fafafa] text-gray-600 font-medium border-b border-[#e8e8e8]">
                    <tr>
                      <th className="py-2 px-3 w-[40px] text-center border-r border-[#f0f0f0]">
                        <input
                          type="checkbox"
                          checked={
                            selectedFuncIds.length === functionItems.length && functionItems.length > 0
                          }
                          onChange={handleSelectAllFunctions}
                          className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="py-2 px-3 w-[50px] border-r border-[#f0f0f0]">#</th>
                      <th className="py-2 px-4 border-r border-[#f0f0f0]">functionId</th>
                      <th className="py-2 px-4 border-r border-[#f0f0f0]">functionName</th>
                      <th className="py-2 px-4 border-r border-[#f0f0f0]">N&T配置参数</th>
                      <th className="py-2 px-3 w-[100px] text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0] text-gray-700">
                    {functionItems.length > 0 ? (
                      functionItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#f7fbff] transition-colors">
                          <td className="py-1.5 px-3 text-center border-r border-[#f0f0f0]">
                            <input
                              type="checkbox"
                              checked={selectedFuncIds.includes(item.id)}
                              onChange={() => handleSelectOneFunction(item.id)}
                              className="rounded-[2px] border-gray-300 text-blue-600 cursor-pointer"
                            />
                          </td>
                          <td className="py-1.5 px-3 text-gray-500 border-r border-[#f0f0f0]">{idx + 1}</td>
                          <td className="py-1.5 px-4 font-mono border-r border-[#f0f0f0]">{item.functionId}</td>
                          <td className="py-1.5 px-4 font-mono border-r border-[#f0f0f0]">{item.functionName}</td>
                          <td className="py-1.5 px-4 text-gray-500 border-r border-[#f0f0f0]">
                            {item.ntList?.length > 0
                              ? item.ntList.map((nt) => `${nt.name || '未命名'}(${nt.type})`).join('; ')
                              : '无参数'}
                          </td>
                          <td className="py-1.5 px-3 text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-400">
                              <button
                                onClick={() => handleEditFunctionItem(item)}
                                className="hover:text-[#1890ff] cursor-pointer"
                                title="编辑"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteFunctionItem(item.id)}
                                className="hover:text-red-500 cursor-pointer"
                                title="删除"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-400">
                          暂无数据，共 0 条
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination (50条/页) */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <div>
                  共 <span className="font-medium text-gray-700">{functionItems.length}</span> 条
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button className="w-5 h-5 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                      <ChevronLeft size={12} />
                    </button>
                    <button className="w-5 h-5 bg-[#1890ff] text-white rounded-[2px] flex items-center justify-center font-medium">
                      1
                    </button>
                    <button className="w-5 h-5 border border-[#d9d9d9] rounded-[2px] flex items-center justify-center text-gray-300 cursor-not-allowed">
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  <span className="text-gray-500">50 条/页</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="py-3 px-6 border-t border-[#f0f0f0] flex items-center justify-center space-x-3 bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-1.5 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555555] rounded-[3px] text-[13px] cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSaveAll}
            className="px-6 py-1.5 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-[3px] text-[13px] cursor-pointer transition-colors shadow-sm font-normal"
          >
            保存
          </button>
        </div>
      </div>

      {/* N&T Sub-modal (3.1 N&T 子弹窗) */}
      {showNTModal && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[620px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
            {/* Sub-modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f0] shrink-0 bg-[#fafafa]">
              <span className="font-semibold text-gray-800 text-[14px]">N&T 配置</span>
              <button
                onClick={() => setShowNTModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                title="关闭"
              >
                <X size={15} />
              </button>
            </div>

            {/* Sub-modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">参数列表（支持新增、修改类型与删除）</span>
                <button
                  onClick={handleAddNTParam}
                  className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-2.5 py-1 rounded-[3px] text-[12px] flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus size={13} />
                  <span>添加参数</span>
                </button>
              </div>

              {/* N&T Items List */}
              <div className="border border-[#e8e8e8] rounded-[3px] overflow-hidden bg-white">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-[#fafafa] text-gray-600 font-medium border-b border-[#e8e8e8]">
                    <tr>
                      <th className="py-2 px-3 border-r border-[#f0f0f0] w-[45%]">
                        <span className="text-red-500 mr-1">*</span>名称
                      </th>
                      <th className="py-2 px-3 border-r border-[#f0f0f0] w-[45%]">
                        <span className="text-red-500 mr-1">*</span>类型
                      </th>
                      <th className="py-2 px-3 text-center w-[10%]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {tempNTList.length > 0 ? (
                      tempNTList.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          {/* Name Input */}
                          <td className="py-1.5 px-3 border-r border-[#f0f0f0]">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setTempNTList((prev) =>
                                  prev.map((i) => (i.id === item.id ? { ...i, name: newName } : i))
                                );
                              }}
                              placeholder="请输入参数名称"
                              className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[2px] px-2 py-1 text-[12px] outline-none"
                            />
                          </td>

                          {/* Type Select */}
                          <td className="py-1.5 px-3 border-r border-[#f0f0f0]">
                            <div className="relative">
                              <select
                                value={item.type}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  setTempNTList((prev) =>
                                    prev.map((i) => (i.id === item.id ? { ...i, type: newType } : i))
                                  );
                                }}
                                className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[2px] px-2 py-1 text-[12px] outline-none bg-white pr-6 appearance-none cursor-pointer"
                              >
                                <option value="自动识别">自动识别</option>
                                <option value="32位整数">32位整数</option>
                                <option value="64位整数">64位整数</option>
                                <option value="UTF8字符串">UTF8字符串</option>
                                <option value="DOUBLE型浮点数">DOUBLE型浮点数</option>
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                            </div>
                          </td>

                          {/* Delete Icon */}
                          <td className="py-1.5 px-3 text-center">
                            <button
                              onClick={() => handleRemoveNTParam(item.id)}
                              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors p-1"
                              title="删除此行"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-5 text-center text-gray-400">
                          暂无参数配置，请点击右上角添加
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-modal Footer */}
            <div className="py-3 px-5 border-t border-[#f0f0f0] flex items-center justify-end space-x-2 bg-white shrink-0">
              <button
                onClick={() => setShowNTModal(false)}
                className="px-4 py-1 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555555] rounded-[3px] text-[12px] cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveNTModal}
                className="px-4 py-1 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-[3px] text-[12px] cursor-pointer"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
