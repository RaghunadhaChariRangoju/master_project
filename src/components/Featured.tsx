
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Featured = () => {
  return (
    <section className="section-padding overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-agIndigo to-agBrown opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595341595379-cf1cd0fb7fb1?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center bg-fixed opacity-20 mix-blend-overlay"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-white"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-4">Featured Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Summer Handloom Collection 2025</h2>
            <p className="mb-6 text-white/90">
              Discover our exclusive collection of lightweight handloom fabrics, perfect for the season. Each piece features traditional motifs reimagined for contemporary wardrobes.
            </p>
            <Link to="/collections/summer">
              <Button className="bg-white text-agIndigo hover:bg-agGold hover:text-white group transition-all duration-300 transform hover:translate-x-1">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div 
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/public/lovable-uploads/19b430ba-b151-45a0-8f5e-4261e99889f7.png" 
                alt="Summer Collection Handloom Fabric" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <motion.div 
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg mt-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/public/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png" 
                alt="Traditional Handloom Saree" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
