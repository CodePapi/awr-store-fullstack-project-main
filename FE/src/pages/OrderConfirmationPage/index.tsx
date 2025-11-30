import type { OrderResponse } from 'project-shared';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../../api';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError('Missing Order ID.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load order details or this order does not exist',
        );
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return <h2>Loading Order Confirmation...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
  }

  if (!order) {
    return <h2 style={{ color: 'red' }}>Order details unavailable.</h2>;
  }

  return (
    <div>
      <h1>🎉 Order Confirmed!</h1>
      <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
        Order ID: {order.id}
      </p>

      <div
        style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}
      >
        <h3>Order Summary</h3>
        <p>
          <strong>Status:</strong>{' '}
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            {order.status}
          </span>
        </p>
        <p>
          <strong>Customer ID:</strong> {order.customerId}
        </p>
        <p>
          <strong>Placed On:</strong>{' '}
          {new Date(order.orderCreatedDate).toLocaleString()}
        </p>
        <p>
          <strong>Order Total:</strong> {order.orderTotal.toFixed(2)} EUR
        </p>

        <h4>Items Ordered:</h4>
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {order.products.map((item) => (
            <li key={item.id}>
              {item.quantity} x {item.name} (
              {(order.orderTotal / item.quantity).toFixed(2)} EUR each - *Note:
              Total calculation is simplified here*)
            </li>
          ))}
        </ul>
      </div>

      <p>Thank you for your purchase!</p>
    </div>
  );
};

export default OrderConfirmationPage;
