import { Link, Outlet } from 'react-router-dom';
import { useCart } from './hooks';

function App() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ padding: '20px' }}>
      <header
        style={{
          borderBottom: '1px solid #ccc',
          paddingBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <nav>
          <Link to="/" style={{ marginRight: '15px' }}>
            Shop
          </Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <Link
          to="/cart"
          style={{
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          🛒 Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </Link>
      </header>

      <main style={{ marginTop: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
