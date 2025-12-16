import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function BulkActionBar({ selectedCount, onAction, onClear }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleStatusChange = (status) => {
    onAction('status', status);
    setShowDropdown(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-in" data-testid="bulk-action-bar">
      <div className="bg-white rounded-full shadow-2xl border border-slate-200 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: '#4a5568' }}>
            <span className="text-white text-sm font-bold" data-testid="selected-count">{selectedCount}</span>
          </div>
          <span className="text-sm font-medium text-slate-700">
            {selectedCount === 1 ? '1 vídeo selecionado' : `${selectedCount} vídeos selecionados`}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            data-testid="bulk-status-dropdown"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
          >
            Alterar Status
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-scale-in" data-testid="bulk-status-menu">
              <button
                onClick={() => handleStatusChange('planejado')}
                data-testid="bulk-status-planejado"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
              >
                📝 Planejado
              </button>
              <button
                onClick={() => handleStatusChange('em-producao')}
                data-testid="bulk-status-em-producao"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
              >
                🎥 Em Produção
              </button>
              <button
                onClick={() => handleStatusChange('em-edicao')}
                data-testid="bulk-status-em-edicao"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
              >
                ✂️ Em Edição
              </button>
              <button
                onClick={() => handleStatusChange('concluido')}
                data-testid="bulk-status-concluido"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
              >
                ✅ Concluído
              </button>
            </div>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onAction('delete')}
          data-testid="bulk-delete-button"
          className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-colors"
        >
          Excluir
        </button>

        {/* Clear Selection */}
        <button
          onClick={onClear}
          data-testid="bulk-clear-button"
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="Limpar seleção"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
