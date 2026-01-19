# 本地运行指南 - 在本地测试项目

本指南将帮助你在本地运行和测试这个项目。

## 前置要求

在开始之前，确保你已经安装了：

- **Node.js** (版本 18 或更高)
  - 检查是否已安装：`node --version`
  - 如果没有安装，下载：https://nodejs.org/
- **npm** (通常随 Node.js 一起安装)
  - 检查是否已安装：`npm --version`

## 步骤 1: 进入项目目录

打开终端，进入项目目录：

```bash
cd "/Users/emmawang/Library/Mobile Documents/com~apple~CloudDocs/Emma My Product/AI_Projects/h_DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP /DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP"
```

## 步骤 2: 安装依赖

安装项目所需的所有依赖包：

```bash
npm install
```

这个命令会：
- 读取 `package.json` 文件
- 下载并安装所有依赖（React, Vite, TypeScript 等）
- 创建 `node_modules` 文件夹

**第一次运行可能需要几分钟**，请耐心等待。

## 步骤 3: 配置环境变量

创建环境变量文件来存储 Gemini API Key：

### 创建 `.env.local` 文件

在项目根目录创建一个名为 `.env.local` 的文件：

```bash
# 在项目根目录创建文件
touch .env.local
```

### 添加 API Key

编辑 `.env.local` 文件，添加以下内容：

```
GEMINI_API_KEY=AIzaSyAmZtlPSA7Vwqf_gCwD5Tsc1PWBU0VLXvo
```

**重要提示**：
- `.env.local` 文件已经被添加到 `.gitignore`，不会被提交到 Git
- 这是安全的做法，保护你的 API Key
- 不要将这个文件分享给其他人

## 步骤 4: 启动开发服务器

运行开发服务器：

```bash
npm run dev
```

你应该会看到类似以下的输出：

```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 步骤 5: 在浏览器中打开

开发服务器启动后：

1. 打开浏览器
2. 访问：**http://localhost:3000/**

你应该能看到完整的网站，包括：
- Hero 区域
- 课程级别展示
- AI Lab Helper 功能
- 注册区域

## 步骤 6: 测试 AI 功能

测试 AI Lab Helper 功能：

1. 滚动到 "AI Pro Lab" 部分
2. 选择一个课程级别（例如 "LEVEL 1 (EXPLORER)"）
3. 输入一个兴趣（例如 "Dragons", "Space", "Minecraft"）
4. 点击 "Generate Idea" 按钮
5. 等待 AI 生成项目建议

**如果功能正常工作**，你应该能看到一个 AI 生成的项目建议。

## 完整命令序列

如果你想一次性执行所有步骤：

```bash
# 1. 进入项目目录
cd "/Users/emmawang/Library/Mobile Documents/com~apple~CloudDocs/Emma My Product/AI_Projects/h_DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP /DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP"

# 2. 安装依赖（仅第一次需要）
npm install

# 3. 创建环境变量文件（仅第一次需要）
echo "GEMINI_API_KEY=AIzaSyAmZtlPSA7Vwqf_gCwD5Tsc1PWBU0VLXvo" > .env.local

# 4. 启动开发服务器
npm run dev
```

## 其他有用的命令

### 停止开发服务器

在终端中按 `Ctrl + C` 停止开发服务器。

### 构建生产版本

如果你想构建生产版本进行测试：

```bash
npm run build
```

这会创建一个 `dist` 文件夹，包含优化后的生产代码。

### 预览生产构建

构建完成后，可以预览生产版本：

```bash
npm run preview
```

## 常见问题解决

### 问题 1: `npm install` 失败

**错误信息**: "npm ERR! code EACCES" 或其他权限错误

**解决方法**:
```bash
# 使用 sudo（不推荐，但可以解决权限问题）
sudo npm install

# 或者修复 npm 权限
npm config set prefix ~/.npm-global
```

### 问题 2: 端口 3000 已被占用

**错误信息**: "Port 3000 is already in use"

**解决方法**:
```bash
# 方法 1: 使用不同的端口
npm run dev -- --port 3001

# 方法 2: 找到并关闭占用端口的进程
lsof -ti:3000 | xargs kill -9
```

### 问题 3: API Key 错误

**错误信息**: "Gemini Error" 或 AI 功能不工作

**解决方法**:
1. 检查 `.env.local` 文件是否存在
2. 确认 API Key 格式正确（没有多余的空格）
3. 确认 API Key 有效
4. 重启开发服务器（按 `Ctrl + C`，然后再次运行 `npm run dev`）

### 问题 4: 依赖安装缓慢

**解决方法**:
```bash
# 使用国内镜像源（如果在中国）
npm install --registry=https://registry.npmmirror.com

# 或者使用 yarn（通常更快）
npm install -g yarn
yarn install
```

### 问题 5: 页面显示空白

**解决方法**:
1. 检查浏览器控制台（按 F12）是否有错误
2. 确认 `index.html` 中有 `<script type="module" src="/index.tsx"></script>`
3. 检查 `index.tsx` 文件是否存在
4. 重启开发服务器

## 验证步骤

确保一切正常运行：

- [ ] 依赖安装成功（`node_modules` 文件夹存在）
- [ ] `.env.local` 文件已创建并包含 API Key
- [ ] 开发服务器成功启动（看到 "ready in xxx ms"）
- [ ] 浏览器能访问 http://localhost:3000/
- [ ] 网站内容正常显示
- [ ] AI Lab Helper 功能能正常工作

## 下一步

本地测试成功后，你可以：

1. **继续开发**: 修改代码，保存后会自动热重载
2. **测试功能**: 测试所有功能是否正常工作
3. **调试问题**: 如果发现问题，可以在本地修复后再提交

## 需要帮助？

如果遇到问题：

1. 检查终端错误信息
2. 查看浏览器控制台（F12）
3. 确认所有步骤都正确执行
4. 参考项目的 `README.md` 文件

## 开发技巧

- **热重载**: 修改代码后，浏览器会自动刷新显示更改
- **错误提示**: 如果有错误，会在终端和浏览器控制台显示
- **快速测试**: 修改代码后立即在浏览器中查看效果

祝你开发愉快！🎉
