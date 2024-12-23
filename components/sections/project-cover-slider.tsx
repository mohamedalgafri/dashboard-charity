// components/sections/project-cover-slider.tsx
"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// استيراد ستايلات Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface ProjectCoverSliderProps {
    projects: {
        id: number;
        coverImage: string | null;
        title: string;
    }[];
}

export default function ProjectCoverSlider({ projects }: ProjectCoverSliderProps) {
    return (
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                className="w-full h-full rounded-lg"
            >
                {projects.map((project) => (
                    <SwiperSlide key={project.id}>
                        {project.coverImage ? (
                            <div className="relative w-full h-[250px] md:h-[300px] lg:h-[400px]">
                                <Image
                                    src={project.coverImage}
                                    alt={project.title}
                                    fill
                                    className="object-cover rounded-lg"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-full h-[250px] md:h-[300px] lg:h-[400px] bg-gray-200 rounded-lg" />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

    );
}