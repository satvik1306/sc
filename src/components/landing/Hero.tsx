import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Watermark } from "@/components/Watermark";
import { MovingHeadlines } from "@/components/MovingHeadlines";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showMagazineLayout, setShowMagazineLayout] = useState(false);

  const isInView = useInView(sectionRef, { amount: 0.6 });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [isInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      // Start transition after 2.5 seconds for smoother experience
      if (currentTime >= 2.5 && !videoCompleted) {
        setVideoCompleted(true);
        // Start layout transition with slight delay for better coordination
        setTimeout(() => setShowMagazineLayout(true), 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoCompleted]);

  const handleVideoEnd = () => {
    // Ensure the transition is complete when video ends
    if (!videoCompleted) {
      setVideoCompleted(true);
      setShowMagazineLayout(true);
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden transition-smooth"
    >
      {/* Background overlay */}
      <div className={`absolute inset-0 bg-black/50 z-10 transition-all duration-1200 ease-in-out ${
        showMagazineLayout ? 'bg-black/30' : ''
      }`} />

      {/* Text background overlay for magazine layout */}
      <motion.div
        className="absolute left-0 top-0 w-full lg:w-1/2 h-full bg-white/85 backdrop-blur-sm z-15 hover:bg-white transition-all duration-300 transition-smooth"
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: showMagazineLayout ? 1 : 0,
          x: showMagazineLayout ? 0 : -100
        }}
        transition={{ 
          duration: 1.0, 
          ease: "easeInOut",
          delay: showMagazineLayout ? 0.3 : 0
        }}
      />

      {/* Video container with dynamic sizing */}
      <motion.div
        className="absolute z-0"
        initial={{ 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%" 
        }}
        animate={{
          top: showMagazineLayout ? "0%" : 0,
          left: showMagazineLayout ? "50%" : 0,
          width: showMagazineLayout ? "50%" : "100%",
          height: showMagazineLayout ? "100%" : "100%"
        }}
        transition={{ 
          duration: 1.2, 
          ease: "easeInOut",
          delay: showMagazineLayout ? 0.3 : 0
        }}
      >
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src="/videos/bg_video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="absolute inset-0 z-20">
        {/* Initial centered content */}
        <motion.div
          className="flex items-center justify-center h-full px-4"
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: showMagazineLayout ? 0 : 1,
            scale: showMagazineLayout ? 0.9 : 1
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="container text-center text-white px-4 max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.5 }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight font-content leading-tight">
              Where Luxury Meets Mindful Living
            </h1>
          </motion.div>
        </motion.div>

        {/* Magazine-style layout */}
        <motion.div
          className="absolute inset-0 flex items-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ 
            opacity: showMagazineLayout ? 1 : 0,
            x: showMagazineLayout ? 0 : -100
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeInOut",
            delay: showMagazineLayout ? 0.5 : 0
          }}
        >
          <div className="w-full lg:w-1/2 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-black pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24">
            <motion.h1 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-normal leading-tight mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-black font-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: showMagazineLayout ? 1 : 0,
                y: showMagazineLayout ? 0 : 30
              }}
              transition={{ delay: 0.8, duration: 1.0, ease: "easeInOut" }}
            >
              WE BUILD
              <br />
              <span className="text-primary">WITH OUR HEART,</span>
              <br />
              NOT JUST CONCRETE.
            </motion.h1>
            
            <motion.div
              className="space-y-3 sm:space-y-4 md:space-y-5 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: showMagazineLayout ? 1 : 0,
                y: showMagazineLayout ? 0 : 30
              }}
              transition={{ delay: 1.0, duration: 1.0, ease: "easeInOut" }}
            >
              <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-content leading-relaxed">
                Luxury isn't just a finish. It's a feeling that runs through every detail. 
                We build for moments, for silence, for stillness, for space.
              </p>
              
              <p className="text-black text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-content leading-relaxed">
                For those who have stopped searching, because what they were looking for is finally here.
              </p>
            </motion.div>

            {/* Buttons positioned vertically on extreme left */}
            <motion.div
              className="flex flex-col space-y-3 sm:space-y-4 w-full max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: showMagazineLayout ? 1 : 0,
                y: showMagazineLayout ? 0 : 30
              }}
              transition={{ delay: 1.2, duration: 1.0, ease: "easeInOut" }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full min-h-[48px] px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg touch-manipulation"
              >
                <a href="#projects">
                  Explore Portfolio <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-black text-black bg-white/90 hover:bg-white hover:text-white w-full min-h-[48px] px-4 sm:px-6 md:px-8 backdrop-blur-sm text-sm sm:text-base md:text-lg hover:border-primary transition-all duration-300 touch-manipulation"
              >
                <a href="#contact">Start Your Project</a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Global watermark - appears after magazine layout transition */}
      {showMagazineLayout && <Watermark />}

      {/* Moving Headline */}
      {showMagazineLayout && (
        <motion.div
          className="absolute bottom-20 xs:bottom-24 sm:bottom-28 md:bottom-32 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1.0, ease: "easeInOut" }}
        >
          <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border border-primary/30 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
            <MovingHeadlines 
              headlines={["Afford Luxury or Deserve It?"]}
              className="text-white"
              fontSize="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
            />
          </div>
        </motion.div>
      )}

      {/* Scroll to Explore Indicator */}
      {showMagazineLayout && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1.0, ease: "easeInOut" }}
        >
          <motion.button
            onClick={() => {
              const aboutSection = document.getElementById('about');
              aboutSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center space-y-2 text-white hover:text-primary transition-colors group"
            whileHover={{ y: -3 }}
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-sm font-medium opacity-80 group-hover:opacity-100">Scroll to Explore</span>
            <div className="w-8 h-8 border-2 border-white group-hover:border-primary rounded-full flex items-center justify-center">
              <ChevronDown className="w-4 h-4" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};
