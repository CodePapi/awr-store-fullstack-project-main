import type { Product } from 'project-shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/apiService';
import AdminProductTable from '../components/AdminProductTable';

// const AdminDashboard = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Function to load products (can be reused after creating a new product)
//   const loadProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchProducts();
//       setProducts(data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError(
//         'Failed to load product dashboard. Please check the backend connection.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   if (loading) {
//     return <h2>Loading Admin Dashboard...</h2>;
//   }

//   if (error) {
//     return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
//   }

//   return (
//     <div>
//       <h1>⚙️ Admin Product Dashboard</h1>

//       {/* Required Link/Button to Create New Product */}
//       <Link to="/admin/new">
//         <button
//           type="button"
//           style={{
//             padding: '10px 15px',
//             marginBottom: '20px',
//             cursor: 'pointer',
//           }}
//         >
//           ➕ Create New Product
//         </button>
//       </Link>

//       <AdminProductTable products={products} />
//     </div>
//   );
// };

// export default AdminDashboard;

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load products (can be reused after creating a new product)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(); // Uses the local placeholder
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
      <div className="flex justify-center items-center h-48">
        <h2 className="ml-4 text-xl text-gray-600">
          Loading Admin Dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
        <h2 className="font-bold">Error Loading Data</h2>
        <p>Details: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        ⚙️ Admin Product Dashboard
      </h1>

      {/* Required Link/Button to Create New Product */}
      <Link to="/admin/new">
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02] mb-6"
        >
          ➕ Create New Product
        </button>
      </Link>

      <AdminProductTable products={products} />
    </div>
  );
};

export default AdminDashboard;
