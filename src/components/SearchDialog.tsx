
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Updated search items with all saree categories from the project
const SEARCH_ITEMS = [
  { id: 1, name: 'Cotton Saree', category: 'Sarees', href: '/shop' },
  { id: 2, name: 'Golden Mustard Handloom Saree', category: 'Sarees', href: '/product/1' },
  { id: 3, name: 'Olive Green Handloom Saree', category: 'Sarees', href: '/product/2' },
  { id: 4, name: 'Beige Floral Handloom Saree', category: 'Sarees', href: '/product/3' },
  { id: 5, name: 'Beige Lotus Motif Saree', category: 'Sarees', href: '/product/4' },
  { id: 6, name: 'Pink Handwoven Cotton Saree', category: 'Sarees', href: '/product/5' },
  { id: 7, name: 'Navy Blue Ikkat Saree', category: 'Sarees', href: '/product/6' },
  { id: 8, name: 'Checkered Pattern Handloom Saree', category: 'Sarees', href: '/product/7' },
  { id: 9, name: 'Striped Handloom Cotton Saree', category: 'Sarees', href: '/product/8' },
];

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  const filteredItems = SEARCH_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-2xl animate-fade-in">
        <div className="flex items-center px-4 py-2 border-b">
          <Search className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
          <Command className="bg-transparent flex-1 p-0">
            <CommandInput 
              placeholder="Search for products..." 
              className="h-11 border-0 focus:ring-0" 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </Command>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="hover:rotate-90 transition-transform duration-300">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Command className="bg-transparent">
          <CommandList className="py-2 max-h-[400px]">
            {searchQuery.length > 0 && filteredItems.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {filteredItems.length > 0 && (
              <CommandGroup heading="Products">
                {filteredItems.map((item) => (
                  <CommandItem 
                    key={item.id} 
                    className="py-2 cursor-pointer transition-all duration-200 hover:bg-accent/50 hover:pl-6"
                    onSelect={() => handleSelect(item.href)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.category}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
