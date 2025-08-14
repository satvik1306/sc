import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#vr-experience', label: 'VR Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-8"
      style={{ 
        opacity: headerOpacity,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <motion.nav
          className={`hidden md:flex items-center justify-between mt-4 lg:mt-6 px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl border transition-all duration-500 ${
            isScrolled 
              ? 'bg-background/95 backdrop-blur-xl border-border/50 shadow-lg' 
              : 'bg-background/80 backdrop-blur-md border-border/20 shadow-md'
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img 
              src={`${import.meta.env.BASE_URL}photos/saridena_logo.png`}
              alt="Saridena Constructions Logo"
              className="h-8 lg:h-10 w-auto object-contain filter drop-shadow-md transition-all duration-300 hover:brightness-110 dark:invert dark:brightness-0"
            />
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollToSection(e, link.href)}
                className="relative text-foreground/80 hover:text-foreground transition-colors duration-300 font-medium group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {link.label}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </motion.nav>

        {/* Mobile Navigation */}
        <motion.div
          className="md:hidden mt-2 sm:mt-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-500 ${
            isScrolled 
              ? 'bg-background/95 backdrop-blur-xl border-border/50 shadow-lg' 
              : 'bg-background/80 backdrop-blur-md border-border/20 shadow-md'
          }`}>
            {/* Mobile Logo */}
            <div 
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer touch-manipulation"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}photos/saridena_logo.png`}
                alt="Saridena Constructions Logo"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain filter drop-shadow-md transition-all duration-300 hover:brightness-110 dark:invert dark:brightness-0"
              />
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-lg hover:bg-muted/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-2">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleScrollToSection(e, link.href)}
                      className="flex items-center justify-between px-4 py-4 rounded-xl hover:bg-muted/50 transition-colors group min-h-[48px] touch-manipulation"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="font-medium text-base">{link.label}</span>
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}