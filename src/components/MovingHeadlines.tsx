import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HeadlineWithDescription {
  headline: string;
  description: string;
}

interface MovingHeadlinesProps {
  headlines: string[] | HeadlineWithDescription[];
  className?: string;
  speed?: number;
  fontSize?: string;
  showDescriptions?: boolean;
}

export function MovingHeadlines({ 
  headlines, 
  className = "", 
  fontSize = "text-xl",
  showDescriptions = false
}: MovingHeadlinesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper function to get headline text
  const getHeadlineText = (headline: string | HeadlineWithDescription): string => {
    return typeof headline === 'string' ? headline : headline.headline;
  };

  // Helper function to get description text
  const getDescriptionText = (headline: string | HeadlineWithDescription): string => {
    return typeof headline === 'string' ? '' : headline.description;
  };

  useEffect(() => {
    // Only cycle through headlines if there are multiple
    if (headlines.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 12000); // Change headline every 12 seconds to allow more time for reading description

    return () => clearInterval(interval);
  }, [headlines.length]);

  const currentHeadline = headlines[currentIndex];
  const headlineText = getHeadlineText(currentHeadline);
  const descriptionText = getDescriptionText(currentHeadline);

  // If only one headline, show it statically
  if (headlines.length === 1) {
    return (
      <div className={`${className}`}>
        <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-8 md:p-2 ${showDescriptions ? 'min-h-[200px]' : ''}`}>
          <div className={`${fontSize} font-bold text-center font-heading drop-shadow-2xl leading-tight`}
               style={{ 
                 textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                 wordBreak: 'break-word',
                 hyphens: 'auto'
               }}>
            {headlineText}
          </div>
          {showDescriptions && descriptionText && (
            <div className="text-lg text-center text-gray-300 font-content leading-relaxed max-w-3xl mx-auto">
              {descriptionText}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <div className={`bg-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-8 md:p-12 ${showDescriptions ? 'min-h-[250px]' : ''}`}>
        <motion.div
          key={currentIndex}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ 
            duration: 2, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        >
          <div className={`${fontSize} font-bold text-center font-heading drop-shadow-2xl leading-tight mb-4`}
               style={{ 
                 textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                 wordBreak: 'break-word',
                 hyphens: 'auto'
               }}>
            {headlineText}
          </div>
          {showDescriptions && descriptionText && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg text-center text-gray-300 font-content leading-relaxed max-w-3xl mx-auto"
            >
              {descriptionText}
            </motion.div>
          )}
        </motion.div>
      </div>
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
  // Extract headline text for ticker display
  const headlineTexts = headlines.map(headline => 
    typeof headline === 'string' ? headline : headline.headline
  );
  const combinedText = headlineTexts.join(" • ");
  
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
