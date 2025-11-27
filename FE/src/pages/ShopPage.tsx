import React, { useEffect, useState } from 'react';
import type { Product } from 'project-shared';
import { fetchProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard'; // Import the new component

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          'Failed to load products. Please check the backend connection.',
        );
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return <h2>Loading Product Catalog...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
  }

  // Requirement: Display a list or grid of all available products.
  return (
    <div>
      <h1>🛍️ Product Catalog</h1>
      <p>Browse our selection and add items to your cart!</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <p>No products available. Please create one via the Admin Dashboard.</p>
      )}
    </div>
  );
};

export default ShopPage;
