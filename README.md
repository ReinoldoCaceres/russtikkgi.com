# russtikkgi.com

A luxury fashion website inspired by Balmain's design, featuring elegant typography, sophisticated grid layouts, and premium aesthetics. Built with React and TypeScript.

## Features

- **Brand**: russtikkgi (replacing Balmain)
- **Categories**: 
  - Swimwear
  - Ball Gowns
  - ReVamp (Premium Denim)
- **Responsive Design**: Mobile-first approach with elegant breakpoints
- **Components**:
  - Fixed header with navigation
  - Hero section with dramatic branding
  - Category grid with hover effects
  - Newsletter subscription
  - Comprehensive footer

## Design Elements

- **Typography**: Inter font family with careful weight and spacing
- **Color Scheme**: Black, white, and grayscale palette
- **Layout**: CSS Grid and Flexbox for responsive layouts
- **Interactions**: Smooth hover effects and transitions
- **Styling**: Balmain-inspired luxury aesthetic

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx         # Navigation and branding
│   ├── Header.css
│   ├── Hero.tsx           # Main hero section
│   ├── Hero.css
│   ├── CategoryGrid.tsx   # Product categories
│   ├── CategoryGrid.css
│   ├── Newsletter.tsx     # Email subscription
│   ├── Newsletter.css
│   ├── Footer.tsx         # Site footer
│   └── Footer.css
├── App.tsx                # Main application component
├── App.css
├── index.tsx              # Application entry point
└── index.css              # Global styles
```

## Key Components

### Header
- Fixed navigation with top bar
- Brand logo prominently displayed
- Category navigation
- Mobile-responsive menu
- Search and cart functionality

### Hero Section
- Large brand typography
- Animated "Scroll down" indicator
- Featured collection showcase
- Dark theme with elegant gradients

### Category Grid
- Responsive grid layout
- Three main categories (Swimwear, Ball Gowns, ReVamp)
- Hover effects with overlay text
- Featured products section

### Newsletter
- Subscription form with validation
- Gender selection and email input
- Privacy disclaimer text
- Responsive form layout

### Footer
- Multi-column layout
- Social media links
- Company information
- Legal links and copyright

## Customization

### Adding Images
Replace the placeholder divs with actual images:

```tsx
// Replace this:
<div className="hero__placeholder-image">
  [HERO COLLECTION IMAGE]
</div>

// With this:
<img src="/path/to/image.jpg" alt="Collection" />
```

### Modifying Categories
Update the categories in `CategoryGrid.tsx`:

```tsx
const categories: CategoryItem[] = [
  {
    id: 'your-category',
    title: 'Your Category',
    subtitle: 'Category Description',
    buttonText: 'Shop Now',
    size: 'large'
  }
];
```

### Color Scheme
Modify colors in the CSS files:
- Primary: `#000000` (black)
- Secondary: `#ffffff` (white)
- Accent: `#666666` (gray)
- Background: `#f8f8f8` (light gray)

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **CSS3** - Custom styling with Grid and Flexbox
- **React Scripts** - Build tools and development server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 russtikkgi. All rights reserved.

---

For questions or support, please contact the development team. 