// ============================================
// Complete Google Apps Script Code
// Copy this entire file to your Google Apps Script editor
// ============================================

// ⚠️ 重要：替换为你的 Stripe Webhook Signing Secret（如果配置了 Webhook）
// 格式：whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// 如果还没有配置 Webhook，可以暂时留空
const STRIPE_WEBHOOK_SECRET = 'whsec_YOUR_WEBHOOK_SECRET_HERE';

// ============================================
// 处理 POST 请求（注册数据和 Webhook）
// ============================================
function doPost(e) {
  try {
    // 检查是否是 Stripe Webhook 请求
    // Stripe Webhook 会在请求头中包含特定的签名
    const rawBody = e.postData.contents;
    const headers = e.parameter;
    
    // 检查是否是 Stripe Webhook（通过检查 payload 结构）
    try {
      const payload = JSON.parse(rawBody);
      
      // Stripe Webhook 包含 'type' 字段
      if (payload.type && (payload.type.startsWith('checkout.session') || payload.type.startsWith('payment_intent'))) {
        // 这是 Stripe Webhook 请求
        return handleStripeWebhook(payload);
      }
    } catch (e) {
      // 不是 JSON 或不是 Stripe Webhook，继续处理注册数据
    }
    
    // 否则，这是普通的注册数据提交
    return handleRegistrationData(e);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// 处理注册数据提交
// ============================================
function handleRegistrationData(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 获取当前时间戳
    const timestamp = new Date();
    
    // 准备要写入的行数据（包含 Payment Processed 列）
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
    
    // 追加新行到 Sheet
    sheet.appendRow(rowData);
    
    Logger.log('Registration saved: ' + data.studentName + ' (' + data.parentEmail + ')');
    
    // 返回成功响应
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in handleRegistrationData: ' + error.toString());
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
// 处理 Stripe Webhook 请求
// ============================================
function handleStripeWebhook(payload) {
  try {
    const eventType = payload.type;
    
    Logger.log('Received Stripe webhook: ' + eventType);
    
    // 只处理支付成功事件
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const result = updatePaymentStatusFromWebhook(payload);
      
      if (result.success) {
        Logger.log('Payment status updated successfully: ' + result.message);
      } else {
        Logger.log('Failed to update payment status: ' + result.message);
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({
          received: true,
          eventType: eventType,
          updated: result.success,
          message: result.message || 'Payment status updated'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 其他事件类型，只确认接收
    return ContentService
      .createTextOutput(JSON.stringify({
        received: true,
        eventType: eventType,
        message: 'Event received but not processed'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in handleStripeWebhook: ' + error.toString());
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
    
    // 从不同的事件类型中提取客户邮箱
    if (payload.type === 'checkout.session.completed') {
      // checkout.session.completed 事件
      customerEmail = payload.data.object.customer_email || 
                     payload.data.object.customer_details?.email || 
                     payload.data.object.customer_details?.email || '';
    } else if (payload.type === 'payment_intent.succeeded') {
      // payment_intent.succeeded 事件
      customerEmail = payload.data.object.charges?.data[0]?.billing_details?.email || 
                     payload.data.object.metadata?.email || '';
    }
    
    if (!customerEmail) {
      Logger.log('No customer email found in webhook payload');
      Logger.log('Payload structure: ' + JSON.stringify(payload.data.object));
      return { success: false, message: 'No email found in webhook payload' };
    }
    
    Logger.log('Processing payment update for email: ' + customerEmail);
    
    // 找到匹配的行并更新 Payment Processed 列
    // Email 在 C 列（索引 2），Payment Processed 在 I 列（索引 8）
    let updatedCount = 0;
    
    for (let i = 1; i < values.length; i++) { // 跳过表头（第0行）
      const rowEmail = values[i][2]; // C 列：Email（索引 2）
      
      if (rowEmail && rowEmail.toString().toLowerCase().trim() === customerEmail.toLowerCase().trim()) {
        // 找到匹配的邮箱，更新 Payment Processed 列为 "Yes"
        sheet.getRange(i + 1, 9).setValue('Yes'); // I 列：Payment Processed（第9列）
        updatedCount++;
        Logger.log('Updated row ' + (i + 1) + ' for email: ' + customerEmail);
      }
    }
    
    if (updatedCount > 0) {
      Logger.log('Successfully updated ' + updatedCount + ' row(s) for email: ' + customerEmail);
      return { 
        success: true, 
        updatedRows: updatedCount,
        message: 'Updated ' + updatedCount + ' registration(s)'
      };
    } else {
      Logger.log('No matching registration found for email: ' + customerEmail);
      return { 
        success: false, 
        message: 'No matching registration found for email: ' + customerEmail 
      };
    }
    
  } catch (error) {
    Logger.log('Error updating payment status: ' + error.toString());
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
      version: '2.0 - Complete with Payment Processed and Webhook support',
      webhookConfigured: STRIPE_WEBHOOK_SECRET !== 'whsec_YOUR_WEBHOOK_SECRET_HERE',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
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
      const rowEmail = values[i][2]; // C 列：Email
      
      if (rowEmail && rowEmail.toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        // 更新 Payment Processed 列
        sheet.getRange(i + 1, 9).setValue(paymentStatus || 'Yes');
        Logger.log('Manually updated row ' + (i + 1) + ' for email: ' + email);
        return { success: true, row: i + 1 };
      }
    }
    
    return { success: false, message: 'Registration not found for email: ' + email };
  } catch (error) {
    Logger.log('Error in updatePaymentStatusManually: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
