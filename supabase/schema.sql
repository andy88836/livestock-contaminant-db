-- Supabase 数据库表结构
-- 毒性数据表：鸡口服急性毒性 LD50

-- 删除已存在的表（如果需要重新创建）
-- DROP TABLE IF EXISTS toxicity_chicken_ld50 CASCADE;

-- 创建毒性数据表
CREATE TABLE IF NOT EXISTS toxicity_chicken_ld50 (
  id TEXT PRIMARY KEY,                          -- TAID (如 TOX-1273)
  name TEXT NOT NULL,                           -- 化学品名称
  iupac_name TEXT,                              -- IUPAC 标准名称
  pubchem_cid INTEGER,                          -- PubChem CID
  canonical_smiles TEXT,                        -- SMILES 结构式
  inchikey TEXT,                                -- InChIKey
  toxicity_value NUMERIC NOT NULL,              -- LD50 毒性值
  toxicity_unit TEXT DEFAULT 'mg/kg',          -- 毒性单位
  test_organism TEXT DEFAULT 'Chicken',         -- 试验生物
  administration_route TEXT DEFAULT 'Oral',    -- 给药方式
  endpoint TEXT DEFAULT 'LD50',                 -- 检测指标
  category TEXT,                                -- 化学品分类（可选）
  risk_level TEXT,                              -- 风险等级（可选）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引（加速查询）
CREATE INDEX IF NOT EXISTS idx_toxicity_name ON toxicity_chicken_ld50(name);
CREATE INDEX IF NOT EXISTS idx_toxicity_value ON toxicity_chicken_ld50(toxicity_value);
CREATE INDEX IF NOT EXISTS idx_toxicity_pubchem ON toxicity_chicken_ld50(pubchem_cid);
CREATE INDEX IF NOT EXISTS idx_toxicity_risk ON toxicity_chicken_ld50(risk_level);

-- 启用行级安全（RLS）
ALTER TABLE toxicity_chicken_ld50 ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取数据
CREATE POLICY "Allow public read access" ON toxicity_chicken_ld50
  FOR SELECT USING (true);

-- 允许所有人插入数据（如需限制可修改）
CREATE POLICY "Allow public insert" ON toxicity_chicken_ld50
  FOR INSERT WITH CHECK (true);

-- 允许所有人更新数据
CREATE POLICY "Allow public update" ON toxicity_chicken_ld50
  FOR UPDATE USING (true);

-- 允许所有人删除数据
CREATE POLICY "Allow public delete" ON toxicity_chicken_ld50
  FOR DELETE USING (true);

-- 添加注释
COMMENT ON TABLE toxicity_chicken_ld50 IS '鸡口服急性毒性 LD50 数据表';
COMMENT ON COLUMN toxicity_chicken_ld50.id IS '毒性唯一标识符 (TAID)';
COMMENT ON COLUMN toxicity_chicken_ld50.name IS '化学品通用名称';
COMMENT ON COLUMN toxicity_chicken_ld50.iupac_name IS 'IUPAC 标准化学名称';
COMMENT ON COLUMN toxicity_chicken_ld50.pubchem_cid IS 'PubChem 化合物标识符';
COMMENT ON COLUMN toxicity_chicken_ld50.canonical_smiles IS 'SMILES 分子结构式';
COMMENT ON COLUMN toxicity_chicken_ld50.inchikey IS 'InChIKey 分子密钥';
COMMENT ON COLUMN toxicity_chicken_ld50.toxicity_value IS 'LD50 毒性值';
COMMENT ON COLUMN toxicity_chicken_ld50.toxicity_unit IS '毒性单位 (默认 mg/kg)';
COMMENT ON COLUMN toxicity_chicken_ld50.test_organism IS '试验生物 (默认 Chicken)';
COMMENT ON COLUMN toxicity_chicken_ld50.administration_route IS '给药方式 (默认 Oral)';
COMMENT ON COLUMN toxicity_chicken_ld50.endpoint IS '检测指标 (默认 LD50)';
