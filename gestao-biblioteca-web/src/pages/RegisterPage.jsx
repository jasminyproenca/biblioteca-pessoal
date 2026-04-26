import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BookMarked } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { register as registerApi, login as loginApi } from '../api/auth';

export default function RegisterPage() {
  const { login } = useAuthStore();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      await registerApi(data);
      const res = await loginApi({ login: data.email, password: data.password });
      const { token, user } = res.data.data;
      login(token, user);
      window.location.href = '/dashboard';
    } catch (err) {
      const details = err.response?.data?.error?.details;
      setApiError(details ? details.map((d) => d.message).join(', ') : err.response?.data?.message || 'Erro ao criar conta.');
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
        <h1 className="auth-title">Criar conta</h1>
        <p className="auth-subtitle">Comece a organizar sua biblioteca</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input id="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Maria Silva"
              {...register('name', { required: 'Nome obrigatório' })} />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input id="username" className={`form-input ${errors.username ? 'error' : ''}`} placeholder="mariasilva"
              {...register('username', { required: 'Username obrigatório' })} />
            {errors.username && <span className="form-error">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input id="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="maria@email.com"
              {...register('email', { required: 'E-mail obrigatório' })} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input id="reg-password" type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Mín. 8 chars, 1 maiúscula, 1 número"
              {...register('password', { required: 'Senha obrigatória', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>
          <button id="btn-register" type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
