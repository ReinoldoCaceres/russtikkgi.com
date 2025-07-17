import { Product } from '../types';
import { productApi } from '../services/api';

// Cache for products to avoid unnecessary API calls
let productsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Static fallback data for development/offline use
const fallbackProducts: Product[] = [
  // Swimwear Collection (10 items)
  {
    id: 'sw-001',
    name: 'Signature One-Piece',
    price: 295,
    category: 'swimwear',
    images: [{ filename: 'sw-001.jpg', path: '/images/sw-001.jpg', isPrimary: true, alt: 'Signature One-Piece' }],
    description: 'Elegant one-piece swimsuit with gold hardware details',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White'],
    inStock: true
  },
  {
    id: 'sw-002',
    name: 'Luxury Bikini Set',
    price: 385,
    category: 'swimwear',
    images: [{ filename: 'sw-002.jpg', path: '/images/sw-002.jpg', isPrimary: true, alt: 'Luxury Bikini Set' }],
    description: 'Two-piece bikini with embossed logo and adjustable straps',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gold', 'White', 'Red'],
    inStock: true
  },
  {
    id: 'sw-003',
    name: 'Cut-Out Monokini',
    price: 425,
    category: 'swimwear',
    images: [{ filename: 'sw-003.jpg', path: '/images/sw-003.jpg', isPrimary: true, alt: 'Cut-Out Monokini' }],
    description: 'Bold cut-out design with metallic accents',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Silver', 'Bronze'],
    inStock: true
  },
  {
    id: 'sw-004',
    name: 'High-Waisted Bikini',
    price: 345,
    category: 'swimwear',
    images: [{ filename: 'sw-004.jpg', path: '/images/sw-004.jpg', isPrimary: true, alt: 'High-Waisted Bikini' }],
    description: 'Retro-inspired high-waisted bottom with bandeau top',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy', 'Pink'],
    inStock: true
  },
  {
    id: 'sw-005',
    name: 'Mesh Detail Swimsuit',
    price: 465,
    category: 'swimwear',
    images: [{ filename: 'sw-005.jpg', path: '/images/sw-005.jpg', isPrimary: true, alt: 'Mesh Detail Swimsuit' }],
    description: 'One-piece with strategic mesh panels and logo charm',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'White'],
    inStock: true
  },
  {
    id: 'sw-006',
    name: 'String Bikini Deluxe',
    price: 285,
    category: 'swimwear',
    images: [{ filename: 'sw-006.jpg', path: '/images/sw-006.jpg', isPrimary: true, alt: 'String Bikini Deluxe' }],
    description: 'Minimalist string bikini with gold chain details',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gold', 'Silver'],
    inStock: false
  },
  {
    id: 'sw-007',
    name: 'Sports Luxe One-Piece',
    price: 395,
    category: 'swimwear',
    images: [{ filename: 'sw-007.jpg', path: '/images/sw-007.jpg', isPrimary: true, alt: 'Sports Luxe One-Piece' }],
    description: 'Athletic-inspired design with luxury finishes',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    inStock: true
  },
  {
    id: 'sw-008',
    name: 'Embellished Bikini',
    price: 525,
    category: 'swimwear',
    images: [{ filename: 'sw-008.jpg', path: '/images/sw-008.jpg', isPrimary: true, alt: 'Embellished Bikini' }],
    description: 'Hand-embellished bikini with crystal details',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Gold'],
    inStock: true
  },
  {
    id: 'sw-009',
    name: 'Asymmetric Swimsuit',
    price: 485,
    category: 'swimwear',
    images: [{ filename: 'sw-009.jpg', path: '/images/sw-009.jpg', isPrimary: true, alt: 'Asymmetric Swimsuit' }],
    description: 'Modern asymmetric cut with architectural lines',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    inStock: true
  },
  {
    id: 'sw-010',
    name: 'Cover-Up Dress',
    price: 685,
    category: 'swimwear',
    images: [{ filename: 'sw-010.jpg', path: '/images/sw-010.jpg', isPrimary: true, alt: 'Cover-Up Dress' }],
    description: 'Elegant beach cover-up with logo embroidery',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Beige'],
    inStock: true
  },

  // Ball Gowns Collection (10 items)
  {
    id: 'bg-001',
    name: 'Midnight Elegance Gown',
    price: 2850,
    category: 'ball-gowns',
    images: [{ filename: 'bg-001.jpg', path: '/images/bg-001.jpg', isPrimary: true, alt: 'Midnight Elegance Gown' }],
    description: 'Floor-length gown with hand-sewn beadwork and train',
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    colors: ['Black', 'Midnight Blue', 'Burgundy'],
    inStock: true
  },
  {
    id: 'bg-002',
    name: 'Crystal Cascade Dress',
    price: 3250,
    category: 'ball-gowns',
    images: [{ filename: 'bg-002.jpg', path: '/images/bg-002.jpg', isPrimary: true, alt: 'Crystal Cascade Dress' }],
    description: 'Embellished bodice with flowing crystal details',
    sizes: ['2', '4', '6', '8', '10', '12'],
    colors: ['Black', 'Silver', 'Champagne'],
    inStock: true
  },
  {
    id: 'bg-003',
    name: 'Velvet Majesty Gown',
    price: 2485,
    category: 'ball-gowns',
    images: [{ filename: 'bg-003.jpg', path: '/images/bg-003.jpg', isPrimary: true, alt: 'Velvet Majesty Gown' }],
    description: 'Luxurious velvet gown with dramatic sleeves',
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    colors: ['Black', 'Emerald', 'Royal Blue'],
    inStock: true
  },
  {
    id: 'bg-004',
    name: 'Mermaid Silhouette Dress',
    price: 2995,
    category: 'ball-gowns',
    images: [{ filename: 'bg-004.jpg', path: '/images/bg-004.jpg', isPrimary: true, alt: 'Mermaid Silhouette Dress' }],
    description: 'Figure-hugging mermaid cut with dramatic flare',
    sizes: ['2', '4', '6', '8', '10', '12'],
    colors: ['Black', 'Gold', 'Rose Gold'],
    inStock: true
  },
  {
    id: 'bg-005',
    name: 'Tulle Princess Gown',
    price: 2685,
    category: 'ball-gowns',
    images: [{ filename: 'bg-005.jpg', path: '/images/bg-005.jpg', isPrimary: true, alt: 'Tulle Princess Gown' }],
    description: 'Romantic tulle ballgown with corseted bodice',
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    colors: ['Black', 'White', 'Blush', 'Ivory'],
    inStock: false
  },
  {
    id: 'bg-006',
    name: 'Sequin Goddess Dress',
    price: 3485,
    category: 'ball-gowns',
    images: [{ filename: 'bg-006.jpg', path: '/images/bg-006.jpg', isPrimary: true, alt: 'Sequin Goddess Dress' }],
    description: 'All-over sequin gown with plunging neckline',
    sizes: ['2', '4', '6', '8', '10', '12'],
    colors: ['Black', 'Gold', 'Silver'],
    inStock: true
  },
  {
    id: 'bg-007',
    name: 'Off-Shoulder Elegance',
    price: 2385,
    category: 'ball-gowns',
    images: [{ filename: 'bg-007.jpg', path: '/images/bg-007.jpg', isPrimary: true, alt: 'Off-Shoulder Elegance' }],
    description: 'Classic off-shoulder design with modern twist',
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    colors: ['Black', 'Navy', 'Wine'],
    inStock: true
  },
  {
    id: 'bg-008',
    name: 'Feather Trim Gown',
    price: 3850,
    category: 'ball-gowns',
    images: [{ filename: 'bg-008.jpg', path: '/images/bg-008.jpg', isPrimary: true, alt: 'Feather Trim Gown' }],
    description: 'Luxurious gown with ostrich feather trim details',
    sizes: ['2', '4', '6', '8', '10', '12'],
    colors: ['Black', 'White'],
    inStock: true
  },
  {
    id: 'bg-009',
    name: 'Backless Beauty Dress',
    price: 2795,
    category: 'ball-gowns',
    images: [{ filename: 'bg-009.jpg', path: '/images/bg-009.jpg', isPrimary: true, alt: 'Backless Beauty Dress' }],
    description: 'Dramatic backless gown with chain detail',
    sizes: ['2', '4', '6', '8', '10', '12'],
    colors: ['Black', 'Red', 'Gold'],
    inStock: true
  },
  {
    id: 'bg-010',
    name: 'Empire Waist Gown',
    price: 2185,
    category: 'ball-gowns',
    images: [{ filename: 'bg-010.jpg', path: '/images/bg-010.jpg', isPrimary: true, alt: 'Empire Waist Gown' }],
    description: 'Flowing empire waist gown with delicate beading',
    sizes: ['2', '4', '6', '8', '10', '12', '14'],
    colors: ['Black', 'Champagne', 'Silver'],
    inStock: true
  },

  // ReVamp Denim Collection (10 items)
  {
    id: 'rv-001',
    name: 'Signature Skinny Jeans',
    price: 485,
    category: 'revamp',
    images: [{ filename: 'rv-001.jpg', path: '/images/rv-001.jpg', isPrimary: true, alt: 'Signature Skinny Jeans' }],
    description: 'Premium stretch denim with logo hardware',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'Dark Blue', 'Light Blue'],
    inStock: true
  },
  {
    id: 'rv-002',
    name: 'High-Rise Straight Jeans',
    price: 525,
    category: 'revamp',
    images: [{ filename: 'rv-002.jpg', path: '/images/rv-002.jpg', isPrimary: true, alt: 'High-Rise Straight Jeans' }],
    description: 'Classic straight cut with modern high rise',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'Raw Indigo', 'Vintage Blue'],
    inStock: true
  },
  {
    id: 'rv-003',
    name: 'Distressed Boyfriend Jeans',
    price: 565,
    category: 'revamp',
    images: [{ filename: 'rv-003.jpg', path: '/images/rv-003.jpg', isPrimary: true, alt: 'Distressed Boyfriend Jeans' }],
    description: 'Relaxed boyfriend fit with artful distressing',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Light Blue', 'Medium Blue', 'Dark Blue'],
    inStock: true
  },
  {
    id: 'rv-004',
    name: 'Flare Leg Jeans',
    price: 585,
    category: 'revamp',
    images: [{ filename: 'rv-004.jpg', path: '/images/rv-004.jpg', isPrimary: true, alt: 'Flare Leg Jeans' }],
    description: 'Retro-inspired flare with premium denim',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'Dark Blue', 'Stone Wash'],
    inStock: true
  },
  {
    id: 'rv-005',
    name: 'Embellished Skinny Jeans',
    price: 785,
    category: 'revamp',
    images: [{ filename: 'rv-005.jpg', path: '/images/rv-005.jpg', isPrimary: true, alt: 'Embellished Skinny Jeans' }],
    description: 'Skinny jeans with crystal and stud embellishments',
    sizes: ['25', '26', '27', '28', '29', '30', '31'],
    colors: ['Black', 'Dark Blue'],
    inStock: true
  },
  {
    id: 'rv-006',
    name: 'Wide Leg Trousers',
    price: 645,
    category: 'revamp',
    images: [{ filename: 'rv-006.jpg', path: '/images/rv-006.jpg', isPrimary: true, alt: 'Wide Leg Trousers' }],
    description: 'Modern wide-leg cut in premium denim',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'Navy', 'Ecru'],
    inStock: false
  },
  {
    id: 'rv-007',
    name: 'Cropped Straight Jeans',
    price: 465,
    category: 'revamp',
    images: [{ filename: 'rv-007.jpg', path: '/images/rv-007.jpg', isPrimary: true, alt: 'Cropped Straight Jeans' }],
    description: 'Ankle-length straight jeans with raw hem',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'White', 'Light Blue'],
    inStock: true
  },
  {
    id: 'rv-008',
    name: 'Leather Trim Jeans',
    price: 885,
    category: 'revamp',
    images: [{ filename: 'rv-008.jpg', path: '/images/rv-008.jpg', isPrimary: true, alt: 'Leather Trim Jeans' }],
    description: 'Luxury denim with genuine leather trim details',
    sizes: ['25', '26', '27', '28', '29', '30', '31'],
    colors: ['Black', 'Dark Blue'],
    inStock: true
  },
  {
    id: 'rv-009',
    name: 'High-Waisted Shorts',
    price: 385,
    category: 'revamp',
    images: [{ filename: 'rv-009.jpg', path: '/images/rv-009.jpg', isPrimary: true, alt: 'High-Waisted Shorts' }],
    description: 'Premium denim shorts with logo button',
    sizes: ['25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Black', 'Light Blue', 'White'],
    inStock: true
  },
  {
    id: 'rv-010',
    name: 'Denim Jacket Deluxe',
    price: 725,
    category: 'revamp',
    images: [{ filename: 'rv-010.jpg', path: '/images/rv-010.jpg', isPrimary: true, alt: 'Denim Jacket Deluxe' }],
    description: 'Classic denim jacket with luxury hardware',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Dark Blue', 'Light Blue'],
    inStock: true
  }
];

