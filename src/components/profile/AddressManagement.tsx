import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Home, MapPin, Plus, PencilLine, Trash2, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Address schema for form validation
const addressSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  addressLine1: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  postalCode: z.string().regex(/^\d{6}$/, { message: 'Postal code must be 6 digits' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian phone number' }),
  isDefault: z.boolean().default(false),
  type: z.enum(['home', 'work', 'other']),
});

// Define the address type
type Address = z.infer<typeof addressSchema> & {
  id: string;
};

interface AddressManagementProps {
  onAddressSelect?: (address: Address) => void;
  selectable?: boolean;
  selectedAddressId?: string;
}

export function AddressManagement({ 
  onAddressSelect, 
  selectable = false,
  selectedAddressId
}: AddressManagementProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  
  const { user, supabase } = useAuth();
  const { toast } = useToast();

  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      isDefault: false,
      type: 'home',
    },
  });

  // Fetch user addresses on component mount
  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch addresses from the database
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our schema
      const formattedAddresses: Address[] = data.map(address => ({
        id: address.id,
        name: address.name,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        phone: address.phone,
        isDefault: address.is_default,
        type: address.type as 'home' | 'work' | 'other',
      }));

      setAddresses(formattedAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load addresses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for adding/editing address
  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to manage addresses',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // If setting as default, update all other addresses to non-default
      if (values.isDefault) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      // Format data for Supabase
      const addressData = {
        user_id: user.id,
        name: values.name,
        address_line1: values.addressLine1,
        address_line2: values.addressLine2 || null,
        city: values.city,
        state: values.state,
        postal_code: values.postalCode,
        phone: values.phone,
        is_default: values.isDefault,
        type: values.type,
      };

      if (editAddressId) {
        // Update existing address
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editAddressId);

        if (error) throw error;

        toast({
          title: 'Address Updated',
          description: 'Your address has been updated successfully',
        });
      } else {
        // Add new address
        const { error } = await supabase
          .from('addresses')
          .insert(addressData);

        if (error) throw error;

        toast({
          title: 'Address Added',
          description: 'Your address has been added successfully',
        });
      }

      // Refresh addresses
      await fetchAddresses();
      
      // Reset form and close dialog
      form.reset();
      setEditAddressId(null);
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing an address
  const handleEditAddress = (address: Address) => {
    setEditAddressId(address.id);
    form.reset({
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
      type: address.type,
    });
    setIsAddressDialogOpen(true);
  };

  // Handle deleting an address
  const handleDeleteAddress = async () => {
    if (!deleteAddressId || !user) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', deleteAddressId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Address Deleted',
        description: 'Your address has been deleted successfully',
      });

      // Refresh addresses
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteAddressId(null);
    }
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;

    try {
      // Set all addresses as non-default first
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Default Address Updated',
        description: 'Your default address has been updated',
      });

      // Refresh addresses
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get address icon based on type
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <MapPin className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // Handle selecting an address (for checkout)
  const handleSelectAddress = (address: Address) => {
    if (onAddressSelect && selectable) {
      onAddressSelect(address);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Addresses</h2>
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2"
              onClick={() => {
                setEditAddressId(null);
                form.reset({
                  name: '',
                  addressLine1: '',
                  addressLine2: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  phone: '',
                  isDefault: addresses.length === 0, // If first address, set as default
                  type: 'home',
                });
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editAddressId ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>
                {editAddressId 
                  ? 'Update your shipping address details' 
                  : 'Add a new address for shipping your orders'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="House/Flat No., Building, Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Landmark, Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="400001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9XXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Set as Default Address
                        </FormLabel>
                        <FormDescription>
                          This will be your default shipping address
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Address'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No addresses found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't added any addresses yet. Add your first address to start shopping.
            </p>
            <Button
              className="gap-2" 
              onClick={() => {
                setEditAddressId(null);
                form.reset({
                  ...form.getValues(),
                  isDefault: true, // First address should be default
                });
                setIsAddressDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={cn(
                "overflow-hidden border transition-all hover:shadow-md",
                {
                  "border-primary bg-primary/5": address.isDefault || (selectable && selectedAddressId === address.id),
                }
              )}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1 text-primary">
                        {getAddressIcon(address.type)}
                      </div>
                      <span className="font-medium capitalize">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="flex items-center text-xs text-primary gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => handleEditAddress(address)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/80"
                            onClick={() => setDeleteAddressId(address.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this address. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteAddressId(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAddress}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{address.name}</p>
                    <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="text-sm text-muted-foreground">{address.addressLine2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p className="text-sm">Phone: {address.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="p-4 bg-muted/50 flex justify-between items-center">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  {selectable && (
                    <Button
                      variant={selectedAddressId === address.id ? "default" : "outline"}
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleSelectAddress(address)}
                    >
                      {selectedAddressId === address.id ? "Selected" : "Deliver Here"}
                    </Button>
                  )}
                  {!selectable && address.isDefault && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      Default shipping address
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
