import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    gender: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', formData);
    // Handle newsletter signup
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__content">
          <h2 className="newsletter__title">Sign up for russtikk updates</h2>
          <p className="newsletter__description">
            Be in the know about what's happening at our fashion house: never miss out on the latest trends, 
            newest collections and exciting special projects from russtikk.
          </p>

          <form className="newsletter__form" onSubmit={handleSubmit}>
            <div className="newsletter__form-row">
              <div className="newsletter__form-group newsletter__form-group--email">
                <label htmlFor="email" className="newsletter__label">
                  Email sign-up *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="newsletter__input"
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="newsletter__submit">
              Subscribe
            </button>
          </form>

          <p className="newsletter__disclaimer">
            russtikk processes the data collected to send you our newsletter. To find out more about how we manage your personal data and to exercise your rights, please refer to our privacy policy.
          </p>
          <p className="newsletter__required">
            *Mandatory information: If you choose not to give your consent for the collection of mandatory data you will not be able to subscribe to the newsletter.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 