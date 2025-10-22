import { motion } from "framer-motion";
import { Award, Users, Target, Heart, Lightbulb, Shield } from "lucide-react";

export function About() {
  const achievements = [
    { 
      icon: Lightbulb, 
      title: "Innovative Approach", 
      description: "Revolutionizing real estate with VR tours and nature-integrated design" 
    },
    { 
      icon: Shield, 
      title: "Strong Foundation", 
      description: "Backed by 16+ years of US tech leadership" 
    },
    { 
      icon: Target, 
      title: "First Project", 
      description: "LakeWoods Villas - Where luxury meets natural serenity" 
    },
    { 
      icon: Users, 
      title: "Green Living", 
      description: "Creating homes that harmonize with their natural surroundings" 
    }
];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge design and technology"
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Every project is crafted with dedication and attention to detail"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Honest communication and transparent business practices"
    }
  ];

  return (
    <section id="about" className="py-8 lg:py-10 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-heading">
            About <span className="text-accent">Saridena</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            With over 15 years of experience, we've established ourselves as pioneers 
            in creating sustainable luxury spaces that embrace and preserve their natural surroundings.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-10 lg:mb-14">
          {/* Founder Section */}
          <motion.div
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-custom-blue/20 rounded-xl sm:rounded-2xl blur-xl" />
              <div className="relative bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl text-white hover:bg-slate-700/95 hover:border-primary/50 transition-all duration-300">
                {/* Founder Image Placeholder */}
                <div className="flex flex-col items-center text-center mb-4">
                  {/*<div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-accent to-custom-blue rounded-full flex items-center justify-center mb-4 shadow-lg">
                    {/* Placeholder for founder image - will be replaced with actual image 
                    <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-white font-heading">SR</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-1 text-white">Mr. Suman Rao Saridena</h3>
                    <p className="text-accent font-medium text-lg">Managing Director</p>
                  </div>*/}

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-heading mb-1 text-white">Mr. Suman Rao Saridena</h3>
                    <p className="text-accent font-medium text-sm">Managing Director</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
                  <p>
                    An entrepreneur with a global perspective and local roots, Mr. Suman Rao brings precision, 
                    innovation, and restraint to the way India builds. With over 16 years of experience in the U.S. 
                    leading technology programs for Fortune 100 companies, his shift to real estate was not to follow trends, 
                    but to redefine them.
                  </p>
                  
                  <p>
                    His academic foundation, B.E. in Mechanical Engineering (Osmania University) and M.S. in Computer Science (USA), 
                    equips him to see design as a science, and construction as art.
                  </p>
                  
                  <p className="font-medium text-white">
                    His vision is not just to build properties, but to create an ecosystem of thoughtful living 
                    for those who expect more from life, and even more from space.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">16+ Years US Experience</span>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">Fortune 100 Leader</span>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">Innovation Expert</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="bg-slate-700/90 backdrop-blur-sm border-2 border-slate-500/60 rounded-xl p-4 hover:shadow-xl hover:border-primary/50 hover:bg-slate-600/90 transition-all duration-300 group text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-custom-blue rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <achievement.icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm mb-2 font-heading text-white">{achievement.title}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Company Values */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-3 font-heading">Our Core Values</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            These principles guide every decision we make and every project we deliver.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="text-center group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -6,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-custom-blue rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg touch-manipulation"
                whileHover={{ 
                  scale: 1.15, 
                  rotate: 8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <motion.h4 
                className="text-sm sm:text-base font-semibold mb-2 font-heading group-hover:text-accent transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {value.title}
              </motion.h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Vision & Mission Side by Side */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Our Vision */}
              <div className="bg-slate-700/80 backdrop-blur-sm border-2 border-slate-500/50 rounded-xl p-3 sm:p-4 shadow-xl text-white hover:bg-slate-600/80 hover:border-primary/50 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold mb-3 font-heading text-white">Our Vision</h3>
                
                <div className="space-y-3 text-left text-sm">
                  <p className="text-gray-300 leading-relaxed">
                    We don't just construct walls. We design quietly. We don't talk about luxury. We live it in the smallest detail.
                  </p>
                  
                  <p className="text-white leading-relaxed font-medium">
                    Our vision is to reimagine what homes mean in a world that never slows down. At Saridena, 
                    we create spaces that do not demand attention, they invite presence.
                  </p>
                  
                  <div className="space-y-2 pt-1 text-sm">
                    <p className="text-gray-300 leading-relaxed italic">
                      Homes that don't overpower lives, but elevate them.
                    </p>
                    
                    <p className="text-gray-300 leading-relaxed italic">
                      Homes where the only crowd is the trees, and the only sound is your own rhythm.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4 pt-3 border-t border-slate-600/30">
                  <div className="flex items-center space-x-2 text-accent">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Thoughtful Design</span>
                  </div>
                  <div className="flex items-center space-x-2 text-accent">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Lasting Quality</span>
                  </div>
                </div>
              </div>
              
              {/* Our Mission */}
              <div className="bg-slate-600/80 backdrop-blur-sm border-2 border-slate-400/50 rounded-xl p-3 sm:p-4 shadow-xl text-white hover:bg-slate-500/80 hover:border-primary/50 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold mb-3 font-heading text-white">Our Mission</h3>
                
                <div className="space-y-3 text-left text-sm">
                  <p className="text-gray-300 leading-relaxed">
                    To craft architectural experiences that blend seamlessly with nature. We don't follow market trends – 
                    we listen to what the environment and spaces want to become.
                  </p>
                  
                  <p className="text-white leading-relaxed font-medium">
                    Every project we undertake is an opportunity to redefine luxury, not through excess, 
                    but through precision, restraint, and an unwavering commitment to excellence.
                  </p>
                  
                  <div className="space-y-2 pt-1 text-sm">
                    <p className="text-gray-300 leading-relaxed italic">
                      Building for those who value quality over quantity.
                    </p>
                    
                    <p className="text-gray-300 leading-relaxed italic">
                      Creating spaces that age beautifully, like fine wine.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4 pt-3 border-t border-slate-500/30">
                  <div className="flex items-center space-x-2 text-accent">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">Precision Craftsmanship</span>
                  </div>
                  <div className="flex items-center space-x-2 text-accent">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-sm font-medium">Innovation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
