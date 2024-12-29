import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements } from '@stripe/react-stripe-js'; 
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; 
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const StripePaymentForm = ({ 
  clientSecret, 
  amount,
  onSuccess,
  onError 
}: { 
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (confirmError) {
        setError(confirmError.message || "حدث خطأ في عملية الدفع");
        onError(confirmError.message || "حدث خطأ في عملية الدفع");
      } else {
        onSuccess();
      }
    } catch (error) {
      setError("حدث خطأ في عملية الدفع");
      onError("حدث خطأ في عملية الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <CardElement options={{
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
          }} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!stripe || isLoading}
        >
          {isLoading ? "جاري المعالجة..." : `ادفع ${amount}$`}
        </Button>
      </div>
    </form>
  );
};

const StripePaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  amount,
  onSuccess,
  onError
}: {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إتمام عملية الدفع</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <StripePaymentForm 
            clientSecret={clientSecret} 
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentModal;