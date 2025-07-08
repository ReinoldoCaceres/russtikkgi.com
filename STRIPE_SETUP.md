# Stripe Payment Integration Setup

## Overview
This project now includes full Stripe payment integration for secure credit card processing. The setup includes:

- **Frontend**: React components with Stripe Elements for secure card input
- **Backend**: Express server for handling payment intents
- **Security**: No card data touches your servers - all handled by Stripe

## Setup Instructions

### 1. Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a new account or sign in
3. Get your API keys from the **Developers > API keys** section
4. You'll need:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Frontend environment variable
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Payment server configuration
PORT=3001
```

### 3. Start the Application
Run both frontend and backend servers:

```bash
# Install dependencies (if not already done)
npm install

# Start both servers simultaneously
npm run dev
```

Or start them separately:

```bash
# Terminal 1: Start the payment server
npm run server

# Terminal 2: Start the React app
npm start
```

## How It Works

### Payment Flow
1. **Customer Information**: User fills out shipping and contact details
2. **Payment Form**: User enters credit card information using Stripe Elements
3. **Payment Intent**: Backend creates a payment intent with Stripe
4. **Secure Processing**: Stripe handles all payment processing
5. **Confirmation**: Payment success/failure is handled gracefully

### Security Features
- **No card data stored**: All payment information is handled by Stripe
- **PCI Compliance**: Stripe handles all PCI compliance requirements
- **3D Secure**: Automatic 3D Secure authentication when required
- **Fraud Detection**: Stripe's built-in fraud detection

## Testing

### Test Card Numbers
Use these test card numbers for development:

- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 8224 6310 005
- **Declined**: 4000 0000 0000 0002

### Test Details
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3-digit number (4 digits for Amex)
- **ZIP**: Any 5-digit number

## Features Included

### Frontend Components
- `StripeProvider`: Wraps the app with Stripe context
- `PaymentForm`: Secure card input with Stripe Elements
- Updated `Checkout`: Two-step checkout process

### Backend API
- `POST /create-payment-intent`: Creates payment intents
- `GET /health`: Health check endpoint
- Full error handling and validation

### Styling
- Luxury design matching the site's aesthetic
- Responsive design for all devices
- Smooth transitions and hover effects

## Production Notes

### Before Going Live
1. **Switch to Live Keys**: Replace test keys with live keys from Stripe
2. **Enable Webhooks**: Set up webhooks for order fulfillment
3. **SSL Certificate**: Ensure your site has a valid SSL certificate
4. **Test Thoroughly**: Test all payment scenarios

### Webhook Setup (Optional)
For production, set up webhooks to handle:
- Payment confirmations
- Failed payments
- Refunds
- Disputes

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For integration issues, check:
- Console logs for errors
- Network tab for API calls
- Stripe Dashboard for payment logs 