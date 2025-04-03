
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Updated product data with real images
const PRODUCTS = [
  {
    id: 1,
    name: "Golden Mustard Handloom Saree",
    price: 3999,
    image: "/lovable-uploads/8811595c-561c-4c71-bee6-2f2b17af31a8.png",
    category: "Sarees"
  },
  {
    id: 2,
    name: "Olive Green Handloom Saree",
    price: 4500,
    image: "/lovable-uploads/92ff61e4-bdb6-4361-94ae-6f644ed2fb97.png",
    category: "Sarees"
  },
  {
    id: 3,
    name: "Beige Floral Handloom Saree",
    price: 3750,
    image: "/lovable-uploads/5ed815a3-93ae-42af-ae00-02c01f0ca1cf.png",
    category: "Sarees"
  },
  {
    id: 4,
    name: "Beige Lotus Motif Saree",
    price: 4250,
    image: "/lovable-uploads/eab094f1-d8f5-4749-bf8a-647599fc5e20.png",
    category: "Sarees"
  },
  {
    id: 5,
    name: "Pink Handwoven Cotton Saree",
    price: 3800,
    image: "/lovable-uploads/68193f81-5551-4aa8-8dee-14a2140ca725.png",
    category: "Sarees"
  },
  {
    id: 6,
    name: "Navy Blue Ikkat Saree",
    price: 5500,
    image: "/lovable-uploads/f6b7485d-1c0a-45d7-a7a6-4fb036ee11c9.png",
    category: "Sarees"
  },
  {
    id: 7,
    name: "Checkered Pattern Handloom Saree",
    price: 4200,
    image: "/lovable-uploads/19b430ba-b151-45a0-8f5e-4261e99889f7.png",
    category: "Sarees"
  },
  {
    id: 8,
    name: "Striped Handloom Cotton Saree",
    price: 3900,
    image: "/lovable-uploads/f2741ab4-9d00-415f-aa23-f3baed0500c1.png",
    category: "Sarees"
  }
];

const Shop = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [category, setCategory] = useState("all");

  // Filter products by category
  const filteredProducts = category === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category.toLowerCase() === category.toLowerCase());

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // default is featured
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container-custom section-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Shop</h1>
        
        {/* Filters and sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={category === "all" ? "default" : "outline"} 
              onClick={() => setCategory("all")}
              className="text-sm transform transition duration-200 hover:scale-105"
            >
              All
            </Button>
            <Button 
              variant={category === "sarees" ? "default" : "outline"} 
              onClick={() => setCategory("sarees")}
              className="text-sm transform transition duration-200 hover:scale-105"
            >
              Sarees
            </Button>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] transition duration-200 hover:border-agTerracotta">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured" className="hover:bg-agBeige/50 transition-colors">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-agBeige/50 transition-colors">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-agBeige/50 transition-colors">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className="group border rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-square bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full transform transition duration-200 hover:scale-110 hover:bg-white"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full transform transition duration-200 hover:scale-110 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium group-hover:text-agTerracotta transition-colors duration-300">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <p className="font-bold group-hover:text-agBrown transition-colors duration-300">₹{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
