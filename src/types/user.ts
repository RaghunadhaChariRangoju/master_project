export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  role?: 'customer' | 'admin' | 'manager';
  email_verified?: boolean;
  last_login?: string;
}

export interface UserProfile extends User {
  addresses?: UserAddress[];
  preferences?: UserPreferences;
}

export interface UserAddress {
  id: string;
  user_id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
  type: 'home' | 'work' | 'other';
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}
