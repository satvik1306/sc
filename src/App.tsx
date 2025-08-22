import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { About } from "./components/landing/About";
import { VRExperience } from "./components/landing/VRExperience";
//import { Services } from "./components/landing/Services";
import { Projects } from "./components/landing/Projects";
import { Contact } from "./components/landing/Contact";
import { Footer } from "./components/landing/Footer";
import { LakewoodVillas } from "./components/LakewoodVillas";
import { Toaster } from "./components/ui/sonner";
import { Watermark } from "./components/Watermark";
import Loader from "./components/Loader";
import './components/Loader.css';
// @ts-ignore
import ChatBot from "./components/ChatBot";


function App() {

  
  const [currentPage, setCurrentPage] = useState<'home' | 'lakewood'>(() => {
    // Initialize page state immediately based on URL hash
    const hash = window.location.hash;
    console.log('Initial hash:', hash); // Debug log
    return hash === '#lakewood-villas' ? 'lakewood' : 'home';
  });

  const [loading, setLoading] = useState(() => {
    // Only show loader on home page, not on LakeWoods page
    const hash = window.location.hash;
    return hash !== '#lakewood-villas';
  });

  // Debug log to track page changes
  useEffect(() => {
    console.log('Current page state:', currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Only run timer if we're showing the loader
    if (loading) {
      const timer = setTimeout(() => {
        console.log('Loading complete, current page:', currentPage); // Debug log
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, currentPage]);

  // Update URL hash when page changes
  useEffect(() => {
    const newHash = currentPage === 'lakewood' ? '#lakewood-villas' : '';
    
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, [currentPage]);

  useEffect(() => {
    // Listen for navigation events
    const handleNavigateToLakewood = () => {
      setCurrentPage('lakewood');
    };

    const handleNavigateToHome = () => {
      setCurrentPage('home');
      // Scroll to projects section after navigation
      setTimeout(() => {
        const projectsElement = document.getElementById('projects');
        if (projectsElement) {
          projectsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('Hash changed to:', hash); // Debug log
      
      if (hash === '#lakewood-villas') {
        setCurrentPage('lakewood');
      } else if (hash === '#projects') {
        setCurrentPage('home');
        // Scroll to projects section after navigation
        setTimeout(() => {
          const projectsElement = document.getElementById('projects');
          if (projectsElement) {
            projectsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (hash === '') {
        setCurrentPage('home');
      }
    };

    // Only add event listeners after loading is complete to prevent interference
    if (!loading) {
      window.addEventListener('navigateToLakewood', handleNavigateToLakewood);
      window.addEventListener('navigateToHome', handleNavigateToHome);
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => {
      window.removeEventListener('navigateToLakewood', handleNavigateToLakewood);
      window.removeEventListener('navigateToHome', handleNavigateToHome);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [loading]);

  return (
    <LayoutGroup>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <ChatBot />
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2}}
        >
          <Watermark />
          {currentPage === 'home' ? (
            <>
              <Header />
              <main>
                <Hero />
                <About />
                <VRExperience />
                <div id="projects">
                  <Projects />
                </div>
                <Contact />
              </main>
              <Footer />
            </>
          ) : (
            <LakewoodVillas />
          )}
          <Toaster />
        </motion.div>
      )}
    </LayoutGroup>
  );
}

export default App
