import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Home, MapPin, Bed, Square, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageLoader } from "@/components/ImageLoader";
import { MovingHeadlines } from "@/components/MovingHeadlines";

type Category = "Interior" | "Exterior" | "Floor Plan" | "Location and layout" | "Isometric View";

interface ProjectItem {
  name: string;
  image: string;
  type?: string;
  model?: string;
}

const categoryOrder: Category[] = ["Location and layout", "Exterior", "Floor Plan", "Interior", "Isometric View"];

// Helper function to generate image paths
const getImagePath = (folder: string, filename: string) => `${import.meta.env.BASE_URL}photos/${folder}/${filename}`;

// Exact same data structure as in Projects.tsx for LakeWoods Villas
const lakewoodProjectData: Record<Category, ProjectItem[]> = {
  Interior: [
    { name: "Modern Living Room", image: getImagePath("interior", "1.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "2.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "3.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "4.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "5.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "6.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "7.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "8.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "9.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "10.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "11.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "12.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "13.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "14.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "15.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "16.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "17.png") },
    { name: "Sleek Kitchen", image: getImagePath("interior", "18.png") },
    { name: "Modern Living Room", image: getImagePath("interior", "19.png") },
    { name: "Cozy Bedroom", image: getImagePath("interior", "20.jpg") },
  ],
  Exterior: [
    { name: "Contemporary Villa", image: getImagePath("exterior", "7.png") },
    { name: "Beachfront Residence", image: getImagePath("exterior", "1.jpg") },
    { name: "Mountain Chalet", image: getImagePath("exterior", "2.jpg") },
    { name: "Contemporary Villa", image: getImagePath("exterior", "3.png") },
    { name: "Beachfront Residence", image: getImagePath("exterior", "4.jpg") },
    { name: "Mountain Chalet", image: getImagePath("exterior", "5.jpg") },
    { name: "Contemporary Villa", image: getImagePath("exterior", "6.jpg") },
  ],
  "Floor Plan": [
    { name: "Two-Story House Blueprint", image: getImagePath("floorplan", "2.jpg") },
    { name: "Apartment Layout", image: getImagePath("floorplan", "3.jpg") },
    { name: "Open-Concept Floor Plan", image: getImagePath("floorplan", "4.jpg") },
  ],
  "Location and layout": [
    { name: "Open-Concept Floor Plan", image: getImagePath("floorplan", "1.jpg") },
    { name: "LakeWoods Villas Map", image: "map_iframe", type: "map" },
  ],
  "Isometric View": [
    { name: "Isometric View - Building Layout", image: getImagePath("isometric", "1.jpg") },
    { name: "Isometric View - Design Perspective", image: getImagePath("isometric", "2.jpg") },
    { name: "Isometric View - Overview", image: getImagePath("isometric", "3.jpg") }
  ],
};

