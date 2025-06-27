import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

interface CategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  size: 'large' | 'medium' | 'small';
}

const CategoryGrid: React.FC = () => {
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
    },
    {
      id: 'accessories',
      title: 'Accessories',
      buttonText: 'Shop Now',
      size: 'medium'
    }
  ];

  return (
    <section className="category-grid">
      <div className="container">
        <div className="category-grid__content">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`category-grid__item category-grid__item--${category.size}`}
            >
              <Link to={`/collection/${category.id}`}>
                <div className="category-grid__image">
                  <div className="category-grid__placeholder">
                    [{category.title.toUpperCase()} IMAGE PLACEHOLDER]
                  </div>
                  <div className="category-grid__overlay">
                    <div className="category-grid__text">
                      <h3 className="category-grid__title">{category.title}</h3>
                      {category.subtitle && (
                        <p className="category-grid__subtitle">{category.subtitle}</p>
                      )}
                      <button className="category-grid__btn">
                        {category.buttonText}
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
          <div className="category-grid__products">
            <div className="category-grid__product">
              <div className="category-grid__product-image">
                <div className="category-grid__placeholder category-grid__placeholder--small">
                  [PRODUCT IMAGE]
                </div>
              </div>
              <div className="category-grid__product-info">
                <h4 className="category-grid__product-name">Signature Swimsuit</h4>
                <p className="category-grid__product-price">$295</p>
              </div>
            </div>
            
            <div className="category-grid__product">
              <div className="category-grid__product-image">
                <div className="category-grid__placeholder category-grid__placeholder--small">
                  [PRODUCT IMAGE]
                </div>
              </div>
              <div className="category-grid__product-info">
                <h4 className="category-grid__product-name">Evening Gown</h4>
                <p className="category-grid__product-price">$1,850</p>
              </div>
            </div>
            
            <div className="category-grid__product">
              <div className="category-grid__product-image">
                <div className="category-grid__placeholder category-grid__placeholder--small">
                  [PRODUCT IMAGE]
                </div>
              </div>
              <div className="category-grid__product-info">
                <h4 className="category-grid__product-name">ReVamp Jeans</h4>
                <p className="category-grid__product-price">$485</p>
              </div>
            </div>
            
            <div className="category-grid__product">
              <div className="category-grid__product-image">
                <div className="category-grid__placeholder category-grid__placeholder--small">
                  [PRODUCT IMAGE]
                </div>
              </div>
              <div className="category-grid__product-info">
                <h4 className="category-grid__product-name">Designer Bag</h4>
                <p className="category-grid__product-price">$1,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid; 