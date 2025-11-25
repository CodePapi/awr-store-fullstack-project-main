import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import { Product } from '../types/api';
import { fetchProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard'; // Import the new component

const ShopPage = () => {
 // Use useQuery to fetch and manage product state
 const { data: products, isLoading, isError, error } = useQuery({
  queryKey: ['products'], // Unique key for caching
  queryFn: fetchProducts, // The function that fetches the data
});

if (isLoading) {
  return <h2>Loading Product Catalog...</h2>;
}

if (isError) {
  // Error is of type Error from our API service
  return <h2 style={{ color: 'red' }}>Error: {error.message}</h2>;
}
  
return (
  <div>
    <h1>🛍️ Product Catalog</h1>
    <p>Browse our selection and add items to your cart!</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    
    {products.length === 0 && (
      <p>No products available. Please create one via the Admin Dashboard.</p>
    )}
  </div>
);
};

export default ShopPage;