import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api';
import { useCart } from '../hooks';

const CUSTOMER_ID = '7545afc6-c1eb-497a-9a44-4e6ba595b4ab';

const CartPage: React.FC = () => {
  const { items, getCartTotal, clearCart, removeItem } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      customerId: CUSTOMER_ID,
      products: items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const newOrder = await placeOrder(payload);
      clearCart();
      alert(`Order ${newOrder.id} placed successfully!`);
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during checkout.',
      );
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

  return (
    <div>
      <h1>🛒 Your Shopping Cart</h1>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {items.length === 0 ? (
        <p>
          Your cart is empty. Start shopping on the <a href="/">Shop Page</a>!
        </p>
      ) : (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '10px' }}>Product</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Subtotal</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.productId}
                  style={{ borderBottom: '1px solid #eee' }}
                >
                  <td style={{ padding: '10px' }}>{item.name}</td>
                  <td style={{ padding: '10px' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>{item.quantity}</td>
                  <td style={{ padding: '10px' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      style={{ background: 'salmon' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              textAlign: 'right',
              marginTop: '20px',
              borderTop: '2px solid #333',
              paddingTop: '10px',
            }}
          >
            <h2>Order Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              style={{
                padding: '15px 30px',
                fontSize: '1.2em',
                cursor: 'pointer',
                background: 'green',
                color: 'white',
              }}
              type="button"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
