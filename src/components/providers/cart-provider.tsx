"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { sdk } from "@/lib/sdk";
import type { StoreCart } from "@/lib/types";
import { useRegion } from "./region-provider";

const CART_STORAGE_KEY = "mg-cart-id";

type CartContextValue = {
  cart: StoreCart | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const { region } = useRegion();
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const regionRef = useRef(region);
  const cartRef = useRef(cart);
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => {
    regionRef.current = region;
  }, [region]);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const [storedCartId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(CART_STORAGE_KEY),
  );

  const setCartState = useCallback((next: StoreCart | null) => {
    cartRef.current = next;
    setCart(next);
    if (next?.id) {
      window.localStorage.setItem(CART_STORAGE_KEY, next.id);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(() => storedCartId !== null);

  useEffect(() => {
    if (!storedCartId) return;
    let cancelled = false;
    sdk.store.cart
      .retrieve(storedCartId)
      .then(({ cart: retrieved }) => {
        if (!cancelled) setCartState(retrieved);
      })
      .catch(() => {
        if (cancelled) return;
        window.localStorage.removeItem(CART_STORAGE_KEY);
        setCartState(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storedCartId, setCartState]);

  const getOrCreateCart = useCallback(async (): Promise<StoreCart | null> => {
    const storedId =
      cartIdRef.current ?? window.localStorage.getItem(CART_STORAGE_KEY);
    if (storedId) {
      if (cartRef.current) return cartRef.current;
      try {
        const { cart: retrieved } = await sdk.store.cart.retrieve(storedId);
        setCartState(retrieved);
        return retrieved;
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        cartIdRef.current = null;
      }
    }
    const activeRegion = regionRef.current;
    if (!activeRegion) return null;
    const { cart: created } = await sdk.store.cart.create({
      region_id: activeRegion.id,
    });
    setCartState(created);
    return created;
  }, [setCartState]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsMutating(true);
      setError(null);
      try {
        const activeCart = await getOrCreateCart();
        if (!activeCart) {
          setError(
            "A delivery region is required before adding items. Check the Medusa backend connection.",
          );
          return false;
        }
        const { cart: updated } = await sdk.store.cart.createLineItem(
          activeCart.id,
          { variant_id: variantId, quantity },
        );
        setCartState(updated);
        return true;
      } catch {
        setError(
          "Could not add this item to your cart. It may be out of stock.",
        );
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [getOrCreateCart, setCartState],
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      const activeCart = cartRef.current;
      if (!activeCart) return;
      setIsMutating(true);
      setError(null);
      try {
        if (quantity <= 0) {
          const { parent: updated } = await sdk.store.cart.deleteLineItem(
            activeCart.id,
            lineItemId,
          );
          setCartState(updated ?? null);
          return;
        }
        const { cart: updated } = await sdk.store.cart.updateLineItem(
          activeCart.id,
          lineItemId,
          { quantity },
        );
        setCartState(updated);
      } catch {
        setError("Could not update your cart. Please try again.");
      } finally {
        setIsMutating(false);
      }
    },
    [setCartState],
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      const activeCart = cartRef.current;
      if (!activeCart) return;
      setIsMutating(true);
      setError(null);
      try {
        const { parent: updated } = await sdk.store.cart.deleteLineItem(
          activeCart.id,
          lineItemId,
        );
        setCartState(updated ?? null);
      } catch {
        setError("Could not remove this item. Please try again.");
      } finally {
        setIsMutating(false);
      }
    },
    [setCartState],
  );

  const clearCart = useCallback(() => {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    cartIdRef.current = null;
    setCartState(null);
  }, [setCartState]);

  const cartCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      isMutating,
      error,
      cartCount,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      cart,
      isLoading,
      isMutating,
      error,
      cartCount,
      isCartOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}