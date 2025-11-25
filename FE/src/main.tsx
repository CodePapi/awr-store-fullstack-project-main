import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import { CartProvider } from './context/CartContext'; 
import App from './App';
import ShopPage from './pages/ShopPage'; 
import AdminDashboard from './pages/AdminDashboard';
import CreateProductForm from './pages/CreateProductForm';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CartPage from './pages/CartPage';
import NotFound from './pages/NotFound'; // A simple fallback page
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client instance
const queryClient = new QueryClient();

// --- Define the Routes ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Main layout/template
    errorElement: <NotFound />,
    children: [
      // Stage 1: Customer Shop Page
      {
        index: true, 
        element: <ShopPage />,
      },
      
      // Stage 1: Admin Dashboard and Creation
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'admin/new',
        element: <CreateProductForm />,
      },
      
      // Stage 2: Order Confirmation Page (Dynamic ID required)
      {
        path: 'orders/:orderId',
        element: <OrderConfirmationPage />,
      },
      {
        path: 'cart', 
        element: <CartPage />,
    },
    ],
  },
]);

// --- Render the Application with Router and Context ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);