# Vercel 部署快速检查清单

## ✅ 本地准备 (已完成)

- [x] Git 仓库已初始化 (`git init`)
- [x] Vercel 配置文件已创建 (`vercel.json`)
- [x] Git 忽略文件已配置 (`.gitignore`)
- [x] PWA 文件已准备 (`manifest.json`, `sw.js`)
- [x] 代码已提交到本地仓库
- [x] PWA 图标已准备 (`icons/icon-192.png`, `icons/icon-512.png`)

---

## 📋 待执行步骤

### 第一步: 推送到 GitHub (需要你操作)

```bash
# 1. 创建 GitHub 仓库 (访问 https://github.com/new)
# 仓库名: event-recruit-frontend
# 设为 Public

# 2. 推送代码 (在 PowerShell 中执行)
cd D:\EventRecruitApp\frontend
git remote add origin https://github.com/你的用户名/event-recruit-frontend.git
git branch -M main
git push -u origin main
```

**注意事项**:
- 将 `你的用户名` 替换为你的 GitHub 用户名
- 如果推送时提示登录,使用 GitHub Token 认证

---

### 第二步: 导入到 Vercel (需要你操作)

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 选择 `event-recruit-frontend` 仓库
4. 点击 "Import"
5. 点击 "Deploy" 开始部署
6. 等待 30-60 秒

---

### 第三步: 验证部署 (部署完成后)

#### 1. 访问网站
- URL: `https://event-recruit-frontend.vercel.app`

#### 2. 验证 HTTPS
- [ ] 地址栏有 🔒 图标
- [ ] URL 以 `https://` 开头

#### 3. 验证 PWA (电脑浏览器)
- [ ] 打开开发者工具 (F12)
- [ ] Application → Manifest: 显示应用信息
- [ ] Application → Service Workers: 显示已激活

#### 4. 验证 PWA (手机浏览器)
- [ ] Safari/Chrome 浏览器访问
- [ ] 可以"添加到主屏幕"
- [ ] 图标和名称正确显示

#### 5. 功能测试
- [ ] 首页正常加载
- [ ] 5 个 Tab 导航正常切换
- [ ] 登录功能正常
- [ ] 报名活动功能正常
- [ ] 投递职位功能正常

---

## 🎯 完成后告诉我

当 Vercel 部署完成后,请告诉我:

1. **部署成功的 URL** (例如: `https://event-recruit-frontend.vercel.app`)
2. **是否有任何错误或警告**
3. **是否需要我帮你测试 PWA 功能**

我会立即帮你验证并准备腾讯云方案B!

---

## 📚 参考文档

完整操作指南: `D:\EventRecruitApp\frontend\Vercel部署操作指南.md`

常见问题解答:
- 部署失败 → 检查 `vercel.json` 配置
- PWA 不显示 → 检查 HTTPS 和 manifest.json
- 图标不显示 → 检查 icons/ 目录和路径

---

**检查清单版本**: v1.0
**创建日期**: 2026-03-20
