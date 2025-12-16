import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { videosAPI } from '../api';
import { X } from 'lucide-react';

export default function VideoModal({ video, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    roteiro: '',
    url: '',
    status: 'planejado',
  });

  useEffect(() => {
    if (video) {
      setFormData({
        titulo: video.titulo || '',
        descricao: video.descricao || '',
        roteiro: video.roteiro || '',
        url: video.url || '',
        status: video.status || 'planejado',
      });
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (video) {
        await videosAPI.update(video.id, formData);
        toast.success('Vídeo atualizado com sucesso!');
      } else {
        await videosAPI.create(formData);
        toast.success('Vídeo criado com sucesso!');
      }
      onSave();
    } catch (error) {
      const message = error.response?.data?.detail || 'Erro ao salvar vídeo';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in" data-testid="video-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold" style={{ color: '#4a5568' }}>
            {video ? 'Editar Vídeo' : 'Novo Vídeo'}
          </h2>
          <button
            onClick={onClose}
            data-testid="close-video-modal"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Digite o título do vídeo"
                required
                data-testid="video-titulo-input"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Breve descrição do vídeo"
                rows={3}
                data-testid="video-descricao-input"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all resize-none"
              />
            </div>

            {/* Roteiro */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Roteiro
              </label>
              <textarea
                name="roteiro"
                value={formData.roteiro}
                onChange={handleChange}
                placeholder="Roteiro completo do vídeo (pode usar múltiplas linhas)"
                rows={8}
                data-testid="video-roteiro-input"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all resize-none font-mono text-sm"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                data-testid="video-url-input"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                data-testid="video-status-input"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
              >
                <option value="planejado">📝 Planejado</option>
                <option value="em-producao">🎥 Em Produção</option>
                <option value="em-edicao">✂️ Em Edição</option>
                <option value="concluido">✅ Concluído</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              data-testid="cancel-video-button"
              className="flex-1 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="save-video-button"
              className="flex-1 px-6 py-3 rounded-full font-medium text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#4a5568' }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2d3748')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4a5568')}
            >
              {loading ? 'Salvando...' : video ? 'Atualizar' : 'Criar Vídeo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
