import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import './PaymentForm.css';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

// Country mapping for Stripe (full name to ISO code)
const getCountryCode = (countryName: string): string => {
  const countryMap: { [key: string]: string } = {
    'United States': 'US',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'France': 'FR',
    'Germany': 'DE',
    'Italy': 'IT',
    'Spain': 'ES',
    'Australia': 'AU',
  };
  
  return countryMap[countryName] || 'US'; // Default to US if not found
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  customerInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent on the backend
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
          metadata: {
            customer_email: customerInfo.email,
            customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            order_id: `order_${Date.now()}`,
          },
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        setIsProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${customerInfo.firstName} ${customerInfo.lastName}`,
              email: customerInfo.email,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                postal_code: customerInfo.zipCode,
                country: getCountryCode(customerInfo.country),
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'An error occurred during payment processing.');
        onPaymentError(stripeError.message || 'Payment failed');
      } else {
        // Payment succeeded
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-form__section">
        <h2 className="payment-form__title">Payment Information</h2>
        
        <div className="payment-form__card-element">
          <label className="payment-form__label">
            Card Information
          </label>
          <div className="payment-form__card-input">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="payment-form__error">
            {error}
          </div>
        )}

        <div className="payment-form__total">
          <div className="payment-form__total-label">Total:</div>
          <div className="payment-form__total-amount">${amount.toFixed(2)}</div>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="payment-form__submit"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm; 