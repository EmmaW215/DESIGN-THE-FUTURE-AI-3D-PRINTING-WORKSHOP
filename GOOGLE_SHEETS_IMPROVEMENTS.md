# Google Sheets 改进方案

## 问题分析与解决方案

### 问题 1: Pivot Summary Table（数据透视汇总表）

**当前状态**：显示详细注册记录

**需求**：
- 按 Course、Session Date、Session Time 分组
- 显示每个组合的注册人数
- 支持筛选功能

**解决方案**：
创建新的 `RegistrationPivotTable` 组件，从前端数据生成汇总表

### 问题 2: "Is Series" 列说明

**含义**：
- `isSeries: true` (Yes) = 3周系列课程（Level 1/2/3，覆盖第1-3周）
- `isSeries: false` (No) = 单次工作坊（Level 3 Advanced Workshop，第4周）

**工作原理**：
- 用户注册 Level 1/2/3 时，会自动关联3周的所有课程
- 用户注册 Workshop 时，只是单次课程

### 问题 3: "Payment Processed" 列

**挑战**：
当前使用 Stripe Payment Links，支付完成后直接跳转到 Stripe 成功页面，无法直接知道支付状态。

**解决方案**：

#### 方案 A: 使用 Stripe Payment Links 的成功 URL 参数（推荐）

**步骤**：
1. 在 Stripe Dashboard 中配置每个 Payment Link 的成功 URL，包含注册信息
2. 创建一个更新 API 端点（Google Apps Script）
3. 当支付成功时，Stripe 重定向到你的页面，带参数
4. 页面调用 Google Apps Script 更新支付状态

**优点**：简单，不需要 webhook
**缺点**：如果用户没有完成重定向，状态不会更新

#### 方案 B: 使用 Stripe Webhook（更可靠）

**步骤**：
1. 在 Stripe Dashboard 中创建 Webhook
2. 配置 Webhook 指向 Google Apps Script（需要额外的脚本）
3. 当支付成功时，Stripe 发送事件到 Webhook
4. Google Apps Script 根据支付信息找到对应的注册记录并更新状态

**优点**：可靠，自动更新
**缺点**：需要配置 webhook，较复杂

**推荐使用方案 A**（更简单，适合当前架构）

## 实施建议

### 优先级 1: Pivot Summary Table（立即实施）
- 创建新的组件
- 实现分组汇总
- 添加筛选功能

### 优先级 2: Payment Processed 列（需要额外配置）
- 需要修改 Stripe Payment Links 配置
- 需要更新 Google Apps Script
- 需要创建更新 API

### 优先级 3: 改进 "Is Series" 显示
- 在表格中添加该列（如果需要）
- 或添加说明文本

## 详细实施计划

### Step 1: 实现 Pivot Table

1. **创建新组件**：`RegistrationPivotTable.tsx`
2. **数据处理**：
   - 从 `globalRegistrations` 读取数据
   - 按 `course + sessionDate + sessionTime` 分组
   - 计算每组的注册人数
3. **UI 实现**：
   - 显示汇总表
   - 添加筛选器（Course、Date、Time）

### Step 2: 添加 Payment Processed 列

**需要修改的地方**：

1. **Google Apps Script**：
   - 添加新的列处理
   - 创建更新函数（通过 email 或 sessionId 匹配）

2. **Stripe Payment Links 配置**：
   - 在 Stripe Dashboard 中，为每个 Payment Link 设置成功 URL：
   ```
   https://design-the-future-ai-3-d-printing-w.vercel.app/success?payment=success&email={CHECKOUT_EMAIL}&session_id={CHECKOUT_SESSION_ID}
   ```

3. **Success.tsx 页面**：
   - 读取 URL 参数
   - 调用 Google Apps Script 更新 API

4. **Google Sheet 表头**：
   - 在 Google Sheet 中添加 "Payment Processed" 列（I 列）

## 当前可立即实施的改进

让我先实施 **Pivot Summary Table**，这个可以立即完成，不需要额外的 Stripe 配置。

对于 **Payment Processed**，需要你先：
1. 在 Google Sheet 中添加该列
2. 确认是否要实施方案 A 或方案 B
3. 然后我可以帮你配置相应的代码
