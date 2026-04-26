import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { updateProfile } from '../api/users';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, username: user?.username, email: user?.email },
  });

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const onSubmit = async (data) => {
    setLoading(true); setApiError(''); setSuccess('');
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    try {
      const res = await updateProfile(payload);
      const updated = res.data.data.user;
      setUser(updated);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      const d = err.response?.data?.error?.details;
      setApiError(d ? d.map((x) => x.message).join(', ') : err.response?.data?.message || 'Erro ao salvar.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Meu Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações pessoais</p>
      </div>
      <div className="page-body">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-meta">@{user?.username} · {user?.email}</div>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Editar informações</h2>

          {apiError && <div className="alert alert-error">{apiError}</div>}
          {success  && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Nome completo</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`}
                  {...register('name', { required: 'Nome obrigatório' })} />
                {errors.name && <span className="form-error">{errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className={`form-input ${errors.username ? 'error' : ''}`}
                  {...register('username', { required: 'Username obrigatório' })} />
                {errors.username && <span className="form-error">{errors.username.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                  {...register('email', { required: 'E-mail obrigatório' })} />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Nova senha <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(deixe em branco para manter)</span></label>
                <input type="password" className="form-input" placeholder="Mín. 8 chars, 1 maiúscula, 1 número"
                  {...register('password', { minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
                {errors.password && <span className="form-error">{errors.password.message}</span>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
