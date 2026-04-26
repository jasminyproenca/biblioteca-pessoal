import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookMarked } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { login as loginApi } from '../api/auth';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await loginApi(data);
      const { token, user } = res.data.data;
      login(token, user);
      window.location.href = '/dashboard';
    } catch (err) {
      setApiError(err.response?.data?.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><BookMarked size={20} color="white" /></div>
          <span className="auth-logo-text">Biblioteca Pessoal</span>
        </div>
        <h1 className="auth-title">Bem-vindo de volta</h1>
        <p className="auth-subtitle">Acesse sua conta para continuar</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">E-mail ou Username</label>
            <input id="login" className={`form-input ${errors.login ? 'error' : ''}`} placeholder="usuario ou email@exemplo.com"
              {...register('login', { required: 'Campo obrigatório' })} />
            {errors.login && <span className="form-error">{errors.login.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input id="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="••••••••"
              {...register('password', { required: 'Campo obrigatório' })} />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>
          <button id="btn-login" type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
