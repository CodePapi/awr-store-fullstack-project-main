import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from 'project-shared';
import { fetchProducts } from '../api/apiService';
import AdminProductTable from '../components/AdminProductTable';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load products (can be reused after creating a new product)
  const loadProducts = async () => {
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
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <h2>Loading Admin Dashboard...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
  }

  return (
    <div>
      <h1>⚙️ Admin Product Dashboard</h1>

      {/* Required Link/Button to Create New Product */}
      <Link to="/admin/new">
        <button
          style={{
            padding: '10px 15px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          ➕ Create New Product
        </button>
      </Link>

      <AdminProductTable products={products} />
    </div>
  );
};

export default AdminDashboard;
