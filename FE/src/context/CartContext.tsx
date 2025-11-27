import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { CartItem } from '../types';

// --- 1. State and Action Types ---
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addItem: (
    item: Omit<CartItem, 'availableCount'> & { availableCount: number },
  ) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// --- 2. Initial State and Reducer ---
const initialCartState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId,
      );

      if (existingItem) {
        // If item exists, update quantity
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === newItem.productId
              ? {
                  ...item,
                  quantity: item.quantity + newItem.quantity,
                }
              : item,
          ),
        };
      } else {
        // Otherwise, add the new item
        return {
          ...state,
          items: [...state.items, newItem],
        };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };
    case 'CLEAR_CART':
      return initialCartState;
    default:
      return state;
  }
};

// --- 3. Context and Provider ---
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = (item: CartItem) => {
    if (item.quantity <= 0) return;
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = (): number => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- 4. Custom Hook ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
