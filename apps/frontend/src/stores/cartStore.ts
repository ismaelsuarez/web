import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../types/api';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  syncWithBackend: (backendCart: CartItem[]) => void;
  setSyncing: (syncing: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSyncing: false,

      addItem: (product: Product, variant: ProductVariant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.variant.id === variant.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                variant,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (variantId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }));
      },

      updateQuantity: (variantId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      syncWithBackend: (backendCart: CartItem[]) => {
        set({ items: backendCart, isSyncing: false });
      },

      setSyncing: (syncing: boolean) => {
        set({ isSyncing: syncing });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
