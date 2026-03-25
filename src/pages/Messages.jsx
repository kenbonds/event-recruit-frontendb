import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemText,
  ListItemButton, Divider, Pagination, Chip, IconButton, Badge
} from '@mui/material';
import { 
  MarkEmailRead as ReadIcon,
  Notifications as NotificationIcon,
  Event as EventIcon,
  Work as WorkIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { messageApi } from '../api';

const typeIcons = {
  system: <InfoIcon color="info" />,
  event: <EventIcon color="primary" />,
  job: <WorkIcon color="success" />,
  default: <NotificationIcon />
};

const typeLabels = {
  system: '系统',
  event: '活动',
  job: '职位',
  default: '通知'
};

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await messageApi.getList({ page, pageSize });
      if (res.code === 200) {
        setMessages(res.data.list);
        setTotal(res.data.total);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await messageApi.markRead(id);
      if (res.code === 200) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, is_read: 1 } : msg
        ));
      }
    } catch (e) {}
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时显示"x分钟前"
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return mins < 1 ? '刚刚' : `${mins}分钟前`;
    }
    // 小于24小时显示"x小时前"
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    // 否则显示日期
    return date.toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>消息中心</Typography>
      
      {messages.length === 0 && !loading ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <NotificationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">暂无消息</Typography>
        </Card>
      ) : (
        <>
          <List>
            {messages.map((msg, index) => (
              <Box key={msg.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    !msg.is_read && (
                      <IconButton 
                        edge="end" 
                        onClick={() => handleMarkRead(msg.id)}
                        title="标记为已读"
                      >
                        <ReadIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemButton onClick={() => !msg.is_read && handleMarkRead(msg.id)}>
                    <Box sx={{ mr: 2 }}>
                      {typeIcons[msg.type] || typeIcons.default}
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ fontWeight: msg.is_read ? 'normal' : 'bold' }}
                          >
                            {msg.title}
                          </Typography>
                          <Chip 
                            label={typeLabels[msg.type] || typeLabels.default} 
                            size="small" 
                            variant="outlined"
                          />
                          {!msg.is_read && (
                            <Badge color="error" variant="dot" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mt: 0.5,
                              fontWeight: msg.is_read ? 'normal' : 'medium'
                            }}
                          >
                            {msg.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {formatTime(msg.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          {total > pageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={Math.ceil(total / pageSize)} 
                page={page} 
                onChange={(e, v) => setPage(v)} 
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
