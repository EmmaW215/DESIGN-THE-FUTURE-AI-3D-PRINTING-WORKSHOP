# Git 推送指南 - 手动推送所有更改到 GitHub

本指南将帮助你手动推送所有更改到 GitHub 仓库。

## 前提条件

- 已安装 Git
- 已配置 GitHub 账户和 SSH 密钥（或使用 HTTPS 认证）
- 已克隆仓库到本地

## 步骤 1: 检查当前状态

首先，检查当前 Git 仓库的状态：

```bash
cd "/Users/emmawang/Library/Mobile Documents/com~apple~CloudDocs/Emma My Product/AI_Projects/h_DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP /DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP"
git status
```

这将显示：
- 哪些文件被修改了
- 哪些文件是新添加的
- 哪些文件已暂存准备提交

## 步骤 2: 查看具体更改

如果你想查看具体修改了什么内容：

```bash
# 查看所有更改的差异
git diff

# 查看已暂存文件的差异
git diff --staged

# 查看特定文件的差异
git diff index.html
git diff services/geminiService.ts
```

## 步骤 3: 添加文件到暂存区

将更改的文件添加到暂存区（准备提交）：

```bash
# 添加所有更改的文件
git add .

# 或者单独添加特定文件
git add index.html
git add services/geminiService.ts
git add App.tsx

# 添加整个目录
git add services/
```

## 步骤 4: 确认暂存的文件

再次检查状态，确认要提交的文件：

```bash
git status
```

你应该看到所有要提交的文件都列在 "Changes to be committed" 下面。

## 步骤 5: 提交更改

创建一个提交，包含描述性的提交信息：

```bash
git commit -m "Fix: Update index.html to work with Vite production build

- Removed importmap which was interfering with Vite build process
- Added explicit entry script reference: <script type=\"module\" src=\"/index.tsx\"></script>
- Fixed geminiService.ts to use GEMINI_API_KEY
- Fixes blank page issue on production deployment"
```

**提示**：
- 使用 `-m` 后面跟一个简短的提交信息
- 使用多行提交信息时，可以不用 `-m`，Git 会打开编辑器让你输入

## 步骤 6: 推送到 GitHub

将本地提交推送到远程 GitHub 仓库：

```bash
# 推送到 main 分支
git push origin main

# 如果是第一次推送新分支，使用：
# git push -u origin main
```

## 步骤 7: 验证推送成功

检查远程仓库是否已更新：

```bash
# 查看远程仓库状态
git remote -v

# 查看最近的提交
git log --oneline -5

# 比较本地和远程的差异
git fetch
git status
```

## 完整命令示例

以下是完整的命令序列：

```bash
# 1. 进入项目目录
cd "/Users/emmawang/Library/Mobile Documents/com~apple~CloudDocs/Emma My Product/AI_Projects/h_DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP /DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP"

# 2. 检查状态
git status

# 3. 添加所有更改
git add .

# 4. 再次检查状态
git status

# 5. 提交更改
git commit -m "你的提交信息"

# 6. 推送到 GitHub
git push origin main
```

## 常见问题解决

### 问题 1: 推送被拒绝

如果看到 "push rejected" 错误：

```bash
# 先拉取远程更改
git pull origin main

# 如果有冲突，解决冲突后再推送
git push origin main
```

### 问题 2: 未配置远程仓库

如果还没有配置远程仓库：

```bash
# 添加远程仓库
git remote add origin https://github.com/EmmaW215/DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP.git

# 然后推送
git push -u origin main
```

### 问题 3: 需要认证

如果提示需要认证：

**使用 HTTPS**:
- 使用个人访问令牌（Personal Access Token）替代密码
- 在 GitHub 设置中生成：Settings → Developer settings → Personal access tokens

**使用 SSH**:
```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 如果没有配置，需要生成 SSH 密钥并添加到 GitHub
```

### 问题 4: 想要撤销最后一次提交

如果你提交了错误的更改：

```bash
# 撤销最后一次提交，但保留更改
git reset --soft HEAD~1

# 或者完全删除最后一次提交
git reset --hard HEAD~1
```

**⚠️ 警告**: `git reset --hard` 会永久删除更改，使用前请确认！

## 最佳实践

1. **提交前检查**: 总是先运行 `git status` 和 `git diff` 查看更改
2. **有意义的提交信息**: 写清楚你做了什么更改以及为什么
3. **小步提交**: 将大的更改拆分成多个小的、逻辑清晰的提交
4. **定期推送**: 不要积累太多本地提交，定期推送到远程仓库
5. **提交前测试**: 确保代码能正常运行再提交

## 查看 GitHub 仓库

推送成功后，你可以在以下地址查看：
- GitHub 仓库: https://github.com/EmmaW215/DESIGN-THE-FUTURE-AI-3D-PRINTING-WORKSHOP
- Vercel 部署: https://design-the-future-ai-3-d-printing-w.vercel.app/

## 需要帮助？

如果遇到问题，可以：
1. 查看 Git 帮助: `git help <command>`
2. 查看错误信息的详细说明
3. 参考 GitHub 文档: https://docs.github.com/
