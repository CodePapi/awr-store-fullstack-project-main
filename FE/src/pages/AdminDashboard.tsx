import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// import { Product } from '../types/api';
import { fetchProducts } from '../api/apiService';
import AdminProductTable from '../components/AdminProductTable';

const AdminDashboard = () => {
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'], // Uses the same cache key as ShopPage!
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <h2>Loading Admin Dashboard...</h2>;
  }

  if (isError) {
    return <h2 style={{ color: 'red' }}>Error: {error.message}</h2>;
  }

  return (
    <div>
      <h1>⚙️ Admin Product Dashboard</h1>
      
      <Link to="/admin/new">
        <button style={{ padding: '10px 15px', marginBottom: '20px', cursor: 'pointer' }}>
          ➕ Create New Product
        </button>
      </Link>

      <AdminProductTable products={products} />
    </div>
  );
};

export default AdminDashboard;