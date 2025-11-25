import React, { useState } from 'react';
// import { Product } from '../types/api';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Local state for the quantity input
  const [quantity, setQuantity] = useState(1); 
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (quantity <= 0 || quantity > product.availableCount) {
      alert(`Invalid quantity. Max available: ${product.availableCount}`);
      return;
    }

    // Add item to the global cart context
    addItem({
      productId: product.id,
      quantity: quantity,
      price: product.price,
      name: product.name,
      availableCount: product.availableCount,
    });

    setQuantity(1); // Reset input after adding
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px', width: '300px' }}>
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      
      {/* Required Display */}
      <p style={{ fontWeight: 'bold' }}>Price: ${product.price.toFixed(2)}</p>
      <p>Available: {product.availableCount}</p>
      
      {/* Add to Cart Interface */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <input
          type="number"
          min="1"
          max={product.availableCount}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '60px', marginRight: '10px', padding: '5px' }}
          disabled={product.availableCount === 0}
        />
        <button 
          onClick={handleAddToCart} 
          disabled={product.availableCount === 0}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          {product.availableCount > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;