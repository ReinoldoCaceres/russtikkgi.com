import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productApi } from '../services/api';
import './CategoryGrid.css';

interface CategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  size: 'large' | 'medium';
}

interface CategoryWithProducts extends CategoryItem {
  firstProduct?: Product;
  hasProducts: boolean;
}

const CategoryGrid: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: CategoryItem[] = [
    {
      id: 'swimwear',
      title: 'Swimwear',
      subtitle: 'Summer Collection',
      buttonText: 'Shop Now',
      size: 'large'
    },
    {
      id: 'ball-gowns',
      title: 'Ball Gowns',
      subtitle: 'Elegant Evening',
      buttonText: 'Shop Collection',
      size: 'large'
    },
    {
      id: 'revamp',
      title: 'ReVamp',
      subtitle: 'Premium Denim',
      buttonText: 'Shop Now',
      size: 'medium'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load featured products
        const featuredResponse = await productApi.getFeaturedProducts();
        setFeaturedProducts(featuredResponse.products || []);

        // Load first product for each category
        const categoriesData = await Promise.all(
          categories.map(async (category) => {
            try {
              const categoryProducts = await productApi.getProductsByCategory(category.id);
              const products = categoryProducts.products || [];
              return {
                ...category,
                firstProduct: products[0] || undefined,
                hasProducts: products.length > 0
              };
            } catch (error) {
              console.error(`Failed to load products for ${category.id}:`, error);
              return {
                ...category,
                firstProduct: undefined,
                hasProducts: false
              };
            }
          })
        );

        setCategoriesWithProducts(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set categories without products as fallback
        setCategoriesWithProducts(categories.map(cat => ({
          ...cat,
          firstProduct: undefined,
          hasProducts: false
        })));
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProductImageSrc = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.path || primaryImage?.filename;
  };

  const getProductImageAlt = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.alt || product.name;
  };

  const getCategoryImageStyle = (categoryData: CategoryWithProducts) => {
    if (categoryData.firstProduct) {
      const imageSrc = getProductImageSrc(categoryData.firstProduct);
      if (imageSrc) {
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    return {};
  };

  return (
    <section className="category-grid">
      <div className="container">
        <div className="category-grid__content">
          {categoriesWithProducts.map((category) => (
            <div 
              key={category.id}
              className={`category-grid__item category-grid__item--${category.size}`}
            >
              <Link to={`/collection/${category.id}`}>
                <div className="category-grid__image" style={getCategoryImageStyle(category)}>
                  {!category.hasProducts && (
                    <div className="category-grid__placeholder">
                      Collection Coming Soon
                    </div>
                  )}
                  <div className="category-grid__overlay">
                    <div className="category-grid__text">
                      <h3 className="category-grid__title">{category.title}</h3>
                      {category.subtitle && (
                        <p className="category-grid__subtitle">{category.subtitle}</p>
                      )}
                      <button className="category-grid__btn">
                        {category.hasProducts ? category.buttonText : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Featured Products Section */}
        <div className="category-grid__featured">
          <h2 className="category-grid__featured-title">Featured Products</h2>
          
          {loading ? (
            <div className="category-grid__loading">
              <p>Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="category-grid__products">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link 
                  key={product._id || product.id} 
                  to={`/product/${product._id || product.id}`}
                  className="category-grid__product"
                >
                  <div className="category-grid__product-image">
                    {getProductImageSrc(product) ? (
                      <img 
                        src={getProductImageSrc(product)} 
                        alt={getProductImageAlt(product)}
                        className="category-grid__product-img"
                      />
                    ) : (
                      <div className="category-grid__placeholder category-grid__placeholder--small">
                        [NO IMAGE]
                      </div>
                    )}
                  </div>
                  <div className="category-grid__product-info">
                    <h4 className="category-grid__product-name">{product.name}</h4>
                    <p className="category-grid__product-price">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="category-grid__empty">
              <p>No featured products available at the moment.</p>
              <p>Visit our collections to explore our products.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid; 