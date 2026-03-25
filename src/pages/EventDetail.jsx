import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { eventApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await eventApi.getDetail(id);
      if (res.code === 200) {
        setEvent(res.data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setDialogOpen(true);
  };

  const submitRegister = async () => {
    setSubmitting(true);
    try {
      const res = await eventApi.register(id, formData);
      if (res.code === 200) {
        setMessage({ type: 'success', text: '报名成功！' });
        setDialogOpen(false);
        fetchEvent();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message || '报名失败' });
    }
    setSubmitting(false);
  };

  if (loading) return <Typography>加载中...</Typography>;
  if (!event) return <Typography>活动不存在</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{event.title}</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip label={event.category} color="primary" sx={{ mr: 1 }} />
          <Chip label={`${event.current_participants}/${event.max_participants}人报名`} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>📍 地点：</strong>{event.location || '待定'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>📅 开始时间：</strong>{event.start_time ? new Date(event.start_time).toLocaleString() : '待定'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>📅 结束时间：</strong>{event.end_time ? new Date(event.end_time).toLocaleString() : '待定'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>活动详情</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {event.description || '暂无详情'}
        </Typography>

        {event.tags?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>标签</Typography>
            <Box>
              {event.tags.map((tag, i) => (
                <Chip key={i} label={tag} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
          </>
        )}

        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            size="large" 
            fullWidth
            onClick={handleRegister}
            disabled={event.current_participants >= event.max_participants}
          >
            {event.current_participants >= event.max_participants ? '名额已满' : '立即报名'}
          </Button>
        </Box>
      </Paper>

      {/* 报名表单弹窗 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>活动报名</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="姓名"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <TextField
            margin="dense"
            label="手机号"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={submitRegister} variant="contained" disabled={submitting}>
            {submitting ? '提交中...' : '确认报名'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
