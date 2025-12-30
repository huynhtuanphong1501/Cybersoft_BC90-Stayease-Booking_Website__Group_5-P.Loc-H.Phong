"use client";

import { useEffect, useState } from "react";
import WOW from "wowjs/dist/wow";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "animate.css";

import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import BackToTopButton from "./components/BackToTop";
import DestinationBar from "./destinationBar";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [homeReady, setHomeReady] = useState(false);

  useEffect(() => {
    let wow: any;

    import("wowjs/dist/wow").then((module) => {
      const WOW = module.WOW;
      wow = new WOW({ live: false, offset: 80 });
      wow.init();
    });

    const t = setTimeout(() => setSplashDone(true), 80);

    return () => {
      clearTimeout(t);
      wow = null;
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-[#C6C6C6] via-[#8D8D8D] to-[#383838] relative overflow-hidden">

      <div className="fixed inset-0 z-100 pointer-events-none">
        <motion.div
          initial={{ y: 0 }}
          animate={splashDone ? { y: "-100%" } : {}}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-0 left-0 w-full h-1/2 bg-[#1C1C1C]"
        />
        <motion.div
          initial={{ y: 0 }}
          animate={splashDone ? { y: "100%" } : {}}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-0 left-0 w-full h-1/2 bg-[#1C1C1C]"
        />
      </div>

      <motion.div
        className="relative w-full bg-white origin-center"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={splashDone ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => setHomeReady(true)}
      >
        <HomeHeader isHome homeAnimationDone={homeReady} />

        <main className="w-full">

          <section className="relative h-screen">
            <div className="absolute inset-0">
              <Swiper
                modules={[Autoplay, Pagination]}
                loop
                autoplay={{ delay: 5200 }}
                pagination={{ clickable: true }}
                className="w-full h-full"
              >
                <SwiperSlide>
                  <img src="/img/Carousel/carousel1.jpg" className="w-full h-full object-cover animate__animated animate__fadeIn" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/img/Carousel/carousel2.jpg" className="w-full h-full object-cover animate__animated animate__fadeIn" />
                </SwiperSlide>
              </Swiper>
            </div>

            {homeReady && (
              <div className="absolute bottom-10 left-0 w-full z-1">
                <div className="bg-white rounded-full shadow-2xl py-6 container mx-auto">
                  <div className="container mx-auto">
                    <DestinationBar />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="w-full py-28 bg-gray-50 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 wow animate__animated animate__fadeInUp">
              Explore Destinations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__zoomIn animate__slow">
                <img src="/destinations/img1.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__zoomIn animate__slow" data-wow-delay="0.1s">
                <img src="/destinations/img2.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__zoomIn animate__slow" data-wow-delay="0.2s">
                <img src="/destinations/img3.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__zoomIn animate__slow" data-wow-delay="0.3s">
                <img src="/destinations/img4.jpg" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          <section className="w-full py-28 bg-white px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 wow animate__animated animate__fadeInUp">
              Amazing Experiences
            </h2>

            <div className="flex gap-6 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
              <div className="min-w-[80%] md:min-w-[30%] h-80 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInLeft animate__slow">
                <img src="/experiences/exp1.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-[80%] md:min-w-[30%] h-80 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp animate__slow">
                <img src="/experiences/exp2.jpg" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-[80%] md:min-w-[30%] h-80 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInRight animate__slow">
                <img src="/experiences/exp3.jpg" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          <section className="w-full py-28 bg-gray-100 overflow-hidden">
            <h3 className="text-xl text-gray-500 mb-16 uppercase tracking-[0.3em] font-medium text-center wow animate__animated animate__fadeInUp">
              Our Partners
            </h3>

            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={80}
              loop
              speed={12000}
              allowTouchMove={false}
              autoplay={{ delay: 0, disableOnInteraction: false }}
              className="w-full"
            >
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/expedia.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/visa.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/mastercard.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/paypal.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/airbnb.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/expedia.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/visa.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/mastercard.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/paypal.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
              <SwiperSlide className="w-auto! flex items-center wow animate__animated animate__fadeIn">
                <img src="/img/Partner/airbnb.png" className="h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              </SwiperSlide>
            </Swiper>
          </section>

          <div className="relative bg-white">
            <BackToTopButton />
            <HomeFooter />
          </div>

        </main>
      </motion.div>
    </div>
  );
}
