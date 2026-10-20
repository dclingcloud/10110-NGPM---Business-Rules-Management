import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';

export interface AdvancedConfigState {
  // 截包长度 (参考图3)
  packetLength: string;

  // 基础超时配置 (参考图3)
  udpIpTimeout: number;

  // 应用性能时延区间 (参考图3)
  perfFastThreshold: number;
  perfNormalThreshold: number;

  // 详单配置 (参考图3: 单独列出ClickHouse AppSession详单)
  clickhouseSessionCount: number;

  // 底层参数调优 (图1中详单各项参数与图6下拉控制项统一归入此类)
  recordType: '流量排名' | '顺序排名';
  recordCount: number;
  serverRecordType: '流量排名' | '顺序排名';
  serverRecordCount: number;
  retransmitCount: number;
  connectFailCount: number;
  mongoSessionCount: number;

  recordAppKpi: '开启' | '关闭';
  appAdaptivePacketLen: '开启' | '关闭';
  reassembleFailContinue: '开启' | '关闭';
  intermediateStateHandling: '开启' | '关闭';
}

export const defaultAdvancedConfig: AdvancedConfigState = {
  packetLength: '64字节',
  udpIpTimeout: 30,
  perfFastThreshold: 50,
  perfNormalThreshold: 500,
  clickhouseSessionCount: 100000,
  recordType: '流量排名',
  recordCount: 100,
  serverRecordType: '流量排名',
  serverRecordCount: 50,
  retransmitCount: 0,
  connectFailCount: 10,
  mongoSessionCount: 1000,
  recordAppKpi: '开启',
  appAdaptivePacketLen: '开启',
  reassembleFailContinue: '关闭',
  intermediateStateHandling: '开启',
};

interface AdvancedConfigModalProps {
  ruleGroup?: string;
  ruleId?: string;
  initialValues?: Partial<AdvancedConfigState>;
  onClose: () => void;
  onSave?: (values: AdvancedConfigState) => void;
}

