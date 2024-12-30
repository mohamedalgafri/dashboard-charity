"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createDonation } from '@/actions/donation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DonationSchema } from '@/schemas';
import { Separator } from "@/components/ui/separator";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FormProvider } from "react-hook-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PREDEFINED_AMOUNTS = [10, 100, 200, 1000];

const fireConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    spread: 50,
    ticks: 100,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'],
    shapes: ['square'],
    scalar: 0.75,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
};

const PaymentForm = ({ form, isLoading, setIsLoading, isHomePage, projects }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const cardRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error("جاري تحميل نظام الدفع...");
      return;
    }

    const validationResult = await form.trigger();
    if (!validationResult) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      const formData = form.getValues();

      // إنشاء طريقة الدفع
      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.donorName,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (createError) {
        throw new Error(createError.message);
      }

      // إنشاء التبرع
      const donationResponse = await createDonation({
        ...formData,
        paymentMethodId: paymentMethod.id
      });

      if (!donationResponse.success) {
        throw new Error(donationResponse.message);
      }

      // الحصول على Client Secret
      const paymentResponse = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          donationId: donationResponse.donation.id,
          paymentMethodId: paymentMethod.id
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('فشل في تجهيز عملية الدفع');
      }

      const { clientSecret } = await paymentResponse.json();

      // تأكيد الدفع
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: paymentMethod.id }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        fireConfetti();
        toast.success("تم التبرع بنجاح");
        form.reset();
        elements.getElement(CardElement)?.clear();
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.message || "حدث خطأ في عملية الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isHomePage && projects?.length > 0 && (
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اختر الحملة</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl dir="rtl">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحملة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent dir="rtl">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {PREDEFINED_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant={form.watch("amount") === amount ? "default" : "outline"}
              className="w-full"
              onClick={() => form.setValue("amount", amount)}
            >
              ${amount}
            </Button>
          ))}
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مبلغ آخر</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="أدخل قيمة التبرع"
                    min="1"
                    className="pl-7"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="donorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسمك" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@domain.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رسالة (اختياري)</FormLabel>
              <FormControl>
                <Textarea placeholder="اكتب رسالتك هنا" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel style={{ marginTop: 0 }}>تبرع بشكل مجهول</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h3 className="text-lg font-medium">معلومات البطاقة</h3>
        </div>
        
        <div className="border rounded-lg p-6 bg-card">
          <CardElement 
            ref={cardRef}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  fontFamily: 'Inter, sans-serif',
                }
              },
              hidePostalCode: true,
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Lock className="h-4 w-4" />
            <span>جميع المعاملات آمنة ومشفرة</span>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-lg"
        disabled={!stripe || !cardComplete || isLoading}
      >
        {isLoading ? "جاري إتمام عملية التبرع..." : "تبرع الآن"}
      </Button>
    </form>
  );
};

const DonationForm = ({ selectedProject, projects, className = "", isHomePage = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      projectId: selectedProject?.id || "",
      amount: 0,
      donorName: "",
      email: "",
      phone: "",
      message: "",
      anonymous: false,
    }
  });

  return (
    <Elements stripe={stripePromise}>
      <Card className={className}>
        <CardHeader>
          <CardTitle>تبرع الآن</CardTitle>
          <CardDescription>
            {selectedProject ? `تبرع لحملة: ${selectedProject.title}` : 'ادعم الحملة بتبرعك الكريم'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <PaymentForm 
              form={form} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isHomePage={isHomePage}
              projects={projects}
            />
          </FormProvider>
        </CardContent>
      </Card>
    </Elements>
  );
};

export default DonationForm;