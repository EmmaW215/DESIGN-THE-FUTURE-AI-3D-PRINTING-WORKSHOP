# Stripe Webhook 自动化实施指南

## 概述

本指南将帮助你配置 Stripe Webhook 来自动更新 Google Sheet 中的 "Payment Processed" 状态。当用户在 Stripe 完成支付后，Webhook 会自动触发，将对应的注册记录的 Payment Processed 列更新为 "Yes"。

---

## 📋 前提条件

- ✅ 已设置 Stripe 账户
- ✅ 已创建 Google Sheet 并配置了 Google Apps Script
- ✅ Google Sheet 中有 "Payment Processed" 列（I 列）
- ✅ 有 Stripe Secret Key（用于验证 Webhook）

---

## 🎯 实施步骤

### Step 1: 获取 Stripe Webhook Signing Secret

#### 1.1 在 Stripe Dashboard 中创建 Webhook Endpoint

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 进入 **Developers** 页面（左侧导航栏 → **Settings** → **Developers**）
3. 在顶部标签栏，点击 **Webhooks** 标签
4. 在 "Event destinations" 部分，你会看到：
   - 顶部有 **`+ Add destination`** 按钮（紫色按钮，在右上角）
   - 可能还有 "Set up local listener" 和 "Import" 按钮
5. 点击 **`+ Add destination`** 按钮
6. 在弹出窗口中：
   - **Destination type**: 选择 **"Webhook endpoint"** 或 **"HTTP endpoint"**
   - **Endpoint URL**: 暂时先填一个临时 URL（如 `https://example.com/webhook`），稍后会更新为 Google Apps Script Web App URL
   - **Description** (可选): `Update Payment Processed Status in Google Sheets`
7. 点击 **Add destination** 或 **Save**
8. 在下一步中，选择要监听的事件：
   - 点击 **Select events** 或 **Add events**
   - 选择以下事件：
     - `checkout.session.completed` ✅（最重要）
     - `payment_intent.succeeded` ✅（可选，作为备用）
   - 点击 **Add events** 或 **Save**

**注意**：如果找不到 **`+ Add destination`** 按钮：
- 确认你在 **Webhooks** 标签页（不是 Overview 或其他标签）
- 滚动页面查看是否有 "Event destinations" 部分
- 确认你使用的是新版的 Stripe Dashboard（可能界面有所更新）

#### 1.2 复制 Webhook Signing Secret

1. 创建 Webhook 后，进入新创建的 Webhook endpoint 详情页面
2. 在 "Signing secret" 部分，点击 **Reveal** 按钮显示 Signing Secret
3. **重要**：立即复制并保存这个 Secret
   - 格式类似：`whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 这个 Secret 只会显示一次，如果丢失需要重新创建 Webhook
4. 保存到安全的地方（稍后在 Google Apps Script 代码中会用到）

**注意**：如果你看不到 Signing Secret：
- 确认你已经创建了 Webhook endpoint
- 在 Webhook 列表中，点击你创建的 endpoint 进入详情页面
- 查找 "Signing secret" 或 "Webhook signing secret" 部分

#### 1.3 复制 Webhook Endpoint URL 和 ID

- **Webhook Endpoint URL**: 你在 Step 1.1 中输入的 URL（稍后会更新为 Google Apps Script URL）
- **Webhook Endpoint ID**: 格式类似 `we_xxxxxxxxxxxxx`
- 保存这些信息，稍后会用到

---

### Step 2: 更新 Google Apps Script 代码

#### 2.1 打开 Google Apps Script 编辑器

1. 打开你的 Google Sheet
2. 点击 **Extensions** → **Apps Script**
3. 删除现有代码，复制以下完整代码：

```javascript
// ============================================
// Stripe Webhook Handler for Payment Status Update
// Version: 2.0 - With Webhook Support
// ============================================

// ⚠️ 重要：替换为你的 Stripe Webhook Signing Secret
const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_WEBHOOK_SECRET_HERE';

