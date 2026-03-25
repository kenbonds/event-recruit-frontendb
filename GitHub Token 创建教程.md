# GitHub Token 创建详细教程

## 目标
创建 Personal Access Token,用于推送代码到 GitHub

---

## 步骤 1: 登录 GitHub

1. 打开浏览器
2. 访问 https://github.com/login
3. 输入账号: **kenbonds**
4. 输入密码: **sjb123456&**
5. 点击 **"Sign in"**

---

## 步骤 2: 进入 Token 设置页面

1. 点击右上角 **头像** (圆形图标)
2. 在下拉菜单中选择 **"Settings"** (设置)
3. 在左侧菜单最下方,点击 **"Developer settings"** (开发者设置)
4. 左侧菜单点击 **"Personal access tokens"**
5. 选择 **"Tokens (classic)"**
6. 点击绿色按钮 **"Generate new token (classic)"**

---

## 步骤 3: 配置 Token

### 填写基本信息
- **Note**: 输入 `EventRecruit Deploy`
- **Expiration**: 选择 **"30 days"** (或 "No expiration")

### 选择权限 (Scopes)
找到 **repo** 选项,**勾选全部**:
- [x] **repo** - Full control of private repositories
  - [x] repo:status
  - [x] repo_deployment
  - [x] public_repo
  - [x] repo:invite
  - [x] security_events

---

## 步骤 4: 生成 Token

1. 滚动到页面底部
2. 点击绿色按钮 **"Generate token"**
3. **重要**: 页面会显示生成的 Token
   - 格式: `ghp_xxxxxxxxxxxxxxxxxxxx`
   - **立即复制保存** (关闭页面后无法再次查看!)

---

## 步骤 5: 告诉我 Token

把复制的 Token 发给我,格式如下:
```
ghp_xxxxxxxxxxxxxxxxxxxx
```

我会立即完成代码推送和部署!

---

## ⚠️ 注意事项

1. **Token 只显示一次**,务必立即复制
2. **不要把 Token 发给其他人**,只发给我
3. **Token 相当于密码**,请妥善保管
4. 如果忘记复制,需要重新生成新的 Token

---

## 常见问题

### Q: 找不到 Developer settings?
**A**: 在 Settings 页面左侧菜单最底部,需要滚动到底部

### Q: 提示需要验证?
**A**: 可能需要邮箱验证或二次验证,按提示操作即可

### Q: Token 创建失败?
**A**: 检查是否勾选了 repo 权限,这是必须的

---

**准备好了吗? 开始步骤 1 吧!** 🚀
