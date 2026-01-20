# Google Sheets 数据同步集成指南

## 概述
本指南将帮助你实现注册数据自动写入 Google Sheets，使用 Google Sheets 作为数据库。

**目标 Google Sheet**: https://docs.google.com/spreadsheets/d/15jlxfy2c0PrsOTgtJ0uY9CQR96_5CAB2X2E9Ey2drDU/edit

## 方案对比

### 方案 A: Google Apps Script（推荐）⭐
- ✅ **免费**
- ✅ **简单易用**
- ✅ **无需后端服务器**
- ✅ **自动处理认证**
- ⚠️ 有每日执行限制（通常足够用）

### 方案 B: Google Sheets API + Service Account
- ✅ 功能强大
- ⚠️ 需要后端服务器处理认证
- ⚠️ 配置较复杂

**推荐使用方案 A**（Google Apps Script）

## 实施步骤：Google Apps Script 方案

### 步骤 1: 准备 Google Sheet

1. **打开你的 Google Sheet**：
   https://docs.google.com/spreadsheets/d/15jlxfy2c0PrsOTgtJ0uY9CQR96_5CAB2X2E9Ey2drDU/edit

2. **创建表头**（如果还没有）：
   在 Sheet 的第一行添加以下列：
   ```
   A: Timestamp
   B: Student Name
   C: Parent Email
   D: Parent Phone
   E: Course
   F: Session Date
   G: Session Time
   H: Is Series
   ```

### 步骤 2: 创建 Google Apps Script

1. **打开脚本编辑器**：
   - 在 Google Sheet 中，点击顶部菜单 **Extensions**（扩展）→ **Apps Script**

2. **创建 Web App**：
   复制以下代码到编辑器：

```javascript
// 处理 POST 请求，写入数据到 Google Sheet
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 获取当前时间戳
    const timestamp = new Date();
    
    // 准备要写入的行数据
    const rowData = [
      timestamp,                    // A: Timestamp
      data.studentName || '',       // B: Student Name
      data.parentEmail || '',       // C: Parent Email
      data.parentPhone || '',       // D: Parent Phone
      data.course || '',            // E: Course
      data.sessionDate || '',       // F: Session Date
      data.sessionTime || '',       // G: Session Time
      data.isSeries ? 'Yes' : 'No'  // H: Is Series
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
      status: 'OK'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **保存脚本**：
   - 点击工具栏的保存图标（💾）
   - 给项目命名：`Registration Data Handler`

4. **部署为 Web App**：
   - 点击 **Deploy**（部署）→ **New deployment**
   - 点击 **Select type** 旁边的齿轮图标 ⚙️
   - 选择 **Web app**
   - 填写部署信息：
     - **Description**: `Registration API v1`
     - **Execute as**: `Me` (你的账户)
     - **Who has access**: `Anyone`（重要！否则无法从前端调用）
   - 点击 **Deploy**
   - **第一次部署需要授权**：
     - 点击 **Authorize access**
     - 选择你的 Google 账户
     - 点击 **Advanced** → **Go to Registration Data Handler (unsafe)**
     - 点击 **Allow**
   - **复制 Web App URL**（格式：`https://script.google.com/macros/s/xxxxx/exec`）
     - ⚠️ **重要**：保存这个 URL，稍后需要在代码中使用

### 步骤 3: 更新前端代码

更新 `src/pages/Registration.tsx` 中的 `handleNewRegistration` 函数：

```typescript
const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

const handleNewRegistration = async (data: any) => {
  setIsSyncing(true);
  
  try {
    // 1. 先保存到 localStorage（作为备份）
    const updated = [data, ...globalRegistrations];
    setGlobalRegistrations(updated);
    localStorage.setItem('dtf_registrations', JSON.stringify(updated));
    
    // 2. 同步到 Google Sheets
    if (GOOGLE_SHEETS_API_URL) {
      const response = await fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Successfully synced to Google Sheets');
      } else {
        console.error('❌ Failed to sync to Google Sheets:', result.error);
        // 可以选择显示错误提示给用户
      }
    } else {
      console.warn('⚠️ Google Sheets API URL not configured');
    }
    
    setIsSyncing(false);
  } catch (error) {
    console.error('❌ Error syncing to Google Sheets:', error);
    setIsSyncing(false);
    // 即使同步失败，数据也已保存到 localStorage
  }
};
```

### 步骤 4: 配置环境变量

#### 本地开发（.env.local）

