"use client";

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const initialState = {
  cartId: null,
  cartToken: null,
  items: [],
  subtotal: 0,
  currency: 'USD',
  isDrawerOpen: false,
  status: {
    isLoading: true,
    isAdding: false,
    updatingItemId: null,
    removingItemId: null,
    isSyncing: false
  },
  warnings: [],
  error: null
};

// Calculate subtotal helper
const calculateSubtotal = (items) => items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT_CART':
      return {
        ...state,
        cartId: action.payload.cart_id,
        cartToken: action.payload.cart_token,
        items: action.payload.items || [],
        subtotal: calculateSubtotal(action.payload.items || []),
        currency: action.payload.currency || 'USD',
        warnings: action.payload.meta?.warnings || [],
        status: { ...state.status, isLoading: false, isSyncing: false }
      };
    case 'SET_STATUS':
      return { ...state, status: { ...state.status, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, status: { ...state.status, isLoading: false, isAdding: false, isSyncing: false, updatingItemId: null, removingItemId: null } };
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: action.payload ?? !state.isDrawerOpen };
    case 'OPTIMISTIC_ADD':
      return { ...state, status: { ...state.status, isAdding: true } }; // Add requires server to resolve cart_item_id
    case 'OPTIMISTIC_UPDATE': {
      const updatedItems = state.items.map(item => 
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return { 
        ...state, 
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
        status: { ...state.status, updatingItemId: action.payload.id }
      };
    }
    case 'OPTIMISTIC_REMOVE': {
      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      return { 
        ...state, 
        items: filteredItems,
        subtotal: calculateSubtotal(filteredItems),
        status: { ...state.status, removingItemId: action.payload.id }
      };
    }
    case 'ROLLBACK':
      return { ...state, items: action.payload.items, subtotal: action.payload.subtotal, status: { ...state.status, updatingItemId: null, removingItemId: null, isAdding: false } };
    case 'CLEAR_CART':
      return { ...state, items: [], subtotal: 0, cartId: null, cartToken: null };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper to fetch with token
  const fetchWithToken = useCallback(async (url, options = {}) => {
    let headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // In a real app with next-auth, you'd get the Bearer token here.
    // For now we assume we use guest cart token if it exists.
    let token = state.cartToken;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('guest_cart_token');
    }
    if (token) {
      headers['x-guest-cart-token'] = token;
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.errors?.[0] || 'API Request Failed');
    }
    
    // Save token if new
    if (data.data?.cart?.cart_token && typeof window !== 'undefined') {
      localStorage.setItem('guest_cart_token', data.data.cart.cart_token);
    }
    
    return data;
  }, [state.cartToken]);

  // Initial Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      try {
        const data = await fetchWithToken('/store/cart');
        if (isMounted) {
          dispatch({ type: 'INIT_CART', payload: data.data.cart });
          if (data.meta?.warnings?.length > 0) {
            // Toast warning here ideally
            console.warn("Cart Warnings:", data.meta.warnings);
          }
        }
      } catch (error) {
        if (isMounted) dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };
    
    if (typeof window !== 'undefined' && localStorage.getItem('guest_cart_token')) {
      fetchCart();
    } else {
      dispatch({ type: 'INIT_CART', payload: { items: [] } });
    }
    
    return () => { isMounted = false; };
  }, [fetchWithToken]);

  const api = useMemo(() => {
    return {
      toggleDrawer: (isOpen) => dispatch({ type: 'TOGGLE_DRAWER', payload: isOpen }),
      
      addToCart: async (product, variant, quantity) => {
        dispatch({ type: 'OPTIMISTIC_ADD' });
        dispatch({ type: 'TOGGLE_DRAWER', payload: true });
        
        try {
          const payload = {
            product_id: product.id,
            variant_id: variant?.id || null,
            quantity: quantity,
            metadata: null
          };
          const res = await fetchWithToken('/store/cart/items', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          dispatch({ type: 'INIT_CART', payload: res.data.cart });
        } catch (error) {
          console.error("Add to cart failed:", error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
          alert(`Failed to add to cart: ${error.message}`); // Fallback toast
        }
      },
      
      updateQuantity: async (itemId, quantity) => {
        const backupItems = [...state.items];
        const backupSubtotal = state.subtotal;
        
        dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id: itemId, quantity } });
        
        try {
          const res = await fetchWithToken(`/store/cart/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
          });
          dispatch({ type: 'INIT_CART', payload: res.data.cart });
        } catch (error) {
          console.error("Update quantity failed:", error);
          dispatch({ type: 'ROLLBACK', payload: { items: backupItems, subtotal: backupSubtotal } });
          alert(`Failed to update: ${error.message}`);
        }
      },
      
      removeFromCart: async (itemId) => {
        const backupItems = [...state.items];
        const backupSubtotal = state.subtotal;
        
        dispatch({ type: 'OPTIMISTIC_REMOVE', payload: { id: itemId } });
        
        try {
          const res = await fetchWithToken(`/store/cart/items/${itemId}`, {
            method: 'DELETE'
          });
          dispatch({ type: 'INIT_CART', payload: res.data.cart });
        } catch (error) {
          console.error("Remove item failed:", error);
          dispatch({ type: 'ROLLBACK', payload: { items: backupItems, subtotal: backupSubtotal } });
          alert(`Failed to remove: ${error.message}`);
        }
      },
      
      mergeGuestCart: async (guestToken) => {
        try {
          dispatch({ type: 'SET_STATUS', payload: { isSyncing: true } });
          // Note: Needs strict Bearer auth token for the actual user in headers here
          const res = await fetchWithToken('/store/cart/merge', {
            method: 'POST',
            body: JSON.stringify({ guest_cart_token: guestToken })
          });
          if (typeof window !== 'undefined') localStorage.removeItem('guest_cart_token');
          dispatch({ type: 'INIT_CART', payload: res.data.cart });
        } catch (error) {
          console.error("Merge failed:", error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
        }
      }
    };
  }, [fetchWithToken, state.items, state.subtotal]);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={api}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
}
