import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MovingHeadlinesProps {
  headlines: string[];
  className?: string;
  speed?: number;
  fontSize?: string;
}

export function MovingHeadlines({ 
  headlines, 
  className = "", 
  speed = 50,
  fontSize = "text-xl"
}: MovingHeadlinesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Only cycle through headlines if there are multiple
    if (headlines.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 4000); // Change headline every 4 seconds

    return () => clearInterval(interval);
  }, [headlines.length]);

  // If only one headline, show it statically
  if (headlines.length === 1) {
    return (
      <div className={`${className}`}>
        <div className={`${fontSize} font-bold text-center font-heading drop-shadow-2xl leading-tight`}
             style={{ 
               textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
               wordBreak: 'break-word',
               hyphens: 'auto'
             }}>
          {headlines[0]}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        key={currentIndex}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className={`${fontSize} font-bold text-center font-heading drop-shadow-2xl leading-tight`}
        style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          wordBreak: 'break-word',
          hyphens: 'auto'
        }}
      >
        {headlines[currentIndex]}
      </motion.div>
    </div>
  );
}

// Alternative ticker-style component for continuous scrolling
export function TickerHeadlines({ 
  headlines, 
  className = "", 
  speed = 50,
  fontSize = "text-xl"
}: MovingHeadlinesProps) {
  const combinedText = headlines.join(" • ");
  
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        animate={{ x: [`0%`, `-${headlines.length * 100}%`] }}
        transition={{ 
          duration: speed,
          ease: "linear",
          repeat: Infinity 
        }}
        className={`whitespace-nowrap ${fontSize} font-bold font-heading flex`}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="mr-16">
            {combinedText}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
