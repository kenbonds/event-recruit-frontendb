import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction,
  Container, Badge, IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Psychology as MatchIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { messageApi } from '../api';

const navItems = [
  { label: '首页', icon: <HomeIcon />, path: '/' },
  { label: '活动', icon: <EventIcon />, path: '/events' },
  { label: '职位', icon: <WorkIcon />, path: '/jobs' },
  { label: '匹配', icon: <MatchIcon />, path: '/match' },
  { label: '我的', icon: <PersonIcon />, path: '/profile' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [unreadCount, setUnreadCount] = useState(0);

  // 获取当前导航索引
  const currentNavIndex = navItems.findIndex(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );
  const [value, setValue] = useState(currentNavIndex >= 0 ? currentNavIndex : 0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const res = await messageApi.getUnreadCount();
      if (res.code === 200) {
        setUnreadCount(res.data.count);
      }
    } catch (e) {}
  };

  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    navigate(navItems[newValue].path);
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* 顶部导航 */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            召集吧
          </Typography>
          {isAuthenticated && (
            <IconButton color="inherit" onClick={() => navigate('/messages')}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* 页面内容 */}
      <Container maxWidth="md" sx={{ mt: 2, mb: 2 }}>
        <Outlet />
      </Container>

      {/* 底部导航 */}
      <BottomNavigation
        value={value}
        onChange={handleNavChange}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction 
            key={item.path} 
            label={item.label} 
            icon={item.icon} 
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
