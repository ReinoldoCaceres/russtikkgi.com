export interface ProductImage {
  filename: string;
  path: string;
  isPrimary: boolean;
  alt?: string;
  _id?: string;
}

export interface Product {
  _id?: string;
  id?: string; // For backwards compatibility
  name: string;
  price: number;
  category: 'swimwear' | 'ball-gowns' | 'revamp';
  images: ProductImage[];
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity?: number;
  slug?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  primaryImage?: ProductImage;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  paymentMethod: 'card';
} 