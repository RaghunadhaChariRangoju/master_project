// This file now re-exports the API modules for backward compatibility
// New code should use the more specific imports from @/lib/api directly

import { supabase as supabaseClient } from './api/client';
import { productApi as productApiModule } from './api/products';
import { profileApi as profileApiModule } from './api/profiles';
import { orderApi as orderApiModule } from './api/orders';
import { wishlistApi as wishlistApiModule } from './api/wishlist';

// Re-export for backward compatibility
export const supabase = supabaseClient;
export const productApi = productApiModule;
export const profileApi = profileApiModule;
export const orderApi = orderApiModule;
export const wishlistApi = wishlistApiModule;

// Default export for backward compatibility
export default supabase;
