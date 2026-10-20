import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface GlobalConfigState {
  // 截包长度 (图1)
  packetLength: string;

  // 基础超时配置 (图1)
  tcpTimeout: string;
  udpIpTimeout: string;

  // 应用性能时延区间 (图1)
  perfFastThreshold: string;
  perfNormalThreshold: string;

  // 底层参数调优 (图2)
  recordType: '流量排名' | '顺序排名';
  recordCount: string;
  serverRecordType: '流量排名' | '顺序排名';
  serverRecordCount: string;
  retransmitCount: string;
  connectFailCount: string;
  mongoSessionCount: string;

  recordAppKpi: '开启' | '关闭';
  appAdaptivePacketLen: '开启' | '关闭';
  reassembleFailContinue: '开启' | '关闭';
  intermediateStateHandling: '开启' | '关闭';
}

export const defaultGlobalConfig: GlobalConfigState = {
  packetLength: '', // 图1中初始占位为「请选择」
  tcpTimeout: '',   // 图1中初始为空
  udpIpTimeout: '', // 图1中初始为空
  perfFastThreshold: '',   // 图1中初始为空
  perfNormalThreshold: '', // 图1中初始为空

  // 图2中各项底层参数默认值
  recordType: '流量排名',
  recordCount: '100',
  serverRecordType: '流量排名',
  serverRecordCount: '50',
  retransmitCount: '0',
  connectFailCount: '10',
  mongoSessionCount: '1000',

  recordAppKpi: '开启',
  appAdaptivePacketLen: '开启',
  reassembleFailContinue: '关闭',
  intermediateStateHandling: '开启',
};

interface GlobalConfigModalProps {
  onClose: () => void;
  onSave?: (config: GlobalConfigState) => void;
}

