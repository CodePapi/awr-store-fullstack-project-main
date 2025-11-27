// --- Local Cart State Model ---
export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  name: string;
  availableCount: number;
}