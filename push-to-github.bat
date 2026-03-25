@echo off
cd /d D:\EventRecruitApp\frontend
echo 正在推送代码到 GitHub...
git remote set-url origin https://github.com/kenbonds/event-recruit-frontendb.git
git push -u origin main
echo.
echo 如果提示输入用户名和密码:
echo 用户名: kenbonds
echo 密码: 请使用 GitHub Personal Access Token
echo.
pause
