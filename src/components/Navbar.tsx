import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, LogOut, Heart, Sparkles, Flame, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SearchDialog from '@/components/SearchDialog';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { wishlistItems, cartCount } = useCart();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;

  // Handle user logout with confirmation
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      // You could also redirect to homepage after logout
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/50 backdrop-blur-md border-b border-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <Avatar className="h-10 w-10 mr-3 border-2 border-agBrown shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <AvatarImage 
                  src="/lovable-uploads/7243dd51-9a19-4088-8c9f-f8819fd21934.png" 
                  alt="AG Handlooms Logo" 
                />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className="flex items-center relative overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-r from-agGold/10 to-agTerracotta/10 blur-md -z-10 rounded-xl"></div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold relative">
                  <span className="relative z-10 bg-gradient-to-r from-agBrown via-agGold to-agTerracotta bg-clip-text text-transparent drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.25)]">
                    AG
                  </span>
                  <Sparkles className="h-4 w-4 text-agGold inline-block mx-0.5 animate-pulse" />
                  <span className="relative z-10 bg-gradient-to-r from-agTerracotta via-agBrown to-agBrown bg-clip-text text-transparent drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.25)]">
                    <span className="group-hover:animate-pulse transition-all duration-700">H</span>andlooms
                  </span>
                  <Flame className="h-3 w-3 text-agTerracotta absolute -top-1 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </h1>
                <div className="absolute left-0 right-0 bottom-0 h-0.5 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-gradient-to-r from-agGold via-agTerracotta to-agGold"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`nav-link font-medium ${isActive('/') ? 'text-agTerracotta after:w-full' : ''}`}>Home</Link>
              <Link to="/shop" className={`nav-link font-medium ${isActive('/shop') ? 'text-agTerracotta after:w-full' : ''}`}>Shop</Link>
              <Link to="/collections" className={`nav-link font-medium ${isActive('/collections') ? 'text-agTerracotta after:w-full' : ''}`}>Collections</Link>
              <Link to="/about" className={`nav-link font-medium ${isActive('/about') ? 'text-agTerracotta after:w-full' : ''}`}>About</Link>
              <Link to="/contact" className={`nav-link font-medium ${isActive('/contact') ? 'text-agTerracotta after:w-full' : ''}`}>Contact</Link>
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="relative"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-agTerracotta text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Cart"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-agTerracotta text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
              
              {authLoading ? (
                <Button variant="ghost" size="icon" disabled>
                  <Loader2 className="h-5 w-5 animate-spin" />
                </Button>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Account">
                      <Avatar className="h-8 w-8">
                        {user?.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user?.name || 'User'} />
                        ) : (
                          <AvatarFallback className="bg-agIndigo text-white">
                            {user?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name || 'User'}
                    </div>
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      {user?.email || ''}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer flex items-center"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> 
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon" aria-label="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Cart" 
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-agTerracotta text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu with AnimatePresence for better transitions */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="md:hidden mt-4 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.nav 
                  className="flex flex-col space-y-4"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                >
                  {[
                    { path: '/', label: 'Home' },
                    { path: '/shop', label: 'Shop' },
                    { path: '/collections', label: 'Collections' },
                    { path: '/about', label: 'About' },
                    { path: '/contact', label: 'Contact' },
                  ].map((item) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link 
                        to={item.path} 
                        className={`nav-link font-medium py-2 ${isActive(item.path) ? 'text-agTerracotta' : ''}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className="flex space-x-4 py-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" /> Search
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setIsWishlistOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" /> Wishlist ({wishlistItems.length})
                    </Button>
                  </div>
                  
                  {authLoading ? (
                    <div className="flex justify-center py-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link to="/profile" className="nav-link font-medium py-2">
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link to="/orders" className="nav-link font-medium py-2">
                          Orders
                        </Link>
                      </motion.div>
                      <motion.button 
                        className="flex items-center text-left text-destructive py-2 w-full"
                        onClick={handleLogout}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </motion.button>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link to="/auth" className={`nav-link font-medium py-2 ${isActive('/auth') ? 'text-agTerracotta' : ''}`}>
                        Login / Register
                      </Link>
                    </motion.div>
                  )}
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Dialogs and Drawers */}
      {isSearchOpen && <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />}
      {isCartOpen && <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />}
      {isWishlistOpen && <WishlistDrawer open={isWishlistOpen} onOpenChange={setIsWishlistOpen} />}
    </>
  );
};

export default Navbar;
