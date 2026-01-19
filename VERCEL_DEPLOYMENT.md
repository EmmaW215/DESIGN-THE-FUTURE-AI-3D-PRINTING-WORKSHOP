# Vercel 部署指南 - Gemini API Key 配置

## 已完成步骤

✅ 1. 代码修复
- 已修复 `services/geminiService.ts` 中的环境变量引用
- 从 `process.env.API_KEY` 改为 `process.env.GEMINI_API_KEY`

✅ 2. 本地环境配置
- 已创建 `.env.local` 文件（本地开发用）
- 已添加到 `.gitignore`，不会提交到 git

✅ 3. 文档创建
- 已创建 `CHANGELOG.md` 记录所有更改

✅ 4. 代码推送
- 已提交并推送到 GitHub: https://github.com/EmmaW215/DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP

## 下一步：在 Vercel 上配置环境变量

### 步骤 1: 登录 Vercel
访问你的项目: https://vercel.com/emma-wangs-projects/design-the-future-ai-3-d-printing-workshop

### 步骤 2: 配置环境变量
1. 在项目页面，点击左侧菜单的 **Settings**（设置）
2. 在设置页面，找到 **Environment Variables**（环境变量）部分
3. 点击 **Add New**（添加新变量）按钮

### 步骤 3: 添加 API Key
填写以下信息：
- **Name（名称）**: `GEMINI_API_KEY`
- **Value（值）**: `AIzaSyAmZtlPSA7Vwqf_gCwD5Tsc1PWBU0VLXvo`
- **Environment（环境）**: 
  - ✅ Production（生产环境）
  - ✅ Preview（预览环境）
  - ✅ Development（开发环境）

### 步骤 4: 保存并重新部署
1. 点击 **Save**（保存）
2. Vercel 会自动触发新的部署
3. 等待部署完成（通常需要 1-2 分钟）

### 步骤 5: 验证部署
部署完成后：
1. 访问你的网站: https://design-the-future-ai-3-d-printing-w.vercel.app
2. 滚动到 "AI Pro Lab" 部分
3. 选择一个课程级别
4. 输入孩子的兴趣（例如："Dragons", "Space", "Minecraft"）
5. 点击 "Generate Idea" 按钮
6. 验证是否成功生成 AI 建议

## 环境变量详情

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `GEMINI_API_KEY` | `AIzaSyAmZtlPSA7Vwqf_gCwD5Tsc1PWBU0VLXvo` | Google Gemini AI API 密钥 |

## 技术说明

### 环境变量工作流程：
1. **本地开发**：
   - 从 `.env.local` 文件读取
   - Vite 的 `loadEnv()` 自动加载
   - 通过 `vite.config.ts` 注入到代码中

2. **Vercel 生产环境**：
   - 从 Vercel 的环境变量设置中读取
   - 在构建时自动注入
   - 运行时通过 `process.env.GEMINI_API_KEY` 访问

### 安全提示：
- ✅ API Key 已安全存储在 Vercel 的环境变量中（加密）
- ✅ `.env.local` 文件不会被提交到 git
- ✅ 代码中不会硬编码 API Key

## 故障排除

### 如果 AI 功能不工作：

1. **检查环境变量是否正确配置**：
   - 确认 Vercel 中 `GEMINI_API_KEY` 已设置
   - 确认选择了正确的环境（Production, Preview, Development）

2. **检查部署日志**：
   - 在 Vercel 项目页面，点击 **Deployments**
   - 查看最新部署的日志
   - 检查是否有错误信息

3. **重新部署**：
   - 在 Vercel 项目页面，点击 **Deployments**
   - 点击最新部署旁边的三个点菜单
   - 选择 **Redeploy**

4. **检查浏览器控制台**：
   - 打开网站，按 F12 打开开发者工具
   - 查看 Console 标签页是否有错误信息

## 支持

如果遇到问题，请检查：
- Vercel 部署日志
- GitHub 仓库: https://github.com/EmmaW215/DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP
- CHANGELOG.md 查看详细更改记录
