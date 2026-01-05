"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "animate.css";

import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import BackToTopButton from "./components/BackToTop";
import DestinationBar from "./(pages)/home/destinationBar";
import SocialMedia from "./components/SocialMedia";
import { TCity } from "./type";
import api from "./service/api";
import Link from "next/link";

const Home = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [homeReady, setHomeReady] = useState(false);
  const [cities, setCities] = useState<TCity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [heroRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5200, stopOnInteraction: false }),
  ]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  useEffect(() => {
    import("wowjs/dist/wow").then((module) => {
      const WOW = module.WOW;
      new WOW({
        live: false,
        offset: 80,
      }).init();
    });

    const t = setTimeout(() => setSplashDone(true), 80);

    const fetchCities = async () => {
      try {
        const response = await api.get("vi-tri");
        setCities(response?.data?.content || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCities();

    return () => clearTimeout(t);
  }, []);

  const groupedCities = useMemo(() => {
    const map = new Map<string, any>();
    cities.forEach((city) => {
      const key = `${city.quocGia}-${city.tinhThanh}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          quocGia: city.quocGia,
          tinhThanh: city.tinhThanh,
          hinhAnh: city.hinhAnh,
          locations: [{ id: city.id, name: city.tenViTri }],
        });
      } else {
        map.get(key).locations.push({
          id: city.id,
          name: city.tenViTri,
        });
      }
    });
    return Array.from(map.values());
  }, [cities]);

  const renderExploreDestination = () => {
    return groupedCities.slice(0, 6).map((group, index) => (
      <div
        key={group.key}
        className="wow animate__animated animate__fadeInUp group relative h-64 sm:h-72 lg:h-80 overflow-hidden shadow-lg cursor-pointer"
        data-wow-delay={`${index * 0.1}s`}
      >
        <img
          src={group.hinhAnh || "/destinations/img1.jpg"}
          alt={group.tinhThanh}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <h3 className="text-white text-3xl font-bold">{group.tinhThanh}</h3>
          <span className="text-white text-xl italic">{group.quocGia}</span>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/2 bg-white text-black backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out p-5">
          <p className="text-sm font-semibold mb-3 uppercase tracking-wide">
            Popular locations
          </p>
          <ul className="text-sm space-y-2 overflow-y-auto max-h-full pr-1">
            {group.locations.map((loc: any) => (
              <Link
                key={loc.id}
                href={`/${loc.id}`}
                className="flex text-black items-center gap-2 hover:text-[#7D6834] transition-all duration-300"
              >
                {loc.name}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-[#C6C6C6] via-[#8D8D8D] to-[#383838] relative overflow-hidden">
      <div className="fixed inset-0 z-50 pointer-events-none">
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
            <div className="absolute inset-0 overflow-hidden" ref={heroRef}>
              <div className="flex h-full">
                <div className="flex-[0_0_100%] h-full">
                  <img
                    src="/img/Carousel/carousel1.jpg"
                    className="w-full h-full object-cover animate__animated animate__fadeIn"
                  />
                </div>
                <div className="flex-[0_0_100%] h-full">
                  <img
                    src="/img/Carousel/carousel2.jpg"
                    className="w-full h-full object-cover animate__animated animate__fadeIn"
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`
        h-2 rounded-full transition-all duration-300
        ${index === selectedIndex
                      ? "w-8 bg-white shadow-md"
                      : "w-2 bg-white/50 hover:bg-white/80"}
      `}
                />
              ))}
            </div>

            {homeReady && (
              <div className="absolute bottom-10 w-full left-0 z-10 animate__animated animate__fadeInUp">
                <div className="w-[90%] xl:w-[80%] 2xl:w-[85%] mx-auto">
                  <DestinationBar />
                </div>
              </div>
            )}

            {homeReady && (
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="fixed left-1 bottom-[20%] z-10"
              >
                <SocialMedia />
              </motion.div>
            )}
          </section>

          <section className="w-full py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
            <div className="app-container mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp">
                Explore Destinations
              </h2>
              <p className="text-center bg-[#1C1F35] text-white font-extralight text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 wow animate__animated animate__fadeInUp">
                From vibrant cities to peaceful retreats, explore destinations
                carefully selected to match every travel style.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 wow">
                {renderExploreDestination()}
              </div>
            </div>
          </section>

          <section className="w-full py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
            <div className="app-container mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp">
                Amazing Experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
                <div
                  className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp"
                  data-wow-delay="0s"
                >
                  <img src="/experiences/exp1.jpg" className="w-full h-full object-cover" />
                </div>
                <div
                  className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <img src="/experiences/exp2.jpg" className="w-full h-full object-cover" />
                </div>
                <div
                  className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <img src="/experiences/exp3.jpg" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 sm:py-16 lg:py-20 xl:py-24 bg-[#F5F5F5]">
            <div className="app-container mx-auto">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-500 mb-4 xl:mb-6 uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-center wow animate__animated animate__fadeInUp">
                Open your door to over 50 million travellers
              </h3>
              <p
                className="text-center text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp"
                data-wow-delay="0.2s"
              >
                Trusted by the world’s leading vacation rental and travel platforms
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-8 sm:gap-x-10 md:gap-x-12 lg:gap-x-14 xl:gap-x-16 gap-y-10 sm:gap-y-12 place-items-center">
                <img src="/img/Partner/amivac.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="0s" />
                <img src="/img/Partner/casevacanza.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="0.2s" />
                <img src="/img/Partner/casmundo.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="0.4s" />
                <img src="/img/Partner/edomizil.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="0.6s" />
                <img src="/img/Partner/hometogo.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="0.8s" />
                <img src="/img/Partner/tripping.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="1s" />
                <img src="/img/Partner/vacances.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 object-contain wow animate__animated animate__fadeInUp" data-wow-delay="1.2s" />
              </div>
            </div>
          </section>

          <BackToTopButton />
          <HomeFooter />
        </main>
      </motion.div>
    </div>
  );
};

export default Home;