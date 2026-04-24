"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  size: string;
  color: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, opts: { size: string; color: string }) => void;
  remove: (slug: string, size: string, color: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      add: (product, { size, color }) =>
        set((s) => {
          const key = (i: CartItem) =>
            i.slug === product.slug && i.size === size && i.color === color;
          const existing = s.items.find(key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                key(i) ? { ...i, qty: i.qty + 1 } : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...s.items,
              {
                slug: product.slug,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0],
                size,
                color,
                qty: 1,
              },
            ],
            isOpen: true,
          };
        }),
      remove: (slug, size, color) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.slug === slug && i.size === size && i.color === color),
          ),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((t, i) => t + i.price * i.qty, 0),
      count: () => get().items.reduce((t, i) => t + i.qty, 0),
    }),
    {
      name: "mares-cart",
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        items: (persistedState as { items?: CartItem[] })?.items ?? [],
        isOpen: false,
      }),
    },
  ),
);
