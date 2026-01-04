# 🚀 毒性数据库网站部署完整指南

本指南将帮助您将鸡口服急性毒性 LD50 数据库部署到 Vercel，使用 Supabase 作为后端数据库。

---

## 📋 前置准备

在开始之前，您需要准备：

1. ✅ GitHub 账号（已完成）
2. ✅ Vercel 账号（已完成）
3. ❌ Supabase 账号（需要注册）
4. ❌ Python 3.8+（用于数据导入）

---

## 🔗 步骤 1：创建 Supabase 项目

### 1.1 注册 Supabase

1. 访问：https://supabase.com
2. 点击 **"Start your project"**
3. 使用 **GitHub 账号登录**

---

### 1.2 创建新项目

1. 登录后，点击 **"New Project"**
2. 填写项目信息：

   ```
   Name: livestock-toxicity-db
   Database Password: [设置一个强密码，请记住！]
   Region: Southeast Asia (Singapore)
   Pricing Plan: Free
   ```

3. 点击 **"Create new project"**
4. **等待 2-3 分钟**，项目创建完成

---

### 1.3 获取 API 密钥

1. 在左侧菜单点击 **Settings** → **API**
2. 复制以下信息（保存到记事本）：

   ```
   Project URL: https://xxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

**⚠️ 重要：请保存这两个值，后续步骤会用到！**

---

## 🗄️ 步骤 2：创建数据库表

### 2.1 打开 SQL 编辑器

1. 在 Supabase 控制台左侧菜单点击 **SQL Editor**
2. 点击 **"New query"**

---

### 2.2 执行 SQL 脚本

1. 打开项目文件夹中的 `supabase/schema.sql` 文件
2. 复制文件中的所有 SQL 代码
3. 粘贴到 Supabase SQL 编辑器中
4. 点击 **"Run"** 执行

---

### 2.3 验证表创建

1. 在左侧菜单点击 **Table Editor**
2. 应该能看到新创建的表：`toxicity_chicken_ld50`

---

## 📥 步骤 3：导入数据

### 3.1 安装 Python 依赖

打开命令行，进入项目目录：

```bash
cd D:\CHL\livestock-contaminant-db\supabase
```

安装依赖：

```bash
pip install -r requirements.txt
```

如果您的 Python 版本较老，可以使用：

```bash
pip3 install -r requirements.txt
```

---

### 3.2 配置导入脚本

1. 打开 `supabase/import_data.py` 文件
2. 找到文件开头的配置部分：

   ```python
   # ============ 配置部分 ============
   SUPABASE_URL = "YOUR_SUPABASE_URL"
   SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"
   ```

3. 替换为您在**步骤 1.3**中获取的值：

   ```python
   SUPABASE_URL = "https://xxxxxxxxx.supabase.co"
   SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   ```

4. 保存文件

---

### 3.3 执行导入

在命令行运行：

```bash
python import_data.py
```

或者：

```bash
python3 import_data.py
```

---

### 3.4 查看导入结果

导入完成后，您应该看到类似的输出：

```
✅ 成功导入: 347 条
❌ 导入失败: 0 条
```

在 Supabase 控制台的 Table Editor 中，您现在应该能看到所有数据！

---

## 🔧 步骤 4：配置环境变量

### 4.1 创建本地环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Gemini API（可选）
GEMINI_API_KEY=your_gemini_api_key_here
```

**替换为您的实际值！**

---

## 🧪 步骤 5：本地测试

### 5.1 启动开发服务器

在项目根目录运行：

```bash
npm run dev
```

---

### 5.2 访问应用

浏览器打开：http://localhost:5173

您应该能看到毒性数据界面！

---

## 🚀 步骤 6：部署到 Vercel

### 6.1 提交代码到 Git

```bash
git add .
git commit -m "Add Supabase integration and toxicity database"
git push origin main
```

---

### 6.2 更新 Vercel 环境变量

1. 访问 Vercel 项目页面
2. 点击 **Settings** → **Environment Variables**
3. 添加以下环境变量：

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `VITE_SUPABASE_URL` | 您的 Supabase URL | **Production**, **Preview**, **Development** |
   | `VITE_SUPABASE_ANON_KEY` | 您的 Supabase Anon Key | **Production**, **Preview**, **Development** |

4. 点击 **Save**

---

### 6.3 重新部署

1. 在 Vercel 项目页面点击 **Deployments**
2. 点击最新部署右侧的 **...** 菜单
3. 选择 **Redeploy**
4. 等待部署完成

---

## ✨ 完成！

您的毒性数据库网站现在已经上线了！🎉

访问 Vercel 提供的 URL（例如：https://livestock-toxicity-db.vercel.app）即可使用。

---

## 📊 功能说明

您的网站现在支持：

- ✅ **查看所有毒性数据** - 347 条化学物质 LD50 数据
- ✅ **搜索功能** - 按化学品名称或 IUPAC 名称搜索
- ✅ **筛选功能** - 按风险等级、分类筛选
- ✅ **排序功能** - 按毒性值排序
- ✅ **详情查看** - 查看完整的化学信息（SMILES、InChIKey、PubChem CID）
- ✅ **数据持久化** - 所有数据存储在 Supabase 云数据库
- ✅ **多用户共享** - 所有人都能访问最新数据

---

## 🔧 故障排除

### 问题 1：无法连接到 Supabase

**解决方案：**
- 检查 `.env.local` 文件中的 URL 和 Key 是否正确
- 确保在 Supabase 控制台中启用了 RLS 策略
- 检查浏览器控制台的错误信息

---

### 问题 2：数据导入失败

**解决方案：**
- 确保安装了所有 Python 依赖：`pip install -r supabase/requirements.txt`
- 检查 Supabase URL 和 Key 是否正确
- 确保 `Acute Toxicity_chicken_oral_LD50.csv` 文件在正确位置
- 查看 Python 脚本的错误输出

---

### 问题 3：Vercel 部署后无法访问

**解决方案：**
- 确保在 Vercel 环境变量中添加了 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
- 检查环境变量名称是否正确（必须以 `VITE_` 开头）
- 查看 Vercel 部署日志

---

## 💡 下一步优化建议

1. **添加更多数据** - 可以添加其他生物（大鼠、小鼠、鱼等）的毒性数据
2. **化学结构可视化** - 使用 RDKit.js 或其他库显示 2D/3D 分子结构
3. **高级搜索** - 添加按分子结构相似度搜索
4. **数据导出** - 添加导出为 Excel、CSV 功能
5. **用户认证** - 使用 Supabase Auth 添加用户登录功能
6. **数据可视化** - 添加毒性分布图表、风险等级热力图等

---

## 📞 技术支持

如有问题，请查看：
- Supabase 文档：https://supabase.com/docs
- Vercel 文档：https://vercel.com/docs
- React 文档：https://react.dev

---

**祝您使用愉快！** 🎉
