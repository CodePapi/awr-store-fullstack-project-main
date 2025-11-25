// src/types/api.ts

// --- Stage 1: Product Models ---
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    availableCount: number;
    createdAt: string; 
    updatedAt: string;
  }
  
  // NEW TYPE: Matches the BE CreateProductDto
  export interface CreateProductPayload {
      name: string;
      description: string;
      price: number;
      availableCount: number;
  }
  
  // --- Local Cart State Model ---
  export interface CartItem { 
    productId: number;
    quantity: number;
    price: number; 
    name: string; 
    availableCount: number; 
}
  
  // --- Stage 2: Order Models (Request) ---
  export interface OrderRequestItem {
    id: number; // Product ID
    quantity: number;
  }
  
  export interface CreateOrderPayload {
    customerId: string; 
    products: OrderRequestItem[];
  }
  
  // --- Stage 2: Order Models (Response) ---
  export interface OrderResponseItem {
    id: number; // Product ID
    quantity: number;
    name: string;
  }
  
  export interface OrderResponse {
    id: string; // Order UUID
    customerId: string;
    orderCreatedDate: string;
    orderUpdatedDate: string;
    status: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELED';
    orderTotal: number;
    products: OrderResponseItem[];
  }