import { Product } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : '';

// Product API functions
export const productApi = {
  // Get all products with optional filtering
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const response = await fetch(`${API_BASE_URL}/api/products?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  // Get single product by ID or slug
  getProduct: async (identifier: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${identifier}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  // Create new product
  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt' | 'slug'>) => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }
    
    return response.json();
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Product>) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    
    return response.json();
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
    
    return response.json();
  },

  // Upload images
  uploadImages: async (productId: string, images: FileList | File[]) => {
    const formData = new FormData();
    
    // Convert FileList to array if needed
    const imageArray = Array.from(images);
    
    imageArray.forEach((image) => {
      formData.append('images', image);
    });
    
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/images`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload images');
    }
    
    return response.json();
  },

  // Delete specific image
  deleteImage: async (productId: string, imageId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete image');
    }
    
    return response.json();
  },

  // Set primary image
  setPrimaryImage: async (productId: string, imageId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/images/${imageId}/primary`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set primary image');
    }
    
    return response.json();
  },

  // Helper function to get products by category
  getProductsByCategory: async (category: string) => {
    return productApi.getProducts({ category });
  },

  // Helper function to get featured products
  getFeaturedProducts: async () => {
    return productApi.getProducts({ featured: true });
  }
};

// Legacy functions for backwards compatibility
export const getProductsByCategory = async (category: string) => {
  const response = await productApi.getProductsByCategory(category);
  return response.products || [];
};

export const getProductById = async (id: string) => {
  try {
    return await productApi.getProduct(id);
  } catch (error) {
    return null;
  }
}; 