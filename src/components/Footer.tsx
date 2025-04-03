import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Sparkles, Flame, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Newsletter schema validation
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const Footer = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    try {
      setIsSubmitting(true);
      // Validate the email
      const validatedData = newsletterSchema.parse({ email });
      
      // In a real application, you would submit this to your API
      // This is just a simulation for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Success
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        setEmailError('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-agBrown text-white">
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="relative inline-block text-2xl font-serif font-bold mb-4 group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-agGold/10 blur-md rounded-2xl transform scale-110 group-hover:scale-125 transition-all duration-500"></div>
              <span className="relative z-10 bg-gradient-to-r from-white via-agGold to-agTerracotta bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
                AG
              </span>
              <Sparkles className="h-4 w-4 text-agGold inline-block mx-0.5 animate-pulse" />
              <span className="relative z-10 bg-gradient-to-r from-agTerracotta via-white to-white bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] whitespace-nowrap">
                <span className="group-hover:animate-pulse transition-all duration-700">H</span>andlooms
              </span>
              <Flame className="h-3 w-3 text-agTerracotta absolute -top-1 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute left-0 right-0 bottom-0 h-0.5 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-agGold via-white to-agGold"></div>
              <div className="absolute inset-0 bg-white/5 blur-[3px] rounded-full transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </h3>
            <p className="text-white/80 mb-6">
              Preserving tradition, embracing sustainability, and creating timeless handcrafted textiles since 1995.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Home Page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Shop All Products"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="About Us Page"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Contact Us Page"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Blog Articles"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/shop/sarees" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Browse Sarees"
                >
                  Sarees
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop/fabrics" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Browse Fabrics"
                >
                  Fabrics
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop/new-arrivals" 
                  className="text-white/80 hover:text-white transition-colors duration-200 inline-block py-1"
                  aria-label="Browse New Arrivals"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-lg font-bold mb-4">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-agGold ${
                      emailError ? 'border-red-500' : ''
                    }`}
                    aria-label="Email for newsletter"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {emailError && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                {emailError && (
                  <p id="email-error" className="text-sm text-red-400">
                    {emailError}
                  </p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-agGold hover:bg-agGold/90 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Subscribe <Send className="h-4 w-4 ml-2" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-agTerracotta" />
                <span className="text-white/80">Raghavendra Colony, Kondapur, Hyderabad - 500084, Telangana, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-agTerracotta" />
                <a 
                  href="tel:+919014216285" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                  aria-label="Call our phone number"
                >
                  +91 9014216285
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-agTerracotta" />
                <a 
                  href="mailto:ag.sarithi@gmail.com" 
                  className="text-white/80 hover:text-white transition-colors duration-200"
                  aria-label="Email us"
                >
                  ag.sarithi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} AG Handlooms. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link 
              to="/privacy-policy" 
              className="hover:text-white transition-colors duration-200 inline-block py-1"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="hover:text-white transition-colors duration-200 inline-block py-1"
              aria-label="Terms of Service"
            >
              Terms of Service
            </Link>
            <Link 
              to="/shipping-policy" 
              className="hover:text-white transition-colors duration-200 inline-block py-1"
              aria-label="Shipping Policy"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
