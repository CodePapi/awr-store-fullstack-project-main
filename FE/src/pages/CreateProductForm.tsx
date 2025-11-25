import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/apiService';
// import { CreateProductPayload } from '../types/api';

const CreateProductForm: React.FC = () => {
  const navigate = useNavigate();
  // Get the query client instance
  const queryClient = useQueryClient(); 
  
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    description: '',
    price: 0,
    availableCount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'availableCount' ? Number(value) : value,
    }));
  };

  // Use useMutation for the POST request
  const createProductMutation = useMutation({
    mutationFn: (newProduct: CreateProductPayload) => createProduct(newProduct),
    
    // On success: Invalidate the 'products' query cache to force the AdminDashboard to refetch
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); 
      alert(`Product "${data.name}" created successfully!`);
      navigate('/admin'); // Redirect on success
    },
    
    // On error: Handle the display of the error message
    onError: (error) => {
      // Error is an instance of Error thrown from the API service
      alert(`Error creating product: ${error.message}`); 
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || formData.price <= 0 || formData.availableCount < 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Trigger the mutation
    createProductMutation.mutate(formData);
  };

  return (
    <div>
      <h1>➕ Create New Product</h1>
      <p>Fill out the details below to add a new item to the inventory.</p>

      {createProductMutation.isError && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
            Error: {createProductMutation.error?.message || 'Failed to create product.'}
        </p>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
        {/* ... (Form fields remain the same) ... */}
        <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></label>
        <label>Description: <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} /></label>
        <label>Price ($): <input type="number" name="price" value={formData.price} onChange={handleChange} min="0.01" step="0.01" required /></label>
        <label>Available Count: <input type="number" name="availableCount" value={formData.availableCount} onChange={handleChange} min="0" required /></label>
        
        <button type="submit" disabled={createProductMutation.isLoading} style={{ padding: '10px' }}>
          {createProductMutation.isLoading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;