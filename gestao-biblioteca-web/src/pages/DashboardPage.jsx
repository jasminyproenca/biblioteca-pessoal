import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, CheckCircle, BookMarked } from 'lucide-react';
import useBooksStore from '../store/useBooksStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import { Spinner } from '../components/ui';
import { Badge } from '../components/ui';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { books, fetchBooks, loading: booksLoading } = useBooksStore();
  const { items, fetchWishlist } = useWishlistStore();

  useEffect(() => { fetchBooks(); fetchWishlist(); }, []);

  const total       = books.length;
  const lidos       = books.filter((b) => b.status === 'lido').length;
  const lendo       = books.filter((b) => b.status === 'lendo').length;
  const wishCount   = items.length;
  const recent      = [...books].slice(0, 4);

  const stats = [
    { label: 'Total de Livros', value: total,     color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)', icon: <BookOpen size={20} color="#7c6ff7" /> },
    { label: 'Já Lidos',        value: lidos,     color: '#34d399', bg: 'rgba(52,211,153,0.15)',  icon: <CheckCircle size={20} color="#34d399" /> },
    { label: 'Lendo Agora',     value: lendo,     color: '#f472b6', bg: 'rgba(244,114,182,0.15)', icon: <BookMarked size={20} color="#f472b6" /> },
    { label: 'Lista de Desejos',value: wishCount, color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  icon: <Heart size={20} color="#fbbf24" /> },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Olá, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Aqui está um resumo da sua biblioteca</p>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="recent-section">
          <div className="section-header">
            <span className="section-title">Adicionados recentemente</span>
            <Link to="/books" className="btn btn-ghost btn-sm">Ver todos →</Link>
          </div>
          {booksLoading ? <Spinner /> : (
            <div className="books-grid">
              {recent.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} style={{ textDecoration: 'none' }}>
                  <div className="book-card">
                    <div className="book-card-header">
                      <div>
                        <div className="book-card-title">{book.title}</div>
                        <div className="book-card-author">{book.author}</div>
                      </div>
                      {book.isFavorite && <span className="book-favorite">♥</span>}
                    </div>
                    <div className="book-card-footer">
                      <Badge status={book.status} />
                    </div>
                  </div>
                </Link>
              ))}
              {books.length === 0 && (
                <div style={{ gridColumn: '1/-1', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Nenhum livro cadastrado ainda. <Link to="/books" style={{ color: 'var(--primary)' }}>Adicionar primeiro livro →</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
