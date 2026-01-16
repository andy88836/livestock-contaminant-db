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

export type ViewState = 'DASHBOARD' | 'TOXICITY';

// ============ Supabase Toxicity Database Types ============

/**
 * Chicken Oral Acute Toxicity LD50 Data Record
 * Column names match Supabase table "Acute Toxicity_chicken_oral_LD50"
 */
export interface ToxicityRecord {
  TAID: string;                    // Toxicity data ID (e.g., TOX-1273)
  Name: string;                    // Chemical name
  "IUPAC Name"?: string | null;    // IUPAC standard name
  "PubChem CID"?: number | null;   // PubChem CID
  "Canonical SMILES"?: string | null; // SMILES structure
  InChIKey?: string | null;        // InChIKey
  "Toxicity Value": number;        // LD50 toxicity value
}

/**
 * Risk level enumeration
 */
export enum ToxicityRiskLevel {
  HIGH = 'High',           // High toxicity (LD50 < 50 mg/kg)
  MEDIUM = 'Medium',       // Moderate toxicity (50-500 mg/kg)
  LOW = 'Low',            // Low toxicity (500-5000 mg/kg)
  VERY_LOW = 'Very Low',  // Practically non-toxic (> 5000 mg/kg)
  UNKNOWN = 'Unknown'      // Unknown
}

/**
 * Chemical category enumeration
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
 * Filter options
 */
export interface FilterOptions {
  search?: string;
  riskLevel?: string;
  category?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * Statistics data
 */
export interface StatisticsData {
  total: number;
  riskDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
}
