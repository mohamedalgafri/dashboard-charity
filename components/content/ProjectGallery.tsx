'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

// Import required Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface GalleryImage {
  id: number;
  url: string;
  order: number | null;
}

interface ProjectGalleryProps {
  coverImage?: string | null;
  images: GalleryImage[];
  title: string;
}

export default function ProjectGallery({ coverImage, images, title }: ProjectGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Combine cover image with other images
  const allImages = [
    ...(coverImage ? [{ id: 0, url: coverImage, order: -1 }] : []),
    ...images,
  ];

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Swiper */}
      <Swiper
        spaceBetween={10}
        navigation={allImages.length > 1}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        
        className="h-[250px] md:h-[300px] lg:h-[350px] rounded-lg"
      >
        {allImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <img
                src={image.url}
                alt={`${title} - صورة ${image.id}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs Swiper */}
      {allImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={2}
          freeMode={true}
          watchSlidesProgress={true}
          breakpoints={{
            450: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
        }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper h-24"
        >
          {allImages.map((image) => (
            <SwiperSlide key={image.id} className="w-24 h-24">
              <div className="relative w-full h-full cursor-pointer">
                <img
                  src={image.url}
                  alt={`${title} - مصغرة ${image.id}`}
                  className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}