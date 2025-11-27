import { ReactNode, createContext,  useReducer } from 'react';
import type { CartItem, CartState, CartAction,CartContextType } from '../types';


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
      }
      return {
        ...state,
        items: [...state.items, newItem],
      };
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

export const CartContext = createContext<CartContextType | undefined>(undefined);

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
