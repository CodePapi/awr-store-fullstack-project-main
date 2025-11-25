// src/pages/CartPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CUSTOMER_ID = '7545afc6-c1eb-497a-9a44-4e6ba595b4ab'; 

const CartPage: React.FC = () => {
  const { items, getCartTotal, clearCart, removeItem } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use useMutation for the POST /orders request
  const placeOrderMutation = useMutation({
    mutationFn: placeOrder, 
    
    // On success: Clear cart, invalidate product cache (since inventory changed), and redirect
    onSuccess: (newOrder) => {
      clearCart();
      
      // Invalidate the 'products' query key to force a refresh on the Shop/Admin pages
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      
      alert(`Order ${newOrder.id} placed successfully!`);
      navigate(`/orders/${newOrder.id}`); 
    },
    
    // On error: Display specific inventory error feedback
    onError: (error: Error) => {
      alert(`Order Failed: ${error.message}`); 
    },
  });

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // 1. Format the cart state into the required payload shape
    const payload = {
      customerId: CUSTOMER_ID,
      products: items.map(item => ({
        id: item.productId,
        quantity: item.quantity,
      })),
    };

    // 2. Trigger the mutation
    placeOrderMutation.mutate(payload);
  };

  const total = getCartTotal();
  const loading = placeOrderMutation.isLoading;
  const error = placeOrderMutation.error; // Use the mutation's error state

  return (
    <div>
      <h1>🛒 Your Shopping Cart</h1>
      
      {/* Display error feedback */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error.message}</p>}
      
      {/* ... (Rest of the component remains the same) ... */}
      
          <div style={{ textAlign: 'right', marginTop: '20px', borderTop: '2px solid #333', paddingTop: '10px' }}>
            <h2>Order Total: ${total.toFixed(2)}</h2>
            <button 
              onClick={handlePlaceOrder} 
              disabled={loading || items.length === 0}
              style={{ padding: '15px 30px', fontSize: '1.2em', cursor: 'pointer', background: 'green', color: 'white' }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
      {/* ... */}
    </div>
  );
};

export default CartPage;