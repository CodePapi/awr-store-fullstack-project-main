import { useState } from 'react';
import { useCart } from '../hooks';
import type { ProductCardProps } from '../types';

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (quantity <= 0 || quantity > product.availableCount) {
      alert(`Invalid quantity. Max available: ${product.availableCount}`);
      return;
    }

    addItem({
      productId: product.id,
      quantity: quantity,
      price: product.price,
      name: product.name,
      availableCount: product.availableCount,
    });

    setQuantity(1); 
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '15px',
        margin: '10px',
        width: '300px',
      }}
    >
      <h4>{product.name}</h4>
      <p>{product.description}</p>

      <p style={{ fontWeight: 'bold' }}>Price: ${product.price.toFixed(2)}</p>
      <p>Available: {product.availableCount}</p>

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
          type="button"
        >
          {product.availableCount > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
