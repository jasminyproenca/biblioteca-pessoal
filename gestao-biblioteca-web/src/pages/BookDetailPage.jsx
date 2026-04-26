import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { getBook } from '../api/books';
import useBooksStore from '../store/useBooksStore';
import { Badge, StarRating, Spinner, Modal } from '../components/ui';
import { BookForm } from '../components/books';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { removeBook } = useBooksStore();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBook(id);
      setBook(res.data.data.book);
    } catch { navigate('/books'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Remover este livro?')) return;
    await removeBook(id);
    navigate('/books');
  };

  if (loading) return <Spinner />;
  if (!book) return null;

  const fmt = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—';

  return (
    <>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.75rem' }} onClick={() => navigate('/books')}>
          <ArrowLeft size={14} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 className="page-title">{book.title}</h1>
            <p className="page-subtitle">{book.author}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}><Pencil size={14} /> Editar</button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}><Trash2 size={14} /> Remover</button>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div><span className="form-label">Status</span><div style={{ marginTop: 4 }}><Badge status={book.status} /></div></div>
            {book.rating && <div><span className="form-label">Avaliação</span><div style={{ marginTop: 4 }}><StarRating value={book.rating} /></div></div>}
            {book.isFavorite && <div><span className="form-label">Favorito</span><div style={{ marginTop: 4, color: 'var(--accent)' }}>♥ Sim</div></div>}
          </div>

          {book.review && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="form-label">Resenha</span>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{book.review}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div><span className="form-label">Adicionado em</span><p style={{ fontSize: '0.875rem', marginTop: 4 }}>{fmt(book.createdAt)}</p></div>
            <div><span className="form-label">Atualizado em</span><p style={{ fontSize: '0.875rem', marginTop: 4 }}>{fmt(book.updatedAt)}</p></div>
          </div>
        </div>
      </div>

      {showEdit && (
        <Modal title="Editar Livro" onClose={() => { setShowEdit(false); load(); }}>
          <BookForm book={book} onClose={() => { setShowEdit(false); load(); }} />
        </Modal>
      )}
    </>
  );
}
