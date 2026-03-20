# Vercel 一键部署指南

## 🚀 快速部署 (5分钟完成)

### 第一步: 创建 GitHub 仓库 (1分钟)

1. 打开浏览器访问: https://github.com/new
2. 填写信息:
   - **Repository name**: `event-recruit-frontend`
   - **Description**: 活动招聘平台前端 - PWA应用
   - **Public**: ✅ 选中 (必须公开)
   - **Add a README file**: ❌ 不选
   - **Add .gitignore**: ❌ 不选
   - **Choose a license**: ❌ 不选
3. 点击 **Create repository**

---

### 第二步: 推送代码到 GitHub (2分钟)

在 PowerShell 中执行以下命令:

```bash
cd D:\EventRecruitApp\frontend

# 添加远程仓库 (替换 YOUR_USERNAME 为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/event-recruit-frontend.git

# 切换到 main 分支
git branch -M main

# 推送代码
git push -u origin main
```

**如果提示登录**:
- 用户名: 你的 GitHub 用户名
- 密码: 使用 GitHub Token (不是密码)
  - 访问 https://github.com/settings/tokens
  - 点击 "Generate new token (classic)"
  - 勾选 "repo" 权限
  - 复制 Token 作为密码

---

### 第三步: 部署到 Vercel (2分钟)

#### 方法 A: 使用 Vercel CLI (推荐)

1. 安装 Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. 登录并部署:
   ```bash
   cd D:\EventRecruitApp\frontend
   vercel
   ```

3. 按提示操作:
   - 登录: 浏览器会自动打开授权页面
   - 确认项目设置: 按回车使用默认
   - 等待部署完成

#### 方法 B: 使用 Vercel 网页 (更简单)

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 点击 "Import Git Repository"
4. 找到 `event-recruit-frontend` 仓库,点击 "Import"
5. 项目配置:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - 其他保持默认
6. 点击 "Deploy"
7. 等待 30-60 秒部署完成

---

## ✅ 部署成功验证

### 1. 访问网站
部署成功后会显示 URL,例如:
```
https://event-recruit-frontend.vercel.app
```

### 2. 验证 HTTPS
- 地址栏显示 🔒 图标
- URL 以 `https://` 开头

### 3. 手机测试 PWA
1. 手机浏览器访问部署的 URL
2. iOS: 分享 → 添加到主屏幕
3. Android: 菜单 → 添加到主屏幕
4. 确认可以安装

---

## 🔄 自动更新

以后修改代码后,只需执行:

```bash
git add .
git commit -m "你的修改说明"
git push
```

Vercel 会自动检测并重新部署!

---

## ⚠️ 常见问题

### Q1: 推送代码时提示 "Permission denied"
**解决**: 使用 GitHub Token 而不是密码
- 访问 https://github.com/settings/tokens
- 生成 Token 并复制使用

### Q2: Vercel 部署失败
**解决**: 
- 检查 `vercel.json` 文件是否存在
- 确认 `demo.html` 在仓库根目录
- 查看 Vercel 部署日志获取错误信息

### Q3: PWA 无法安装
**解决**:
- 必须使用 HTTPS (Vercel 自动配置)
- 清除浏览器缓存后重试
- 检查手机浏览器是否支持 PWA

### Q4: 自定义域名
**解决**:
- Vercel 项目设置 → Domains
- 添加你的域名
- 按提示配置 DNS

---

## 📞 需要帮助?

如果遇到问题:
1. 查看详细文档: `Vercel部署操作指南.md`
2. 检查 Vercel 部署日志
3. 清除浏览器缓存重试

---

**文档版本**: v1.0
**创建时间**: 2026-03-20
