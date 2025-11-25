// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.tsx';

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

// src/main.tsx

// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import Router components
import { CartProvider } from './context/CartContext'; 
import App from './App';
// Import your planned page components (will be created next)
import ShopPage from './pages/ShopPage'; 
import AdminDashboard from './pages/AdminDashboard';
import CreateProductForm from './pages/CreateProductForm';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CartPage from './pages/CartPage';
import NotFound from './pages/NotFound'; // A simple fallback page

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
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);