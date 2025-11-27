import type { Product } from "project-shared";

export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  availableCount: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

export interface CartContextType extends CartState {
  addItem: (
    item: Omit<CartItem, 'availableCount'> & { availableCount: number },
  ) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export interface AdminProductTableProps {
  products: Product[];
}

export interface ProductCardProps {
  product: Product;
}
