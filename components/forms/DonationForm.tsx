"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import { createDonation } from '@/actions/donation';

interface Project {
  id: number;
  title: string;
}

interface DonationFormProps {
  selectedProject?: Project;
  projects?: Project[];
  className?: string;
}

const DonationForm = ({ selectedProject, projects, className = "" }: DonationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectId: selectedProject?.id || "",
    amount: "",
    donorName: "",
    email: "",
    phone: "",
    message: "",
    anonymous: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // تأكد من أن projectId رقم وليس نص
      const donationData = {
        ...formData,
        projectId: Number(formData.projectId),
        amount: Number(formData.amount)
      };

      const response = await createDonation(donationData);

      if (response.success) {
        toast.success(response.message);
        // تصفير النموذج
        setFormData({
          projectId: selectedProject?.id.toString() || "",
          amount: "",
          donorName: "",
          email: "",
          phone: "",
          message: "",
          anonymous: false
        });
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
        <CardDescription>ادعم المشروع بتبرعك الكريم</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedProject && projects && (
            <div className="space-y-2">
              <Label htmlFor="project">اختر المشروع</Label>
              <Select
                value={String(formData.projectId)}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">قيمة التبرع</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="أدخل قيمة التبرع"
              min="1"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donorName">الاسم</Label>
            <Input
              id="donorName"
              value={formData.donorName}
              onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
              placeholder="أدخل اسمك"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="أدخل بريدك الإلكتروني"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="أدخل رقم هاتفك"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">رسالة (اختياري)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="اكتب رسالتك هنا"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, anonymous: checked as boolean }))
              }
              disabled={isLoading}
            />
            <Label htmlFor="anonymous">
              تبرع بشكل مجهول
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري إرسال التبرع..." : "تبرع الآن"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;