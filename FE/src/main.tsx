import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import App from './App';
import { CartProvider } from './context';
import {AdminDashboard, CartPage, CreateProductForm, NotFound, OrderConfirmationPage, ShopPage} from './pages';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <ShopPage />,
      },


      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'admin/new',
        element: <CreateProductForm /> ,
      },

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