```bash
# Google Sheets API (从 Google Apps Script 部署 URL)
VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

#### Vercel 生产环境

1. 访问 Vercel Dashboard
2. 进入项目 **Settings** → **Environment Variables**
3. 添加：
   - **Name**: `VITE_GOOGLE_SHEETS_API_URL`
   - **Value**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
   - **Environment**: 所有环境

## 完整代码更新

代码已自动更新！`src/pages/Registration.tsx` 中的 `handleNewRegistration` 函数已经包含了 Google Sheets 同步功能。

## 步骤 5: 测试集成

### 5.1 测试 Google Apps Script

1. 在 Google Apps Script 编辑器中，点击运行按钮 ▶️
2. 选择 `doGet` 函数
3. 如果看到 `{"message": "Google Sheets API is running", "status": "OK"}`，说明部署成功

### 5.2 测试前端连接

1. 启动开发服务器：`npm run dev`
2. 访问注册页面：`http://localhost:5173/registration`
3. 选择一个时间段注册
4. 填写学生信息
5. 点击 "Enroll & Sync"
6. 检查：
   - ✅ 浏览器控制台应该显示 "✅ Registration data sent to Google Sheets"
   - ✅ Google Sheet 中应该出现新的一行数据

## 数据格式说明

发送到 Google Sheets 的数据格式：

```javascript
{
  studentName: "Alex Chen",
  parentEmail: "parent@example.com",
  parentPhone: "(555) 000-0000",
  course: "Level 1",
  sessionDate: "2026-02-03",
  sessionTime: "4:00 PM",
  isSeries: true,
  timestamp: "2026-01-15T10:30:00.000Z"
}
```

在 Google Sheet 中的列顺序：
- A: Timestamp (自动生成)
- B: Student Name
- C: Parent Email
- D: Parent Phone
- E: Course
- F: Session Date
- G: Session Time
- H: Is Series (Yes/No)

## 故障排除

### 问题 1: "Failed to sync to Google Sheets"

**可能原因**：
- Google Apps Script URL 未配置或错误
- Web App 未设置为 "Anyone" 访问权限
- CORS 错误

**解决方法**：
1. 检查环境变量 `VITE_GOOGLE_SHEETS_API_URL` 是否正确
2. 确保 Web App 部署时选择 "Anyone" 访问权限
3. 检查 Google Apps Script 编辑器中的代码是否正确

### 问题 2: 数据没有写入 Google Sheet

**可能原因**：
- Google Apps Script 执行权限问题
- Sheet 名称或列顺序不匹配

**解决方法**：
1. 检查 Google Apps Script 的执行日志：
   - 在 Apps Script 编辑器中，点击 **Execution**（执行）查看日志
2. 确认 Sheet 的第一行有正确的表头
3. 确认 Google Apps Script 中的列顺序与代码匹配

### 问题 3: 使用 no-cors 模式无法读取响应

这是正常的。使用 `mode: 'no-cors'` 是因为 Google Apps Script Web App 不支持 CORS。数据仍然会被发送和写入，只是无法在前端读取响应。

可以通过以下方式验证数据是否写入：
1. 直接查看 Google Sheet
2. 在 Google Apps Script 中添加日志记录

## 高级功能（可选）

### 添加数据验证

在 Google Apps Script 中添加验证：

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 验证必填字段
    if (!data.studentName || !data.parentEmail) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ... 其余代码
  } catch (error) {
    // ... 错误处理
  }
}
```

### 添加邮件通知

当有新注册时发送邮件：

```javascript
function doPost(e) {
  try {
    // ... 写入数据的代码 ...
    
    // 发送通知邮件
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: 'New Course Registration',
      body: `New registration:\n\nStudent: ${data.studentName}\nCourse: ${data.course}`
    });
    
    // ... 返回响应
  } catch (error) {
    // ... 错误处理
  }
}
```

## 完成清单

- [ ] 创建了 Google Apps Script 项目
- [ ] 复制了 `doPost` 函数代码
- [ ] 部署了 Web App（选择 "Anyone" 访问权限）
- [ ] 复制了 Web App URL
- [ ] 在 `.env.local` 中添加了 `VITE_GOOGLE_SHEETS_API_URL`
- [ ] 在 Vercel 中设置了环境变量
- [ ] 测试了注册功能，确认数据写入 Google Sheet
- [ ] Google Sheet 中有正确的表头

## 下一步

完成后：
1. 测试完整的注册流程
2. 验证数据正确写入 Google Sheet
3. 考虑添加数据验证和错误处理
4. （可选）设置邮件通知