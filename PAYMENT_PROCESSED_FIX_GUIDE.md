# Payment Processed 问题修复指南

## 问题描述

### 问题 1: 新注册后 Payment Processed 列为空
**症状**：新用户注册后，Google Sheet 中的 "Payment Processed" 列是空的，而不是 "No"

### 问题 2: 支付完成后没有自动更新为 "Yes"
**症状**：用户完成 Stripe 支付后，Google Sheet 中的 "Payment Processed" 列没有自动更新为 "Yes"

---

## 解决方案

### Step 1: 更新 Google Apps Script 代码

#### 1.1 打开 Google Apps Script 编辑器

1. 打开你的 Google Sheet
2. 点击 **Extensions** → **Apps Script**
3. 删除现有代码，复制 `GOOGLE_APPS_SCRIPT_COMPLETE_CODE.gs` 文件中的所有代码
4. 粘贴到 Google Apps Script 编辑器中

#### 1.2 检查代码关键部分

确保代码包含以下部分：

**✅ 注册数据处理（包含 Payment Processed）**：
```javascript
const rowData = [
  timestamp,                           // A: Timestamp
  data.studentName || '',              // B: Student Name
  data.parentEmail || '',              // C: Parent Email
  data.parentPhone || '',              // D: Parent Phone
  data.course || '',                   // E: Course
  data.sessionDate || '',              // F: Session Date
  data.sessionTime || '',              // G: Session Time
  data.isSeries ? 'Yes' : 'No',        // H: Is Series
  data.paymentProcessed || 'No'        // I: Payment Processed (默认 'No')
];
```

**✅ Webhook 处理逻辑**：
```javascript
function handleStripeWebhook(payload) {
  // 处理 checkout.session.completed 事件
  // 更新 Payment Processed 为 "Yes"
}
```

#### 1.3 配置 Webhook Secret（如果已配置 Webhook）

如果已经配置了 Stripe Webhook，更新代码中的 Secret：

```javascript
const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE';
```

如果还没有配置 Webhook，可以暂时留空：
```javascript
const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_WEBHOOK_SECRET_HERE';
```

#### 1.4 保存并部署

1. 保存代码（Ctrl+S 或 Cmd+S）
2. 部署为 Web App（如果还没有部署）：
   - 点击 **Deploy** → **New deployment**
   - 选择 **Web app**
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
   - 点击 **Deploy**

---

### Step 2: 验证前端代码

#### 2.1 检查 Calendar.tsx

确保注册数据包含 `paymentProcessed: 'No'`：

```typescript
const registrationEntry = {
  ...newStudent,
  sessionDate: format(selectedSession.date, 'yyyy-MM-dd'),
  sessionTime: selectedSession.startTime,
  course: selectedSession.level,
  isSeries: !selectedSession.isWorkshop,
  paymentProcessed: 'No' // ✅ 确保这里设置为 'No'
};
```

#### 2.2 检查数据发送

确保 `Registration.tsx` 中的 `handleNewRegistration` 函数正确发送数据：

```typescript
const handleNewRegistration = async (data: any) => {
  // ...
  // 发送到 Google Sheets
  await fetch(GOOGLE_SHEETS_API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // ✅ 确保包含 paymentProcessed: 'No'
  });
};
```

---

### Step 3: 测试修复

#### 3.1 测试新注册

1. 在你的网站上创建一个新的测试注册
2. 检查 Google Sheet：
   - ✅ "Payment Processed" 列应该显示 "No"
   - ✅ 其他列的数据应该正确写入

#### 3.2 测试支付完成（Webhook）

**方法 A: 使用 Stripe 测试卡**
1. 使用测试注册的邮箱进行支付
2. 使用 Stripe 测试卡：`4242 4242 4242 4242`
3. 完成支付后，检查 Google Sheet
4. ✅ "Payment Processed" 列应该自动更新为 "Yes"

