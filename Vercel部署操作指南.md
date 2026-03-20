# 活动招聘平台 - Vercel 部署操作指南

## 📋 前置准备

### 1. 注册账号
- **GitHub**: https://github.com/signup (如果还没有账号)
- **Vercel**: https://vercel.com/signup

### 2. 本地已完成
✅ Git仓库已初始化
✅ Vercel配置文件已创建
✅ PWA文件已准备
✅ 代码已提交到本地仓库

---

## 🚀 部署步骤

### 步骤 1: 推送代码到 GitHub

#### 方法 A: 使用 GitHub 网页操作 (推荐新手)

1. 访问 https://github.com/new
2. 创建新仓库:
   - Repository name: `event-recruit-frontend`
   - 设为 Public (免费账户必须公开)
3. 点击 "Create repository"
4. 执行以下命令推送代码:

```bash
cd D:\EventRecruitApp\frontend
git remote add origin https://github.com/你的用户名/event-recruit-frontend.git
git branch -M main
git push -u origin main
```

#### 方法 B: 使用 GitHub CLI (需要先安装 gh)

```bash
gh repo create event-recruit-frontend --public --source=. --push
```

---

### 步骤 2: 在 Vercel 导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 找到并选择 `event-recruit-frontend` 仓库
4. 点击 "Import"

### 步骤 3: 配置项目

在项目配置页面:

**Framework Preset**: 选择 "Other" (因为这是纯HTML项目)

**Root Directory**: 保持默认 `/`

**Build and Output Settings**: 保持默认 (Vercel 会自动识别)

**Environment Variables**: 不需要配置 (前端项目无环境变量)

点击 "Deploy" 按钮

---

### 步骤 4: 等待部署完成

- 部署通常需要 30-60 秒
- 部署成功后会看到:
  - ✅ Production URL: `https://event-recruit-frontend.vercel.app`
  - ✅ 自动配置的 HTTPS 证书

---

## ✅ 部署后验证

### 1. 访问网站
打开浏览器访问: `https://event-recruit-frontend.vercel.app`

### 2. 验证 HTTPS
- 检查地址栏是否有 🔒 锁图标
- 确认 URL 是 `https://` 开头

### 3. 验证 PWA 功能

#### 电脑浏览器测试:
1. 打开开发者工具 (F12)
2. 切换到 "Application" 标签
3. 左侧菜单:
   - **Manifest**: 检查是否识别到 manifest.json
   - **Service Workers**: 检查 sw.js 是否注册成功

#### 手机浏览器测试:
1. 使用 Safari (iOS) 或 Chrome (Android) 访问网站
2. 点击菜单中的 "添加到主屏幕" 或 "安装应用"
3. 确认图标和名称正确显示

### 4. 测试所有页面
- ✅ 首页、活动、职位、匹配、我的
- ✅ 登录功能
- ✅ 报名活动
- ✅ 投递职位
- ✅ 筛选和搜索

---

## 🔧 自定义域名 (可选)

### 在 Vercel 添加自定义域名

1. 访问项目设置: Settings → Domains
2. 点击 "Add" 添加域名:
   - 输入域名: `recruit.yourdomain.com`
   - 点击 "Add"
3. 按照提示配置 DNS 记录

### DNS 配置示例

```
类型: CNAME
名称: recruit
值: cname.vercel-dns.com
TTL: 600
```

---

## 🔄 自动更新

### 更新代码后的部署流程

1. 修改本地代码
2. 提交到 Git:
   ```bash
   git add .
   git commit -m "描述你的修改"
   git push
   ```
3. Vercel 会自动检测到更新并重新部署
4. 访问新的预览链接确认修改

### 预览部署
每次推送代码,Vercel 会自动创建一个预览链接:
- Production: `https://event-recruit-frontend.vercel.app`
- Preview: `https://event-recruit-frontend-git-xxx.vercel.app`

---

## ⚠️ 常见问题

### 问题 1: 部署失败,提示找不到文件
**解决方案**:
- 检查 `vercel.json` 文件是否存在
- 确认 `demo.html` 在仓库根目录
- 重新部署: Vercel 仪表盘 → Redeploy

### 问题 2: PWA 无法安装
**解决方案**:
- 必须使用 HTTPS (Vercel 已自动配置)
- 检查 `manifest.json` 和 `sw.js` 是否正确
- 清除浏览器缓存后重试

### 问题 3: Service Worker 注册失败
**解决方案**:
- 打开浏览器开发者工具 → Console
- 查看错误信息
- 确保 `sw.js` 在根目录,`vercel.json` 配置正确

### 问题 4: 图标不显示
**解决方案**:
- 检查 `icons/` 目录是否正确上传
- 确认图标路径在 `manifest.json` 中配置正确:
  ```json
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192" },
    { "src": "/icons/icon-512.png", "sizes": "512x512" }
  ]
  ```

### 问题 5: 修改代码后网站没有更新
**解决方案**:
- 清除浏览器缓存 (Ctrl + Shift + Delete)
- 硬刷新 (Ctrl + Shift + R)
- 等待 1-2 分钟让 Vercel CDN 更新

---

## 📊 成本说明

### Vercel 免费方案限制

- ✅ **无限带宽**: 完全免费
- ✅ **无限项目**: 可以部署多个网站
- ✅ **自动 HTTPS**: 免费
- ✅ **自定义域名**: 免费
- ✅ **全球 CDN**: 免费加速
- ⚠️ **构建时间**: 每月 6000 分钟 (前端项目用不完)
- ⚠️ **团队协作**: 免费版仅限 1 人

### 升级付费版 (可选)

如果需要:
- 多人协作
- 更多构建时间
- 优先支持

可升级到 Pro 版 ($20/月)

---

## 🎯 下一步

部署完成后:

1. **分享演示**: 将 Vercel URL 发给团队/客户
2. **收集反馈**: 观察用户使用情况
3. **准备方案B**: 如果需要后端支持,准备腾讯云部署

---

## 📞 技术支持

如果遇到问题:

1. 查看 Vercel 文档: https://vercel.com/docs
2. 检查 Vercel 部署日志: 项目 → Deployments → 查看日志
3. 清除缓存重试

---

**文档版本**: v1.0
**创建日期**: 2026-03-20
**适用版本**: EventRecruit Frontend v2.2
