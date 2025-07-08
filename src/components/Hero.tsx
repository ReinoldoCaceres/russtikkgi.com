import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
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
              <div className="hero__placeholder-image">
                [HERO COLLECTION IMAGE]
              </div>
            </div>
            <div className="hero__collection-content">
              <h2 className="hero__collection-title">New Summer Collection 2025</h2>
              <button className="hero__collection-btn">Shop the Collection</button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Video/Image Placeholder */}
      <div className="hero__background">
        <div className="hero__background-placeholder">
          [BACKGROUND VIDEO/IMAGE PLACEHOLDER]
        </div>
      </div>
    </section>
  );
};

export default Hero; 