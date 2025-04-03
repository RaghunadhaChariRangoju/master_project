
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative bg-agCream overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599121183322-c237abf64142?q=80&w=1887&auto=format&fit=crop')] bg-cover bg-center opacity-20 hover:opacity-25 transition-opacity duration-1000">
        <motion.div 
          animate={{ scale: 1.05 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-full h-full"
        />
      </div>
      
      {/* Content with Staggered Animation */}
      <div className="container-custom relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Authentic Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-agTerracotta/10 text-agTerracotta text-sm font-medium">
              <Star className="h-4 w-4 mr-1.5 fill-agGold text-agGold" />
              Authentic Handcrafted Textiles
            </span>
          </motion.div>
          
          {/* Main Heading with Gradient */}
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-agTerracotta to-agBrown bg-clip-text text-transparent">Traditional Craftsmanship</span>
            <br className="hidden md:block" /> for Modern Living
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground"
          >
            Experience the beauty of handwoven textiles crafted with care and passion by skilled artisans using time-honored techniques
          </motion.p>
          
          {/* Badges - Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-agBrown">
              <Heart className="h-3.5 w-3.5 mr-1.5 text-agTerracotta" />
              Made with Love
            </span>
            <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-agBrown">
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-agIndigo" />
              Free Shipping
            </span>
            <span className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-agBrown">
              <Star className="h-3.5 w-3.5 mr-1.5 text-agGold" />
              Premium Quality
            </span>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/shop">
              <Button className="btn-primary transform transition-all duration-500 hover:scale-105 hover:shadow-lg group min-w-36">
                Shop Collection
                <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button className="btn-secondary transform transition-all duration-500 hover:scale-105 hover:shadow-md min-w-36">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-0 right-0 mx-auto text-center animate-bounce"
        >
          <div className="w-8 h-8 mx-auto border-2 border-agTerracotta rounded-full flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-agTerracotta -rotate-90" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
