import { create } from 'zustand';
import * as booksApi from '../api/books';

const useBooksStore = create((set, get) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await booksApi.listBooks();
      set({ books: res.data.data.books, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erro ao carregar livros', loading: false });
    }
  },

  addBook: async (data) => {
    const res = await booksApi.createBook(data);
    // API retorna { data: { book } } (singular) no POST
    const newBook = res.data.data.book;
    set({ books: [newBook, ...get().books] });
    return newBook;
  },

  updateBook: async (id, data) => {
    const res = await booksApi.updateBook(id, data);
    const updated = res.data.data.book;
    set({ books: get().books.map((b) => (b.id === id ? updated : b)) });
    return updated;
  },

  removeBook: async (id) => {
    await booksApi.deleteBook(id);
    set({ books: get().books.filter((b) => b.id !== id) });
  },
}));

export default useBooksStore;
