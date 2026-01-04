import { Pollutant, PollutantCategory, RiskLevel, ToxicityData, AOPData, AOPNodeType } from '../types';

// Initial Mock Data
let POLLUTANTS: Pollutant[] = [
  {
    id: 'p1',
    name: 'Oxytetracycline',
    casNumber: '79-57-2',
    category: PollutantCategory.ANTIBIOTIC,
    usage: 'Veterinary antibiotic for cattle and poultry.',
    smiles: 'C[C@H]1[C@@H](O)[C@](O)(C(=O)C(=C(O)C1=O)C(=O)N)N(C)C',
    riskLevel: RiskLevel.MEDIUM,
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: 'p2',
    name: 'Estradiol',
    casNumber: '50-28-2',
    category: PollutantCategory.HORMONE,
    usage: 'Growth promoter in livestock.',
    smiles: 'C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2O)CCC4=C3C=CC(=C4)O',
    riskLevel: RiskLevel.HIGH, // Endocrine disruptor
    createdAt: new Date('2023-02-10').toISOString(),
  },
  {
    id: 'p3',
    name: 'Tylosin',
    casNumber: '1401-69-0',
    category: PollutantCategory.ANTIBIOTIC,
    usage: 'Feed additive for growth promotion.',
    smiles: 'CC[C@H]1OC(=O)C[C@@H](O)CC=CC=CC[C@H](C)C[C@@H](C)C(=O)...',
    riskLevel: RiskLevel.LOW,
    createdAt: new Date('2023-03-05').toISOString(),
  },
  {
    id: 'p4',
    name: 'Atrazine',
    casNumber: '1912-24-9',
    category: PollutantCategory.PESTICIDE,
    usage: 'Herbicide used in corn feed production.',
    smiles: 'CCNC1=NC(=NC(=N1)Cl)NC(C)C',
    riskLevel: RiskLevel.HIGH,
    createdAt: new Date('2023-04-20').toISOString(),
  }
];

let TOXICITY_DATA: ToxicityData[] = [
  { id: 't1', pollutantId: 'p1', toxicityType: 'Acute Toxicity', testOrganism: 'Daphnia magna', endpoint: 'EC50', value: 102, unit: 'mg/L', reference: 'EPA 2020' },
  { id: 't2', pollutantId: 'p1', toxicityType: 'Microbial Inhibition', testOrganism: 'Activated Sludge', endpoint: 'IC50', value: 15, unit: 'mg/L', reference: 'Journal of HazMat 2019' },
  { id: 't3', pollutantId: 'p2', toxicityType: 'Endocrine Disruption', testOrganism: 'Danio rerio', endpoint: 'EC50', value: 0.005, unit: 'mg/L', reference: 'Aquatic Tox 2021' },
  { id: 't4', pollutantId: 'p2', toxicityType: 'Reproductive', testOrganism: 'Oryzias latipes', endpoint: 'LOEC', value: 0.001, unit: 'mg/L', reference: 'Env Sci Tech 2022' },
  { id: 't5', pollutantId: 'p3', toxicityType: 'Acute Toxicity', testOrganism: 'Rainbow Trout', endpoint: 'LC50', value: 300, unit: 'mg/L', reference: 'Vet Pharma DB' },
  { id: 't6', pollutantId: 'p4', toxicityType: 'Endocrine Disruption', testOrganism: 'Xenopus laevis', endpoint: 'EC50', value: 0.1, unit: 'mg/L', reference: 'Nature 2018' },
];

const AOP_DATA: Record<string, AOPData> = {
  'p2': {
    pollutantId: 'p2',
    nodes: [
      { id: 'mie1', label: 'Estrogen Receptor Activation', type: AOPNodeType.MIE },
      { id: 'ke1', label: 'Altered Gene Expression', type: AOPNodeType.KE },
      { id: 'ke2', label: 'Increased Vitellogenin', type: AOPNodeType.KE },
      { id: 'ke3', label: 'Gonadal Abnormality', type: AOPNodeType.KE },
      { id: 'ao1', label: 'Population Decline', type: AOPNodeType.AO },
    ],
    edges: [
      { source: 'mie1', target: 'ke1' },
      { source: 'ke1', target: 'ke2' },
      { source: 'ke2', target: 'ke3' },
      { source: 'ke3', target: 'ao1' },
    ]
  },
  'p1': {
    pollutantId: 'p1',
    nodes: [
      { id: 'mie1', label: 'Ribosome Binding', type: AOPNodeType.MIE },
      { id: 'ke1', label: 'Protein Synthesis Inhibition', type: AOPNodeType.KE },
      { id: 'ke2', label: 'Bacterial Growth Inhibition', type: AOPNodeType.KE },
      { id: 'ao1', label: 'Microbial Community Shift', type: AOPNodeType.AO },
    ],
    edges: [
      { source: 'mie1', target: 'ke1' },
      { source: 'ke1', target: 'ke2' },
      { source: 'ke2', target: 'ao1' },
    ]
  }
};

// --- Service Methods ---

export const getPollutants = async (): Promise<Pollutant[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...POLLUTANTS]), 300));
};

export const getPollutantById = async (id: string): Promise<Pollutant | undefined> => {
  return new Promise((resolve) => setTimeout(() => resolve(POLLUTANTS.find(p => p.id === id)), 200));
};

export const createPollutant = async (data: Omit<Pollutant, 'id' | 'createdAt' | 'riskLevel'>): Promise<Pollutant> => {
  const newId = `p${Date.now()}`;
  
  // Auto-grading logic (Mock)
  let risk = RiskLevel.LOW;
  if (data.category === PollutantCategory.HORMONE || data.category === PollutantCategory.HEAVY_METAL) {
    risk = RiskLevel.HIGH;
  }
  
  const newPollutant: Pollutant = {
    ...data,
    id: newId,
    riskLevel: risk,
    createdAt: new Date().toISOString(),
  };
  
  POLLUTANTS = [...POLLUTANTS, newPollutant];
  return new Promise((resolve) => setTimeout(() => resolve(newPollutant), 400));
};

export const deletePollutant = async (id: string): Promise<void> => {
  POLLUTANTS = POLLUTANTS.filter(p => p.id !== id);
  TOXICITY_DATA = TOXICITY_DATA.filter(t => t.pollutantId !== id);
  return new Promise((resolve) => setTimeout(resolve, 300));
};

export const getToxicityData = async (pollutantId: string): Promise<ToxicityData[]> => {
  return new Promise((resolve) => 
    setTimeout(() => resolve(TOXICITY_DATA.filter(t => t.pollutantId === pollutantId)), 300)
  );
};

export const getAllToxicityData = async (): Promise<ToxicityData[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...TOXICITY_DATA]), 300));
};

export const getAOPData = async (pollutantId: string): Promise<AOPData | null> => {
  return new Promise((resolve) => 
    setTimeout(() => resolve(AOP_DATA[pollutantId] || null), 300)
  );
};

// Helper for exporting
export const getFullExportData = async () => {
  return {
    pollutants: POLLUTANTS,
    toxicity: TOXICITY_DATA,
    aop: AOP_DATA,
    generatedAt: new Date().toISOString()
  };
};
