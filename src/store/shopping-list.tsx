// src/store/useShoppingListStore.ts
import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
}

interface ShoppingListState {
  items: Item[];
  addItem: (item: Item) => void;
  toggleItem: (id: string) => void;
}

export const useShoppingListStore = create<ShoppingListState>((set) => ({
  items: [],
  addItem: (item: Item) => set((state) => ({ items: [...state.items, item] })),
  toggleItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),
}));
