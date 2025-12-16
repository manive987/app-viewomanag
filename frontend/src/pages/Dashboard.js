import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { videosAPI } from '../api';
import { 
  Video, LogOut, Plus, Search, Filter, Download, Upload,
  TrendingUp, Clock, Play, CheckCircle2, X
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import ImportExportModal from '../components/ImportExportModal';
import Pagination from '../components/Pagination';
import BulkActionBar from '../components/BulkActionBar';

export default function Dashboard({ setIsAuthenticated }) {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  
  // Selection
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Load stats
  useEffect(() => {
    loadStats();
  }, []);

  // Load videos when filters change
  useEffect(() => {
    loadVideos();
  }, [searchQuery, statusFilter, timeFilter, currentPage, itemsPerPage]);

  const loadStats = async () => {
    try {
      const response = await videosAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const params = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };
      
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status_filter = statusFilter;
      if (timeFilter) params.time_filter = timeFilter;

      const [videosResponse, countResponse] = await Promise.all([
        videosAPI.getAll(params),
        videosAPI.getCount(params),
      ]);

      setVideos(videosResponse.data);
      setTotalCount(countResponse.data.count);
    } catch (error) {
      toast.error('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.success('Logout realizado com sucesso');
  };

  const handleCreateVideo = () => {
    setEditingVideo(null);
    setShowVideoModal(true);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setShowVideoModal(true);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) return;
    
    try {
      await videosAPI.delete(videoId);
      toast.success('Vídeo excluído com sucesso');
      loadVideos();
      loadStats();
    } catch (error) {
      toast.error('Erro ao excluir vídeo');
    }
  };

  const handleVideoSaved = () => {
    setShowVideoModal(false);
    loadVideos();
    loadStats();
  };

  const handleImportSuccess = () => {
    loadVideos();
    loadStats();
  };

  const handleToggleSelection = (videoId) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleClearSelection = () => {
    setSelectedVideos([]);
  };

  const handleBulkAction = async (action, value) => {
    try {
      if (action === 'delete') {
        if (!window.confirm(`Excluir ${selectedVideos.length} vídeo(s)?`)) return;
        await videosAPI.bulkDelete({ video_ids: selectedVideos });
        toast.success('Vídeos excluídos com sucesso');
      } else if (action === 'status') {
        await videosAPI.bulkUpdate({ video_ids: selectedVideos, status: value });
        toast.success('Status atualizado com sucesso');
      }
      
      setSelectedVideos([]);
      loadVideos();
      loadStats();
    } catch (error) {
      toast.error('Erro ao executar ação');
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7fafc' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: '#4a5568' }}>
                <Video className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#4a5568' }}>VideoFlow</h1>
                <p className="text-xs text-slate-500">Olá, {user.username}!</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="stat-card-nivel">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#4a5568' }} />
                <span className="text-2xl font-bold" style={{ color: '#4a5568' }}>{stats.nivel}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Nível</p>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="stat-card-concluidos">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.videos_concluidos}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Concluídos</p>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="stat-card-producao">
              <div className="flex items-center justify-between mb-2">
                <Play className="w-5 h-5 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">{stats.videos_em_producao}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Em Produção</p>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid="stat-card-total">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5" style={{ color: '#4299e1' }} />
                <span className="text-2xl font-bold" style={{ color: '#4299e1' }}>{stats.total_videos}</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">Total</p>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou roteiro..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  data-testid="search-input"
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border-transparent focus:bg-white focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                data-testid="toggle-filters-button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all ${showFilters ? 'bg-[#4a5568] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              
              <button
                onClick={handleCreateVideo}
                data-testid="create-video-button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-white transition-all active:scale-95"
                style={{ backgroundColor: '#4a5568' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5568'}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Vídeo</span>
              </button>
              
              <button
                onClick={() => setShowImportExportModal(true)}
                data-testid="import-export-button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-all"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Importar/Exportar</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in" data-testid="filters-panel">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  data-testid="status-filter"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                >
                  <option value="">Todos os status</option>
                  <option value="planejado">Planejado</option>
                  <option value="em-producao">Em Produção</option>
                  <option value="em-edicao">Em Edição</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
                <select
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  data-testid="time-filter"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                >
                  <option value="">Todo o tempo</option>
                  <option value="1h">Última 1 hora</option>
                  <option value="4h">Últimas 4 horas</option>
                  <option value="6h">Últimas 6 horas</option>
                  <option value="12h">Últimas 12 horas</option>
                  <option value="1d">Último dia</option>
                  <option value="3d">Últimos 3 dias</option>
                  <option value="1s">Última semana</option>
                  <option value="1m">Último mês</option>
                  <option value="3m">Últimos 3 meses</option>
                  <option value="6m">Últimos 6 meses</option>
                  <option value="1a">Último ano</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Itens por página</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  data-testid="items-per-page-select"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                >
                  <option value={4}>4 vídeos</option>
                  <option value={6}>6 vídeos</option>
                  <option value={12}>12 vídeos</option>
                  <option value={24}>24 vídeos</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600" data-testid="results-count">
            {totalCount} vídeo(s) encontrado(s)
          </p>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#4a5568]"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <Video className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhum vídeo encontrado</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || statusFilter || timeFilter
                ? 'Tente ajustar os filtros de busca'
                : 'Crie seu primeiro vídeo para começar'}
            </p>
            {!searchQuery && !statusFilter && !timeFilter && (
              <button
                onClick={handleCreateVideo}
                className="px-6 py-3 rounded-full font-medium text-white transition-all active:scale-95"
                style={{ backgroundColor: '#4a5568' }}
              >
                Criar Primeiro Vídeo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" data-testid="videos-grid">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSelected={selectedVideos.includes(video.id)}
                  onToggleSelection={handleToggleSelection}
                  onEdit={handleEditVideo}
                  onDelete={handleDeleteVideo}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showVideoModal && (
        <VideoModal
          video={editingVideo}
          onClose={() => setShowVideoModal(false)}
          onSave={handleVideoSaved}
        />
      )}

      {showImportExportModal && (
        <ImportExportModal
          onClose={() => setShowImportExportModal(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}

      {/* Bulk Action Bar */}
      {selectedVideos.length > 0 && (
        <BulkActionBar
          selectedCount={selectedVideos.length}
          onAction={handleBulkAction}
          onClear={handleClearSelection}
        />
      )}
    </div>
  );
}