export function LakewoodVillas() {
  const [isInView, setIsInView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Location and layout");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; index: number } | null>(null);
  const [currentImages, setCurrentImages] = useState<ProjectItem[]>([]);

  useEffect(() => {
    setIsInView(true);
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToProjects = () => {
    // Navigate back to projects section using custom event
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

  const openLightbox = (image: string, alt: string, index: number) => {
    setSelectedImage({ src: image, alt, index });
    setCurrentImages(lakewoodProjectData[selectedCategory] || []);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage || !currentImages.length) return;
    
    const currentIndex = selectedImage.index;
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
    } else {
      newIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newImage = currentImages[newIndex];
    setSelectedImage({ src: newImage.image, alt: newImage.name, index: newIndex });
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
    totalUnits: "29 Ultra-Luxury Villas",
    priceRange: "Ultra-Premium",
    specifications: {
      plotArea: "945 to 1,360 sq.yd",
      builtUpArea: "9,550 to 11,150 sq.ft",
      villaType: "Triplex Villas",
      vaastu: "100% Compliant",
      design: "No Shared Walls",
      privacy: "No Villa Faces Another"
    }
  };

  const amenities = [
    "25,000 sq.ft. Clubhouse",
    "Private Guest Rooms",
    "Amphitheatre",
    "Wellness Spaces",
    "Jogging Trails",
    "Pickleball Courts",
    "Green Zones",
    "24x7 Premium Security",
    "Eco-Smart Living",
    "Vaastu Compliant Design",
    "High Ceilings & Open Terraces",
    "Spatial Intelligence Design"
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
        <div className="container px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleBackToProjects}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary min-h-[44px] px-3 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back to Projects</span>
              <span className="xs:hidden">Back</span>
            </Button>
            
            {/* Centered Lakewoods Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <ImageLoader
                src={getImagePath("", "lakewoods_logo.jpg")}
                alt="Lakewoods Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] sm:h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <ImageLoader
            src={getImagePath("exterior", "1.jpg")}
            alt="Lakewood Villas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            className="text-center text-white max-w-4xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 font-heading">
              LAKEWOODS
              <br />
              <span className="text-primary">VILLAS</span>
            </h1>
            <p className="text-xl xs:text-2xl sm:text-3xl mb-3 sm:mb-4 font-content">
              A rare composition of earth, light, and intent
            </p>
            <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-content">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-base xs:text-lg sm:text-xl">{projectDetails.location}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Moving Headlines - Location 1 */}
      <motion.section 
        className="py-12 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 border-y border-primary/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <div className="container px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-xl p-8 md:p-12">
            <MovingHeadlines 
              headlines={[
                "This Isn't for Everyone. That Was Always the Point.",
                "Excellence resides here. Shouldn't you?",
                "Not just a home. It's a statement. Ready to make yours?",
                "Designed for the distinguished. Lived in by the worthy."
              ]}
              className="text-white"
              fontSize="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </div>
        </div>
      </motion.section>

      {/* Project Overview */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">
                  WHY CHOOSE
                  <br />
                  <span className="text-primary">US?</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-content">
                  LakeWoods Villas is not just a development, it's a rare composition of earth, light, and intent. 
                  With just 29 ultra-luxury triplex villas, this estate is not for the crowd. It isn't promoted. 
                  It isn't pushed. It doesn't call attention; it commands awareness.
                </p>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-content">
                  Each villa is built on plots ranging from 945 to 1,360 sq. yd. with a super built-up area between 
                  9,550 and 11,150 sq. ft. Surrounded by the natural cover of Mrugavani National Park and the peaceful 
                  stretch of Osman Sagar, LakeWoods merges nature and design with effortless clarity.
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed font-content">
                  100% Vaastu compliant, the homes are designed with vast open terraces, high ceilings, no shared walls, 
                  and spatial intelligence that creates privacy without walls. The question isn't "why here?" 
                  It's "are you meant to be here?"
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 p-4 sm:p-6 rounded-xl hover:bg-slate-600/90 hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-white">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-3" />
                  <p className="text-xs sm:text-sm text-gray-300 font-content">Total Villas</p>
                  <p className="text-lg sm:text-xl font-bold font-content text-white">{projectDetails.totalUnits}</p>
                </div>
                <div className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 p-4 sm:p-6 rounded-xl hover:bg-slate-600/90 hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-white">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-3" />
                  <p className="text-xs sm:text-sm text-gray-300 font-content">Villa Type</p>
                  <p className="text-lg sm:text-xl font-bold font-content text-white">{projectDetails.specifications.villaType}</p>
                </div>
                <div className="bg-slate-600/80 backdrop-blur-sm border-2 border-slate-400/50 p-4 sm:p-6 rounded-xl hover:bg-slate-500/80 hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-white">
                  <Square className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-3" />
                  <p className="text-xs sm:text-sm text-gray-300 font-content">Plot Area</p>
                  <p className="text-lg sm:text-xl font-bold font-content text-white">{projectDetails.specifications.plotArea}</p>
                </div>
                <div className="bg-slate-600/80 backdrop-blur-sm border-2 border-slate-400/50 p-4 sm:p-6 rounded-xl hover:bg-slate-500/80 hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-white">
                  <Bed className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-3" />
                  <p className="text-xs sm:text-sm text-gray-300 font-content">Built-up Area</p>
                  <p className="text-lg sm:text-xl font-bold font-content text-white">{projectDetails.specifications.builtUpArea}</p>
                </div>
              </div>
            </motion.div>

            {/* Navigation and Gallery - Exact copy from Projects.tsx */}
            <motion.div
              id="project-gallery"
              className="mb-16"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center font-heading">
                PROJECT GALLERY
              </h3>
              
              {/* Navigation Tabs - Exact copy from Projects.tsx */}
              <div className="mb-6 md:mb-8 lg:mb-12">
                <nav className="flex justify-center overflow-x-auto">
                  <div className="border-b-2 flex min-w-max">
                    {categoryOrder.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`py-2 md:py-3 lg:py-3 px-2 md:px-4 lg:px-5 text-xs sm:text-sm md:text-sm lg:text-base font-medium rounded-none whitespace-nowrap ${
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
              <div className="magazine-masonry mb-8">
                {lakewoodProjectData[selectedCategory]?.map((project, index) => {
                  // Vary image heights for magazine effect
                  const heights = [
                    'h-64', 'h-80', 'h-72', 'h-96', 'h-56', 'h-60', 'h-52', 'h-44', 'h-48', 'h-80', 'h-72', 'h-64'
                  ];
                  const heightClass = heights[index % heights.length];
                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className={`mb-4 break-inside-avoid rounded-xl shadow-lg overflow-hidden group bg-slate-800/80 hover:bg-slate-700/90 transition-all duration-300 ${heightClass}`}
                    >
                      {project.type === "map" ? (
                        <div className="relative w-full h-full min-h-[200px]">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1904.0092653797528!2d78.32458454996164!3d17.36284131174712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95007f4f624f%3A0x6ce54ab1b762e7c5!2sLakeWoods%20Villas!5e0!3m2!1sen!2sin!4v1754996807271!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: 200 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="pointer-events-none rounded-xl"
                          ></iframe>
                          <a
                            href="https://www.google.com/maps/place/LakeWoods+Villas/@17.36284131174712,78.32458454996164,17z"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch-manipulation rounded-xl"
                          >
                            View in Larger Map
                          </a>
                        </div>
                      ) : (
                        <ImageLoader
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer rounded-xl"
                          loading={index < 8 ? "eager" : "lazy"}
                          style={{ imageRendering: 'auto', minHeight: 180, maxHeight: 420, objectFit: 'cover' }}
                          onClick={() => openLightbox(project.image, project.name, index)}
                        />
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {project.name}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* Magazine Masonry CSS */}
              <style>{`
                .magazine-masonry {
                  column-count: 1;
                  column-gap: 1rem;
                }
                @media (min-width: 640px) {
                  .magazine-masonry { column-count: 2; }
                }
                @media (min-width: 1024px) {
                  .magazine-masonry { column-count: 3; }
                }
                @media (min-width: 1536px) {
                  .magazine-masonry { column-count: 4; }
                }
                .magazine-masonry > * {
                  display: block;
                  width: 100%;
                  margin-bottom: 1rem;
                }
                .break-inside-avoid {
                  break-inside: avoid;
                  -webkit-column-break-inside: avoid;
                  page-break-inside: avoid;
                }
              `}</style>
            </motion.div>

            {/* Specifications */}
            <motion.div
              className="bg-slate-700/90 backdrop-blur-sm border border-slate-500/40 p-8 md:p-12 rounded-lg shadow-lg mb-16 hover:bg-slate-600/90 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 text-white"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center font-heading text-white">
                VILLA SPECIFICATIONS
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(projectDetails.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-4 bg-slate-600/60 border border-slate-500/40 rounded-lg hover:bg-slate-600/80 transition-colors duration-300">
                    <span className="font-medium capitalize font-content text-gray-300">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-blue-400 font-semibold font-content">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Community Features */}
            <motion.div
              className="bg-slate-700/90 backdrop-blur-sm border border-slate-500/40 p-8 md:p-12 rounded-lg shadow-lg mb-16 hover:bg-slate-600/90 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 text-white"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center font-heading text-white">
                EXCLUSIVE COMMUNITY
              </h3>
              <div className="prose prose-lg max-w-4xl mx-auto text-center">
                <p className="text-xl text-gray-300 mb-6 leading-relaxed font-content">
                  The community is integrated with a 25,000 sq. ft. clubhouse, private guest rooms, amphitheatre, 
                  wellness spaces, jogging trails, pickleball courts, and green zones that breathe with the architecture.
                </p>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed font-content">
                  <strong>No villa faces another.</strong> Every detail, from the air you breathe to the way the sun 
                  enters your home, is intentional. This is not about banners or billboards. LakeWoods does not exist 
                  in the usual real estate ecosystem.
                </p>
                <p className="text-xl text-primary font-semibold font-content">
                  It's not designed to attract, it's designed to awaken. Do you belong here?
                </p>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center font-heading">
                WORLD-CLASS AMENITIES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={amenity}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-slate-700/80 backdrop-blur-sm border border-slate-500/40 rounded-lg hover:bg-slate-600/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 text-white touch-manipulation"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    <span className="text-base md:text-lg font-content text-gray-300">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Moving Headlines - Location 2 */}
      <motion.section
        className="py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-700/95 border-2 border-primary/40 rounded-3xl p-10 md:p-16 text-center shadow-2xl backdrop-blur-lg">
              <MovingHeadlines 
                headlines={[
                  "This Isn't for Everyone. That Was Always the Point.",
                  "Excellence resides here. Shouldn't you?",
                  "Not just a home. It's a statement. Ready to make yours?",
                  "Designed for the distinguished. Lived in by the worthy."
                ]}
                className="text-white"
                fontSize="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-slate-800/95 backdrop-blur-sm border-t border-slate-500/40 hover:bg-slate-700/95 transition-all duration-300 text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-6 font-heading text-white">
              Are You Meant to Be Here?
            </h3>
            <p className="text-lg text-gray-300 mb-4 font-content">
              Featured Project: LakeWoods Villas
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left mb-8 max-w-3xl mx-auto font-content text-gray-300"
            >
              <div className="space-y-2">
                <p className="flex items-center gap-2"><span>🏡</span> Ultra-Luxury Triplex Villas</p>
                <p className="flex items-center gap-2"><span>📏</span> 945 to 1,360 sq.yd plots | 9,550 to 11,150 sq.ft homes</p>
                <p className="flex items-center gap-2"><span>📍</span> Near Mrugavani National Park & Osman Sagar</p>
                <p className="flex items-center gap-2"><span>🔐</span> Premium Community with 24x7 Security</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2"><span>🏛</span> 25,000 sq.ft Clubhouse | Private Guest Rooms</p>
                <p className="flex items-center gap-2"><span>🔋</span> Eco-Smart Living</p>
                <p className="flex items-center gap-2"><span>🧿</span> 100% Vaastu Compliant Design</p>
                <p className="flex items-center gap-2"><span>🎓</span> Close to top international schools & hospitals</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
              <Button size="lg" className="bg-primary hover:bg-primary/90 min-h-[48px] touch-manipulation" onClick={handleViewOnMaps}>
                <span className="flex items-center gap-2">
                  📍 View on Google Maps
                </span>
              </Button>
              <Button size="lg" variant="outline" className="min-h-[48px] touch-manipulation" onClick={handleBackToProjects}>
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          >
            <ChevronLeft size={48} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          >
            <ChevronRight size={48} />
          </button>

          <div 
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-lg font-medium">{selectedImage.alt}</p>
              <p className="text-sm opacity-75">
                {selectedImage.index + 1} of {currentImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
