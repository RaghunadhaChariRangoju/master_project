import { supabase } from './client';
import { productApi } from './products';
import { profileApi } from './profiles';
import { orderApi } from './orders';
import { ApiError } from './utils';

// Export all API modules
export { 
  supabase,
  productApi,
  profileApi,
  orderApi,
  ApiError
};

// Export a default API object that includes all sub-APIs
const api = {
  products: productApi,
  profiles: profileApi,
  orders: orderApi,
};

export default api;
