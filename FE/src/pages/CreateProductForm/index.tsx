import type { CreateProduct } from 'project-shared';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api';
import styles from "./styles";

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
      [name]:
        name === 'price' || name === 'availableCount'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price <= 0 ||
      !Number.isFinite(formData.price) ||
      formData.availableCount <= 0 ||
      !Number.isInteger(formData.availableCount)
    ) {
      setError('Please fill out all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      await createProduct(formData);

      alert(`Product "${formData.name}" created successfully!`);
      navigate('/admin');

    } catch (err) {
      console.error('Error creating product:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during creation.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>➕ Create New Product</h1>
      <p style={styles.subtitle}>Fill out the details below to add a new item to the inventory.</p>

      {error && <p style={styles.error}>Error: {error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <label style={styles.label}>
          Product Name:
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Wireless Mouse"
            required
          />
        </label>

        <label style={styles.label}>
          Product Description:
          <textarea
            style={styles.textarea}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief summary of the product's features and use."
            required
            rows={4}
          />
        </label>

        <label style={styles.label}>
          Price (EUR):
          <input
            style={styles.input}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            placeholder="0.01"
            required
          />
        </label>

        <label style={styles.label}>
          Available Count:
          <input
            style={styles.input}
            type="number"
            name="availableCount"
            value={formData.availableCount}
            onChange={handleChange}
            min="1"
            step="1"
            placeholder="1"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>

      </form>
    </div>
  );
};

export default CreateProductForm;
