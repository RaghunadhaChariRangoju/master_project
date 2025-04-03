
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, BadgeCheck, Shield, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type Testimonial = {
  id: number;
  name: string;
  location: string;
  avatar?: string;
  comment: string;
  rating: number;
  purchaseDate: string;
  reviewDate: string;
  verifiedPurchase: boolean;
  product?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop',
    comment: "The quality of the sarees from AG Handlooms is exceptional. The craftsmanship and attention to detail are evident in every piece. I've received countless compliments on my collection!",
    rating: 5,
    purchaseDate: '2024-01-15',
    reviewDate: '2024-02-05',
    verifiedPurchase: true,
    product: 'Golden Mustard Handloom Saree',
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop',
    comment: "I purchased home textiles for my new apartment and I'm amazed by the quality. The colors are vibrant and the fabric is durable. Definitely worth the investment!",
    rating: 4,
    purchaseDate: '2023-11-20',
    reviewDate: '2023-12-10',
    verifiedPurchase: true,
    product: 'Handloom Home Textiles Set',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop',
    comment: "AG Handlooms has become my go-to place for authentic handloom products. Their customer service is impeccable and the products are exactly as described. Highly recommend!",
    rating: 5,
    purchaseDate: '2024-02-02',
    reviewDate: '2024-03-01',
    verifiedPurchase: true,
    product: 'Navy Blue Ikkat Saree',
  },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-agBeige/30 to-agCream relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-agIndigo/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-agTerracotta/5 blur-3xl"></div>
      
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-agTerracotta/10 text-agTerracotta text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Authentic reviews from verified customers who have purchased our products</p>
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-2 text-agIndigo" />
            <span>All reviews are from verified purchases and are not edited or modified</span>
          </div>
        </div>
        
        <div className="relative px-4 md:px-10">
          <motion.div 
            key={activeTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-20 h-20 text-agGold/10">
                <Quote className="w-full h-full" />
              </div>
              
              <CardContent className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < testimonials[activeTestimonial].rating ? "text-agGold fill-agGold" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  {testimonials[activeTestimonial].verifiedPurchase && (
                    <div className="flex items-center text-xs text-agTerracotta">
                      <BadgeCheck className="h-4 w-4 mr-1" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>
                
                {testimonials[activeTestimonial].product && (
                  <div className="mb-3 text-sm text-agBrown">
                    <span className="font-medium">Product:</span> {testimonials[activeTestimonial].product}
                  </div>
                )}
                
                <p className="text-gray-700 italic mb-8 text-lg md:text-xl">"{testimonials[activeTestimonial].comment}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-agGold/20">
                      <AvatarImage src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} />
                      <AvatarFallback className="bg-agIndigo text-white">
                        {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].location}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>Purchased: {formatDate(testimonials[activeTestimonial].purchaseDate)}</div>
                    <div>Reviewed: {formatDate(testimonials[activeTestimonial].reviewDate)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Navigation arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-2 right-0 flex justify-between pointer-events-none w-full px-2 md:px-0">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full bg-white shadow-sm border-agTerracotta/30 text-agTerracotta hover:bg-agTerracotta hover:text-white pointer-events-auto transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full bg-white shadow-sm border-agTerracotta/30 text-agTerracotta hover:bg-agTerracotta hover:text-white pointer-events-auto transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial ? "bg-agTerracotta scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
