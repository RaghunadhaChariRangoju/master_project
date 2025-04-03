
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type Category = {
  id: number;
  name: string;
  bgColor: string;
  link: string;
  description: string;
};

const categories: Category[] = [
  {
    id: 1,
    name: 'Sarees',
    bgColor: 'bg-gradient-to-br from-agTerracotta/30 to-agTerracotta/70',
    link: '/shop/sarees',
    description: 'Handcrafted sarees with intricate patterns and vibrant colors',
  },
  {
    id: 2,
    name: 'Fabrics',
    bgColor: 'bg-gradient-to-br from-agIndigo/30 to-agIndigo/70',
    link: '/shop/fabrics',
    description: 'Premium quality handloom fabrics for your custom creations',
  },
];

const CategorySection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-agBeige to-agCream py-16 overflow-hidden">
      <div className="container-custom max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-agIndigo/10 text-agIndigo text-sm font-medium mb-4">Discover Our Collection</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Each piece tells a unique story of traditional craftsmanship and heritage</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link to={category.link}>
                <Card className="product-card group relative h-full overflow-hidden border border-gray-100 rounded-xl bg-white shadow-sm transform transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                  <div className={`relative h-80 ${category.bgColor} flex items-center justify-center`}>
                    {/* Category name as a decorative background element */}
                    <div className="text-white text-7xl font-serif opacity-20">{category.name}</div>
                    
                    {/* Card content positioned at the bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent z-20">
                      <h3 className="text-2xl font-medium text-white mb-2">{category.name}</h3>
                      <p className="text-white/90 text-sm">{category.description}</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">View Collection</span>
                    <div className="w-10 h-10 rounded-full bg-agTerracotta/10 flex items-center justify-center group-hover:bg-agTerracotta transition-all duration-300">
                      <ArrowRight className="h-5 w-5 text-agTerracotta group-hover:text-white transform transition-all duration-500 group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/shop">
            <span className="inline-flex items-center text-agIndigo hover:text-agTerracotta transition-colors duration-300 font-medium">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
