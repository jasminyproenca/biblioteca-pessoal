import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge, StarRating } from '../ui';
import useBooksStore from '../../store/useBooksStore';

const STATUS_OPTIONS = ['quero ler', 'lendo', 'lido', 'abandonado', 'emprestado'];

export function BookForm({ book, onClose }) {
  const { addBook, updateBook } = useBooksStore();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const isEdit = !!book;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: book || { status: 'quero ler', isFavorite: false },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    const payload = {
      ...data,
      rating: data.rating ? parseInt(data.rating) : undefined,
      isFavorite: data.isFavorite === true || data.isFavorite === 'true',
    };
    if (!payload.rating) delete payload.rating;
    if (!payload.review) delete payload.review;
    try {
      if (isEdit) await updateBook(book.id, payload);
      else await addBook(payload);
      onClose();
    } catch (err) {
      const detail = err.response?.data?.error?.details;
      setApiError(detail ? detail.map((d) => d.message).join(', ') : err.response?.data?.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {apiError && <div className="alert alert-error">{apiError}</div>}
      <div className="form-grid">
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label">Título *</label>
          <input className={`form-input ${errors.title ? 'error' : ''}`} placeholder="Dom Casmurro" {...register('title', { required: 'Título obrigatório' })} />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label">Autor *</label>
          <input className={`form-input ${errors.author ? 'error' : ''}`} placeholder="Machado de Assis" {...register('author', { required: 'Autor obrigatório' })} />
          {errors.author && <span className="form-error">{errors.author.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" {...register('status')}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Avaliação (1–5)</label>
          <select className="form-input" {...register('rating')}>
            <option value="">Sem avaliação</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label">Resenha</label>
          <textarea className="form-input" placeholder="Sua opinião sobre o livro..." maxLength={1000} {...register('review')} />
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="isFavorite" {...register('isFavorite')} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
          <label htmlFor="isFavorite" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Favorito ♥</label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Adicionar Livro'}</button>
      </div>
    </form>
  );
}

export function BookCard({ book, onEdit, onDelete, onClick }) {
  return (
    <div className="book-card" onClick={() => onClick && onClick(book)}>
      <div className="book-card-header">
        <div style={{ flex: 1 }}>
          <div className="book-card-title">{book.title}</div>
          <div className="book-card-author">{book.author}</div>
        </div>
        <div className="book-card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn-icon" title="Editar" onClick={() => onEdit(book)}>✎</button>
          <button className="btn-icon danger" title="Remover" onClick={() => onDelete(book.id)}>🗑</button>
        </div>
      </div>
      <div className="book-card-footer">
        <Badge status={book.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {book.rating && <StarRating value={book.rating} />}
          {book.isFavorite && <span className="book-favorite">♥</span>}
        </div>
      </div>
    </div>
  );
}

export function BookFilters({ active, onChange }) {
  const filters = ['todos', 'quero ler', 'lendo', 'lido', 'abandonado', 'emprestado'];
  return (
    <div className="filters">
      {filters.map((f) => (
        <button key={f} className={`filter-btn ${active === f ? 'active' : ''}`} onClick={() => onChange(f)}>
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