export default function GlobalConfigModal({ onClose, onSave }: GlobalConfigModalProps) {
  const [formData, setFormData] = useState<GlobalConfigState>(defaultGlobalConfig);
  const [showToast, setShowToast] = useState(false);

  const handleTextChange = (key: keyof GlobalConfigState, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectChange = (key: keyof GlobalConfigState, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-[840px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Toast 提示 */}
        {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#f6ffed] border border-[#b7eb8f] text-[#52c41a] px-4 py-2 rounded shadow-md text-[13px] flex items-center space-x-2">
            <span>✓</span>
            <span>全局配置保存成功，已推送到当前接口的所有应用！</span>
          </div>
        )}

        {/* 顶部标题栏：全局配置 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] shrink-0 bg-white">
          <span className="font-semibold text-gray-800 text-[15px]">全局配置</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
            title="关闭"
          >
            <X size={17} />
          </button>
        </div>

        {/* 弹窗内容主体（结合图1与图2内容） */}
        <div className="px-7 py-5 overflow-y-auto space-y-6 flex-1 text-[13px] bg-white">
          {/* 图1 提示栏：以下配置保存后将推送到当前接口的所有应用，不填写则不修改 */}
          <div className="bg-[#fffbe6] border border-[#ffe58f] rounded-[3px] px-4 py-2.5 text-[#595959] text-[13px] leading-relaxed">
            以下配置保存后将推送到当前接口的所有应用，不填写则不修改
          </div>

          {/* Section 1: 截包长度 (图1) */}
          <div className="flex items-center pl-1">
            <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">截包长度</label>
            <div className="flex-1 relative">
              <select
                value={formData.packetLength}
                onChange={(e) => handleSelectChange('packetLength', e.target.value)}
                className={`w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white outline-none pr-8 appearance-none cursor-pointer ${
                  !formData.packetLength ? 'text-gray-400' : 'text-gray-800'
                }`}
              >
                <option value="">请选择</option>
                <option value="全包">全包</option>
                <option value="64字节">64字节</option>
                <option value="128字节">128字节</option>
                <option value="256字节">256字节</option>
                <option value="512字节">512字节</option>
                <option value="1024字节">1024字节</option>
                <option value="1518字节">1518字节</option>
                <option value="不存包">不存包</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Section 2: 基础超时配置 (图1) */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">基础超时配置</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="space-y-3.5 pl-1">
              {/* TCP连接超时阈值 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  TCP连接超时阈值
                </label>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={formData.tcpTimeout}
                    onChange={(e) => handleTextChange('tcpTimeout', e.target.value)}
                    placeholder=""
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-3 text-gray-400 text-[12px]">秒</span>
                </div>
              </div>

              {/* UDP&IP连接超时阈值 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  UDP&IP连接超时阈值
                </label>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={formData.udpIpTimeout}
                    onChange={(e) => handleTextChange('udpIpTimeout', e.target.value)}
                    placeholder=""
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-3 text-gray-400 text-[12px]">秒</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 应用性能时延区间 (图1) */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">
                应用性能时延区间
              </span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="flex items-center pl-1">
              <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">应用性能</label>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <span className="bg-[#d9f7be] text-[#389e0d] px-3 py-1 rounded-[3px] text-[12px] font-medium">
                  响应迅速
                </span>
                <span className="text-gray-400 text-[13px]">≤</span>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.perfFastThreshold}
                    onChange={(e) => handleTextChange('perfFastThreshold', e.target.value)}
                    placeholder=""
                    className="w-28 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-2 text-gray-400 text-[11px]">毫秒</span>
                </div>
                <span className="text-gray-400 text-[13px]">&lt;</span>
                <span className="bg-[#e6f7ff] text-[#1890ff] px-3 py-1 rounded-[3px] text-[12px] font-medium">
                  响应正常
                </span>
                <span className="text-gray-400 text-[13px]">≤</span>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={formData.perfNormalThreshold}
                    onChange={(e) => handleTextChange('perfNormalThreshold', e.target.value)}
                    placeholder=""
                    className="w-28 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] pl-3 pr-8 py-1 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="absolute right-2 text-gray-400 text-[11px]">毫秒</span>
                </div>
                <span className="text-gray-400 text-[13px]">&lt;</span>
                <span className="bg-[#fff1f0] text-[#ff4d4f] px-3 py-1 rounded-[3px] text-[12px] font-medium">
                  响应超时
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: 底层参数调优 (图2) */}
          <div>
            <div className="flex items-center space-x-3 mb-3.5">
              <span className="text-[#1890ff] text-[13px] font-medium shrink-0">底层参数调优</span>
              <div className="flex-1 border-b border-dashed border-[#d9e8ff]" />
            </div>

            <div className="space-y-3.5 pl-1">
              {/* 详单类型 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">详单类型</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="globalRecordType"
                      checked={formData.recordType === '流量排名'}
                      onChange={() => handleSelectChange('recordType', '流量排名')}
                      className="text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700 text-[13px]">流量排名</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="globalRecordType"
                      checked={formData.recordType === '顺序排名'}
                      onChange={() => handleSelectChange('recordType', '顺序排名')}
                      className="text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700 text-[13px]">顺序排名</span>
                  </label>
                </div>
              </div>

              {/* 详单条目 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">详单条目</label>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.recordCount}
                    onChange={(e) => handleTextChange('recordCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[13px] shrink-0 w-[110px]">(0-100之间)</span>
                </div>
              </div>

              {/* 服务器详单类型 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  服务器详单类型
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="globalServerRecordType"
                      checked={formData.serverRecordType === '流量排名'}
                      onChange={() => handleSelectChange('serverRecordType', '流量排名')}
                      className="text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700 text-[13px]">流量排名</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="globalServerRecordType"
                      checked={formData.serverRecordType === '顺序排名'}
                      onChange={() => handleSelectChange('serverRecordType', '顺序排名')}
                      className="text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-gray-700 text-[13px]">顺序排名</span>
                  </label>
                </div>
              </div>

              {/* 服务器详单条目 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  服务器详单条目
                </label>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.serverRecordCount}
                    onChange={(e) => handleTextChange('serverRecordCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[13px] shrink-0 w-[110px]">(0-100之间)</span>
                </div>
              </div>

              {/* 重传详单 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">重传详单</label>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.retransmitCount}
                    onChange={(e) => handleTextChange('retransmitCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[13px] shrink-0 w-[110px]">(0-1000之间)</span>
                </div>
              </div>

              {/* 建连失败详单 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  建连失败详单
                </label>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.connectFailCount}
                    onChange={(e) => handleTextChange('connectFailCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[13px] shrink-0 w-[110px]">(0-1000之间)</span>
                </div>
              </div>

              {/* Mongo AppSession详单 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  Mongo AppSession详单
                </label>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.mongoSessionCount}
                    onChange={(e) => handleTextChange('mongoSessionCount', e.target.value)}
                    className="flex-1 border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] text-gray-800 outline-none bg-white"
                  />
                  <span className="text-gray-400 text-[13px] shrink-0 w-[110px]">(0-1000000之间)</span>
                </div>
              </div>

              {/* 记录APP KPI */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">记录APP KPI</label>
                <div className="flex-1 relative">
                  <select
                    value={formData.recordAppKpi}
                    onChange={(e) => handleSelectChange('recordAppKpi', e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* APP自适应存包长度 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  APP自适应存包长度
                </label>
                <div className="flex-1 relative">
                  <select
                    value={formData.appAdaptivePacketLen}
                    onChange={(e) => handleSelectChange('appAdaptivePacketLen', e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* 重组失败继续处理 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  重组失败继续处理
                </label>
                <div className="flex-1 relative">
                  <select
                    value={formData.reassembleFailContinue}
                    onChange={(e) => handleSelectChange('reassembleFailContinue', e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* 连接中间状态处理 */}
              <div className="flex items-center">
                <label className="w-[170px] text-gray-700 shrink-0 text-[13px]">
                  连接中间状态处理
                </label>
                <div className="flex-1 relative">
                  <select
                    value={formData.intermediateStateHandling}
                    onChange={(e) => handleSelectChange('intermediateStateHandling', e.target.value)}
                    className="w-full border border-[#d9d9d9] hover:border-[#40a9ff] focus:border-[#1890ff] rounded-[3px] px-3 py-1.5 text-[13px] bg-white text-gray-800 outline-none pr-8 appearance-none cursor-pointer"
                  >
                    <option value="开启">开启</option>
                    <option value="关闭">关闭</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 弹窗底部操作栏：取消与确定按钮 */}
        <div className="px-6 py-3.5 border-t border-[#f0f0f0] flex items-center justify-center space-x-4 bg-white shrink-0">
          <button
            onClick={onClose}
            className="border border-[#d9d9d9] bg-white text-gray-600 hover:text-[#1890ff] hover:border-[#1890ff] px-7 py-1.5 rounded-[3px] text-[13px] cursor-pointer transition-colors shadow-sm"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-7 py-1.5 rounded-[3px] text-[13px] cursor-pointer transition-colors shadow-sm font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
