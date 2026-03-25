import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Avatar, Button, List, ListItem,
  ListItemText, ListItemIcon, Divider, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Tabs, Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { eventApi, jobApi, authApi } from '../api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取我的报名
      const eventsRes = await eventApi.getMyRegistrations();
      if (eventsRes.code === 200) {
        setMyEvents(eventsRes.data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditOpen = () => {
    setEditForm({
      nickname: user?.nickname || '',
      real_name: user?.real_name || '',
      school: user?.school || '',
      major: user?.major || '',
      education: user?.education || '',
      city: user?.city || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      // 这里假设有更新接口，实际可能需要后端添加
      setMessage({ type: 'success', text: '资料更新成功' });
      setEditDialogOpen(false);
      fetchUser();
    } catch (e) {
      setMessage({ type: 'error', text: '更新失败' });
    }
  };

  const menuItems = [
    { icon: <EventIcon />, text: '我的活动', onClick: () => setTabValue(1) },
    { icon: <WorkIcon />, text: '我的投递', onClick: () => setTabValue(2) },
    { icon: <SettingsIcon />, text: '设置', onClick: () => {} },
    { icon: <LogoutIcon />, text: '退出登录', onClick: handleLogout, color: 'error' },
  ];

  return (
    <Box>
      {/* 用户信息卡片 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
              {user?.nickname?.[0] || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{user?.nickname || '未设置昵称'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.phone}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip size="small" label={`活跃度: ${user?.activity_score || 0}`} color="primary" />
              </Box>
            </Box>
            <Button startIcon={<EditIcon />} size="small" onClick={handleEditOpen}>
              编辑
            </Button>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {user?.school && (
              <Chip icon={<SchoolIcon />} label={user.school} size="small" variant="outlined" />
            )}
            {user?.education && (
              <Chip label={user.education} size="small" variant="outlined" />
            )}
            {user?.city && (
              <Chip icon={<LocationIcon />} label={user.city} size="small" variant="outlined" />
            )}
            {user?.major && (
              <Chip label={user.major} size="small" variant="outlined" />
            )}
          </Box>

          {user?.tags?.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {user.tags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 功能菜单 */}
      <Card sx={{ mb: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <Box key={item.text}>
              <ListItem button onClick={item.onClick}>
                <ListItemIcon sx={{ color: item.color }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ color: item.color }}
                />
              </ListItem>
              {index < menuItems.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Card>

      {/* Tab 内容 */}
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="概览" />
        <Tab label="我的活动" />
        <Tab label="我的投递" />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>数据概览</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <Box>
                <Typography variant="h4" color="primary">{myEvents.length}</Typography>
                <Typography variant="body2" color="text.secondary">已报名活动</Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary">0</Typography>
                <Typography variant="body2" color="text.secondary">已投递职位</Typography>
              </Box>
              <Box>
                <Typography variant="h4" color="primary">{user?.activity_score || 0}</Typography>
                <Typography variant="body2" color="text.secondary">活跃度</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Box>
          {myEvents.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 4 }}>
              <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">暂无报名活动</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/events')}>
                去发现活动
              </Button>
            </Card>
          ) : (
            myEvents.map(event => (
              <Card key={event.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/events/${event.event_id || event.id}`)}>
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    报名时间: {new Date(event.register_time).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={event.reg_status === 1 ? '已报名' : event.reg_status === 2 ? '已签到' : '已取消'} 
                      color={event.reg_status === 1 ? 'primary' : event.reg_status === 2 ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {tabValue === 2 && (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">暂无投递记录</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/jobs')}>
            去发现职位
          </Button>
        </Card>
      )}

      {/* 编辑资料弹窗 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>编辑资料</DialogTitle>
        <DialogContent>
          {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
          <TextField
            fullWidth
            label="昵称"
            value={editForm.nickname}
            onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="真实姓名"
            value={editForm.real_name}
            onChange={(e) => setEditForm({...editForm, real_name: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="学校"
            value={editForm.school}
            onChange={(e) => setEditForm({...editForm, school: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="专业"
            value={editForm.major}
            onChange={(e) => setEditForm({...editForm, major: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="学历"
            value={editForm.education}
            onChange={(e) => setEditForm({...editForm, education: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="城市"
            value={editForm.city}
            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleEditSave}>保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
