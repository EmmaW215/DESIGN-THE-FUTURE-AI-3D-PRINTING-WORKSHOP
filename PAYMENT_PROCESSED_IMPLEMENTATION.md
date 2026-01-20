# Payment Processed 列实施指南

## 概述

添加 "Payment Processed" 列来跟踪哪些注册已完成支付。由于当前使用 Stripe Payment Links，需要特殊处理来跟踪支付状态。

## 问题说明

### 当前架构限制
- 使用 Stripe Payment Links（`buy.stripe.com/...`）
- 支付完成后直接跳转到 Stripe 成功页面
- 前端无法直接知道支付是否完成

### 解决方案对比

#### 方案 A: 使用 Stripe Payment Links 成功 URL（推荐 ⭐）

**优点**：
- ✅ 简单，不需要 webhook
- ✅ 可以立即实施
- ✅ 不需要额外的后端服务器

**缺点**：
- ⚠️ 如果用户没有完成重定向，状态不会更新
- ⚠️ 依赖用户浏览器的重定向

#### 方案 B: Stripe Webhook（更可靠）

**优点**：
- ✅ 可靠，自动更新
- ✅ 不依赖用户操作
- ✅ 可以处理所有支付事件

**缺点**：
- ❌ 需要配置 webhook endpoint
- ❌ Google Apps Script 处理 webhook 较复杂

## 推荐方案：方案 A（Stripe Payment Links + Success URL）

### 实施步骤

#### Step 1: 更新 Google Sheet 表头

在 Google Sheet 中添加新列：
- **I 列**: "Payment Processed"
- 类型：文本（Yes/No）

#### Step 2: 更新 Google Apps Script

添加新的列处理和更新函数：

```javascript
// 处理 POST 请求，写入数据到 Google Sheet
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 获取当前时间戳
    const timestamp = new Date();
    
    // 准备要写入的行数据（添加 Payment Processed 列）
    const rowData = [
      timestamp,                    // A: Timestamp
      data.studentName || '',       // B: Student Name
      data.parentEmail || '',       // C: Parent Email
      data.parentPhone || '',       // D: Parent Phone
      data.course || '',            // E: Course
      data.sessionDate || '',       // F: Session Date
      data.sessionTime || '',       // G: Session Time
      data.isSeries ? 'Yes' : 'No', // H: Is Series
      data.paymentProcessed || 'No' // I: Payment Processed (新增)
    ];
    
    // 追加新行到 Sheet
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 新增：更新支付状态的函数
function updatePaymentStatus(email, sessionId, paymentStatus) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 找到匹配的行（通过 email 和 sessionId）
    for (let i = 1; i < values.length; i++) { // 跳过表头
      if (values[i][2] === email) { // Email 在 C 列（索引 2）
        // 更新 Payment Processed 列（I 列，索引 8）
        sheet.getRange(i + 1, 9).setValue(paymentStatus);
        return { success: true, row: i + 1 };
      }
    }
    
    return { success: false, message: 'Registration not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// 处理支付状态更新的 POST 请求
function doPostForPayment(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = updatePaymentStatus(
      data.email,
      data.sessionId,
      data.paymentStatus || 'Yes'
    );
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### Step 3: 配置 Stripe Payment Links 成功 URL

在 Stripe Dashboard 中：

1. 访问每个 Payment Link 的编辑页面
2. 设置 "After payment" → "Redirect to URL"
3. 使用以下格式：
   ```
   https://design-the-future-ai-3-d-printing-w.vercel.app/success?payment=success&email={CHECKOUT_EMAIL}&course={PRODUCT_NAME}
   ```

**注意**：Stripe Payment Links 可能不支持自定义参数。如果是这样，需要使用方案 B（Webhook）。

#### Step 4: 更新 Success.tsx 页面

```typescript
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const paymentStatus = searchParams.get('payment');
  
  useEffect(() => {
    // 如果 URL 中有支付成功参数，更新 Google Sheet
    if (paymentStatus === 'success' && email) {
      const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_UPDATE_API_URL || '';
      
      if (GOOGLE_SHEETS_API_URL) {
        fetch(GOOGLE_SHEETS_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            paymentStatus: 'Yes'
          })
        }).catch(err => console.error('Failed to update payment status:', err));
      }
    }
  }, [paymentStatus, email]);
  
  // ... 其余代码
}
```

#### Step 5: 更新前端注册代码

在 `Registration.tsx` 中，默认设置 `paymentProcessed: 'No'`：

```typescript
const registrationEntry = {
  ...newStudent,
  sessionDate: format(selectedSession.date, 'yyyy-MM-dd'),
  sessionTime: selectedSession.startTime,
  course: selectedSession.level,
  isSeries: !selectedSession.isWorkshop,
  paymentProcessed: 'No' // 默认未支付
};
```

## 方案 B: Stripe Webhook（如果需要更可靠的方案）

### 实施步骤

1. **创建 Webhook Endpoint**（需要在 Google Apps Script 中创建）
2. **在 Stripe Dashboard 配置 Webhook**
3. **处理支付成功事件**
4. **更新 Google Sheet**

这个方案更复杂，需要额外的 Google Apps Script 代码来处理 webhook 验证。

## 建议

### 短期方案（立即实施）
1. ✅ 添加 "Payment Processed" 列到 Google Sheet（默认 "No"）
2. ✅ 更新 Google Apps Script 支持该列
3. ✅ 在详细表格中显示该列
4. ✅ 手动更新支付状态（临时方案）

### 长期方案（完整自动化）
1. 实施方案 A 或方案 B
2. 自动化支付状态更新

## 当前可立即实施的改进

- ✅ 添加 "Payment Processed" 列到前端显示
- ✅ 更新 Google Apps Script 代码支持该列
- ✅ 手动标记支付状态（在 Google Sheet 中）

自动化支付状态跟踪需要额外的 Stripe 配置。