export default function AdvancedConfigModal({
  initialValues,
  onClose,
  onSave,
}: AdvancedConfigModalProps) {
  const [formData, setFormData] = useState<AdvancedConfigState>({
    ...defaultAdvancedConfig,
    ...initialValues,
  });

  const handleSelectChange = (key: keyof AdvancedConfigState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: keyof AdvancedConfigState, val: string) => {
    const num = val === '' ? 0 : Number(val);
    setFormData((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 顶部标题栏：纯净标题「高级配置」与关闭按钮 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] shrink-0 bg-white">
          <span className="font-semibold text-gray-800 text-[15px]">高级配置</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
            title="关闭"
          >
            <X size={17} />
          </button>
        </div>

        {/* 弹窗内容主体 */}
        <div className="px-7 py-5 overflow-y-auto space-y-6 flex-1 text-[13px] bg-white">
          {/* Section 1: 截包长度 */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">截包长度</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="flex items-center pl-1">
              <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">截包长度</label>
              <div className="w-[520px] relative">
                <select
                  value={formData.packetLength}
                  onChange={(e) => handleSelectChange('packetLength', e.target.value)}
                  className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                >
                  <option value="64字节">64字节</option>
                  <option value="128字节">128字节</option>
                  <option value="全包">全包</option>
                  <option value="不存包">不存包</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Section 2: 基础超时配置 */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">基础超时配置</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="pl-1">
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">UDP&IP连接超时阈值</label>
                <div className="w-[520px] relative flex items-center">
                  <input
                    type="number"
                    value={formData.udpIpTimeout}
                    onChange={(e) => handleNumberChange('udpIpTimeout', e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-3 text-gray-400 text-[12px]">秒</span>
                </div>
              </div>
              <div className="flex items-center mt-1.5 ml-[190px] text-[12px] text-gray-400 space-x-1">
                <Info size={13} className="text-[#1890ff]" />
                <span>UDP&IP协议默认30秒</span>
              </div>
            </div>
          </div>

          {/* Section 3: 应用性能时延区间 */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">应用性能时延区间</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="flex items-center pl-1">
              <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">应用性能</label>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <span className="bg-[#e6f7ea] text-[#52c41a] px-2.5 py-1 rounded-[3px] text-[12px] font-medium">
                  响应迅速
                </span>
                <span className="text-gray-400 text-[13px]">≤</span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={formData.perfFastThreshold}
                    onChange={(e) => handleNumberChange('perfFastThreshold', e.target.value)}
                    className="w-28 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-2.5 text-gray-400 text-[11px]">毫秒</span>
                </div>
                <span className="text-gray-400 text-[13px]">&lt;</span>
                <span className="bg-[#e6f7ff] text-[#1890ff] px-2.5 py-1 rounded-[3px] text-[12px] font-medium">
                  响应正常
                </span>
                <span className="text-gray-400 text-[13px]">≤</span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={formData.perfNormalThreshold}
                    onChange={(e) => handleNumberChange('perfNormalThreshold', e.target.value)}
                    className="w-28 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-2.5 text-gray-400 text-[11px]">毫秒</span>
                </div>
                <span className="text-gray-400 text-[13px]">&lt;</span>
                <span className="bg-[#fff1f0] text-[#ff4d4f] px-2.5 py-1 rounded-[3px] text-[12px] font-medium">
                  响应超时
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: 详单配置 (单独展示 ClickHouse AppSession详单) */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">详单配置</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="pl-1">
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">ClickHouse AppSession详单</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.clickhouseSessionCount}
                    onChange={(e) => handleNumberChange('clickhouseSessionCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(1-5000000之间)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: 底层参数调优 (图1中详单类型、条目等内容与开关控制项全部统一分类在此模块) */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">底层参数调优</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="space-y-4 pl-1">
              {/* 1. 详单类型 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">详单类型</label>
                <div className="flex items-center space-x-6">
                  {(['流量排名', '顺序排名'] as const).map((opt) => (
                    <label
                      key={opt}
                      onClick={() => handleSelectChange('recordType', opt)}
                      className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          formData.recordType === opt ? 'border-[#1890ff]' : 'border-gray-300'
                        }`}
                      >
                        {formData.recordType === opt && (
                          <span className="w-2 h-2 rounded-full bg-[#1890ff]" />
                        )}
                      </span>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. 详单条目 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">详单条目</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.recordCount}
                    onChange={(e) => handleNumberChange('recordCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(0-100之间)</span>
                </div>
              </div>

              {/* 3. 服务器详单类型 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">服务器详单类型</label>
                <div className="flex items-center space-x-6">
                  {(['流量排名', '顺序排名'] as const).map((opt) => (
                    <label
                      key={opt}
                      onClick={() => handleSelectChange('serverRecordType', opt)}
                      className="flex items-center space-x-2 cursor-pointer text-gray-700 text-[13px]"
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          formData.serverRecordType === opt ? 'border-[#1890ff]' : 'border-gray-300'
                        }`}
                      >
                        {formData.serverRecordType === opt && (
                          <span className="w-2 h-2 rounded-full bg-[#1890ff]" />
                        )}
                      </span>
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. 服务器详单条目 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">服务器详单条目</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.serverRecordCount}
                    onChange={(e) => handleNumberChange('serverRecordCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(0-100之间)</span>
                </div>
              </div>

              {/* 5. 重传详单 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">重传详单</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.retransmitCount}
                    onChange={(e) => handleNumberChange('retransmitCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(0-1000之间)</span>
                </div>
              </div>

              {/* 6. 建连失败详单 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">建连失败详单</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.connectFailCount}
                    onChange={(e) => handleNumberChange('connectFailCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(0-1000之间)</span>
                </div>
              </div>

              {/* 7. Mongo AppSession详单 */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">Mongo AppSession详单</label>
                <div className="w-[520px] flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.mongoSessionCount}
                    onChange={(e) => handleNumberChange('mongoSessionCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[12px] shrink-0">(0-1000000之间)</span>
                </div>
              </div>

              {/* 8. 记录APP KPI (参考图6下拉设计) */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">记录APP KPI</label>
                <div className="w-[520px] relative">
                  <select
                    value={formData.recordAppKpi}
                    onChange={(e) => handleSelectChange('recordAppKpi', e.target.value as any)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 9. APP自适应存包长度 (参考图6下拉设计) */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">APP自适应存包长度</label>
                <div className="w-[520px] relative">
                  <select
                    value={formData.appAdaptivePacketLen}
                    onChange={(e) => handleSelectChange('appAdaptivePacketLen', e.target.value as any)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 10. 重组失败继续处理 (参考图6下拉设计) */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">重组失败继续处理</label>
                <div className="w-[520px] relative">
                  <select
                    value={formData.reassembleFailContinue}
                    onChange={(e) => handleSelectChange('reassembleFailContinue', e.target.value as any)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="关闭">关闭</option>
                    <option value="开启">开启</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 11. 连接中间状态处理 (参考图6下拉设计) */}
              <div className="flex items-center">
                <label className="w-[190px] text-gray-700 shrink-0 text-[13px]">连接中间状态处理</label>
                <div className="w-[520px] relative">
                  <select
                    value={formData.intermediateStateHandling}
                    onChange={(e) => handleSelectChange('intermediateStateHandling', e.target.value as any)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Centered buttons */}
        <div className="py-3.5 px-6 border-t border-[#f0f0f0] flex items-center justify-center space-x-3 bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-1.5 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555555] rounded-[3px] text-[13px] cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-1.5 bg-[#0091ff] hover:bg-[#1890ff] text-white rounded-[3px] text-[13px] cursor-pointer transition-colors shadow-sm font-normal"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
