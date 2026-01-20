// Updated Google Apps Script Code
// Copy this to your Google Apps Script editor

// 处理 POST 请求，写入数据到 Google Sheet
function doPost(e) {
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
      data.paymentProcessed || 'No' // I: Payment Processed (新增)
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

// 处理 GET 请求（可选，用于测试）
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Google Sheets API is running',
      status: 'OK',
      version: '2.0 - with Payment Processed support'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 新增：更新支付状态的函数（可选，用于将来实现支付状态自动更新）
function updatePaymentStatus(email, paymentStatus) {
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
