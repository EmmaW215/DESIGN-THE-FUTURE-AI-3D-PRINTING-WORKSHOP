# Stripe 集成验证清单

## ✅ 已完成的配置

### 1. Stripe Dashboard 配置
- [x] 创建了 4 个产品（Level 1, Level 2, Level 3, Level 3 Workshop）
- [x] 获取了所有 Price IDs（格式：`price_...`）

### 2. 代码配置
- [x] 更新了 `src/services/courseData.ts` 中的 Price IDs
  - Level 1: `price_1SrjjxE6OOEHr6ZosPgc6y6u`
  - Level 2: `price_1SrjifE6OOEHr6ZoTFo70dEa`
  - Level 3: `price_1SrjlcE6OOEHr6Zot9QtWuWJ`
  - Level 3 Workshop: `price_1SrjnIE6OOEHr6Zo5gPCoQdc`
- [x] 所有课程正确引用了对应的 Price ID
- [x] 代码构建成功，无错误

### 3. 环境变量配置
- [x] 本地开发：`.env.local` 文件已创建
- [x] Vercel 生产环境：已设置 `VITE_STRIPE_PUBLIC_KEY`

## 🔍 最终验证步骤

### 步骤 1: 验证环境变量

**本地开发**：
1. 确认 `.env.local` 文件存在
2. 确认文件中包含：
   ```bash
   VITE_STRIPE_PUBLIC_KEY=pk_test_你的实际密钥
   ```
3. 重启开发服务器：
   ```bash
   npm run dev
   ```

**Vercel 生产环境**：
1. 访问 Vercel Dashboard
2. 进入项目 Settings → Environment Variables
3. 确认 `VITE_STRIPE_PUBLIC_KEY` 已设置
4. 确认已勾选所有环境（Production, Preview, Development）
5. **重要**：如果刚添加环境变量，需要重新部署

### 步骤 2: 测试 Stripe Checkout

#### 本地测试：
1. 启动开发服务器：`npm run dev`
2. 访问：`http://localhost:5173/level/1`
3. 点击 "Enroll Now" 或 "Secure Checkout with Stripe" 按钮
4. 应该跳转到 Stripe Checkout 页面（不是模拟页面）
5. 使用测试卡号：
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`
6. 完成测试支付
7. 检查是否跳转到 `/success` 页面

#### 生产环境测试：
1. 访问你的 Vercel 部署 URL
2. 重复上述测试步骤
3. 在 Stripe Dashboard → Payments 中查看测试支付记录

### 步骤 3: 验证 Price IDs 匹配

在 Stripe Dashboard 中确认：
- Level 1 产品的 Price ID 是 `price_1SrjjxE6OOEHr6ZosPgc6y6u`
- Level 2 产品的 Price ID 是 `price_1SrjifE6OOEHr6ZoTFo70dEa`
- Level 3 产品的 Price ID 是 `price_1SrjlcE6OOEHr6Zot9QtWuWJ`
- Level 3 Workshop 产品的 Price ID 是 `price_1SrjnIE6OOEHr6Zo5gPCoQdc`

## ⚠️ 常见问题排查

### 问题 1: 点击按钮后显示 "Stripe is not configured yet"

**原因**：环境变量未正确加载

**解决方法**：
1. 检查 `.env.local` 文件是否存在且格式正确
2. 确认环境变量名称是 `VITE_STRIPE_PUBLIC_KEY`（完全匹配）
3. 重启开发服务器
4. 清除浏览器缓存

### 问题 2: 支付页面显示错误

**原因**：Price ID 不正确或环境变量未设置

**解决方法**：
1. 在 Stripe Dashboard 中确认 Price ID 是否正确
2. 检查代码中的 Price ID 是否与 Dashboard 中的一致
3. 确认使用的是测试环境的 Price ID（如果使用 `pk_test_...`）

### 问题 3: Vercel 部署后支付不工作

**原因**：环境变量未设置或未重新部署

**解决方法**：
1. 在 Vercel Dashboard 中确认环境变量已设置
2. 确认环境变量值正确（没有多余空格）
3. 重新部署项目（Settings → Deployments → Redeploy）

## ✅ 成功标志

当一切配置正确时，你应该看到：

1. ✅ 点击 "Enroll Now" 按钮后，跳转到 Stripe 官方支付页面
2. ✅ 支付页面显示正确的课程名称和价格
3. ✅ 使用测试卡号可以完成支付
4. ✅ 支付成功后跳转到 `/success` 页面
5. ✅ 在 Stripe Dashboard → Payments 中可以看到支付记录

## 📝 下一步

配置完成后：
1. 测试所有 4 个级别的支付流程
2. 确认支付金额正确
3. 测试支付成功和取消流程
4. 准备切换到生产环境（当准备好上线时）

## 🔐 安全提醒

- ✅ Publishable Key (`pk_...`) 可以安全地在前端使用
- ❌ Secret Key (`sk_...`) 永远不要放在前端代码中
- ✅ `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
