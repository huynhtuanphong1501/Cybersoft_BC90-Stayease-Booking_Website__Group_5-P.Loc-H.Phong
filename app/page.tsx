"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "animate.css";

import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
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
    import('wowjs').then((WOW) => {
      new WOW.WOW({
        live: false
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

  const renderLocationBanner = () => {
    const validGroups = groupedCities.filter(
      (item) => item?.hinhAnh && item.hinhAnh.trim() !== ""
    );

    return validGroups.map((group, index) => (
      <div
        key={group.key || index}
        ref={heroRef}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="flex h-full">
          {validGroups.map((group) => (
            <div
              key={group?.key}
              className="flex-[0_0_100%] h-full relative"
            >
              <img
                src={group.hinhAnh || "/img/Carousel/carousel1.jpg"}
                className="w-full h-full object-cover"
              />

              <div className="hidden absolute inset-0 bg-black/20 lg:flex flex-col items-start text-white justify-center">
                <h2 className="text-6xl xl:text-8xl font-light px-12 xl:px-15 animate__animated animate__animate__fadeInUp animate__delay-3s">
                  {group.tinhThanh}
                </h2>
                <p className="text-2xl xl:text-4xl italic animate__animated px-12 xl:px-15 animate__animate__fadeInUp animate__delay-4s">
                  {group.quocGia}
                </p>

                <div className="w-16 h-1 bg-primary mt-4 rounded-full shadow-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

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
    return groupedCities.slice(0, 6).map((group) => (
      <div
        key={group.key}
        className="wow animate__animated animate__fadeInUp group relative h-64 sm:h-72 lg:h-80 overflow-hidden shadow-lg cursor-pointer"
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

        <div className="absolute top-0 right-0 h-full w-1/2 bg-white text-black backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out p-5 flex flex-col">

          <p className="text-sm font-semibold mb-3 uppercase tracking-wide">
            Popular locations
          </p>

          <ul className="
    text-sm space-y-2 pr-1
    overflow-y-auto
    flex-1
    max-h-full
  ">
            {group.locations.map((loc: any) => (
              <Link
                key={loc.id}
                href={`/${loc.id}`}
                className="flex text-black items-center gap-2 hover:text-[#a50000] hover:font-bold transition-all duration-300"
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
      <div className="fixed inset-0 z-1 pointer-events-none">
        <motion.div
          initial={{ y: 0 }}
          animate={splashDone ? { y: "-100%" } : {}}
          transition={{ duration: 0.45, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-1/2 bg-[#1C1C1C]"
        />

        <motion.div
          initial={{ y: 0 }}
          animate={splashDone ? { y: "100%" } : {}}
          transition={{ duration: 0.45, ease: "linear" }}
          className="absolute bottom-0 left-0 w-full h-1/2 bg-[#1C1C1C]"
        />
      </div>

      <motion.div
        className="relative w-full bg-white origin-center"
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={splashDone ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => setHomeReady(true)}
      >
        <HomeHeader isHome homeAnimationDone={homeReady} />

        <main className="w-full">
          <section className="relative h-[75vh] sm:h-[85vh] lg:h-screen max-h-225">
            <div className="absolute inset-0 overflow-hidden" ref={heroRef}>
              <div className="flex h-full">
                {renderLocationBanner()}
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`
        h-2 rounded-full transition-all duration-300
        ${index === selectedIndex
                      ? "w-8 bg-white shadow-lg"
                      : "w-2 bg-white/50 hover:bg-white"}
      `}
                />
              ))}
            </div>

            {homeReady && (
              <div className="absolute bottom-10 w-full left-0 z-1 animate__animated animate__fadeInUp">
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
                className="fixed left-1 bottom-[20%] z-1"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden">

                <div className="wow animate__animated animate__fadeInUp relative aspect-square overflow-hidden group cursor-pointer" data-wow-delay="0s">
                  <img
                    src="/img/Experience/northern.jpg"
                    alt="Northern Heritage"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex flex-col justify-end text-center p-4 sm:p-6 lg:p-4 xl:p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/90 text-[10px] tracking-[0.2em] mb-1 uppercase">
                        Experience
                      </p>
                      <h3 className="text-white font-bold text-base sm:text-lg lg:text-base xl:text-xl leading-tight uppercase mb-1">
                        Northern Heritage
                      </h3>
                      <p className="text-white/80 text-[10px] sm:text-xs italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-1">
                        Old Quarters & Mountain Views
                      </p>
                    </div>
                  </div>
                </div>

                <div className="wow animate__animated animate__fadeInUp relative aspect-square overflow-hidden group cursor-pointer" data-wow-delay="0.1s">
                  <img
                    src="/img/Experience/hoiAn.jpg"
                    alt="Central Coastal"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex flex-col justify-end text-center p-4 sm:p-6 lg:p-4 xl:p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/90 text-[10px] tracking-[0.2em] mb-1 uppercase">
                        Experience
                      </p>
                      <h3 className="text-white font-bold text-base sm:text-lg lg:text-base xl:text-xl leading-tight uppercase mb-1">
                        Central Coastal Escape
                      </h3>
                      <p className="text-white/80 text-[10px] sm:text-xs italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-1">
                        Beach Houses & Heritage Towns
                      </p>
                    </div>
                  </div>
                </div>

                <div className="wow animate__animated animate__fadeInUp relative aspect-square overflow-hidden group cursor-pointer" data-wow-delay="0.2s">
                  <img
                    src="/img/Experience/southern.webp"
                    alt="Southern City"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex flex-col justify-end text-center p-4 sm:p-6 lg:p-4 xl:p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/90 text-[10px] tracking-[0.2em] mb-1 uppercase">
                        Experience
                      </p>
                      <h3 className="text-white font-bold text-base sm:text-lg lg:text-base xl:text-xl leading-tight uppercase mb-1">
                        Southern City Life
                      </h3>
                      <p className="text-white/80 text-[10px] sm:text-xs italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-1">
                        Modern Stays & Nightlife
                      </p>
                    </div>
                  </div>
                </div>

                <div className="wow animate__animated animate__fadeInUp relative aspect-square overflow-hidden group cursor-pointer" data-wow-delay="0.3s">
                  <img
                    src="/img/Experience/island.jpg"
                    alt="Island Retreats"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex flex-col justify-end text-center p-4 sm:p-6 lg:p-4 xl:p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white/90 text-[10px] tracking-[0.2em] mb-1 uppercase">
                        Experience
                      </p>
                      <h3 className="text-white font-bold text-base sm:text-lg lg:text-base xl:text-xl leading-tight uppercase mb-1">
                        Island Retreats
                      </h3>
                      <p className="text-white/80 text-[10px] sm:text-xs italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-1">
                        Tropical Villas & Ocean Breeze
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="w-full py-12 sm:py-16 lg:py-20 xl:py-24 bg-white">
            <div className="app-container mx-auto">

              <div className="flex justify-between items-end mb-12 md:mb-16 wow animate__animated animate__fadeInUp">
                <div className="text-left">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-slate-900">
                    Blogs
                  </h2>
                  <div className="w-12 h-0.5 bg-rose-800 mt-4"></div>
                </div>

                <Link
                  href="/blogs"
                  className="mt-6 sm:mt-0 group flex items-center text-[11px] uppercase tracking-[0.3em] font-bold text-slate-900 hover:text-rose-800 transition-colors"
                >
                  Explore All
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">

                {/* Card 1 */}
                <article className="group wow animate__animated animate__fadeInUp" data-wow-delay="0s">
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                    <img
                      src="/img/Blogs/hoiAn.jpg"
                      alt="Hoi An"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-800 block opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      Heritage Guide
                    </span>
                    <h3 className="text-xl font-serif leading-snug group-hover:text-slate-600 transition-colors duration-300 min-h-14 lg:min-h-18 xl:min-h-20">
                      7 Perfect Days in the Heart of Ancient Hoi An
                    </h3>

                    <div className="flex justify-center">
                      <button className="relative flex items-center justify-center text-[11px] uppercase tracking-widest font-bold border-b border-slate-900 pb-1 group/btn cursor-pointer hover:border-[#E76F51] transition-all duration-300">
                        <span className="group-hover/btn:text-[#E76F51] transition-all duration-300 cursor-pointer">
                          Read More
                        </span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Card 2 */}
                <article className="group wow animate__animated animate__fadeInUp" data-wow-delay="0.1s">
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                    <img
                      src="/img/Blogs/The Ultimate Lunar New Year Escapes 2026.webp"
                      alt="Lunar New Year"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>

                  <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-800 block opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      Seasonal Experience
                    </span>
                    <h3 className="text-xl font-serif leading-snug group-hover:text-slate-600 transition-colors duration-300 min-h-14 lg:min-h-18 xl:min-h-20">
                      The Ultimate Lunar New Year Escapes 2026
                    </h3>
                    <div className="flex justify-center">
                      <button className="relative flex items-center justify-center text-[11px] uppercase tracking-widest font-bold border-b border-slate-900 pb-1 group/btn cursor-pointer hover:border-[#E76F51] transition-all duration-300">
                        <span className="group-hover/btn:text-[#E76F51] transition-all duration-300 cursor-pointer">
                          Read More
                        </span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Card 3 */}
                <article className="group wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                    <img
                      src="/img/Blogs/SaPa.jpg"
                      alt="Sapa"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-800 block opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      Mountain Luxury
                    </span>
                    <h3 className="text-xl font-serif leading-snug group-hover:text-slate-600 transition-colors duration-300 min-h-14 lg:min-h-18 xl:min-h-20">
                      Beyond the Clouds: Private Retreats in Sapa
                    </h3>
                    <div className="flex justify-center">
                      <button className="relative flex items-center justify-center text-[11px] uppercase tracking-widest font-bold border-b border-slate-900 pb-1 group/btn cursor-pointer hover:border-[#E76F51] transition-all duration-300">
                        <span className="group-hover/btn:text-[#E76F51] transition-all duration-300 cursor-pointer">
                          Read More
                        </span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Card 4 */}
                <article className="group wow animate__animated animate__fadeInUp" data-wow-delay="0.3s">
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                    <img
                      src="/img/Blogs/The Colonial Charm of Hanoi.jpg"
                      alt="Hanoi"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 space-y-2 sm:space-y-3 md:space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-800 block opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      Urban Discovery
                    </span>
                    <h3 className="text-xl font-serif leading-snug group-hover:text-slate-600 transition-colors duration-300 min-h-14 lg:min-h-18 xl:min-h-20">
                      LockWind City Guide | The Colonial Charm of Hanoi
                    </h3>
                    <div className="flex justify-center">
                      <button className="relative flex items-center justify-center text-[11px] uppercase tracking-widest font-bold border-b border-slate-900 pb-1 group/btn cursor-pointer hover:border-[#E76F51] transition-all duration-300">
                        <span className="group-hover/btn:text-[#E76F51] transition-all duration-300 cursor-pointer">
                          Read More
                        </span>
                      </button>
                    </div>
                  </div>
                </article>

              </div>

              <div className="mt-4 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20 text-center wow animate__animated animate__fadeInUp">
                <Link
                  href={"/blogs"}
                  className="px-12 py-4 border border-slate-200 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl"
                >
                  Load More
                </Link>
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

          <HomeFooter />
        </main>
      </motion.div >
    </div >
  );
};

export default Home;