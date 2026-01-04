export enum PollutantCategory {
  ANTIBIOTIC = 'Antibiotic',
  HORMONE = 'Hormone',
  PESTICIDE = 'Pesticide',
  HEAVY_METAL = 'Heavy Metal',
  OTHER = 'Other'
}

export enum RiskLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum AOPNodeType {
  MIE = 'MIE', // Molecular Initiating Event
  KE = 'KE',   // Key Event
  AO = 'AO'    // Adverse Outcome
}

export interface Pollutant {
  id: string;
  name: string;
  casNumber: string;
  category: PollutantCategory;
  usage: string;
  smiles: string;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface ToxicityData {
  id: string;
  pollutantId: string;
  toxicityType: string; // e.g., Neurotoxicity, Endocrine
  testOrganism: string;
  endpoint: string; // e.g., LC50, EC50
  value: number;
  unit: string;
  reference: string;
}

export interface AOPNode {
  id: string;
  label: string;
  type: AOPNodeType;
}

export interface AOPEdge {
  source: string;
  target: string;
}

export interface AOPData {
  pollutantId: string;
  nodes: AOPNode[];
  edges: AOPEdge[];
}

export type ViewState = 'DASHBOARD' | 'LIST' | 'DETAIL' | 'COMPARE';

// ============ Supabase 毒性数据库相关类型 ============

/**
 * 鸡口服急性毒性 LD50 数据记录
 */
export interface ToxicityRecord {
  id: string;                      // TAID (如 TOX-1273)
  name: string;                    // 化学品名称
  iupac_name?: string | null;      // IUPAC 标准名称
  pubchem_cid?: number | null;     // PubChem CID
  canonical_smiles?: string | null; // SMILES 结构式
  inchikey?: string | null;        // InChIKey
  toxicity_value: number;          // LD50 毒性值
  toxicity_unit: string;           // 毒性单位 (mg/kg)
  test_organism: string;           // 试验生物 (Chicken)
  administration_route: string;    // 给药方式 (Oral)
  endpoint: string;                // 检测指标 (LD50)
  category?: string | null;        // 化学品分类
  risk_level?: string | null;      // 风险等级 (High/Medium/Low/Very Low)
  created_at?: string;             // 创建时间
}

/**
 * 风险等级枚举
 */
export enum ToxicityRiskLevel {
  HIGH = 'High',           // 高毒 (LD50 < 50 mg/kg)
  MEDIUM = 'Medium',       // 中毒 (50-500 mg/kg)
  LOW = 'Low',            // 低毒 (500-5000 mg/kg)
  VERY_LOW = 'Very Low',  // 实际无毒 (> 5000 mg/kg)
  UNKNOWN = 'Unknown'      // 未知
}

/**
 * 化学品分类枚举
 */
export enum ChemicalCategory {
  ORGANOCHLORINE_PESTICIDE = 'Organochlorine Pesticide',
  ORGANOPHOSPHATE_PESTICIDE = 'Organophosphate Pesticide',
  CARBAMATE = 'Carbamate',
  HERBICIDE = 'Herbicide',
  PYRETHROID = 'Pyrethroid',
  HEAVY_METAL = 'Heavy Metal',
  MYCOTOXIN = 'Mycotoxin',
  PHARMACEUTICAL = 'Pharmaceutical',
  OTHER = 'Other'
}

/**
 * 筛选选项
 */
export interface FilterOptions {
  search?: string;
  riskLevel?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * 统计数据
 */
export interface StatisticsData {
  total: number;
  riskDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
}
