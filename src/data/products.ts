import { Product } from '../types';

export const products: Product[] = [
  // Swimwear Collection (10 items)
  {
    id: 'sw-001',
    name: 'Signature One-Piece',
    price: 295,
    category: 'swimwear',
    image: '[SWIMWEAR-001-IMAGE]',
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
    image: '[SWIMWEAR-002-IMAGE]',
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
    image: '[SWIMWEAR-003-IMAGE]',
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
    image: '[SWIMWEAR-004-IMAGE]',
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
    image: '[SWIMWEAR-005-IMAGE]',
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
    image: '[SWIMWEAR-006-IMAGE]',
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
    image: '[SWIMWEAR-007-IMAGE]',
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
    image: '[SWIMWEAR-008-IMAGE]',
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
    image: '[SWIMWEAR-009-IMAGE]',
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
    image: '[SWIMWEAR-010-IMAGE]',
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
    image: '[BALLGOWN-001-IMAGE]',
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
    image: '[BALLGOWN-002-IMAGE]',
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
    image: '[BALLGOWN-003-IMAGE]',
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
    image: '[BALLGOWN-004-IMAGE]',
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
    image: '[BALLGOWN-005-IMAGE]',
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
    image: '[BALLGOWN-006-IMAGE]',
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
    image: '[BALLGOWN-007-IMAGE]',
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
    image: '[BALLGOWN-008-IMAGE]',
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
    image: '[BALLGOWN-009-IMAGE]',
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
    image: '[BALLGOWN-010-IMAGE]',
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
    image: '[REVAMP-001-IMAGE]',
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
    image: '[REVAMP-002-IMAGE]',
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
    image: '[REVAMP-003-IMAGE]',
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
    image: '[REVAMP-004-IMAGE]',
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
    image: '[REVAMP-005-IMAGE]',
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
    image: '[REVAMP-006-IMAGE]',
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
    image: '[REVAMP-007-IMAGE]',
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
    image: '[REVAMP-008-IMAGE]',
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
    image: '[REVAMP-009-IMAGE]',
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
    image: '[REVAMP-010-IMAGE]',
    description: 'Classic denim jacket with luxury hardware',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Dark Blue', 'Light Blue'],
    inStock: true
  }
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
}; 