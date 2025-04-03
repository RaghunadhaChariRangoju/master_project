import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { productApi } from '@/lib/api';
import { Product } from '@/types/product';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  onSale: boolean;
  inStock: boolean;
  colors: string[];
  materials: string[];
  sort: 'newest' | 'price-low-high' | 'price-high-low' | 'popularity';
}

const initialFilters: FilterOptions = {
  search: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 10000,
  onSale: false,
  inStock: false,
  colors: [],
  materials: [],
  sort: 'newest',
};

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Purple'];
const MATERIALS = ['Cotton', 'Silk', 'Linen', 'Wool', 'Polyester', 'Bamboo'];

interface AdvancedSearchProps {
  onSearch: (products: Product[]) => void;
  initialSearchTerm?: string;
}

export function AdvancedSearch({ onSearch, initialSearchTerm = '' }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    ...initialFilters,
    search: initialSearchTerm,
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const navigate = useNavigate();

  // Count active filters for the badge
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.minPrice > initialFilters.minPrice) count++;
    if (filters.maxPrice < initialFilters.maxPrice) count++;
    if (filters.onSale) count++;
    if (filters.inStock) count++;
    count += filters.colors.length;
    count += filters.materials.length;
    if (filters.sort !== 'newest') count++;
    
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle search when filters change
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Build the filter parameters for the API
      const params = {
        search: filters.search,
        category: filters.category !== 'all' ? filters.category : undefined,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        on_sale: filters.onSale || undefined,
        in_stock: filters.inStock || undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        materials: filters.materials.length > 0 ? filters.materials : undefined,
        sort: filters.sort,
      };

      // Call the API to get filtered products
      const products = await productApi.getProducts(params);
      onSearch(products);

      // Update URL with search parameters for bookmarking/sharing
      const searchParams = new URLSearchParams();
      if (filters.search) searchParams.set('q', filters.search);
      if (filters.category !== 'all') searchParams.set('category', filters.category);
      if (filters.minPrice > initialFilters.minPrice) searchParams.set('min', filters.minPrice.toString());
      if (filters.maxPrice < initialFilters.maxPrice) searchParams.set('max', filters.maxPrice.toString());
      if (filters.sort !== 'newest') searchParams.set('sort', filters.sort);

      navigate(`/shop?${searchParams.toString()}`, { replace: true });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle price range changes
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  // Handle checkbox filters for colors and materials
  const handleCheckboxChange = (type: 'colors' | 'materials', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
        
      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  // Reset all filters to default
  const resetFilters = () => {
    setFilters(initialFilters);
    setPriceRange([initialFilters.minPrice, initialFilters.maxPrice]);
    
    // Update URL by removing all search parameters
    navigate('/shop', { replace: true });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search handloom products..."
            className="pl-10"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Select
          value={filters.sort}
          onValueChange={value => setFilters(prev => ({ ...prev, sort: value as any }))}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>
                Refine your search with the following filters
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Category</h3>
                  <Select
                    value={filters.category}
                    onValueChange={value => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="sarees">Sarees</SelectItem>
                      <SelectItem value="fabrics">Fabrics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="home">Home Decor</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="text-sm font-medium">Price Range</h3>
                    <span className="text-sm text-muted-foreground">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={10000}
                    step={100}
                    onValueChange={handlePriceChange}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹0</span>
                    <span>₹10,000+</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Availability Filters */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="in-stock" 
                        checked={filters.inStock}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, inStock: checked === true }))
                        }
                      />
                      <Label htmlFor="in-stock">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="on-sale" 
                        checked={filters.onSale}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, onSale: checked === true }))
                        }
                      />
                      <Label htmlFor="on-sale">On Sale</Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Colors Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Colors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {COLORS.map(color => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`color-${color}`} 
                          checked={filters.colors.includes(color)}
                          onCheckedChange={() => handleCheckboxChange('colors', color)}
                        />
                        <Label htmlFor={`color-${color}`}>{color}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Materials Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Materials</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {MATERIALS.map(material => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`material-${material}`} 
                          checked={filters.materials.includes(material)}
                          onCheckedChange={() => handleCheckboxChange('materials', material)}
                        />
                        <Label htmlFor={`material-${material}`}>{material}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-6">
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Apply Filters'}
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>
              
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.search}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.category !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(filters.minPrice > initialFilters.minPrice || 
               filters.maxPrice < initialFilters.maxPrice) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Price: ₹{filters.minPrice} - ₹{filters.maxPrice}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        minPrice: initialFilters.minPrice,
                        maxPrice: initialFilters.maxPrice
                      }));
                      setPriceRange([initialFilters.minPrice, initialFilters.maxPrice]);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.inStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.onSale && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  On Sale
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, onSale: false }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {filters.colors.map(color => (
                <Badge key={color} variant="secondary" className="flex items-center gap-1">
                  Color: {color}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleCheckboxChange('colors', color)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              {filters.materials.map(material => (
                <Badge key={material} variant="secondary" className="flex items-center gap-1">
                  Material: {material}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleCheckboxChange('materials', material)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              
              {filters.sort !== 'newest' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {filters.sort.replace(/-/g, ' ')}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'newest' }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
