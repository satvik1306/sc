import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    {
      title: "Services",
      links: [
        { name: "Residential Construction", href: "#" },
        { name: "Commercial Projects", href: "#" },
        { name: "Interior Design", href: "#" },
        { name: "VR Visualization", href: "#vr-experience" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Our Projects", href: "#projects" },
        { name: "Careers", href: "#" },
        { name: "News & Updates", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#contact" },
        { name: "FAQ", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" }
      ]
    }
  ];

  const contactInfo = [
    { icon: Phone, text: "+91 63871 19708", href: "tel:+916387119708" },
    { icon: Mail, text: "careers@saridenaconstructions.com", href: "mailto:careers@saridenaconstructions.com" },
    { icon: MapPin, text: "4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad, Telangana 500081", href: "#" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <motion.footer
      className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-800/95" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
            {/* Company Info */}
            <motion.div
              className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={`${import.meta.env.BASE_URL}photos/saridena_logo.png`}
                  alt="Saridena Constructions Logo"
                  className="h-12 w-auto object-contain filter brightness-0 invert drop-shadow-lg"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(255, 255, 255, 0.4))'
                  }}
                />
                <div>
                  <h3 className="text-2xl font-bold font-heading text-white">Saridena</h3>
                  <p className="text-gray-300 text-sm">Constructions Pvt. Ltd.</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                Building architectural excellence with over 15 years of experience in luxury construction. 
                We transform visions into extraordinary living spaces that stand the test of time.
              </p>

              <h3 className="text-2xl font-bold font-heading text-white">Join Us</h3>

              {/* Contact Information */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ x: 5 }}
                  >
                    <contact.icon size={16} className="flex-shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-sm">{contact.text}</span>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 group backdrop-blur-sm border border-white/10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={18} className="text-gray-300 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + sectionIndex * 0.1, duration: 0.6 }}
              >
                <h4 className="text-lg font-semibold font-heading text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="text-gray-300 hover:text-primary transition-colors text-sm group"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + linkIndex * 0.05, duration: 0.4 }}
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.p
                className="text-gray-400 text-sm text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                &copy; {new Date().getFullYear()} Saridena Constructions Pvt. Ltd. All rights reserved.
              </motion.p>
              
              <motion.div
                className="flex items-center space-x-6 text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
                <motion.button
                  onClick={scrollToTop}
                  className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  <span>Back to Top</span>
                  <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
