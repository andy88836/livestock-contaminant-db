"""
Supabase 数据导入脚本
将 CSV 文件中的毒性数据导入到 Supabase 数据库
"""

import pandas as pd
import os
from supabase import create_client, Client
from typing import Optional
import math

# ============ 配置部分 ============
# 请替换为您的 Supabase 项目信息
SUPABASE_URL = "YOUR_SUPABASE_URL"  # 从 Supabase 控制台获取
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"  # 从 Supabase 控制台获取

# CSV 文件路径
CSV_FILE_PATH = "../Acute Toxicity_chicken_oral_LD50.csv"

# 表名
TABLE_NAME = "toxicity_chicken_ld50"
# =================================


def calculate_risk_level(value: float) -> str:
    """
    根据毒性值计算风险等级
    LD50 (mg/kg):
    - < 50: 高毒 (High)
    - 50-500: 中毒 (Medium)
    - 500-5000: 低毒 (Low)
    - > 5000: 实际无毒 (Very Low)
    """
    if pd.isna(value):
        return "Unknown"
    if value < 50:
        return "High"
    elif value < 500:
        return "Medium"
    elif value < 5000:
        return "Low"
    else:
        return "Very Low"


def categorize_chemical(name: str) -> Optional[str]:
    """
    根据化学品名称推断分类
    """
    name_lower = name.lower()

    # 有机氯农药
    if any(x in name_lower for x in ['lindane', 'aldrin', 'endrin', 'dieldrin', 'chlordane', 'heptachlor']):
        return "Organochlorine Pesticide"

    # 有机磷农药
    if any(x in name_lower for x in ['parathion', 'malathion', 'chlorpyrifos', 'diazinon', 'phosmet']):
        return "Organophosphate Pesticide"

    # 氨基甲酸酯
    if any(x in name_lower for x in ['carbaryl', 'carbofuran', 'aldicarb', 'methomyl']):
        return "Carbamate"

    # 除草剂
    if any(x in name_lower for x in ['atrazine', 'simazine', 'alachlor', 'metolachlor', 'paraquat']):
        return "Herbicide"

    # 拟除虫菊酯
    if any(x in name_lower for x in ['permethrin', 'cypermethrin', 'deltamethrin', 'allethrin']):
        return "Pyrethroid"

    # 重金属
    if any(x in name_lower for x in ['mercury', 'lead', 'arsenic', 'cadmium']):
        return "Heavy Metal"

    # 真菌毒素
    if any(x in name_lower for x in ['aflatoxin', 'fumonisin', 'deoxynivalenol', 'zearalenone', 't-2']):
        return "Mycotoxin"

    # 药物
    if any(x in name_lower for x in ['antibiotic', 'sulfonamide', 'tetracycline']):
        return "Pharmaceutical"

    return "Other"


def import_to_supabase(csv_path: str) -> None:
    """
    从 CSV 文件导入数据到 Supabase
    """
    print(f"📖 读取 CSV 文件: {csv_path}")

    # 读取 CSV 文件
    try:
        df = pd.read_csv(csv_path)
        print(f"✅ 成功读取 {len(df)} 条数据")
    except Exception as e:
        print(f"❌ 读取 CSV 文件失败: {e}")
        return

    # 显示前几行数据
    print("\n📊 数据预览:")
    print(df.head())
    print(f"\n列名: {df.columns.tolist()}")

    # 检查必需的列
    required_columns = ['TAID', 'Name', 'Toxicity Value']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"❌ CSV 文件缺少必需的列: {missing_columns}")
        return

    # 初始化 Supabase 客户端
    print(f"\n🔗 连接到 Supabase...")
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase 连接成功")
    except Exception as e:
        print(f"❌ Supabase 连接失败: {e}")
        print("\n请检查:")
        print("1. SUPABASE_URL 是否正确")
        print("2. SUPABASE_KEY 是否正确")
        return

    # 准备数据
    print(f"\n🔄 准备导入 {len(df)} 条数据...")

    imported_count = 0
    failed_count = 0
    failed_records = []

    for index, row in df.iterrows():
        try:
            # 处理空值
            taid = str(row['TAID']) if pd.notna(row['TAID']) else f"TOX-{index}"
            name = str(row['Name']) if pd.notna(row['Name']) else "Unknown"
            iupac_name = str(row['IUPAC Name']) if pd.notna(row['IUPAC Name']) else None
            pubchem_cid = int(row['PubChem CID']) if pd.notna(row['PubChem CID']) else None
            smiles = str(row['Canonical SMILES']) if pd.notna(row['Canonical SMILES']) else None
            inchikey = str(row['InChIKey']) if pd.notna(row['InChIKey']) else None

            toxicity_value = float(row['Toxicity Value']) if pd.notna(row['Toxicity Value']) else 0.0

            # 计算风险等级
            risk_level = calculate_risk_level(toxicity_value)

            # 分类化学品
            category = categorize_chemical(name)

            # 构建数据记录
            record = {
                'id': taid,
                'name': name,
                'iupac_name': iupac_name,
                'pubchem_cid': pubchem_cid,
                'canonical_smiles': smiles,
                'inchikey': inchikey,
                'toxicity_value': toxicity_value,
                'toxicity_unit': 'mg/kg',
                'test_organism': 'Chicken',
                'administration_route': 'Oral',
                'endpoint': 'LD50',
                'category': category,
                'risk_level': risk_level
            }

            # 插入到 Supabase
            result = supabase.table(TABLE_NAME).insert(record).execute()

            if result.data:
                imported_count += 1
                if imported_count % 50 == 0:
                    print(f"   已导入: {imported_count}/{len(df)}")
            else:
                failed_count += 1
                failed_records.append({'taid': taid, 'name': name, 'error': 'No data returned'})

        except Exception as e:
            failed_count += 1
            failed_records.append({'taid': row.get('TAID', 'Unknown'), 'name': row.get('Name', 'Unknown'), 'error': str(e)})
            print(f"⚠️  导入失败 (行 {index}): {e}")

    # 导入完成
    print("\n" + "="*50)
    print("📊 导入完成统计:")
    print(f"✅ 成功导入: {imported_count} 条")
    print(f"❌ 导入失败: {failed_count} 条")
    print("="*50)

    if failed_records:
        print("\n❌ 失败记录:")
        for record in failed_records[:10]:  # 只显示前10条
            print(f"   - {record['taid']} ({record['name']}): {record['error']}")
        if len(failed_records) > 10:
            print(f"   ... 还有 {len(failed_records) - 10} 条失败记录")

    print("\n✨ 数据导入完成！")
    print(f"🌐 您可以在 Supabase 控制台查看数据: {SUPABASE_URL.replace('/rest/v1', '')}/project")


def main():
    """主函数"""
    print("="*50)
    print("🧪 毒性数据库导入工具")
    print("="*50)

    # 检查配置
    if SUPABASE_URL == "YOUR_SUPABASE_URL" or SUPABASE_KEY == "YOUR_SUPABASE_ANON_KEY":
        print("\n❌ 请先配置 Supabase 连接信息:")
        print("1. 打开 import_data.py 文件")
        print("2. 修改 SUPABASE_URL 和 SUPABASE_KEY")
        print("\n您可以从以下位置获取这些信息:")
        print("   Supabase 控制台 → Project Settings → API")
        return

    # 检查 CSV 文件
    if not os.path.exists(CSV_FILE_PATH):
        print(f"\n❌ 找不到 CSV 文件: {CSV_FILE_PATH}")
        print(f"请确保文件路径正确")
        return

    # 执行导入
    import_to_supabase(CSV_FILE_PATH)


if __name__ == "__main__":
    main()
