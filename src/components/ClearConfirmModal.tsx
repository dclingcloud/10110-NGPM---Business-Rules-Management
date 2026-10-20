import React from 'react';
import { X } from 'lucide-react';

interface ClearConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearConfirmModal({ onClose, onConfirm }: ClearConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-[430px] p-5 animate-in fade-in zoom-in-95 duration-150">
        {/* 顶部标题与关闭图标 */}
        <div className="flex items-center justify-between pb-3">
          <span className="text-[15px] font-semibold text-gray-800">清空应用</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-0.5"
            title="关闭"
          >
            <X size={17} />
          </button>
        </div>

        {/* 提示内容 */}
        <div className="py-2 text-[13.5px] text-[#262626] leading-relaxed">
          清空当前接口规则后，相关功能的应用将会被取消关联，确认清空？
        </div>

        {/* 底部右对齐操作按钮 */}
        <div className="flex items-center justify-end space-x-2.5 mt-5">
          <button
            onClick={onClose}
            className="bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#333333] px-4 py-1.5 rounded-[2px] text-[13px] cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#0091ff] hover:bg-[#40a9ff] text-white px-4 py-1.5 rounded-[2px] text-[13px] cursor-pointer transition-colors font-medium shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
