import { useEffect, useState } from 'react';
import { Plus, Heart, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useWishlistStore from '../store/useWishlistStore';
import { Spinner, EmptyState, Modal } from '../components/ui';

function WishlistItemRow({ item, onDelete }) {
  return (
    <div className="wishlist-item">
      <div>
        <div className="wishlist-item-title">{item.title}</div>
        <div className="wishlist-item-author">{item.author}</div>
      </div>
      <button className="btn-icon danger" title="Remover" onClick={() => onDelete(item.id)}>
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function WishlistForm({ onClose }) {
  const { addItem } = useWishlistStore();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); setApiError('');
    try { await addItem(data); onClose(); }
    catch (err) {
      const d = err.response?.data?.error?.details;
      setApiError(d ? d.map((x) => x.message).join(', ') : err.response?.data?.message || 'Erro inesperado.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {apiError && <div className="alert alert-error">{apiError}</div>}
      <div className="form-group">
        <label className="form-label">Título *</label>
        <input className={`form-input ${errors.title ? 'error' : ''}`} placeholder="O Senhor dos Anéis"
          {...register('title', { required: 'Título obrigatório' })} />
        {errors.title && <span className="form-error">{errors.title.message}</span>}
      </div>
      <div className="form-group">
        <label className="form-label">Autor *</label>
        <input className={`form-input ${errors.author ? 'error' : ''}`} placeholder="J.R.R. Tolkien"
          {...register('author', { required: 'Autor obrigatório' })} />
        {errors.author && <span className="form-error">{errors.author.message}</span>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adicionando...' : 'Adicionar'}</button>
      </div>
    </form>
  );
}

export default function WishlistPage() {
  const { items, fetchWishlist, removeItem, loading } = useWishlistStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchWishlist(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remover da lista de desejos?')) return;
    await removeItem(id);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Lista de Desejos</h1>
        <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} na sua wishlist</p>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <div />
          <button id="btn-add-wish" className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Adicionar Desejo
          </button>
        </div>

        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} />}
            title="Lista de desejos vazia"
            text="Adicione livros que você quer ler ou comprar."
            action={<button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Adicionar</button>}
          />
        ) : (
          <div className="wishlist-list">
            {items.map((item) => (
              <WishlistItemRow key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Adicionar à Wishlist" onClose={() => setShowModal(false)}>
          <WishlistForm onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}
