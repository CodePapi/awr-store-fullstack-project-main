import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/apiService';
import type { CreateProduct } from 'project-shared';

const CreateProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProduct>({
    name: '',
    description: '',
    price: 0,
    availableCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert number fields to actual numbers
      [name]:
        name === 'price' || name === 'availableCount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      formData.price <= 0 ||
      formData.availableCount < 0
    ) {
      setError('Please fill out all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      await createProduct(formData);

      // On successful submission, redirect back to the Product Dashboard
      alert(`Product "${formData.name}" created successfully!`);
      navigate('/admin');
    } catch (err) {
      console.error('Error creating product:', err);
      // Display the specific error message from the API service
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during creation.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>➕ Create New Product</h1>
      <p>Fill out the details below to add a new item to the inventory.</p>

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </label>

        <label>
          Price ($):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </label>

        <label>
          Available Count:
          <input
            type="number"
            name="availableCount"
            value={formData.availableCount}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '10px' }}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
