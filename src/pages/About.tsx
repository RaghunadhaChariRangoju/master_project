
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Award, Users, Leaf, Clock, Globe, HeartHandshake } from 'lucide-react';

const About = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-agCream/50">
      <Navbar />
      <main className="flex-grow container-custom section-padding">
        {/* Hero Section */}
        <motion.div 
          className="mb-16 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-agBrown">Our Story</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Celebrating the timeless art of handloom weaving and the skilled artisans who preserve this precious heritage.
          </p>
        </motion.div>

        {/* Our History */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="relative h-[450px] rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/public/lovable-uploads/f2741ab4-9d00-415f-aa23-f3baed0500c1.png" 
              alt="Handloom Weaver" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-agBrown/10 text-agBrown text-sm font-medium mb-4">Our History</span>
            <h2 className="text-3xl font-bold mb-6 text-agBrown">A Heritage of Craftsmanship</h2>
            <p className="text-muted-foreground mb-6">
              Founded in 1998, AG Handlooms began as a small family workshop dedicated to preserving the ancient textile traditions of India. What started as a passion project by the Gupta family has grown into a respected name in the handloom industry, connecting skilled artisans with appreciative customers around the world.
            </p>
            <p className="text-muted-foreground">
              For over 25 years, we've worked directly with weaving communities across India, ensuring fair wages, ethical practices, and the preservation of techniques that have been passed down through generations. Each textile tells a story of cultural heritage and meticulous craftsmanship.
            </p>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="order-2 md:order-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-agTerracotta/10 text-agTerracotta text-sm font-medium mb-4">Our Mission</span>
            <h2 className="text-3xl font-bold mb-6 text-agBrown">Preserving Tradition, Empowering Artisans</h2>
            <p className="text-muted-foreground mb-6">
              At AG Handlooms, our mission extends beyond creating beautiful textiles. We are committed to:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="bg-agBrown/10 p-1 rounded-full mr-3 mt-1">
                  <HeartHandshake className="h-4 w-4 text-agBrown" />
                </span>
                <span>Supporting over 200 artisan families with fair trade practices and sustainable livelihoods</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agBrown/10 p-1 rounded-full mr-3 mt-1">
                  <Clock className="h-4 w-4 text-agBrown" />
                </span>
                <span>Preserving traditional handloom techniques that date back centuries</span>
              </li>
              <li className="flex items-start">
                <span className="bg-agBrown/10 p-1 rounded-full mr-3 mt-1">
                  <Leaf className="h-4 w-4 text-agBrown" />
                </span>
                <span>Embracing sustainable, eco-friendly production methods that respect our planet</span>
              </li>
            </ul>
          </div>
          <div className="relative h-[450px] rounded-lg overflow-hidden shadow-lg order-1 md:order-2">
            <img 
              src="/public/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png" 
              alt="Traditional Handloom Techniques" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-agIndigo/10 text-agIndigo text-sm font-medium mb-4">Our Values</span>
            <h2 className="text-3xl font-bold mb-6 text-agBrown">What Drives Us Every Day</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our core values shape everything we do, from how we work with artisans to how we create our products.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUpVariants}
            >
              <div className="bg-agTerracotta/10 p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-agTerracotta" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-agBrown">Excellence</h3>
              <p className="text-muted-foreground">
                We pursue perfection in every thread, every design, and every customer interaction. Our commitment to quality is unwavering.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUpVariants}
            >
              <div className="bg-agTerracotta/10 p-3 rounded-full w-fit mb-4">
                <Users className="h-6 w-6 text-agTerracotta" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-agBrown">Community</h3>
              <p className="text-muted-foreground">
                We believe in the power of community and the importance of preserving traditional craft communities for future generations.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUpVariants}
            >
              <div className="bg-agTerracotta/10 p-3 rounded-full w-fit mb-4">
                <Globe className="h-6 w-6 text-agTerracotta" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-agBrown">Sustainability</h3>
              <p className="text-muted-foreground">
                From natural dyes to low-impact production methods, we strive to minimize our environmental footprint at every step.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Our Process */}
        <motion.div 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-agGold/20 text-agBrown text-sm font-medium mb-4">Our Process</span>
            <h2 className="text-3xl font-bold mb-6 text-agBrown">From Fiber to Fabric</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Each AG Handlooms piece follows a meticulous journey from raw materials to finished product.
            </p>
          </div>

          <Card className="border-agGold/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-agGold/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-agBrown">01</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-agBrown">Material Selection</h3>
                  <p className="text-sm text-muted-foreground">Carefully sourcing the finest natural fibers from ethical suppliers</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-agGold/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-agBrown">02</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-agBrown">Design Creation</h3>
                  <p className="text-sm text-muted-foreground">Blending traditional motifs with contemporary aesthetics</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-agGold/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-agBrown">03</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-agBrown">Artisan Weaving</h3>
                  <p className="text-sm text-muted-foreground">Skilled weavers bringing designs to life using traditional looms</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-agGold/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-agBrown">04</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-agBrown">Quality Assurance</h3>
                  <p className="text-sm text-muted-foreground">Rigorous inspection ensuring every piece meets our high standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Team */}
        <motion.div 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-agIndigo/10 text-agIndigo text-sm font-medium mb-4">Our Team</span>
            <h2 className="text-3xl font-bold mb-6 text-agBrown">The People Behind AG Handlooms</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our diverse team combines textile experts, designers, and business professionals all united by a passion for handloom textiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-agIndigo/10 hover:shadow-xl transition-all duration-500 group relative">
              <div className="h-64 bg-gradient-to-br from-agTerracotta/40 to-agTerracotta/80 flex items-center justify-center relative overflow-hidden group-hover:from-agTerracotta/60 group-hover:to-agTerracotta/90 transition-all duration-500">
                <span className="text-white text-6xl font-serif opacity-30 group-hover:opacity-40 group-hover:scale-125 transform transition-all duration-700 rotate-0 group-hover:rotate-6">GC</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 border-t-2 border-b-2 border-white/40 rounded-full animate-spin opacity-30"></div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-agBrown/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <CardContent className="p-6 transform group-hover:translate-y-[-15px] transition-transform duration-500 relative z-10 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-agCream">
                <h3 className="text-xl font-bold mb-1 text-agBrown group-hover:text-agTerracotta transition-colors duration-300">Gopi Chand Miriyala</h3>
                <p className="text-sm text-agIndigo mb-3 group-hover:text-agIndigo/80 transition-colors duration-300">Founder & Creative Director</p>
                <p className="text-sm text-muted-foreground transform translate-y-0 group-hover:translate-y-[-5px] transition-transform duration-500 opacity-80 group-hover:opacity-100">
                  With over 30 years of experience in textile design, Gopi Chand leads our creative vision and artisan partnerships.
                </p>
                <div className="h-0.5 w-0 bg-gradient-to-r from-agTerracotta to-agBrown mt-4 group-hover:w-full transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-agIndigo/10 hover:shadow-xl transition-all duration-500 group relative">
              <div className="h-64 bg-gradient-to-br from-agBrown/40 to-agBrown/80 flex items-center justify-center relative overflow-hidden group-hover:from-agBrown/60 group-hover:to-agBrown/90 transition-all duration-500">
                <span className="text-white text-6xl font-serif opacity-30 group-hover:opacity-40 group-hover:scale-125 transform transition-all duration-700 rotate-0 group-hover:rotate-6">CR</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 border-t-2 border-b-2 border-white/40 rounded-full animate-spin opacity-30"></div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-agTerracotta/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <CardContent className="p-6 transform group-hover:translate-y-[-15px] transition-transform duration-500 relative z-10 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-agCream">
                <h3 className="text-xl font-bold mb-1 text-agBrown group-hover:text-agBrown transition-colors duration-300">Chandan Reddy Doma</h3>
                <p className="text-sm text-agIndigo mb-3 group-hover:text-agIndigo/80 transition-colors duration-300">Head of Production</p>
                <p className="text-sm text-muted-foreground transform translate-y-0 group-hover:translate-y-[-5px] transition-transform duration-500 opacity-80 group-hover:opacity-100">
                  Chandan ensures the highest quality standards are maintained throughout our production process.
                </p>
                <div className="h-0.5 w-0 bg-gradient-to-r from-agBrown to-agGold mt-4 group-hover:w-full transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-agIndigo/10 hover:shadow-xl transition-all duration-500 group relative">
              <div className="h-64 bg-gradient-to-br from-agIndigo/40 to-agIndigo/80 flex items-center justify-center relative overflow-hidden group-hover:from-agIndigo/60 group-hover:to-agIndigo/90 transition-all duration-500">
                <span className="text-white text-6xl font-serif opacity-30 group-hover:opacity-40 group-hover:scale-125 transform transition-all duration-700 rotate-0 group-hover:rotate-6">SA</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 border-t-2 border-b-2 border-white/40 rounded-full animate-spin opacity-30"></div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-agGold/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <CardContent className="p-6 transform group-hover:translate-y-[-15px] transition-transform duration-500 relative z-10 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-agCream">
                <h3 className="text-xl font-bold mb-1 text-agBrown group-hover:text-agIndigo transition-colors duration-300">Sindhu Arani</h3>
                <p className="text-sm text-agIndigo mb-3 group-hover:text-agIndigo/80 transition-colors duration-300">Sustainability Lead</p>
                <p className="text-sm text-muted-foreground transform translate-y-0 group-hover:translate-y-[-5px] transition-transform duration-500 opacity-80 group-hover:opacity-100">
                  Sindhu focuses on implementing eco-friendly practices and ethical sourcing across our operations.
                </p>
                <div className="h-0.5 w-0 bg-gradient-to-r from-agIndigo to-agTerracotta mt-4 group-hover:w-full transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
