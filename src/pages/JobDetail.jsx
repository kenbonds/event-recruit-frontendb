import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, Divider, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { jobApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getDetail(id);
      if (res.code === 200) {
        setJob(res.data);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setDialogOpen(true);
  };

  const confirmApply = async () => {
    setApplying(true);
    try {
      const res = await jobApi.apply(id);
      if (res.code === 200) {
        setMessage({ type: 'success', text: '投递成功！' });
        setDialogOpen(false);
        fetchJob();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message || '投递失败' });
    }
    setApplying(false);
  };

  if (loading) return <Typography>加载中...</Typography>;
  if (!job) return <Typography>职位不存在</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip label={`${job.salary_min}-${job.salary_max}元/月`} color="success" sx={{ mr: 1 }} />
          <Chip label={job.city} variant="outlined" />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>公司信息</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>{job.company_name}</strong> {job.certify_status ? '✓ 已认证' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {job.industry} · {job.scale}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>工作地点</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {job.address || job.city}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>职位描述</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {job.description || '暂无描述'}
        </Typography>

        {job.requirements && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>任职要求</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {job.requirements}
            </Typography>
          </>
        )}

        {job.tags?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>技能标签</Typography>
            <Box>
              {job.tags.map((tag, i) => (
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
            onClick={handleApply}
            disabled={job.status !== 1}
          >
            {job.status !== 1 ? '已关闭' : '投递简历'}
          </Button>
        </Box>
      </Paper>

      {/* 确认弹窗 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>确认投递</DialogTitle>
        <DialogContent>
          <Typography>确定要投递「{job.title}」这个职位吗？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button onClick={confirmApply} variant="contained" disabled={applying}>
            {applying ? '投递中...' : '确认投递'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