// Function to check if cache is valid
const isCacheValid = (): boolean => {
  return productsCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

// Function to fetch all products with caching
export const getAllProducts = async (): Promise<Product[]> => {
  if (isCacheValid() && productsCache) {
    return productsCache;
  }

  try {
    const response = await productApi.getProducts();
    const products = response.products || [];
    
    // Update cache
    productsCache = products;
    cacheTimestamp = Date.now();
    
    return products;
  } catch (error) {
    console.error('Failed to fetch products from API, using fallback data:', error);
    return fallbackProducts;
  }
};

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const products = await getAllProducts();
    return products.filter(product => product.category === category);
  } catch (error) {
    console.error('Failed to get products by category:', error);
    return fallbackProducts.filter(product => product.category === category);
  }
};

// Function to get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // First try to get from API directly
    const product = await productApi.getProduct(id);
    return product;
  } catch (error) {
    // Fallback to searching in all products
    console.error('Failed to get product by ID from API, searching cache:', error);
    try {
      const products = await getAllProducts();
      return products.find(product => product.id === id || product._id === id);
    } catch (cacheError) {
      console.error('Failed to search cache:', cacheError);
      return fallbackProducts.find(product => product.id === id);
    }
  }
};

// Function to invalidate cache (useful after product updates)
export const invalidateProductsCache = (): void => {
  productsCache = null;
  cacheTimestamp = 0;
};

// Legacy export for backwards compatibility
export const products = fallbackProducts; 