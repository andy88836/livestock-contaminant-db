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
