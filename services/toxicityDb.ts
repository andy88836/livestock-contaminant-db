import { supabase, TABLES } from './supabaseClient';
import { ToxicityRecord } from '../types';

/**
 * 从 Supabase 获取所有毒性数据
 */
export const getToxicityData = async (): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('*')
      .order('toxicity_value', { ascending: true });

    if (error) {
      console.error('Error fetching toxicity data:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch toxicity data:', error);
    throw error;
  }
};

/**
 * 根据 ID 获取单条毒性数据
 */
export const getToxicityById = async (id: string): Promise<ToxicityRecord | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching toxicity by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch toxicity by ID:', error);
    throw error;
  }
};

/**
 * 搜索毒性数据
 */
export const searchToxicityData = async (searchTerm: string): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,iupac_name.ilike.%${searchTerm}%`)
      .order('toxicity_value', { ascending: true });

    if (error) {
      console.error('Error searching toxicity data:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search toxicity data:', error);
    throw error;
  }
};

/**
 * 根据风险等级筛选数据
 */
export const filterByRiskLevel = async (riskLevel: string): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('*')
      .eq('risk_level', riskLevel)
      .order('toxicity_value', { ascending: true });

    if (error) {
      console.error('Error filtering by risk level:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to filter by risk level:', error);
    throw error;
  }
};

/**
 * 根据分类筛选数据
 */
export const filterByCategory = async (category: string): Promise<ToxicityRecord[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('*')
      .eq('category', category)
      .order('toxicity_value', { ascending: true });

    if (error) {
      console.error('Error filtering by category:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to filter by category:', error);
    throw error;
  }
};

/**
 * 添加新的毒性数据
 */
export const addToxicityRecord = async (record: Omit<ToxicityRecord, 'created_at'>): Promise<ToxicityRecord> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error('Error adding toxicity record:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add toxicity record:', error);
    throw error;
  }
};

/**
 * 更新毒性数据
 */
export const updateToxicityRecord = async (id: string, updates: Partial<ToxicityRecord>): Promise<ToxicityRecord> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating toxicity record:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update toxicity record:', error);
    throw error;
  }
};

/**
 * 删除毒性数据
 */
export const deleteToxicityRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting toxicity record:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete toxicity record:', error);
    throw error;
  }
};

/**
 * 获取统计数据
 */
export const getStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOXICITY_CHICKEN_LD50)
      .select('risk_level, category');

    if (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }

    // 计算风险等级分布
    const riskDistribution = (data || []).reduce((acc, record) => {
      const level = record.risk_level || 'Unknown';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 计算分类分布
    const categoryDistribution = (data || []).reduce((acc, record) => {
      const category = record.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data?.length || 0,
      riskDistribution,
      categoryDistribution
    };
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    throw error;
  }
};
