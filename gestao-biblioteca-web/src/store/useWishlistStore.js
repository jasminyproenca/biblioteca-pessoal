import { create } from 'zustand';
import * as wishlistApi from '../api/wishlist';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await wishlistApi.listWishlist();
      set({ items: res.data.data.items, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erro ao carregar wishlist', loading: false });
    }
  },

  addItem: async (data) => {
    const res = await wishlistApi.addToWishlist(data);
    // API retorna { data: { item } } no POST
    const newItem = res.data.data.item;
    set({ items: [newItem, ...get().items] });
    return newItem;
  },

  removeItem: async (id) => {
    await wishlistApi.removeFromWishlist(id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
}));

export default useWishlistStore;
