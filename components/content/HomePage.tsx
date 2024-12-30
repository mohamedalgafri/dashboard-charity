"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import DonationForm from '@/components/forms/DonationForm';
import ProjectsSlider from '@/components/content/ProjectsSlider';
import ProjectCoverSlider from '@/components/sections/project-cover-slider';

const HomePage = ({ projects, projectsWithCovers, availableProjects }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    // إعداد IntersectionObserver مع خيارات محسنة
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            // إلغاء مراقبة العنصر بعد ظهوره
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // تحديد جميع العناصر التي تحتاج إلى انيميشن
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen ">
      {/* القسم الرئيسي */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 " />
        
        <MaxWidthWrapper className="relative h-full">
          <div className="flex flex-col md:flex-row items-center justify-between min-h-screen py-20">
            <div className="w-full md:w-1/2 text-white space-y-6 animate-on-scroll">
              <h1 className="text-4xl md:text-6xl font-bold">
                مؤسسة العطاء
              </h1>
              <p className="text-xl md:text-2xl">
                معًا نبني مستقبلاً مشرقًا عبر نشر روح التكافل والعطاء
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="#donate">
                  تبرع الان
                </Link>
              </Button>
            </div>
            
            <div className="w-full md:w-1/2 mt-8 md:mt-0 animate-on-scroll">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <ProjectCoverSlider projects={projectsWithCovers} />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* قسم المشاريع المميزة */}
      {projects && projects.length > 0 && (
        <section className="py-20 ">
          <MaxWidthWrapper>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold animate-on-scroll">الحملات المميزة</h2>
              <Button variant="outline" className="animate-on-scroll">
                <Link href="/projects">
                  عرض جميع الحملات
                </Link>
              </Button>
            </div>
            <div className="animate-on-scroll">
              <ProjectsSlider projects={projects} />
            </div>
          </MaxWidthWrapper>
        </section>
      )}

      {/* قسم التبرع */}
      <section className="py-20" id="donate">
        <MaxWidthWrapper>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 animate-on-scroll">ساهم في التغيير</h2>
            <div className="animate-on-scroll">
              {availableProjects.length > 0 ? (
                <DonationForm projects={availableProjects} isHomePage={true} />
              ) : (
                <p className="text-center text-gray-600">لا توجد مشاريع متاحة للتبرع حالياً</p>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* قسم الإحصائيات */}
      <section className="py-16 bg-purple-600 text-white">
        <MaxWidthWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 animate-on-scroll">
              <h3 className="text-4xl font-bold mb-2">+1000</h3>
              <p className="text-lg">مشروع تم دعمه</p>
            </div>
            <div className="p-6 animate-on-scroll">
              <h3 className="text-4xl font-bold mb-2">+5000</h3>
              <p className="text-lg">متبرع</p>
            </div>
            <div className="p-6 animate-on-scroll">
              <h3 className="text-4xl font-bold mb-2">+100k</h3>
              <p className="text-lg">قيمة التبرعات</p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
};

export default HomePage;