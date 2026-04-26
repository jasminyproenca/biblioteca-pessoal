import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Heart, User, LogOut, BookMarked } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BookMarked size={18} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">Biblioteca</div>
          <div className="sidebar-logo-sub">Pessoal</div>
        </div>
      </div>

      <span className="sidebar-section">Menu</span>

      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard /> Dashboard
      </NavLink>
      <NavLink to="/books" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BookOpen /> Meus Livros
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Heart /> Lista de Desejos
      </NavLink>

      <span className="sidebar-section" style={{ marginTop: '0.5rem' }}>Conta</span>
      <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <User /> Perfil
      </NavLink>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="sidebar-user-name">{user?.name || 'Usuário'}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <button className="sidebar-link btn-full" style={{ border: 'none', cursor: 'pointer', width: '100%' }} onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
