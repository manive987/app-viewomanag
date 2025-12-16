import React, { useState } from 'react';
import { toast } from 'sonner';
import { authAPI } from '../api';
import { Video, Lock, Mail, User } from 'lucide-react';

export default function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin
        ? await authAPI.login({ email: formData.email, password: formData.password })
        : await authAPI.register(formData);

      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(isLogin ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
      setIsAuthenticated(true);
    } catch (error) {
      const message = error.response?.data?.detail || 'Erro ao processar requisição';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f7fafc' }}>
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#4a5568' }}>
            <Video className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#4a5568' }}>VideoFlow</h1>
          <p className="text-slate-600">Gestão de vídeos para criadores</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#4a5568' }}>
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isLogin
                ? 'Acesse sua conta para gerenciar seus vídeos'
                : 'Crie uma conta para começar a organizar seus vídeos'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="seu_usuario"
                    required
                    data-testid="auth-username-input"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  data-testid="auth-email-input"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  data-testid="auth-password-input"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a5568] focus:ring-2 focus:ring-[#4a5568] focus:ring-opacity-20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="auth-submit-button"
              className="w-full py-3 px-6 rounded-full font-medium text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#4a5568' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2d3748'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4a5568'}
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              data-testid="auth-toggle-button"
              className="text-sm text-slate-600 hover:text-[#4a5568] transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
