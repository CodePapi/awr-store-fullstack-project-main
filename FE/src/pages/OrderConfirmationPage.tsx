import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { fetchOrder } from '../api/apiService';

const OrderConfirmationPage: React.FC = () => {
  // 1. Get the dynamic ID from the URL
  const { orderId } = useParams<{ orderId: string }>();

  // Use useQuery to fetch the order details
  const { 
    data: order, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    // Query key includes the specific ID to ensure caching is correct for each unique order
    queryKey: ['order', orderId], 
    // Query function only runs if orderId exists
    queryFn: () => {
        if (!orderId) throw new Error("Missing Order ID");
        return fetchOrder(orderId);
    },
    // Prevent the query from running if orderId is falsy
    enabled: !!orderId, 
  });

  if (!orderId) {
    return <h2 style={{ color: 'red' }}>Error: Order ID is missing from the URL.</h2>;
  }

  if (isLoading) {
    return <h2>Loading Order Confirmation for ID: {orderId}...</h2>;
  }

  if (isError) {
    // This handles 404 (Not Found) errors caught in the API service
    return <h2 style={{ color: 'red' }}>Error: {error.message}</h2>;
  }

  // Data (order) is guaranteed to be available here
  return (
    <div>
      <h1>🎉 Order Confirmed!</h1>
      <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Order ID: {order.id}</p>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
        <h3>Order Summary</h3>
        <p><strong>Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{order.status}</span></p>
        <p><strong>Customer ID:</strong> {order.customerId}</p>
        <p><strong>Placed On:</strong> {new Date(order.orderCreatedDate).toLocaleString()}</p>
        <p><strong>Order Total:</strong> ${order.orderTotal.toFixed(2)}</p>
        
        <h4>Items Ordered:</h4>
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {order.products.map((item) => (
            // Using item.id as the key is sufficient as product IDs are unique
            <li key={item.id}> 
              {item.quantity} x {item.name} 
              {/* Note: Price per unit is not returned directly, so we display quantity and name. */}
            </li>
          ))}
        </ul>
      </div>

      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default OrderConfirmationPage;