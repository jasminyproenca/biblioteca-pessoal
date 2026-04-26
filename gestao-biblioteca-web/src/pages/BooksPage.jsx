import { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import useBooksStore from '../store/useBooksStore';
import { BookCard, BookFilters, BookForm } from '../components/books';
import { Spinner, EmptyState, Modal } from '../components/ui';

export default function BooksPage() {
  const { books, fetchBooks, removeBook, loading } = useBooksStore();
  const [filter, setFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchBooks(); }, []);

  const filtered = filter === 'todos' ? books : books.filter((b) => b.status === filter);

  const handleEdit = (book) => { setEditBook(book); setShowModal(true); };
  const handleAdd  = () => { setEditBook(null); setShowModal(true); };
  const handleDelete = async (id) => {
    if (!window.confirm('Remover este livro?')) return;
    setDeleting(id);
    try { await removeBook(id); } finally { setDeleting(null); }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Meus Livros</h1>
        <p className="page-subtitle">{books.length} livro{books.length !== 1 ? 's' : ''} na sua biblioteca</p>
      </div>
      <div className="page-body">
        <div className="toolbar">
          <BookFilters active={filter} onChange={setFilter} />
          <button id="btn-add-book" className="btn btn-primary" onClick={handleAdd}>
            <Plus size={16} /> Adicionar Livro
          </button>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="Nenhum livro encontrado"
            text={filter !== 'todos' ? 'Nenhum livro com esse status.' : 'Adicione seu primeiro livro!'}
            action={<button className="btn btn-primary" onClick={handleAdd}><Plus size={16} /> Adicionar Livro</button>}
          />
        ) : (
          <div className="books-grid">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editBook ? 'Editar Livro' : 'Novo Livro'} onClose={() => setShowModal(false)}>
          <BookForm book={editBook} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}
