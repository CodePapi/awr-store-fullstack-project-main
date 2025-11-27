import { cartReducer, initialCartState } from './CartContext';
import { CartState, CartItem } from '../types'; 

// Mock data for testing
const mockItem1: CartItem = {
    productId: 101,
    name: 'Laptop Charger',
    price: 50.0,
    quantity: 1,
    availableCount: 0
};

const mockItem2: CartItem = {
    productId: 202,
    name: 'Wireless Mouse',
    price: 25.0,
    quantity: 2,
    availableCount: 0
};

const mockItem3: CartItem = {
    productId: 101,
    name: 'Laptop Charger',
    price: 50.0,
    quantity: 3,
    availableCount: 0
};

describe('cartReducer', () => {

  // --- Initial State Test ---
  test('should return the initial state for unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION', payload: {} };
    // We expect the state to be returned unchanged if the action type is not handled
    expect(cartReducer(initialCartState, action as any)).toEqual(initialCartState);
  });

  // --- ADD_ITEM Tests ---
  describe('ADD_ITEM', () => {
    test('should add a new item to an empty cart', () => {
      const action: {
        type: 'ADD_ITEM';
        payload: CartItem;
    } = { type: 'ADD_ITEM', payload: mockItem1 };
      const newState = cartReducer(initialCartState, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toEqual(mockItem1);
    });

    test('should add a new unique item to a cart with existing items', () => {
      const stateWithItem1: CartState = { items: [mockItem1] };
      const action: {
        type: 'ADD_ITEM';
        payload: CartItem;
    } = { type: 'ADD_ITEM', payload: mockItem2 };
      const newState = cartReducer(stateWithItem1, action);

      expect(newState.items).toHaveLength(2);
      expect(newState.items).toEqual([mockItem1, mockItem2]);
    });

    test('should increment quantity if the item already exists in the cart', () => {
      const stateWithItem1: CartState = { items: [mockItem1] }; // Item 1: Qty 1
      const action : {
        type: 'ADD_ITEM';
        payload: CartItem;
    } = { type: 'ADD_ITEM', payload: mockItem3 }; // Adding 3 more

      const newState = cartReducer(stateWithItem1, action);

      expect(newState.items).toHaveLength(1); // The number of unique items should not change
      const updatedItem = newState.items[0];

      // Original quantity (1) + added quantity (3) = 4
      expect(updatedItem.quantity).toBe(4);
      // Ensure other properties remain the same
      expect(updatedItem.price).toBe(50.0);
    });
  });

  // --- REMOVE_ITEM Tests ---
  describe('REMOVE_ITEM', () => {
    const stateWithTwoItems: CartState = { items: [mockItem1, mockItem2] };

    test('should remove the specified item from the cart', () => {
      // Remove mockItem1 (productId: 101)
      const action:{
        type: 'REMOVE_ITEM';
        payload: number;
    } = { type: 'REMOVE_ITEM', payload: mockItem1.productId };
      const newState = cartReducer(stateWithTwoItems, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].productId).toBe(mockItem2.productId);
      expect(newState.items).not.toContainEqual(mockItem1);
    });

    test('should return the state unchanged if the item to remove is not found', () => {
      // Attempt to remove an item that does not exist (productId: 999)
      const action:{
        type: 'REMOVE_ITEM';
        payload: number;
    } = { type: 'REMOVE_ITEM', payload: 999 };
      const newState = cartReducer(stateWithTwoItems, action);

      expect(newState.items).toHaveLength(2);
      expect(newState).toEqual(stateWithTwoItems);
    });
  });

  // --- CLEAR_CART Tests ---
  describe('CLEAR_CART', () => {
    test('should reset the items array to empty', () => {
      const stateWithItems: CartState = { items: [mockItem1, mockItem2] };
      const action : {
        type: 'CLEAR_CART';
        payload: number;
    } = {
        type: 'CLEAR_CART',
        payload: 0
    };
      const newState = cartReducer(stateWithItems, action);

      expect(newState.items).toHaveLength(0);
      expect(newState).toEqual(initialCartState);
    });
  });
});