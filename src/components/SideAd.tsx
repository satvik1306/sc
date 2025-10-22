import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function SideAd() {
  const [isInView, setIsInView] = useState(false);
  const sideAdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sideAdRef.current) {
      observer.observe(sideAdRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const magazineVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div 
      ref={sideAdRef}
      className="hidden lg:block space-y-2"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Magazine-style header */}
      <motion.div
        variants={magazineVariants}
        className="text-center mb-2"
      >
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5">
          FEATURED
          <br />
          <span className="text-primary">SHOWCASE</span>
        </h3>
        <div className="w-8 h-0.5 bg-primary mx-auto"></div>
      </motion.div>

      {/* Video showcase 1 */}
      <motion.div 
        variants={cardVariants}
        transition={{ delay: 0.2 }}
        className="group relative overflow-hidden rounded-lg shadow-2xl bg-card border-2 border-border/20 hover:border-primary/30 transition-all duration-500"
      >
        <div className="relative overflow-hidden">
          <video
            src={`${import.meta.env.BASE_URL}videos/sari3.mp4`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-1.5 md:p-2">
          <h4 className="text-xs font-bold mb-0.5 text-foreground">Dream Home</h4>
          <p className="text-xs text-muted-foreground leading-snug">
            Architectural reality through cutting-edge design.
          </p>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Featured Project</span>
            <div className="w-4 h-0.5 bg-primary"></div>
          </div>
        </div>
      </motion.div>

      {/* Video showcase 2 */}
      <motion.div 
        variants={cardVariants}
        transition={{ delay: 0.4 }}
        className="group relative overflow-hidden rounded-lg shadow-2xl bg-card border-2 border-border/20 hover:border-primary/30 transition-all duration-500"
      >
        <div className="relative overflow-hidden">
          <video
            src={`${import.meta.env.BASE_URL}videos/sari4.mp4`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-1.5 md:p-2">
          <h4 className="text-xs font-bold mb-0.5 text-foreground">Innovation</h4>
          <p className="text-xs text-muted-foreground leading-snug">
            Precision crafted with uncompromising quality.
          </p>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Excellence</span>
            <div className="w-4 h-0.5 bg-primary"></div>
          </div>
        </div>
      </motion.div>

      {/* Call-to-action magazine block */}
      <motion.div 
        variants={cardVariants}
        transition={{ delay: 0.6 }}
        className="bg-primary/5 border-2 border-primary/20 rounded-lg p-3 md:p-4 text-center hover:bg-primary/15 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
      >
        <h4 className="text-base md:text-lg font-bold mb-1.5 text-foreground">
          START YOUR
          <br />
          <span className="text-primary">JOURNEY</span>
        </h4>
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
          Ready to build your dream villa? Let's discuss your vision.
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">Consultation</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">Design</span>
          </div>
          <div className="flex items-center justify-center space-x-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">Construction</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
