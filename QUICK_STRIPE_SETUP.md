# 快速 Stripe 配置指南

## ✅ 你已经有的密钥

你已经有了：
- ✅ **Publishable Key** (`pk_test_...` 或 `pk_live_...`) - **可以直接使用**
- ✅ **Secret Key** (`sk_test_...` 或 `sk_live_...`) - **只能用于后端，不要放在前端**

## 步骤 1: 配置 Publishable Key（前端）

### 本地开发

在项目根目录创建或编辑 `.env.local` 文件：

```bash
# 粘贴你的 Publishable Key（测试模式）
VITE_STRIPE_PUBLIC_KEY=pk_test_你的实际密钥
```

**示例**：
```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_51RlrH1E6OOEHr6Zo...
```

### Vercel 生产环境

1. 访问 Vercel Dashboard: https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加变量：
   - **Name**: `VITE_STRIPE_PUBLIC_KEY`
   - **Value**: 粘贴你的 Publishable Key（`pk_test_...`）
   - **Environment**: 勾选所有（Production, Preview, Development）
5. 点击 **Save**
6. **重要**：需要重新部署才能生效

## 步骤 2: 创建产品和获取 Price IDs

即使你已经有 API Keys，你还需要：

1. **登录 Stripe Dashboard**: https://dashboard.stripe.com/acct_1RlrH1E6OOEHr6Zo/payments

2. **检查是否已有产品**：
   - 左侧菜单点击 **Products**（产品）
   - 查看是否已有 Level 1, Level 2, Level 3 的产品

3. **如果没有产品，创建它们**：
   - Level 1: $145 CAD
   - Level 2: $185 CAD  
   - Level 3: $225 CAD
   - Advanced Workshop: $80 CAD

4. **获取 Price IDs**：
   - 每个产品都有一个 Price ID（格式：`price_xxxxx`）
   - 点击产品，在 "Pricing" 部分可以看到 Price ID
   - **复制这些 Price IDs**

## 步骤 3: 更新代码中的 Price IDs

编辑 `src/services/courseData.ts`，更新 Price IDs：

```typescript
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_PLACEHOLDER',
  priceIds: {
    level1: 'price_你的Level1实际PriceID',      // 替换这里
    level2: 'price_你的Level2实际PriceID',      // 替换这里
    level3: 'price_你的Level3实际PriceID',      // 替换这里
  },
  successUrl: `${window.location.origin}/success`,
  cancelUrl: `${window.location.origin}`,
};
```

**示例**：
```typescript
priceIds: {
  level1: 'price_1RlrH1E6OOEHr6ZoABC123',
  level2: 'price_1RlrH1E6OOEHr6ZoXYZ789',
  level3: 'price_1RlrH1E6OOEHr6ZoDEF456',
},
```

## 步骤 4: 验证配置

### 测试环境变量

1. 重启开发服务器：
   ```bash
   npm run dev
   ```

2. 检查浏览器控制台（F12）：
   - 不应该看到 `pk_test_PLACEHOLDER` 的警告
   - 如果配置正确，代码会使用环境变量中的值

### 测试 Stripe Checkout

1. 访问注册页面
2. 选择一个支付选项
3. 应该看到 Stripe 支付页面（不是模拟的）
4. 使用测试卡号：`4242 4242 4242 4242`

## 关于 Secret Key（后端使用）

你的 **Secret Key** (`sk_test_...` 或 `sk_live_...`)：

- ✅ **保留它**，但**不要放在前端代码中**
- ✅ **只在后端服务器使用**（如果以后需要处理 webhook）
- ⚠️ **不要**添加到 `.env.local` 或 Vercel 环境变量（除非是后端变量）

目前前端代码使用 Stripe Checkout，只需要 Publishable Key 就足够了。

## 快速检查清单

- [ ] 在 `.env.local` 中设置了 `VITE_STRIPE_PUBLIC_KEY`
- [ ] 在 Vercel 中设置了 `VITE_STRIPE_PUBLIC_KEY` 环境变量
- [ ] 在 Stripe Dashboard 中确认有 4 个产品（Level 1, 2, 3, Workshop）
- [ ] 复制了所有产品的 Price IDs
- [ ] 更新了 `src/services/courseData.ts` 中的 Price IDs
- [ ] 重启了开发服务器
- [ ] 测试了支付流程

## 常见问题

### Q: 我的 Publishable Key 是 `pk_live_...`，可以使用吗？

**A**: 可以，但建议：
- 开发测试时使用 `pk_test_...`
- 正式上线时再使用 `pk_live_...`
- 两个环境的 Price IDs 不同，需要分别配置

### Q: 我可以在同一个环境中同时测试测试和生产密钥吗？

**A**: 不可以。一次只能使用一个：
- 测试环境 → 使用 `pk_test_...` 和测试 Price IDs
- 生产环境 → 使用 `pk_live_...` 和生产 Price IDs

### Q: Secret Key 什么时候需要？

**A**: 当你需要：
- 处理 Stripe webhook（支付成功后的服务器回调）
- 在后端创建 Checkout Session
- 查询订单状态

目前使用 Stripe Checkout（前端直接跳转），暂时不需要 Secret Key。
