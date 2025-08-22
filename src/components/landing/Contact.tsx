import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Shield, Send, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import emailjs from '@emailjs/browser';

export function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    
    try {
      // EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      // Debug logging
      console.log('EmailJS Configuration Check:');
      console.log('Service ID:', serviceId ? '✓ Present' : '✗ Missing');
      console.log('Template ID:', templateId ? '✓ Present' : '✗ Missing');
      console.log('Public Key:', publicKey ? '✓ Present' : '✗ Missing');
      
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing. Please check your environment variables.');
      }
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        project_type: formData.subject,
        message: formData.message,
        to_name: 'Saridena Constructions',
        to_email: 'admin@saridenaconstructions.com', // Add recipient email
        reply_to: formData.email, // This allows you to reply directly to the sender
      };

      console.log('Sending email with params:', templateParams);
      
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('EmailJS Response:', response);
      setFormState('sent');
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormState('idle');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('EmailJS Error Details:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      setFormState('error');
      
      // Reset to idle after 5 seconds on error
      setTimeout(() => {
        setFormState('idle');
      }, 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 63871 19708"],
      subtitle: "Mon-Sat 9:30AM-6PM",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["admin@saridenaconstructions.com"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad, Telangana 500081"],
      subtitle: "Open House Tours",
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  const features = [
    { icon: Shield, text: "Free Consultation" },
    { icon: CheckCircle, text: "Licensed & Insured" }
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-heading">
            Let's Build Your <span className="text-accent">Dream Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start your architectural journey? Our team of experts is here to guide you 
            from concept to completion with personalized service and innovative solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
          {/* Contact Form */}
          <motion.div
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/60 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-accent/20 to-custom-blue/20 rounded-full blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl lg:rounded-3xl" />
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 font-heading">Start Your Project</h3>
                
                {formState === 'sent' ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">Message Sent Successfully!</h4>
                    <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : formState === 'error' ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-red-500" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-red-600">Failed to Send Message</h4>
                    <p className="text-muted-foreground">Please try again or contact us directly at careers@saridenaconstructions.com</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">Project Type</label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Residential, Commercial, etc."
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Project Details</label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your project vision, timeline, and budget..."
                        rows={6}
                        required
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      disabled={formState === 'sending'}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 transition-all duration-200"
                    >
                      {formState === 'sending' ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.filter(info => info.title !== "Visit Us").map((info, index) => (
                <motion.div
                  key={info.title}
                  className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 hover:bg-slate-600/90 transition-all duration-300 group shadow-lg text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1 font-heading text-white">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-300">{detail}</p>
                      ))}
                      <p className="text-accent text-sm font-medium mt-1">{info.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visit Us with Map */}
            <motion.div
              className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 hover:bg-slate-600/90 transition-all duration-300 group shadow-lg text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Address Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 font-heading text-white">Visit Us</h4>
                  <p className="text-gray-300">4-B, 4th Floor, Hyndava Techno Park, Hi-Tech City, Hyderabad, Telangana 500081</p>
                  <p className="text-accent text-sm font-medium mt-1">Open House Tours</p>
                </div>
              </div>
              
              {/* Map */}
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d237.89778736705912!2d78.37471100000002!3d17.442255!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb930075c2b685%3A0x5bc8df8a8dd5561b!2sSaridena%20Constructions%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1755153812853!5m2!1sen!2sin" 
                  width="100%" 
                  height="180"
                  style={{border: 0}}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              className="bg-slate-600/80 backdrop-blur-sm border-2 border-slate-400/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:bg-slate-500/80 transition-all duration-300 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold text-lg mb-4 font-heading text-white">Why Choose Saridena?</h4>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-3">
                    <feature.icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:bg-slate-600/90 transition-all duration-300 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-accent" />
                <h4 className="font-semibold text-lg font-heading text-white">Office Hours</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Saturday</span>
                  <span className="font-medium text-white">9:30 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunday</span>
                  <span className="font-medium text-white">Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center bg-gradient-to-r from-accent to-custom-blue rounded-3xl p-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
            Ready to Transform Your Vision?
          </h3>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have trusted us with their architectural dreams. 
            Let's create something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90 font-semibold"
              onClick={() => {
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Schedule Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
              onClick={() => {
                const projectsElement = document.getElementById('projects');
                if (projectsElement) {
                  projectsElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View Portfolio
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