**方法 B: 使用 Stripe Dashboard 发送测试 Webhook**
1. 进入 Stripe Dashboard → **Developers** → **Webhooks**
2. 点击你的 Webhook endpoint
3. 点击 **Send test webhook**
4. 选择 `checkout.session.completed`
5. 在测试数据中，修改 `customer_email` 为你的测试注册邮箱
6. 点击 **Send test webhook**
7. 检查 Google Sheet
8. ✅ "Payment Processed" 列应该自动更新为 "Yes"

---

### Step 4: 检查 Google Apps Script 日志

如果测试失败，检查日志：

1. 在 Google Apps Script 编辑器中，点击 **Executions**（左侧菜单）
2. 查看最近的执行记录
3. 点击某个执行记录查看日志
4. 查找以下信息：
   - `Registration saved: ...` - 确认注册数据已保存
   - `Received Stripe webhook: ...` - 确认 Webhook 已接收
   - `Processing payment update for email: ...` - 确认正在处理支付更新
   - `Updated row X for email: ...` - 确认已更新支付状态

---

## 故障排除

### 问题 1: Payment Processed 仍然为空

**可能原因**：
- Google Apps Script 代码没有更新
- 代码中缺少 Payment Processed 字段

**解决方法**：
1. 确认已复制完整的 `GOOGLE_APPS_SCRIPT_COMPLETE_CODE.gs` 代码
2. 确认 `rowData` 数组中包含 `data.paymentProcessed || 'No'`
3. 重新部署 Web App
4. 清除浏览器缓存后重新测试

### 问题 2: Webhook 没有触发

**可能原因**：
- Stripe Webhook 没有正确配置
- Google Apps Script Web App URL 配置错误
- Webhook Secret 配置错误

**解决方法**：
1. 检查 Stripe Dashboard 中的 Webhook URL 是否正确
2. 检查 Google Apps Script Web App 权限设置为 "Anyone"
3. 在 Stripe Dashboard 中测试 Webhook
4. 检查 Google Apps Script 日志中的错误信息

### 问题 3: 支付状态没有更新

**可能原因**：
- 邮箱地址不匹配（大小写、空格等）
- Google Sheet 中找不到匹配的注册记录

**解决方法**：
1. 检查 Webhook 日志中的邮箱地址
2. 确认 Google Sheet 中的邮箱地址格式一致
3. 检查是否有多个注册记录使用相同的邮箱
4. 查看 Google Apps Script 日志中的错误信息

---

## 验证清单

完成以下所有步骤后，两个问题都应该解决了：

### 问题 1 修复清单
- [ ] 更新了 Google Apps Script 代码（使用完整代码）
- [ ] 代码中包含 `data.paymentProcessed || 'No'`
- [ ] 重新部署了 Web App
- [ ] 测试了新注册，确认 Payment Processed 显示 "No"

### 问题 2 修复清单
- [ ] 配置了 Stripe Webhook
- [ ] 更新了 Google Apps Script 代码（包含 Webhook 处理）
- [ ] 配置了 Webhook Secret（可选，但推荐）
- [ ] 在 Stripe Dashboard 中配置了 Webhook URL
- [ ] 测试了支付完成，确认 Payment Processed 自动更新为 "Yes"

---

## 下一步

修复完成后：

1. **监控注册**：
   - 确认新注册时 Payment Processed 正确显示 "No"

2. **监控支付**：
   - 确认支付完成后 Payment Processed 自动更新为 "Yes"

3. **检查日志**：
   - 定期检查 Google Apps Script 执行日志
   - 确认没有错误

4. **生产环境测试**：
   - 使用真实的支付流程测试
   - 确认自动化工作正常

---

## 需要帮助？

如果遇到问题：

1. 查看 Google Apps Script 执行日志
2. 查看 Stripe Dashboard 中的 Webhook 日志
3. 检查 Google Sheet 中的数据格式
4. 确认所有配置步骤都已正确完成
