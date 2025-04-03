import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Collections = () => {
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

  // Collections data
  const collections = [
    {
      id: 1,
      title: "Summer 2025",
      description: "Lightweight fabrics with traditional motifs, perfect for the warm season. Vibrant colors inspired by summer blooms.",
      image: "/lovable-uploads/19b430ba-b151-45a0-8f5e-4261e99889f7.png",
      link: "/shop?collection=summer",
      featured: true,
      launchDate: "Available Now",
      region: "Andhra Pradesh"
    },
    {
      id: 2,
      title: "Wedding Collection",
      description: "Exquisite handloom sarees with intricate zari work and rich embellishments for the perfect bridal ensemble.",
      image: "/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png",
      link: "/shop?collection=wedding",
      featured: false,
      launchDate: "Available Now",
      region: "West Bengal"
    },
    {
      id: 3,
      title: "Heritage Collection",
      description: "Timeless designs that celebrate India's rich textile heritage, featuring ancient motifs and traditional techniques.",
      image: "/lovable-uploads/f6b7485d-1c0a-45d7-a7a6-4fb036ee11c9.png",
      link: "/shop?collection=heritage",
      featured: false,
      launchDate: "Available Now",
      region: "Tamil Nadu"
    },
    {
      id: 4,
      title: "Festive Collection",
      description: "Celebrate special occasions with our vibrant festive collection featuring gold work and rich colors.",
      image: "/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png",
      link: "/shop?collection=festive",
      featured: false,
      launchDate: "Coming Soon",
      region: "Gujarat"
    },
    {
      id: 5,
      title: "Contemporary Fusion",
      description: "Modern interpretations of traditional handloom techniques, perfect for the fashion-forward customer.",
      image: "/lovable-uploads/5ed815a3-93ae-42af-ae00-02c01f0ca1cf.png",
      link: "/shop?collection=contemporary",
      featured: false,
      launchDate: "Coming Soon",
      region: "Karnataka"
    }
  ];

  // Get featured collection
  const featuredCollection = collections.find(collection => collection.featured);
  // Get other collections
  const otherCollections = collections.filter(collection => !collection.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-agIndigo">
          <div className="absolute inset-0 bg-gradient-to-r from-agIndigo/90 to-agBrown/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/lovable-uploads/f6b7485d-1c0a-45d7-a7a6-4fb036ee11c9.png')] bg-cover bg-center opacity-40"></div>
          <div className="container-custom relative z-20 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Collections</h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                Discover our curated collections of handcrafted textiles, each telling a unique story of artisanal heritage and craftsmanship.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured collection */}
        {featuredCollection && (
          <section className="section-padding bg-agBeige">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-agGold/20 text-agBrown text-sm font-medium mb-4">Featured Collection</span>
                <h2 className="text-3xl md:text-4xl font-bold">Highlighting Our Best</h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="aspect-[4/3] overflow-hidden rounded-xl"
                >
                  <img 
                    src={featuredCollection.image}
                    alt={featuredCollection.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl md:text-3xl font-bold">{featuredCollection.title} Collection</h3>
                  <p className="text-muted-foreground">{featuredCollection.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-agTerracotta" />
                      {featuredCollection.launchDate}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-agTerracotta" />
                      {featuredCollection.region}
                    </div>
                  </div>
                  
                  <Link to={featuredCollection.link}>
                    <Button className="mt-4 bg-agTerracotta hover:bg-agBrown group">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* All collections */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-agIndigo/10 text-agIndigo text-sm font-medium mb-4">Handcrafted Excellence</span>
              <h2 className="text-3xl md:text-4xl font-bold">All Collections</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Each collection represents months of meticulous craftsmanship and design, preserving traditional techniques while embracing contemporary aesthetics.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {collections.map((collection) => (
                <motion.div
                  key={collection.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={collection.link}>
                    <Card className="overflow-hidden border-gray-100 hover:border-agGold/50 hover:shadow-md transition-all duration-300 h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={collection.image} 
                          alt={collection.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4">
                          {collection.launchDate === "Coming Soon" ? (
                            <span className="inline-block px-3 py-1 bg-agGold/90 text-white text-xs font-medium rounded-full">
                              Coming Soon
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-agTerracotta/90 text-white text-xs font-medium rounded-full">
                              Available Now
                            </span>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-medium">{collection.title}</h3>
                          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                            {collection.region}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{collection.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-agIndigo hover:text-agTerracotta transition-colors duration-300 group inline-flex items-center">
                            Explore
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Collection process */}
        <section className="section-padding bg-agCream">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-agTerracotta/10 text-agTerracotta text-sm font-medium">Our Process</span>
                <h2 className="text-3xl md:text-4xl font-bold">How We Create Our Collections</h2>
                <p className="text-muted-foreground">
                  Each collection follows a meticulous process from concept to creation, ensuring the highest quality and authenticity.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-agIndigo text-white flex items-center justify-center font-medium">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium">Research & Inspiration</h3>
                      <p className="text-sm text-muted-foreground">Our designers travel to different regions to study traditional motifs and techniques.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-agIndigo text-white flex items-center justify-center font-medium">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Design Development</h3>
                      <p className="text-sm text-muted-foreground">We carefully create designs that honor traditions while adding contemporary elements.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-agIndigo text-white flex items-center justify-center font-medium">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Artisan Partnership</h3>
                      <p className="text-sm text-muted-foreground">We collaborate with skilled weavers who bring these designs to life using traditional looms.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-agIndigo text-white flex items-center justify-center font-medium">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium">Quality Control</h3>
                      <p className="text-sm text-muted-foreground">Each piece undergoes rigorous quality checks before becoming part of our collection.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/0d8ca5aa-bdae-462a-8f5c-de04c0080ec6.png" 
                    alt="Collection Process" 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg mt-6">
                  <img 
                    src="/lovable-uploads/e47b2fbe-656f-42a2-812d-fade92dcd62e.png"
                    alt="Handloom Weaving" 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png" 
                    alt="Fabric Detail" 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg mt-6">
                  <img 
                    src="/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png" 
                    alt="Final Product" 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="section-padding bg-agIndigo text-white">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore Our Collections?</h2>
              <p className="text-white/80 mb-8">
                Discover the perfect handloom piece for your wardrobe or home. Each purchase supports traditional artisans and helps preserve ancient crafts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button className="bg-white text-agIndigo hover:bg-agGold hover:text-white group px-8">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-white text-agGold font-medium hover:bg-white/10 px-8">
                    Contact For Custom Orders
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