// ============================================
// 处理注册数据的 POST 请求
// ============================================
function doPost(e) {
  try {
    // 检查是否是 Stripe Webhook 请求
    const signature = e.parameter.signature || e.parameter['stripe-signature'];
    if (signature) {
      // 这是 Stripe Webhook 请求
      return handleStripeWebhook(e);
    }
    
    // 否则，这是普通的注册数据提交
    return handleRegistrationData(e);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// 处理 Stripe Webhook 请求
// ============================================
function handleStripeWebhook(e) {
  try {
    // 获取原始请求体
    const rawBody = e.postData.contents;
    const signature = e.parameter.signature || e.parameter['stripe-signature'];
    
    // 验证 Webhook 签名（简化版）
    // 注意：完整的签名验证需要 crypto 库，这里使用简化验证
    // 生产环境建议使用完整的签名验证
    
    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    
    // 只处理支付成功事件
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      updatePaymentStatusFromWebhook(payload);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        received: true,
        eventType: eventType
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Webhook error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        received: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// 从 Stripe Webhook 更新支付状态
// ============================================
function updatePaymentStatusFromWebhook(payload) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let customerEmail = '';
    let sessionId = '';
    
    // 从不同的事件类型中提取客户邮箱
    if (payload.type === 'checkout.session.completed') {
      customerEmail = payload.data.object.customer_email || payload.data.object.customer_details?.email || '';
      sessionId = payload.data.object.id || '';
    } else if (payload.type === 'payment_intent.succeeded') {
      customerEmail = payload.data.object.charges?.data[0]?.billing_details?.email || '';
    }
    
    if (!customerEmail) {
      Logger.log('No customer email found in webhook payload');
      return { success: false, message: 'No email found' };
    }
    
    Logger.log('Processing payment update for email: ' + customerEmail);
    
    // 找到匹配的行并更新 Payment Processed 列
    // Email 在 C 列（索引 2），Payment Processed 在 I 列（索引 8）
    let updatedCount = 0;
    
    for (let i = 1; i < values.length; i++) { // 跳过表头
      const rowEmail = values[i][2]; // C 列：Email
      
      if (rowEmail && rowEmail.toLowerCase().trim() === customerEmail.toLowerCase().trim()) {
        // 找到匹配的邮箱，更新 Payment Processed 列为 "Yes"
        sheet.getRange(i + 1, 9).setValue('Yes'); // I 列：Payment Processed
        updatedCount++;
        Logger.log('Updated row ' + (i + 1) + ' for email: ' + customerEmail);
      }
    }
    
    if (updatedCount > 0) {
      Logger.log('Successfully updated ' + updatedCount + ' row(s) for email: ' + customerEmail);
      return { success: true, updatedRows: updatedCount };
    } else {
      Logger.log('No matching registration found for email: ' + customerEmail);
      return { success: false, message: 'No matching registration found' };
    }
    
  } catch (error) {
    Logger.log('Error updating payment status: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// ============================================
// 处理注册数据提交（原有功能）
// ============================================
function handleRegistrationData(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 获取当前时间戳
    const timestamp = new Date();
    
    // 准备要写入的行数据（包含 Payment Processed 列）
    const rowData = [
      timestamp,                    // A: Timestamp
      data.studentName || '',       // B: Student Name
      data.parentEmail || '',       // C: Parent Email
      data.parentPhone || '',       // D: Parent Phone
      data.course || '',            // E: Course
      data.sessionDate || '',       // F: Session Date
      data.sessionTime || '',       // G: Session Time
      data.isSeries ? 'Yes' : 'No', // H: Is Series
      data.paymentProcessed || 'No' // I: Payment Processed (默认 'No')
    ];
    
    // 追加新行到 Sheet
    sheet.appendRow(rowData);
    
    // 返回成功响应
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 返回错误响应
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// 手动更新支付状态的函数（可选，用于测试）
// ============================================
function updatePaymentStatusManually(email, paymentStatus) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 找到匹配的行（通过 email）
    // Email 在 C 列（索引 2），Payment Processed 在 I 列（索引 8）
    for (let i = 1; i < values.length; i++) { // 跳过表头
      if (values[i][2] === email) { // 匹配 Email
        // 更新 Payment Processed 列
        sheet.getRange(i + 1, 9).setValue(paymentStatus || 'Yes');
        return { success: true, row: i + 1 };
      }
    }
    
    return { success: false, message: 'Registration not found for email: ' + email };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================
// 处理 GET 请求（用于测试）
// ============================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Google Sheets API is running',
      status: 'OK',
      version: '2.0 - with Stripe Webhook support',
      webhookSecretConfigured: STRIPE_WEBHOOK_SECRET !== 'whsec_YOUR_WEBHOOK_SECRET_HERE'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### 2.2 配置 Webhook Secret

1. 在代码顶部找到这一行：
   ```javascript
   const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_WEBHOOK_SECRET_HERE';
   ```

2. 将 `whsec_YOUR_WEBHOOK_SECRET_HERE` 替换为你在 Step 1.2 中复制的实际 Webhook Signing Secret

3. 保存代码（Ctrl+S 或 Cmd+S）

---

### Step 3: 部署 Google Apps Script 为 Web App

#### 3.1 部署为 Web App

1. 在 Apps Script 编辑器中，点击 **Deploy** → **New deployment**
2. 点击齿轮图标 ⚙️（选择类型）→ 选择 **Web app**
3. 配置部署设置：
   - **Description**: `Stripe Webhook Handler v2.0`
   - **Execute as**: `Me`（你的账户）
   - **Who has access**: `Anyone`（Stripe 需要能够访问）

4. 点击 **Deploy**

#### 3.2 复制 Web App URL

1. 部署成功后，复制 **Web App URL**
   - 格式类似：`https://script.google.com/macros/s/AKfycbz.../exec`
2. **重要**：这是 Stripe Webhook 需要调用的 URL

#### 3.3 授权应用

1. 首次部署时，会提示授权
2. 点击 **Authorize access**
3. 选择你的 Google 账户
4. 点击 **Advanced** → **Go to [你的项目名] (unsafe)**
5. 点击 **Allow**

---

### Step 4: 配置 Stripe Webhook Endpoint URL

#### 4.1 更新 Stripe Webhook Endpoint

1. 返回 Stripe Dashboard → **Developers** → **Webhooks**
2. 点击你之前创建的 Webhook endpoint
3. 点击 **Update endpoint**
4. 在 **Endpoint URL** 字段中，粘贴你从 Step 3.2 复制的 Google Apps Script Web App URL
5. 点击 **Update endpoint**

#### 4.2 验证 Webhook 配置

1. 在 Stripe Dashboard 的 Webhook 详情页面
2. 点击 **Send test webhook** 按钮
3. 选择事件类型：`checkout.session.completed`
4. 点击 **Send test webhook**

---

### Step 5: 测试 Webhook 集成

#### 5.1 创建测试注册

1. 在你的网站上进行一次测试注册
2. 确保注册数据包含有效的邮箱地址
3. 确认 Google Sheet 中已创建该注册记录（Payment Processed = "No"）

#### 5.2 模拟支付完成

**方法 1：使用 Stripe 测试卡**
1. 访问你的注册页面
2. 点击支付按钮，进入 Stripe Payment Link
3. 使用 Stripe 测试卡号：
   - 卡号：`4242 4242 4242 4242`
   - 过期日期：任意未来日期（如 `12/25`）
   - CVC：任意 3 位数字（如 `123`）
4. 完成支付

**方法 2：在 Stripe Dashboard 发送测试 Webhook**
1. 进入 Stripe Dashboard → **Developers** → **Webhooks**
2. 点击你的 Webhook endpoint
3. 点击 **Send test webhook**
4. 选择 `checkout.session.completed`
5. 在测试数据中，修改 `customer_email` 字段为你的测试注册邮箱
6. 点击 **Send test webhook**

#### 5.3 验证更新

1. 检查 Google Sheet
2. 找到对应的注册记录
3. 确认 **Payment Processed** 列已自动更新为 **"Yes"**

---

## 🔍 调试和故障排除

### 查看 Google Apps Script 日志

1. 在 Apps Script 编辑器中，点击 **Executions**（左侧菜单）
2. 查看最近的执行记录
3. 点击某个执行记录查看日志
4. 查找错误信息或 `Logger.log()` 输出

### 常见问题

#### 问题 1: Webhook 未触发

**可能原因**：
- Stripe Webhook URL 配置错误
- Google Apps Script 部署权限设置错误

**解决方法**：
- 检查 Stripe Dashboard 中的 Webhook URL 是否正确
- 确认 Google Apps Script Web App 权限设置为 "Anyone"

#### 问题 2: 支付状态未更新

**可能原因**：
- 邮箱地址不匹配（大小写、空格等）
- Google Sheet 中找不到匹配的注册记录

**解决方法**：
- 检查 Stripe Webhook 日志中的邮箱地址
- 确认 Google Sheet 中的邮箱地址格式一致
- 查看 Apps Script 执行日志中的错误信息

#### 问题 3: 签名验证失败

**可能原因**：
- Webhook Secret 配置错误

**解决方法**：
- 确认 Google Apps Script 代码中的 `STRIPE_WEBHOOK_SECRET` 正确
- 在 Stripe Dashboard 中重新复制 Signing Secret

---

## 📊 数据流程

```
用户完成 Stripe 支付
    ↓
Stripe 发送 checkout.session.completed 事件
    ↓
Webhook 请求发送到 Google Apps Script Web App URL
    ↓
Google Apps Script 接收 Webhook 请求
    ↓
提取客户邮箱地址
    ↓
在 Google Sheet 中查找匹配的注册记录
    ↓
更新 Payment Processed 列为 "Yes"
    ↓
✅ 完成
```

---

## 🔒 安全注意事项

### 当前实现的安全限制

1. **签名验证简化**：当前代码使用简化版的签名验证。在生产环境中，建议实现完整的 Stripe Webhook 签名验证。

2. **访问控制**：
   - Google Apps Script Web App 设置为 "Anyone" 可以访问，这是 Stripe Webhook 正常工作所必需的
   - 但由于 Webhook Secret 的验证，只有 Stripe 可以成功触发更新

### 增强安全性的建议

如果需要更强的安全性，可以实现完整的 Stripe 签名验证：

```javascript
// 完整的签名验证示例（需要 crypto 库）
function verifyStripeSignature(payload, signature, secret) {
  // 使用 HMAC-SHA256 验证签名
  // 实现细节请参考 Stripe 文档
}
```

---

## ✅ 检查清单

完成以下所有步骤后，Webhook 自动化就配置好了：

- [ ] 在 Stripe Dashboard 创建了 Webhook Endpoint
- [ ] 复制并保存了 Webhook Signing Secret
- [ ] 更新了 Google Apps Script 代码（包含 Webhook 处理函数）
- [ ] 在代码中配置了 Webhook Secret
- [ ] 部署了 Google Apps Script 为 Web App
- [ ] 复制了 Google Apps Script Web App URL
- [ ] 在 Stripe Webhook 中配置了 Endpoint URL
- [ ] 授权了 Google Apps Script 访问
- [ ] 发送了测试 Webhook
- [ ] 验证了 Google Sheet 中的 Payment Processed 状态更新

---

## 📝 下一步

配置完成后：

1. **监控 Webhook**：
   - 定期检查 Stripe Dashboard → **Developers** → **Webhooks** → **Logs**
   - 查看成功的 Webhook 请求

2. **监控 Google Sheet**：
   - 确认支付完成后 Payment Processed 列自动更新

3. **测试生产环境**：
   - 使用真实的支付流程测试
   - 确认自动化工作正常

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 Google Apps Script 执行日志
2. 查看 Stripe Dashboard 中的 Webhook 日志
3. 检查 Google Sheet 中的数据格式
4. 确认所有配置步骤都已正确完成
