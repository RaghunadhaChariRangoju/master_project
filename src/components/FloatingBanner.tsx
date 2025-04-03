
import React, { useEffect, useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Gift, Tag, Flame, Sparkle, X, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type BannerItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const bannerItems: BannerItem[] = [
  {
    id: 1,
    title: "Diwali Sale",
    description: "20% off on all handloom sarees",
    icon: <Gift className="h-5 w-5" />,
    color: "text-white",
    bgColor: "bg-gradient-to-r from-agTerracotta to-agBrown",
  },
  {
    id: 2,
    title: "Festival Special",
    description: "Buy 2 Get 1 Free on all home textiles",
    icon: <Tag className="h-5 w-5" />,
    color: "text-foreground",
    bgColor: "bg-gradient-to-r from-agGold to-amber-200",
  },
  {
    id: 3,
    title: "Weekend Flash Sale",
    description: "Limited time offers on selected items",
    icon: <Flame className="h-5 w-5" />,
    color: "text-white",
    bgColor: "bg-gradient-to-r from-agIndigo to-blue-500",
  },
  {
    id: 4,
    title: "New Collection",
    description: "Explore our latest handwoven designs",
    icon: <Sparkle className="h-5 w-5" />,
    color: "text-foreground",
    bgColor: "bg-gradient-to-r from-agCream to-secondary",
  },
];

const FloatingBanner = () => {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('bannerDismissed');
    if (bannerDismissed) {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (!minimized && !isPaused) {
      const interval = setInterval(() => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % bannerItems.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [minimized, isPaused]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('bannerDismissed', 'true');
  };

  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  const resetBanner = () => {
    localStorage.removeItem('bannerDismissed');
    setDismissed(false);
    setMinimized(false);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotate: 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        mass: 1,
        when: "beforeChildren",
        staggerChildren: 0.08,
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1] // Custom ease curve for more bounce
      }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transition: { 
        duration: 0.5, 
        ease: [0.32, 0.72, 0, 1]
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
    hover: { 
      scale: 1.2, 
      rotate: [0, 10, 0],
      transition: { 
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const minimizeButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  if (dismissed) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          duration: 0.6
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, 15, -15, 0],
          transition: { 
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={resetBanner}
        className="fixed bottom-4 right-4 z-50 p-2 bg-agTerracotta text-white rounded-full shadow-lg hover:bg-agBrown transition-colors flex items-center justify-center"
        aria-label="Show promotions"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        key="banner"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
          minimized ? "w-12 h-12 rounded-full overflow-hidden" : "w-80 rounded-lg shadow-lg overflow-hidden"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {minimized ? (
          <motion.button 
            variants={minimizeButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleMinimize}
            className="w-full h-full bg-agTerracotta text-white flex items-center justify-center hover:bg-agBrown transition-colors"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ 
                y: [-3, 3, -3],
                transition: { 
                  duration: 1.2, 
                  repeat: Infinity,
                  repeatType: "mirror" as const,
                  ease: "easeInOut"
                }
              }}
            >
              <ChevronUp className="h-6 w-6" />
            </motion.div>
          </motion.button>
        ) : (
          <motion.div 
            variants={childVariants}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            animate={{ 
              boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              ],
              transition: { 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div 
              variants={childVariants}
              className="flex items-center justify-between px-3 py-2 bg-muted"
            >
              <motion.h3 
                variants={childVariants}
                className="text-sm font-medium"
              >
                Special Offers
              </motion.h3>
              <div className="flex items-center space-x-1">
                <motion.button 
                  variants={minimizeButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleMinimize} 
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="Minimize"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
                <motion.button 
                  variants={minimizeButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDismiss} 
                  className="p-1 rounded-full hover:bg-gray-200"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
            
            <Carousel 
              className="w-full"
              opts={{ loop: true, align: "start" }}
              setApi={(api) => {
                if (api) {
                  api.scrollTo(currentItemIndex);
                }
              }}
            >
              <CarouselContent>
                {bannerItems.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 24,
                          delay: 0.1
                        }
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "flex items-center space-x-3 p-4",
                        item.bgColor, 
                        item.color
                      )}
                      onMouseEnter={() => setCurrentItemIndex(index)}
                    >
                      <motion.div 
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full"
                      >
                        {item.icon}
                      </motion.div>
                      <div>
                        <motion.h4 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.15,
                              type: "spring", 
                              stiffness: 500, 
                              damping: 24 
                            }
                          }}
                          className="font-medium"
                        >
                          {item.title}
                        </motion.h4>
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.25,
                              type: "spring", 
                              stiffness: 500, 
                              damping: 24 
                            }
                          }}
                          className="text-sm opacity-90"
                        >
                          {item.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1 pb-1">
                {bannerItems.map((_, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0.4, scale: 0.8 }}
                    animate={{ 
                      opacity: currentItemIndex === index ? 1 : 0.4,
                      scale: currentItemIndex === index ? 1 : 0.8,
                      transition: { duration: 0.3 }
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentItemIndex(index)}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full", 
                      currentItemIndex === index 
                        ? "bg-white" 
                        : "bg-white/40"
                    )}
                  />
                ))}
              </div>
            </Carousel>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingBanner;
