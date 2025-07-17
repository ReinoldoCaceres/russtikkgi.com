import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load hero image:', e.currentTarget.src);
  };

  const handleImageLoad = () => {
    console.log('Hero image loaded successfully');
  };

  return (
    <section className="hero">
      <div className="hero__content">
        {/* Main Brand Display */}
        <div className="hero__brand">
          <h1 className="hero__title">russtikkgi</h1>
          <p className="hero__scroll">Scroll down</p>
        </div>

        {/* Featured Collection */}
        <div className="hero__collection">
          <div className="hero__collection-item hero__collection-item--main">
            <div className="hero__collection-image">
              <img 
                src="/hero-image.jpg" 
                alt="Russtikk Hero Collection" 
                className="hero__hero-image"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
            <div className="hero__collection-content">
              <h2 className="hero__collection-title">New Summer Collection 2025</h2>
              <button className="hero__collection-btn">Shop the Collection</button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Video/Image Placeholder */}
    </section>
  );
};

export default Hero; 