import type {
  CreateOrder,
  CreateProduct,
  OrderResponse,
  Product,
} from 'project-shared';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  console.log('products', response);
  if (!response.ok) {
    console.log('failed to logg');
    throw new Error('Failed to fetch products');
  }
  return response.json();
}


export async function createProduct(
  payload: CreateProduct,
): Promise<CreateProduct> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create product.');
  }

  return response.json();
}


export async function placeOrder(payload: CreateOrder): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to place order.');
  }

  return response.json();
}


export async function fetchOrder(orderId: string): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Order ${orderId} not found.`);
    }
    throw new Error('Failed to fetch order details.');
  }

  return response.json();
}
