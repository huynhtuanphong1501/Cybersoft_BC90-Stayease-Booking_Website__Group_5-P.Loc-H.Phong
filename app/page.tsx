"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "animate.css";

import HomeHeader from "./components/HomeHeader";
import HomeFooter from "./components/HomeFooter";
import BackToTopButton from "./components/BackToTop";
import DestinationBar from "./(pages)/home/destinationBar";
import SocialMedia from "./components/SocialMedia";

const Home = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [homeReady, setHomeReady] = useState(false);

  const [heroRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5200, stopOnInteraction: false })]
  );

  useEffect(() => {
    import("wowjs/dist/wow").then((module) => {
      const WOW = module.WOW;
      new WOW({
        live: false,
        offset: 80,
      }).init();
    });

    const t = setTimeout(() => setSplashDone(true), 80);
    return () => clearTimeout(t);
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
            <div className="absolute inset-0 overflow-hidden" ref={heroRef}>
              <div className="flex h-full">
                <div className="flex-[0_0_100%] h-full">
                  <img src="/img/Carousel/carousel1.jpg" className="w-full h-full object-cover animate__animated animate__fadeIn" />
                </div>
                <div className="flex-[0_0_100%] h-full">
                  <img src="/img/Carousel/carousel2.jpg" className="w-full h-full object-cover animate__animated animate__fadeIn" />
                </div>
              </div>
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
                className="fixed left-1 bottom-[20%] z-10"
              >
                <SocialMedia />
              </motion.div>
            )}
          </section>

          <section className="w-full py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-white">
            <div className="app-container mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp">
                Explore Destinations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 xl:gap-10">
                <div className="h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 2xl:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0s">
                  <img src="/destinations/img1.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 2xl:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                  <img src="/destinations/img2.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 2xl:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                  <img src="/destinations/img3.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="h-52 sm:h-56 md:h-60 lg:h-64 xl:h-72 2xl:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0.6s">
                  <img src="/destinations/img4.jpg" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-white">
            <div className="app-container mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp">
                Amazing Experiences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
                <div className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0s">
                  <img src="/experiences/exp1.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                  <img src="/experiences/exp2.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="h-64 sm:h-72 md:h-80 lg:h-100 xl:h-112.5 2xl:h-125 rounded-2xl overflow-hidden shadow-md bg-gray-200 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                  <img src="/experiences/exp3.jpg" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 bg-[#F5F5F5]">
            <div className="app-container mx-auto">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-500 mb-4 xl:mb-6 uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-center wow animate__animated animate__fadeInUp">
                Open your door to over 50 million travellers
              </h3>

              <p className="text-center text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-10 sm:mb-12 md:mb-14 lg:mb-16 xl:mb-20 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                Trusted by the world’s leading vacation rental and travel platforms
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-8 sm:gap-x-10 md:gap-x-12 lg:gap-x-14 xl:gap-x-16 gap-y-10 sm:gap-y-12 place-items-center">
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="0s">
                  <img src="/img/Partner/amivac.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                  <img src="/img/Partner/casevacanza.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                  <img src="/img/Partner/casmundo.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="0.6s">
                  <img src="/img/Partner/edomizil.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="0.8s">
                  <img src="/img/Partner/hometogo.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="1s">
                  <img src="/img/Partner/tripping.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
                <div className="wow animate__animated animate__fadeInUp" data-wow-delay="1.2s">
                  <img src="/img/Partner/vacances.png" className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14 object-contain" />
                </div>
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
