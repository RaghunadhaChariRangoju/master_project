import { supabase } from './client';
import { Profile } from '@/types/supabase';
import { handleApiError } from './utils';

export interface ProfileUpdateData {
  name?: string;
  phone?: string | null;
  address?: string | null;
}

/**
 * Get a user profile by user ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, `getProfile(${userId})`);
  }
}

/**
 * Create a new user profile
 */
export async function createProfile(profile: { id: string; name: string; phone?: string | null; address?: string | null }): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: profile.id,
        name: profile.name,
        phone: profile.phone || null,
        address: profile.address || null
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, 'createProfile');
  }
}

/**
 * Update a user profile
 */
export async function updateProfile(userId: string, updates: ProfileUpdateData): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, `updateProfile(${userId})`);
  }
}

/**
 * Ensure a user profile exists, creating one if it doesn't
 */
export async function ensureProfile(userId: string, defaultName: string): Promise<Profile> {
  try {
    // First try to get the profile
    const existingProfile = await getProfile(userId);
    
    // If it exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // Otherwise create a new profile
    return await createProfile({ id: userId, name: defaultName });
  } catch (error) {
    handleApiError(error, `ensureProfile(${userId})`);
  }
}

export const profileApi = {
  getProfile,
  createProfile,
  updateProfile,
  ensureProfile
};
