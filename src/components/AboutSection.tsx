
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-agBeige/30 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative h-[450px] md:h-[550px] overflow-visible"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
          >
            {/* Main large image */}
            <motion.div 
              className="absolute z-10 inset-0 overflow-hidden rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/public/lovable-uploads/f2741ab4-9d00-415f-aa23-f3baed0500c1.png" 
                alt="Handloom Weaver" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
            
            {/* Bottom right smaller image */}
            <motion.div 
              className="absolute z-20 bottom-4 -right-8 w-40 h-40 rounded-lg overflow-hidden border-4 border-agCream shadow-lg hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <img 
                src="/public/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png" 
                alt="Traditional Techniques" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
            
            {/* Top left circular image */}
            <motion.div 
              className="absolute z-30 top-4 -left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-agCream shadow-lg hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <img 
                src="/public/lovable-uploads/eab094f1-d8f5-4749-bf8a-647599fc5e20.png" 
                alt="Handloom Details" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-agBrown/10 text-agBrown text-sm font-medium mb-4">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Heritage & Craftsmanship</h2>
            <p className="text-muted-foreground mb-4">
              AG Handlooms was founded with a passion for preserving the rich heritage of Indian textiles. Our journey began with a mission to revive traditional handloom techniques while creating sustainable livelihood opportunities for skilled artisans.
            </p>
            <p className="text-muted-foreground mb-6">
              Each AG Handlooms product is a testament to the intricate craftsmanship passed down through generations. We work directly with weavers across India, ensuring fair wages and preserving their time-honored techniques.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div 
                className="flex flex-col items-center p-4 bg-white/70 rounded-lg shadow-sm"
                variants={iconVariants}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Award className="h-8 w-8 text-agTerracotta mb-2" />
                <h4 className="font-medium text-agBrown">Premium Quality</h4>
                <p className="text-xs text-center text-muted-foreground">Finest handpicked materials</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center p-4 bg-white/70 rounded-lg shadow-sm"
                variants={iconVariants}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Users className="h-8 w-8 text-agTerracotta mb-2" />
                <h4 className="font-medium text-agBrown">Artisan Made</h4>
                <p className="text-xs text-center text-muted-foreground">Supporting 200+ artisan families</p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center p-4 bg-white/70 rounded-lg shadow-sm"
                variants={iconVariants}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Clock className="h-8 w-8 text-agTerracotta mb-2" />
                <h4 className="font-medium text-agBrown">Heritage</h4>
                <p className="text-xs text-center text-muted-foreground">25+ years of tradition</p>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/about">
                <Button className="bg-agBrown text-white hover:bg-agTerracotta group transition-all duration-300">
                  Read Our Story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
