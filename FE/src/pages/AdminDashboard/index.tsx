import type { Product } from 'project-shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api';
import { AdminProductTable } from '../../components';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(
        'Failed to load product dashboard. Please check the backend connection.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <div>
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading Data</h2>
        <p>Details: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>⚙️ Admin Product Dashboard</h1>

      <Link to="/admin/new">
        <button type="button" style={{ cursor: 'pointer', height: '40px' }}>
          ➕ Create New Product
        </button>
      </Link>

      <AdminProductTable products={products} />
    </div>
  );
};

export default AdminDashboard;
