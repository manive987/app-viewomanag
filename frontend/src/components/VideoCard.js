import React, { useState } from 'react';
import { toast } from 'sonner';
import { Edit2, Trash2, Copy, ExternalLink, CheckCircle } from 'lucide-react';

const statusConfig = {
  'planejado': { label: 'Planejado', color: 'bg-slate-100 text-slate-700', icon: '📝' },
  'em-producao': { label: 'Em Produção', color: 'bg-orange-100 text-orange-700', icon: '🎥' },
  'em-edicao': { label: 'Em Edição', color: 'bg-blue-100 text-blue-700', icon: '✂️' },
  'concluido': { label: 'Concluído', color: 'bg-green-100 text-green-700', icon: '✅' },
};

export default function VideoCard({ video, isSelected, onToggleSelection, onEdit, onDelete, className, style }) {
  const status = statusConfig[video.status] || statusConfig['planejado'];
  const [showActions, setShowActions] = useState(false);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border-2 overflow-hidden hover:border-[#4299e1] transition-all ${isSelected ? 'border-[#4299e1] shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-md'} ${className || ''}`}
      style={style}
      data-testid={`video-card-${video.id}`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(video.id)}
            data-testid={`video-checkbox-${video.id}`}
            className="w-5 h-5 rounded border-2 border-slate-300 text-[#4a5568] focus:ring-2 focus:ring-[#4a5568] cursor-pointer"
          />
        </label>
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
          data-testid={`video-status-${video.id}`}
        >
          {status.icon} {status.label}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-14">
        <h3
          className="text-lg font-semibold mb-2 line-clamp-2"
          style={{ color: '#4a5568' }}
          data-testid={`video-title-${video.id}`}
        >
          {video.titulo}
        </h3>

        {video.descricao && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2" data-testid={`video-description-${video.id}`}>
            {video.descricao}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <span>{formatDate(video.data_criacao)}</span>
          {video.data_conclusao && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {formatDate(video.data_conclusao)}
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(video.titulo, 'Título')}
            data-testid={`copy-title-${video.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors"
          >
            <Copy className="w-4 h-4" />
            Título
          </button>

          <button
            onClick={() => onEdit(video)}
            data-testid={`edit-video-${video.id}`}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Editar vídeo"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(video.id)}
            data-testid={`delete-video-${video.id}`}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Excluir vídeo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Copy Options Dropdown */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowActions(!showActions)}
            data-testid={`more-actions-${video.id}`}
            className="w-full text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showActions ? 'Ocultar opções' : 'Mais opções de cópia'}
          </button>

          {showActions && (
            <div className="mt-2 space-y-1 animate-slide-in">
              {video.descricao && (
                <button
                  onClick={() => handleCopy(video.descricao, 'Descrição')}
                  data-testid={`copy-description-${video.id}`}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  Copiar Descrição
                </button>
              )}
              {video.roteiro && (
                <button
                  onClick={() => handleCopy(video.roteiro, 'Roteiro')}
                  data-testid={`copy-script-${video.id}`}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  Copiar Roteiro
                </button>
              )}
              <button
                onClick={() => {
                  const fullText = `TÍTULO: ${video.titulo}\n\nDESCRIÇÃO: ${video.descricao || '-'}\n\nROTEIRO:\n${video.roteiro || '-'}\n\nURL: ${video.url || '-'}`;
                  handleCopy(fullText, 'Tudo');
                }}
                data-testid={`copy-all-${video.id}`}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors"
              >
                Copiar Tudo
              </button>
            </div>
          )}
        </div>

        {video.url && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`video-url-${video.id}`}
              className="flex items-center gap-2 text-xs text-[#4299e1] hover:text-[#2d3748] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir URL
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
