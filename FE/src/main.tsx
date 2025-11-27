import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router'; 

import { CartProvider } from './context/CartContext';
import App from './App';
import ShopPage from './pages/ShopPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateProductForm from './pages/CreateProductForm';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CartPage from './pages/CartPage';
import NotFound from './pages/NotFound'; // A simple fallback page

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);