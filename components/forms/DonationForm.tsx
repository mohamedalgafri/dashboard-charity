"use client";

import React, { useState } from 'react';
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonationSchema, DonationType } from '@/schemas';
import confetti from 'canvas-confetti';


interface Project {
 id: number;
 title: string;
}

interface DonationFormProps {
 selectedProject?: Project;
 projects?: Project[];
 className?: string;
}

const PREDEFINED_AMOUNTS = [10, 100, 200, 1000];

const DonationForm = ({ selectedProject, projects, className = "" }: DonationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DonationType>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      projectId: selectedProject?.id?.toString() || "",
      amount: "",
      donorName: "",
      email: "",
      phone: "",
      message: "",
      anonymous: false
    }
  });

  const handleAmountSelect = (amount: number) => {
    form.setValue("amount", amount.toString());
  };


  const onSubmit = async (data: DonationType) => {
    setIsLoading(true);
  
    try {
      const response = await createDonation(data);
  
      if (response.success) {
        // تأثير confetti أكثر واقعية
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
  
        function fire(particleRatio: number, opts: any) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }
  
        // تشغيل التأثير من عدة زوايا
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
  
        fire(0.2, {
          spread: 60,
        });
  
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
  
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
  
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
  
        toast.success(response.message);
        form.reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("حدث خطأ أثناء إضافة التبرع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>تبرع الآن</CardTitle>
        <CardDescription>ادعم الحملة بتبرعك الكريم</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!selectedProject && projects && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اختر الحملة</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحملة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={String(project.id)}>
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
                    variant={form.watch("amount") === amount.toString() ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleAmountSelect(amount)}
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
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="أدخل بريدك الإلكتروني" {...field} disabled={isLoading} />
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
                    <Input type="tel" placeholder="أدخل رقم هاتفك" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>تبرع بشكل مجهول</FormLabel>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "جاري إرسال التبرع..." : "تبرع الآن"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;