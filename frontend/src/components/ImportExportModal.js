import React, { useState } from 'react';
import { toast } from 'sonner';
import { videosAPI } from '../api';
import { X, Upload, Download, FileText, Type } from 'lucide-react';

export default function ImportExportModal({ onClose, onImportSuccess }) {
  const [activeTab, setActiveTab] = useState('import');
  const [importText, setImportText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleImport = async () => {
    if (!importText.trim()) {
      toast.error('Por favor, cole ou digite o conteúdo para importar');
      return;
    }

    setLoading(true);
    try {
      const response = await videosAPI.import({ content: importText });
      const { imported_count, errors } = response.data;
      
      if (errors.length > 0) {
        toast.warning(`${imported_count} vídeo(s) importado(s) com alguns erros`);
        console.warn('Import errors:', errors);
      } else {
        toast.success(`${imported_count} vídeo(s) importado(s) com sucesso!`);
      }
      
      setImportText('');
      onImportSuccess();
      onClose();
    } catch (error) {
      const message = error.response?.data?.detail || 'Erro ao importar vídeos';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target.result);
      toast.success('Arquivo carregado com sucesso!');
    };
    reader.onerror = () => {
      toast.error('Erro ao ler o arquivo');
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await videosAPI.export();
      const { content } = response.data;

      if (!content) {
        toast.error('Nenhum vídeo para exportar');
        return;
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      a.download = `videos_${dateStr}.txt`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Vídeos exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar vídeos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in" data-testid="import-export-modal">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold" style={{ color: '#4a5568' }}>
            Importar / Exportar Vídeos
          </h2>
          <button
            onClick={onClose}
            data-testid="close-import-export-modal"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('import')}
            data-testid="import-tab"
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-[#4a5568] border-b-2 border-[#4a5568]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Importar
            </div>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            data-testid="export-tab"
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-[#4a5568] border-b-2 border-[#4a5568]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Exportar
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'import' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#4a5568' }}>
                  Como importar?
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Cole o texto com os dados dos vídeos ou faça upload de um arquivo .txt ou .md.
                </p>
                <div className="bg-slate-50 rounded-lg p-4 text-sm font-mono text-slate-700">
                  <p className="font-bold mb-2">Formato esperado:</p>
                  <pre className="whitespace-pre-wrap">
{`[TÍTULO] Meu Vídeo Incrivel
[DESCRIÇÃO] Uma breve descrição
[ROTEIRO] Roteiro completo
com múltiplas linhas
[URL] https://youtube.com/...
[STATUS] planejado

[TÍTULO] Outro Vídeo
[DESCRIÇÃO] Outra descrição
...`}
                  </pre>
                </div>
              </div>

              {/* File Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="file-upload-input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-file-button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#4a5568] text-slate-600 hover:text-[#4a5568] font-medium transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Fazer Upload de Arquivo (.txt ou .md)
                </button>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ou cole o texto aqui:
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Cole o conteúdo aqui..."
                  rows={12}
                  data-testid="import-textarea"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all resize-none font-mono text-sm"
                />
              </div>

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={loading}
                data-testid="import-button"
                className="w-full px-6 py-3 rounded-full font-medium text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4a5568' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2d3748')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4a5568')}
              >
                {loading ? 'Importando...' : 'Importar Vídeos'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#4a5568' }}>
                  Exportar todos os vídeos
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Faça o download de todos os seus vídeos em formato de texto (.txt).
                  O arquivo será nomeado com a data atual (ex: videos_2025-06-15.txt).
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <Download className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 mb-6">
                  O arquivo conterá todos os seus vídeos no formato compatível com a importação.
                </p>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={loading}
                data-testid="export-button"
                className="w-full px-6 py-3 rounded-full font-medium text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4a5568' }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2d3748')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4a5568')}
              >
                {loading ? 'Exportando...' : 'Exportar Vídeos'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
