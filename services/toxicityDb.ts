import { supabase, TABLES } from './supabaseClient';
import { ToxicityRecord } from '../types';

/**
 * Fetch all toxicity data from Supabase
 */
export const getToxicityData = async (): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_ORAL_LD50)
      .select('*')
      .order('"Toxicity Value"', { ascending: true });

    if (error) {
      console.error('Error fetching toxicity data:', error);
      throw error;
    }

    return (data || []) as ToxicityRecord[];
  } catch (error) {
    console.error('Failed to fetch toxicity data:', error);
    throw error;
  }
};

/**
 * Get single toxicity record by TAID
 */
export const getToxicityById = async (id: string): Promise<ToxicityRecord | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_ORAL_LD50)
      .select('*')
      .eq('TAID', id)
      .single();

    if (error) {
      console.error('Error fetching toxicity by ID:', error);
      throw error;
    }

    return data as ToxicityRecord;
  } catch (error) {
    console.error('Failed to fetch toxicity by ID:', error);
    throw error;
  }
};

/**
 * Search toxicity data
 */
export const searchToxicityData = async (searchTerm: string): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_ORAL_LD50)
      .select('*')
      .or(`Name.ilike.%${searchTerm}%,"IUPAC Name".ilike.%${searchTerm}%`)
      .order('"Toxicity Value"', { ascending: true });

    if (error) {
      console.error('Error searching toxicity data:', error);
      throw error;
    }

    return (data || []) as ToxicityRecord[];
  } catch (error) {
    console.error('Failed to search toxicity data:', error);
    throw error;
  }
};
