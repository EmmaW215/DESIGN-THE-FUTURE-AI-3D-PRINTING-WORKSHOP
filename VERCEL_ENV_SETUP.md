# Vercel 环境变量设置指南 - 修复 API Key 问题

## 问题

错误信息：`Uncaught (in promise) Error: An API Key must be set when running in a browser`

这表明 Gemini API Key 没有正确传递到浏览器环境。

## 解决方案

### 步骤 1: 在 Vercel 中设置环境变量

1. **登录 Vercel 并进入项目**
   - 访问：https://vercel.com/emma-wangs-projects/design-the-future-ai-3-d-printing-workshop
   - 或者直接访问：https://vercel.com/dashboard

2. **进入设置**
   - 在项目页面，点击左侧菜单的 **Settings**（设置）

3. **打开环境变量**
   - 在设置页面，找到 **Environment Variables**（环境变量）部分
   - 点击查看或添加环境变量

4. **添加新环境变量**
   - 点击 **Add New**（添加新变量）按钮
   - 填写以下信息：
     - **Name（名称）**: `GEMINI_API_KEY`
     - **Value（值）**: 
     - **Environment（环境）**: 
       - ✅ **Production**（生产环境）⚠️ **非常重要！**
       - ✅ **Preview**（预览环境）
       - ✅ **Development**（开发环境）

5. **保存**
   - 点击 **Save**（保存）按钮

### 步骤 2: 重新部署

**重要**：修改环境变量后，必须重新部署才能生效！

1. **自动重新部署**
   - 如果你推送了新代码，Vercel 会自动重新部署
   - 或者你可以手动触发重新部署

2. **手动触发重新部署**
   - 在项目页面，点击 **Deployments**（部署）标签
   - 找到最新的部署
   - 点击右侧的三个点菜单
   - 选择 **Redeploy**（重新部署）

### 步骤 3: 验证修复

部署完成后：

1. **清除浏览器缓存**（重要！）
   - 按 `Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac)
   - 或者打开开发者工具（F12），右键刷新按钮，选择"清空缓存并硬性重新加载"

2. **测试功能**
   - 访问：https://design-the-future-ai-3-d-printing-w.vercel.app/
   - 滚动到 "AI Pro Lab" 部分
   - 选择一个级别
   - 输入一个兴趣（例如 "Dragons"）
   - 点击 "Generate Idea" 按钮
   - 应该能正常工作，不再出现 API Key 错误

3. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页
   - 应该不再有 "An API Key must be set" 错误

## 技术说明

### 环境变量是如何工作的

1. **构建时注入**：
   - Vite 在构建时读取 `GEMINI_API_KEY` 环境变量
   - 通过 `vite.config.ts` 中的 `define` 配置注入到代码中
   - 替换代码中的 `process.env.GEMINI_API_KEY`

2. **浏览器端访问**：
   - 构建后的代码中，`process.env.GEMINI_API_KEY` 被替换为实际的 API Key 值
   - 浏览器可以访问这个值来调用 Gemini API

3. **安全性**：
   - ⚠️ **注意**：在浏览器中暴露 API Key 有安全风险
   - 对于客户端应用，这是必要的
   - 建议：
     - 限制 API Key 的使用范围
     - 设置 API Key 的使用配额
     - 定期轮换 API Key

## 常见问题

### 问题 1: 设置了环境变量但仍然报错

**可能原因**：
- 只设置了 Development 或 Preview，没有设置 Production
- 环境变量名称拼写错误
- 没有重新部署

**解决方法**：
1. 确认设置了 **Production** 环境
2. 确认环境变量名称是 `GEMINI_API_KEY`（完全匹配）
3. 重新部署项目
4. 清除浏览器缓存

### 问题 2: 环境变量值包含空格

**解决方法**：
- 确保 API Key 值前后没有空格
- 直接从 Google AI Studio 复制，不要手动输入

### 问题 3: 本地开发正常，生产环境不工作

**可能原因**：
- 本地有 `.env.local` 文件
- Vercel 中环境变量未设置或设置错误

**解决方法**：
1. 检查 Vercel 环境变量设置
2. 确认 Production 环境已启用
3. 重新部署

## 验证清单

- [ ] 在 Vercel 中设置了 `GEMINI_API_KEY` 环境变量
- [ ] 值为：`
- [ ] 已启用 **Production** 环境
- [ ] 已启用 **Preview** 环境（可选）
- [ ] 已启用 **Development** 环境（可选）
- [ ] 已重新部署项目
- [ ] 清除了浏览器缓存
- [ ] 测试了 "Generate Idea" 功能
- [ ] 浏览器控制台没有错误

## 下一步

修复完成后：
1. 测试所有功能是否正常
2. 检查是否还有其他错误
3. 考虑优化错误处理和用户体验

祝你成功！🎉
