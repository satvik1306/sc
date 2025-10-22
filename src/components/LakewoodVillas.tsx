import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, Home, MapPin, X, ChevronLeft, ChevronRight, Warehouse,
  Zap, Store, Users, Dumbbell, Scissors, Users2, Heart, Gamepad2, Building, 
  PartyPopper, Trees, Dog, Footprints, Trophy, Target, Waves, CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MovingHeadlines } from "@/components/MovingHeadlines";

// Image component with skeleton loading
const ImageWithSkeleton = ({ src, alt, className, loading, style, onClick, ...props }: {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && !imageError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={loading}
        style={style}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
        onClick={onClick}
        {...props}
      />
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700/50 rounded-xl">
          <span className="text-white text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Lightbox image component with skeleton loading
const LightboxImageWithSkeleton = ({ src, alt, className }: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative max-w-[95vw] max-h-[85vh] flex items-center justify-center">
      {!imageLoaded && !imageError && (
        <Skeleton className="w-[80vw] h-[70vh] rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
        }}
      />
      {imageError && (
        <div className="flex items-center justify-center bg-slate-700/50 rounded-lg p-8">
          <span className="text-white text-lg">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

type Category = "Interior" | "Exterior" | "Floor Plan" | "Location and layout" | "Isometric View";

interface ProjectItem {
  name: string;
  image: string;
  type?: string;
  model?: string;
}

const categoryOrder: Category[] = ["Location and layout", "Exterior", "Floor Plan", "Interior", "Isometric View"];

// Helper function to generate image paths
const getImagePath = (folder: string, filename: string) => {
  return `${import.meta.env.BASE_URL}photos/${folder}/${filename}`;
};

// Exact same data structure as in Projects.tsx for LakeWoods Villas
const lakewoodProjectData: Record<Category, ProjectItem[]> = {
  Interior: [
    { name: "Living Room View-1", image: getImagePath("interior", "1.png") },
    { name: "Living Room View-2", image: getImagePath("interior", "2.png") },
    { name: "Living Room View-3", image: getImagePath("interior", "3.png") },
    { name: "Entrance View-1", image: getImagePath("interior", "4.png") },
    { name: "Entrance View-2", image: getImagePath("interior", "5.png") },
    { name: "Indoor Pool View-1", image: getImagePath("interior", "6.png") },
    { name: "Indoor Pool View-2", image: getImagePath("interior", "7.png") },
    { name: "Stairs View", image: getImagePath("interior", "8.png") },
    { name: "Living Room View", image: getImagePath("interior", "9.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "10.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "12.png") },
    { name: "Living Room Entrance", image: getImagePath("interior", "13.png") },
    { name: "Dining Room", image: getImagePath("interior", "14.png") },
    { name: "Outdoor Sitting Area View-1", image: getImagePath("interior", "15.png") },
    { name: "Outdoor Sitting Area View-2", image: getImagePath("interior", "16.png") },
    { name: "Garden Area", image: getImagePath("interior", "17.png") },
    { name: "Outdoor Seating", image: getImagePath("interior", "19.png") },
    { name: "Outdoor Seating", image: getImagePath("interior", "20.jpg") },
  ],
  Exterior: [
    { name: "Villa Model 1", image: getImagePath("exterior", "1.jpg") },
    { name: "Villa Model 2", image: getImagePath("exterior", "2.jpg") },
    { name: "Villa Model 3", image: getImagePath("exterior", "3.png") },
    { name: "Villa Model 4", image: getImagePath("exterior", "4.jpg") },
    { name: "Villa Model 5", image: getImagePath("exterior", "5.jpg") },
    { name: "Villa Model 6", image: getImagePath("exterior", "6.jpg") },
  ],
  "Floor Plan": [
    { name: "Ground Floor Plan", image: getImagePath("floorplan", "3.jpg") },
    { name: "First Floor Plan", image: getImagePath("floorplan", "2.jpg") },
    { name: "Second Floor Plan", image: getImagePath("floorplan", "4.jpg") },
  ],
  "Location and layout": [
    { name: "Layout Plan", image: getImagePath("floorplan", "1.jpg") },
    { name: "LakeWoods Villas Map", image: "map_iframe", type: "map" },
  ],
  "Isometric View": [
    { name: "Isometric View - Ground Floor", image: getImagePath("isometric", "2.jpg") },
    { name: "Isometric View - First Floor", image: getImagePath("isometric", "1.jpg") },
    { name: "Isometric View - Second Floor", image: getImagePath("isometric", "3.jpg") }
  ],
};

export function LakewoodVillas() {
  const [isInView, setIsInView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Location and layout");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; index: number } | null>(null);
  const [currentImages, setCurrentImages] = useState<ProjectItem[]>([]);
  
  // Zoom functionality state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsInView(true);
    // Set custom document title for LakeWoods page
    document.title = 'Lakewoods Villas by Saridena Constructions';
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update current images when category changes and lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      const allImages = lakewoodProjectData[selectedCategory] || [];
      // Filter out map items from navigation
      const imageOnlyItems = allImages.filter(item => item.type !== 'map');
      setCurrentImages(imageOnlyItems);
    }
  }, [selectedCategory, lightboxOpen]);

  const handleBackToProjects = () => {
    // TODO: Replace with actual Saridena domain when purchased
    // window.location.href = 'https://YOUR_SARIDENA_DOMAIN.com#projects';
    
    // Temporary: Keep current functionality until domains are ready
    document.title = 'Saridena Constructions | Luxury Villas';
    const event = new CustomEvent('navigateToHome');
    window.dispatchEvent(event);
  };

  const handleViewOnMaps = (e: React.MouseEvent) => {
    e.preventDefault();
    // Switch to Location and layout tab
    setSelectedCategory("Location and layout");
    // Scroll to gallery section
    const gallerySection = document.getElementById('project-gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const openLightbox = (project: ProjectItem) => {
    const allImages = lakewoodProjectData[selectedCategory] || [];
    // Filter out map items from navigation
    const imageOnlyItems = allImages.filter(item => item.type !== 'map');
    // Find the correct index in the filtered array
    const filteredIndex = imageOnlyItems.findIndex(item => item.image === project.image);
    
    setSelectedImage({ src: project.image, alt: project.name, index: filteredIndex });
    setCurrentImages(imageOnlyItems);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    setCurrentImages([]);
    // Reset zoom and pan when closing
    setZoom(1);
    setPanX(0);
    setPanY(0);
    document.body.style.overflow = 'unset';
  };

  // Zoom and pan functions
  const resetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(zoom + delta, 0.5), 5); // Min 0.5x, Max 5x zoom
    setZoom(newZoom);
    
    // Reset pan if zoom is back to 1 or less
    if (newZoom <= 1) {
      setPanX(0);
      setPanY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage || !currentImages.length) return;
    
    // Reset zoom when changing images
    setZoom(1);
    setPanX(0);
    setPanY(0);
    
    setSelectedImage(prev => {
      if (!prev) return null;

      const currentIndex = prev.index;
      let newIndex;

      if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
      } else {
        newIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
      }

      const newImage = currentImages[newIndex];
      return { src: newImage.image, alt: newImage.name, index: newIndex };
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, selectedImage]);

  const projectDetails = {
    name: "LakeWoods Villas",
    location: "Near Mrugavani National Park & Osman Sagar",
    type: "Ultra-Luxury Triplex Villas",
    status: "Exclusive Development",
    completionDate: "Premium Community",
    totalUnits: "30 Ultra-Luxury Villas",
    priceRange: "Ultra-Premium",
    specifications: {
      plotArea: "1200 sq.yd (approx)",
      builtUpArea: "9,550 to 11,150 sq.ft",
      villaType: "G+2 Villas",
      vaastu: "100% Compliant",
      design: "No Shared Walls",
      privacy: "No Villa Faces Another",
      clubhouse: "30,000 sq.ft. Clubhouse",
    }
  };

  const amenities = [
    { name: "Badminton Court", icon: Zap },
    { name: "Store", icon: Store },
    { name: "Guest Rooms", icon: Users },
    { name: "Gym", icon: Dumbbell },
    { name: "Spa Saloon", icon: Scissors },
    { name: "Conference Hall", icon: Users2 },
    { name: "Yoga Room", icon: Heart },
    { name: "Indoor Games", icon: Gamepad2 },
    { name: "Multi Purpose Hall", icon: Building },
    { name: "Party Lounge", icon: PartyPopper },
    { name: "Multipurpose Lawn", icon: Trees },
    { name: "Dog Park", icon: Dog },
    { name: "All Round Walkway", icon: Footprints },
    { name: "Tennis Court", icon: Trophy },
    { name: "Cricket Nets", icon: Target },
    { name: "Swimming Pool", icon: Waves },
    { name: "Basketball Court", icon: CircleDot }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <motion.div
        className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-50 hover:bg-background transition-all duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleBackToProjects}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary min-h-[36px] px-2 touch-manipulation text-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden xs:inline">Back to Projects</span>
              <span className="xs:hidden">Back</span>
            </Button>
            
            {/* Centered Lakewoods Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-8 sm:h-10">
              <ImageWithSkeleton
                src={getImagePath("", "lakewoods_logo.jpg")}
                alt="Lakewoods Logo"
                className="h-8 sm:h-10 w-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative h-[45vh] sm:h-[50vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img
            src={getImagePath("exterior", "1.jpg")}
            alt="Lakewood Villas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            className="text-center text-white max-w-3xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 font-heading">
              LAKEWOODS
              <br />
              <span className="text-primary">VILLAS</span>
            </h1>
            <p className="text-lg xs:text-xl sm:text-2xl mb-2 sm:mb-3 font-content">
              A rare composition of earth, light, and intent
            </p>
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-content">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-base xs:text-lg sm:text-xl">{projectDetails.location}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Moving Headlines - Above Why Choose Us */}
      <motion.section 
        className="py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <MovingHeadlines 
            headlines={[
              {
                headline: "This Isn ' t for Everyone. That Was Always the Point.",
                description: "Experience our exclusive 30,000 sq.ft. clubhouse with private guest rooms, designed for those who understand true luxury isn't about access—it's about belonging."
              },
              {
                headline: "Excellence resides here. Shouldn ' t you?",
                description: "Unwind in our dedicated wellness spaces and amphitheatre, where every detail reflects the pinnacle of premium living and architectural sophistication."
              },
              {
                headline: "Not just a home. It ' s a statement. Ready to make yours?",
                description: "Play on world-class pickleball courts surrounded by expansive green zones, where recreation meets the artistry of intentional community design."
              },
              {
                headline: "Designed for the distinguished. Lived in by the worthy.",
                description: "Protected by 24x7 premium security and eco-smart living systems, every aspect ensures your sanctuary remains private, secure, and environmentally conscious."
              }
            ]}
            className="text-white"
            fontSize="text-lg sm:text-xl md:text-2xl lg:text-3xl"
            showDescriptions={true}
          />
        </div>
      </motion.section>

      {/* Project Overview */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-8 items-start mb-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
                  WHY CHOOSE
                  <br />
                  <span className="text-primary">US?</span>
                </h2>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed font-content">
                  LakeWoods Villas is a private collection of just 30 ultra-luxury G+2 villas, designed for those who seek exclusivity over exposure.
                </p>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed font-content">
                  Set on expansive plots (approx 1200 sq.yd) with built-up areas of 9,550–11,150 sq. ft., each villa is surrounded by the serene landscapes of Mrugavani National Park and Osman Sagar.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-content">
                  100% Vaastu compliant, the homes feature open terraces, high ceilings, no shared walls, and intelligent spatial design that ensures privacy without barriers.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2">
                <motion.div 
                  className="bg-gradient-to-br from-slate-700/95 to-slate-800/95 backdrop-blur-sm border-2 border-slate-500/60 p-3 sm:p-4 rounded-xl hover:from-slate-600/95 hover:to-slate-700/95 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-white group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-xs text-gray-300 font-content mb-1">Total Villas</p>
                  <p className="text-sm sm:text-base font-bold font-content text-white">{projectDetails.totalUnits}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-slate-700/95 to-slate-800/95 backdrop-blur-sm border-2 border-slate-500/60 p-3 sm:p-4 rounded-xl hover:from-slate-600/95 hover:to-slate-700/95 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-white group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Building className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-xs text-gray-300 font-content mb-1">Villa Type</p>
                  <p className="text-sm sm:text-base font-bold font-content text-white">{projectDetails.specifications.villaType}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-slate-700/95 to-slate-800/95 backdrop-blur-sm border-2 border-slate-500/60 p-3 sm:p-4 rounded-xl hover:from-slate-600/95 hover:to-slate-700/95 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-white group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Warehouse className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-xs text-gray-300 font-content mb-1">Clubhouse</p>
                  <p className="text-sm sm:text-base font-bold font-content text-white">{projectDetails.specifications.clubhouse}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-slate-700/95 to-slate-800/95 backdrop-blur-sm border-2 border-slate-500/60 p-3 sm:p-4 rounded-xl hover:from-slate-600/95 hover:to-slate-700/95 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 text-white group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Trees className="h-5 w-5 sm:h-6 sm:w-6 text-accent mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <p className="text-xs text-gray-300 font-content mb-1">Plot Size</p>
                  <p className="text-sm sm:text-base font-bold font-content text-white">~1200 sq.yd</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Navigation and Gallery - Exact copy from Projects.tsx */}
            <motion.div
              id="project-gallery"
              className="mb-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-center font-heading">
                PROJECT GALLERY
              </h3>
              
              {/* Navigation Tabs - Exact copy from Projects.tsx */}
              <div className="mb-4 md:mb-6">
                <nav className="flex justify-center overflow-x-auto">
                  <div className="border-b-2 flex min-w-max">
                    {categoryOrder.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`py-1 md:py-2 px-2 md:px-3 text-xs sm:text-sm font-medium rounded-none whitespace-nowrap ${
                          selectedCategory === category
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Magazine-style Masonry Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mb-6">
                {lakewoodProjectData[selectedCategory]?.map((project, index) => {
                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="relative rounded-xl shadow-lg overflow-hidden bg-slate-800/80 hover:bg-slate-700/90 transition-colors duration-300"
                    >
                      {project.type === "map" ? (
                        <div className="relative w-full h-full min-h-[200px]">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4517.1096816779755!2d78.32429457117165!3d17.36097372073983!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9500700340b9%3A0x55a866128dbfe12c!2sLakewoods%20Villas!5e1!3m2!1sen!2sin!4v1760598208453!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: 200 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="pointer-events-none rounded-xl"
                          ></iframe>
                          <a
                            href="https://www.google.com/maps/place/Lakewoods+Villas/@17.3609737,78.3242946,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb9500700340b9:0x55a866128dbfe12c!8m2!3d17.3609737!4d78.3242946!16s%2Fg%2F11y6qg5p5f"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs sm:text-sm font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300 touch-manipulation rounded-xl"
                          >
                            View in Larger Map
                          </a>
                        </div>
                      ) : (
                        <ImageWithSkeleton
                          src={project.image}
                          alt={project.name}
                          className={`w-full h-full object-cover rounded-xl transition-transform duration-300 ${
                            project.type === 'map' ? '' : 'hover:scale-105 cursor-pointer'
                          }`}
                          loading={index < 8 ? "eager" : "lazy"}
                          style={{ imageRendering: 'auto', minHeight: 180, maxHeight: 420, objectFit: 'cover' }}
                          onClick={() => project.type !== 'map' && openLightbox(project)}
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-xs sm:text-sm px-3 py-2 font-content pointer-events-none z-10">
                        {project.name}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* Magazine Masonry CSS */}

            </motion.div>

            {/* Specifications */}
            <motion.div
              className="bg-slate-700/90 backdrop-blur-sm border border-slate-500/40 p-4 md:p-6 rounded-lg shadow-lg mb-10 hover:bg-slate-600/90 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 text-white"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-center font-heading text-white">
                VILLA SPECIFICATIONS
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(projectDetails.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-slate-600/60 border border-slate-500/40 rounded-lg hover:bg-slate-600/80 transition-colors duration-300">
                    <span className="font-medium capitalize font-content text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-blue-400 font-semibold font-content">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-center font-heading">
                WORLD-CLASS AMENITIES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {amenities.map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return (
                    <motion.div
                      key={amenity.name}
                      className="flex flex-col items-center gap-3 p-3 sm:p-4 bg-slate-700/80 backdrop-blur-sm border border-slate-500/40 rounded-lg hover:bg-slate-600/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-white touch-manipulation text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.05, duration: 0.5 }}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/20 rounded-full">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="text-xs sm:text-sm font-content text-gray-300 leading-tight">{amenity.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-8 bg-slate-800/95 backdrop-blur-sm border-t border-slate-500/40 hover:bg-slate-700/95 transition-all duration-300 text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-3 font-heading text-white">
              Are You Meant to Be Here ?
            </h3>
            <p className="text-sm text-gray-300 mb-3 font-content">
              Featured Project: LakeWoods Villas
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-left mb-4 max-w-2xl mx-auto font-content text-gray-300"
            >
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-xs"><span>🏡</span> Ultra-Luxury G+2 Villas</p>
                <p className="flex items-center gap-1 text-xs"><span>📏</span> approx 1200 sq.yd plots | 9,550 to 11,150 sq.ft homes</p>
                <p className="flex items-center gap-1 text-xs"><span>📍</span> Near Mrugavani National Park & Osman Sagar</p>
                <p className="flex items-center gap-1 text-xs"><span>🔐</span> Premium Community with 24x7 Security</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-xs"><span>🏛</span> 30,000 sq.ft Clubhouse | Private Guest Rooms</p>
                <p className="flex items-center gap-1 text-xs"><span>🧿</span> 100% Vaastu Compliant Design</p>
                <p className="flex items-center gap-1 text-xs"><span>🎓</span> Close to top international schools & hospitals</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center max-w-xs mx-auto">
              <Button size="sm" className="bg-primary hover:bg-primary/90 min-h-[36px] touch-manipulation text-sm" onClick={handleViewOnMaps}>
                <span className="flex items-center gap-1">
                  📍 View on Google Maps
                </span>
              </Button>
              <Button size="sm" variant="outline" className="min-h-[36px] touch-manipulation text-sm" onClick={handleBackToProjects}>
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div 
          id="lakewood-lightbox-modal"
          key="lakewood-lightbox"
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeLightbox}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[10001]"
            title="Close (ESC)"
          >
            <X size={32} />
          </button>

          {/* Reset Zoom Button */}
          {zoom > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
              className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors z-[10001] bg-black/50 rounded-lg px-3 py-2 text-sm"
              title="Reset Zoom (Double Click)"
            >
              Reset Zoom
            </button>
          )}

          {/* Zoom Level Indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 rounded-lg px-3 py-2 z-[10001]">
            {Math.round(zoom * 100)}%
          </div>
          
          {/* Previous Image Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-[10001]"
            title="Previous Image (←)"
          >
            <ChevronLeft size={48} />
          </button>
          
          {/* Next Image Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-[10001]"
            title="Next Image (→)"
          >
            <ChevronRight size={48} />
          </button>

          {/* Zoomable Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center z-[10000] p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <div
              className="transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                transformOrigin: 'center center'
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                resetZoom();
              }}
            >
              <LightboxImageWithSkeleton
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain select-none"
              />
            </div>
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center z-[10001] bg-black/50 rounded-lg px-4 py-2">
              <p className="text-lg font-medium">{selectedImage.alt}</p>
              <p className="text-sm opacity-75">
                {selectedImage.index + 1} of {currentImages.length}
              </p>
              <p className="text-xs opacity-60 mt-1">
                Scroll to zoom • Double-click to reset • Drag to pan
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
