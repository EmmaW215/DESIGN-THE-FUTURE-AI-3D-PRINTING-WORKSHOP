# Stripe 支付集成完整指南

## 概述
本指南将帮助你将项目连接到真实的 Stripe 账户：``

## 步骤 1: 在 Stripe Dashboard 创建产品

### 1.1 登录 Stripe Dashboard
访问：

### 1.2 创建产品
为每个课程级别创建产品和价格：

#### Level 1 - Explorer ($145 CAD + HST)
1. 点击左侧菜单 **Products**（产品）
2. 点击 **+ Add product**（添加产品）
3. 填写信息：
   - **Name**: `Level 1 - 3D Explorer (Beginner)`
   - **Description**: `Perfect for curious minds with zero experience. Discover the magic behind 3D printing.`
   - **Pricing model**: `Standard pricing`
   - **Price**: `145.00`
   - **Currency**: `CAD`
   - **Billing period**: `One time`
4. 点击 **Save product**
5. **复制 Price ID**（格式：`price_xxxxx`），稍后需要用到

#### Level 2 - Apprentice ($185 CAD + HST)
重复上述步骤：
- **Name**: `Level 2 - 3D Apprentice (Intermediate)`
- **Price**: `185.00 CAD`

#### Level 3 - AI Pro ($225 CAD + HST)
重复上述步骤：
- **Name**: `Level 3 - AI Pro (Advanced)`
- **Price**: `225.00 CAD`

#### Level 3 Advanced Workshop ($80 CAD + HST)
重复上述步骤：
- **Name**: `Level 3 Advanced Workshop`
- **Price**: `80.00 CAD`

## 步骤 2: 获取 Stripe API Keys

### 2.1 获取 Publishable Key
1. 在 Stripe Dashboard，点击左侧菜单 **Developers**（开发者）
2. 点击 **API keys**
3. 在 **Publishable key** 部分，复制你的密钥
   - 测试环境：`pk_test_...`（用于开发测试）
   - 生产环境：`pk_live_...`（用于正式上线）
   - **现在先使用测试密钥**

## 步骤 3: 配置环境变量

### 3.1 本地开发环境（.env.local）

在项目根目录创建 `.env.local` 文件：

```bash
# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
```

### 3.2 Vercel 生产环境

1. 访问 Vercel Dashboard: https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加变量：
   - **Name**: `VITE_STRIPE_PUBLIC_KEY`
   - **Value**: `pk_test_...`（或 `pk_live_...` 生产环境）
   - **Environment**: 勾选所有（Production, Preview, Development）
5. 点击 **Save**

## 步骤 4: 更新代码配置

更新 `src/services/courseData.ts` 中的 Price IDs：

```typescript
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_PLACEHOLDER',
  priceIds: {
    level1: 'price_xxxxxxxxxxxxx', // 替换为实际的 Level 1 Price ID
    level2: 'price_xxxxxxxxxxxxx', // 替换为实际的 Level 2 Price ID
    level3: 'price_xxxxxxxxxxxxx', // 替换为实际的 Level 3 Price ID
  },
  successUrl: `${window.location.origin}/success`,
  cancelUrl: `${window.location.origin}`,
};
```

## 步骤 5: 创建后端 API（处理支付成功后的回调）

**重要**：Stripe Checkout 需要后端 API 来处理支付成功后的 webhook。

### 选项 A: 使用 Vercel Serverless Functions（推荐）

创建 `api/stripe-webhook.ts`：

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // 处理支付成功事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 在这里可以：
    // 1. 更新数据库
    // 2. 发送确认邮件
    // 3. 写入 Google Sheets（见 Google Sheets 集成指南）
    
    console.log('Payment successful:', session.id);
  }

  res.json({ received: true });
}
```

### 选项 B: 简化方案（前端直接处理）

如果暂时不需要 webhook，可以在支付成功后：
1. 在 `PaymentSection.tsx` 中，支付成功后调用 Google Sheets API
2. 直接在前端处理注册数据写入

## 步骤 6: 测试

### 6.1 使用 Stripe 测试卡号
在测试模式下，使用以下测试卡号：
- **Card**: `4242 4242 4242 4242`
- **Expiry**: 任意未来日期（如 `12/34`）
- **CVC**: 任意 3 位数字（如 `123`）
- **ZIP**: 任意 5 位数字（如 `12345`）

### 6.2 测试流程
1. 启动开发服务器：`npm run dev`
2. 访问注册页面
3. 选择支付选项
4. 使用测试卡号完成支付
5. 检查 Stripe Dashboard → **Payments** 是否显示支付记录

## 切换至生产环境

当准备好上线时：

1. **切换 Stripe 模式**：
   - 在 Stripe Dashboard 右上角，切换 **Test mode** → **Live mode**

2. **获取生产 API Keys**：
   - 复制生产环境的 `pk_live_...`
   - 复制生产环境的 Secret Key：`sk_live_...`

3. **更新环境变量**：
   - Vercel 中更新 `VITE_STRIPE_PUBLIC_KEY` 为 `pk_live_...`

4. **更新 Price IDs**：
   - 在生产模式下创建的产品会有不同的 Price IDs
   - 更新 `courseData.ts` 中的 Price IDs

## 注意事项

⚠️ **安全提醒**：
- ✅ 可以安全地在客户端使用 **Publishable Key** (`pk_...`)
- ❌ **永远不要**在前端代码中暴露 **Secret Key** (`sk_...`)
- Secret Key 只能用于后端服务器

## 费用说明

- **Stripe 费用**：每笔交易收取 2.9% + $0.30 CAD
- **无月费**：Stripe 不收取月费
- **示例**：$145 CAD 订单，Stripe 收取 $4.51 CAD

## 完成清单

- [ ] 在 Stripe Dashboard 创建了 4 个产品（Level 1, 2, 3, Workshop）
- [ ] 复制了所有 Price IDs
- [ ] 复制了 Publishable Key (`pk_test_...`)
- [ ] 更新了 `.env.local`（本地开发）
- [ ] 在 Vercel 中设置了 `VITE_STRIPE_PUBLIC_KEY` 环境变量
- [ ] 更新了 `src/services/courseData.ts` 中的 Price IDs
- [ ] 测试了支付流程（使用测试卡号）
- [ ] 在 Stripe Dashboard 中确认看到了测试支付记录
