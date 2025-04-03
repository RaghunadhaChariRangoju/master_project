
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MailCheck, Send, Bell, Stamp } from 'lucide-react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Subscription Successful!",
          description: "Thank you for subscribing to our newsletter.",
          duration: 3000,
        });
        setEmail('');
        setIsSubmitting(false);
      }, 1000);
    }
  };

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
      transition: { duration: 0.6 }
    }
  };

  const bulletPoints = [
    { icon: <Bell className="h-5 w-5" />, text: "Exclusive Collection Updates" },
    { icon: <Stamp className="h-5 w-5" />, text: "Artisan Stories & Techniques" },
    { icon: <MailCheck className="h-5 w-5" />, text: "Special Offers & Discounts" }
  ];

  return (
    <section className="relative overflow-hidden py-20">
      {/* Decorative elements and background */}
      <div className="absolute inset-0 bg-gradient-to-br from-agIndigo via-agIndigo to-agBrown opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620097064445-0299dbf8e888?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      {/* Enhanced glossy decorative patterns */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-agGold/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-agTerracotta/5 rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white">
              <MailCheck className="h-8 w-8" />
            </motion.div>
            
            {/* Enhanced ultra glossy heading with refined depth and shine */}
            <motion.h2 
              variants={itemVariants} 
              className="text-3xl md:text-4xl font-bold mb-4 font-serif relative"
            >
              <span className="inline-block relative">
                <span className="relative z-10 bg-gradient-to-br from-white via-white to-agGold/80 bg-clip-text text-transparent drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
                  Stay Connected with 
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-sm z-0"></span>
              </span>{" "}
              <span className="inline-block relative">
                <span className="relative z-10 bg-gradient-to-br from-agGold via-agGold to-white bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] [text-shadow:0_1px_1px_rgba(255,215,0,0.3)]">
                  AG Handlooms
                </span>
                <span className="absolute inset-0 bg-gradient-to-tr from-agGold/30 to-white/20 blur-sm z-0"></span>
              </span>
            </motion.h2>
            
            {/* Enhanced glossy subheading with improved texture */}
            <motion.p 
              variants={itemVariants} 
              className="mb-8 text-white/95 leading-relaxed tracking-wide text-lg font-light drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] [text-shadow:0_1px_0_rgba(255,255,255,0.1)]"
            >
              Subscribe to our newsletter for exclusive updates on new collections, artisan stories, and special offers.
            </motion.p>
            
            <motion.div 
              variants={containerVariants}
              className="space-y-4 mb-8 hidden lg:block"
            >
              {bulletPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3 text-white/90 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-agGold/40 transition-all duration-300">
                    {point.icon}
                  </div>
                  <span className="group-hover:text-white transition-all duration-300 drop-shadow-sm font-medium bg-gradient-to-r from-white/90 via-white to-white/80 bg-clip-text [text-shadow:0_0.5px_0_rgba(255,255,255,0.2)]">
                    {point.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl"
          >
            <div className="text-center mb-6">
              {/* Enhanced ultra glossy title with reflection effect */}
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-white/90 to-agGold/80 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] [text-shadow:0_1px_0_rgba(255,255,255,0.3)]">
                Join Our Newsletter
              </h3>
              <p className="text-white/80 text-sm mt-2 tracking-wide [text-shadow:0_0.5px_0_rgba(255,255,255,0.1)]">
                Be the first to know about new collections and special offers
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 pl-12 focus:border-agGold focus-visible:ring-1 focus-visible:ring-agGold focus-visible:ring-offset-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                  <MailCheck className="h-5 w-5" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-agGold via-agGold to-agTerracotta hover:from-agTerracotta hover:to-agGold text-white group transition-all duration-500 h-12 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full"></div>
                    <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Subscribing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] [text-shadow:0_1px_0_rgba(0,0,0,0.2)]">Subscribe Now</span>
                    <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              
              {/* Mobile bullet points with glossy text */}
              <div className="space-y-3 pt-4 lg:hidden">
                {bulletPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 text-white/90 active:scale-105 transition-transform touch-manipulation"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      {point.icon}
                    </div>
                    <span className="text-sm drop-shadow-sm bg-gradient-to-r from-white/90 to-white/80 bg-clip-text [text-shadow:0_0.5px_0_rgba(255,255,255,0.1)]">
                      {point.text}
                    </span>
                  </div>
                ))}
              </div>
            </form>
            
            <div className="flex justify-center gap-2 items-center mt-6">
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
              <p className="text-xs text-white/70 [text-shadow:0_0.5px_0_rgba(255,255,255,0.05)]">
                We respect your privacy. Unsubscribe at any time.
              </p>
              <div className="w-2 h-2 rounded-full bg-white/40"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
