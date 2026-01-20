# Stripe Webhook 快速开始指南

## 找不到 "+ Add destination" 按钮？

根据你的截图，你可能需要按照以下步骤：

### 步骤 1: 确认你在正确的页面

1. ✅ 确认你在 **Developers** 页面
   - 左侧导航：**Settings** → **Developers**
   - URL 应该是：`https://dashboard.stripe.com/acct_1RlrH1E6OOEHr6Zo/settings/developers`

2. ✅ 确认你点击了 **Webhooks** 标签
   - 在页面顶部，有一行标签：**Overview**, **Webhooks**, **Events**, **Logs** 等
   - 点击 **Webhooks** 标签（应该被高亮显示）

### 步骤 2: 查找 "Event destinations" 部分

1. 在 **Webhooks** 标签页中，向下滚动
2. 找到 **"Event destinations"** 部分（标题）
3. 在这个部分的右上角，应该有一个紫色的 **`+ Add destination`** 按钮

### 步骤 3: 如果仍然看不到按钮

#### 方法 A: 检查页面是否完全加载
- 刷新页面（F5 或 Cmd+R）
- 等待页面完全加载
- 向下滚动查看 "Event destinations" 部分

#### 方法 B: 使用旧版界面（如果有）
- 某些 Stripe 账户可能仍在使用旧版界面
- 查找是否有 "Switch to classic view" 或类似的链接
- 旧版界面中，按钮可能叫做 "Add endpoint" 或 "+ Add webhook endpoint"

#### 方法 C: 直接访问 URL
尝试直接访问以下 URL：
```
https://dashboard.stripe.com/acct_1RlrH1E6OOEHr6Zo/test/webhooks
```
（如果是测试环境）或
```
https://dashboard.stripe.com/acct_1RlrH1E6OOEHr6Zo/webhooks
```

### 步骤 4: 替代方法 - 通过 Stripe CLI

如果界面有问题，你可以使用 Stripe CLI 创建 Webhook：

1. 安装 Stripe CLI：
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # 其他系统，参考: https://stripe.com/docs/stripe-cli
   ```

2. 登录 Stripe CLI：
   ```bash
   stripe login
   ```

3. 创建 Webhook endpoint（需要先部署 Google Apps Script）：
   ```bash
   stripe webhook-endpoints create \
     --url="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL" \
     --enabled-events="checkout.session.completed"
   ```

### 步骤 5: 截图说明

根据你的截图，你应该看到：

1. **页面顶部**：
   - 左侧：面包屑导航 "Settings > Developers"
   - 中间：大标题 "Developers"
   - 右侧：各种图标按钮

2. **标签栏**：
   - **Overview** | **Webhooks** | **Events** | **Logs** | **Health** | **Inspector** | **Blueprints** | **Shell**
   - 确认 **Webhooks** 标签被选中（应该高亮显示）

3. **"Event destinations" 部分**：
   - 标题："Event destinations"
   - 描述："Send events from Stripe to webhook endpoints and cloud services."
   - **右上角应该有一个紫色的 `+ Add destination` 按钮**
   - 下方可能有一个表格，显示现有的 Webhook endpoints

### 如果你看到现有的 Webhook

在你的截图中，你提到看到了一个现有的 Webhook：
- **Type**: Matchwise API
- **Destination**: `https://resume-matcher-backend-rr....onrender.com/api/stripe-webhook`

这说明：
- ✅ Webhooks 功能是可用的
- ✅ 你应该能够创建新的 Webhook endpoint
- ✅ 界面可能只是布局有所不同

### 详细步骤（如果按钮可见）

当你看到 **`+ Add destination`** 按钮后：

1. 点击 **`+ Add destination`** 按钮
2. 在弹出的窗口中：
   - **Destination type**: 选择 **"Webhook endpoint"** 或 **"HTTP endpoint"**
   - **Endpoint URL**: 
     - 第一次：先填一个临时 URL（如 `https://example.com/webhook`）
     - 稍后：会更新为你的 Google Apps Script Web App URL
   - **Description** (可选): `Update Payment Processed Status in Google Sheets`
3. 点击 **Add destination** 或 **Save**
4. 选择事件：
   - 在事件选择页面，找到并选择：
     - `checkout.session.completed` ✅
     - `payment_intent.succeeded` ✅（可选）
   - 点击 **Add events** 或 **Save**
5. 完成后，回到 Webhook endpoint 详情页面，复制 **Signing secret**

### 需要更多帮助？

如果以上步骤都不起作用，请：

1. **检查浏览器控制台**：
   - 按 F12 打开开发者工具
   - 查看 Console 标签，看是否有错误信息

2. **尝试不同的浏览器**：
   - Chrome、Firefox、Safari 等
   - 清除缓存后重试

3. **联系 Stripe 支持**：
   - 如果界面确实有问题，可以联系 Stripe 技术支持

4. **使用 Stripe API**：
   - 可以通过 API 直接创建 Webhook endpoint（需要 API Key）

### 快速检查清单

- [ ] 在 Developers 页面
- [ ] 点击了 Webhooks 标签
- [ ] 找到 "Event destinations" 部分
- [ ] 看到紫色的 "+ Add destination" 按钮
- [ ] 或者看到现有的 Webhook 列表（证明功能可用）

如果这些都确认了但还是看不到按钮，可能需要：
- 检查账户权限
- 刷新页面
- 尝试不同浏览器
- 联系 Stripe 支持
