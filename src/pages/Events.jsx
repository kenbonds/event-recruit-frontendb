import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, Grid, TextField,
  Button, Pagination, Skeleton, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { eventApi } from '../api';

const categories = ['全部', '招聘', '技术', '比赛', '讲座', '社交'];

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchEvents();
  }, [page, category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (category && category !== '全部') params.category = category;
      
      const res = await eventApi.getList(params);
      if (res.code === 200) {
        setEvents(res.data.list);
        setTotal(res.data.total);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value === '全部' ? '' : e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>活动列表</Typography>
      
      {/* 筛选 */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>活动类型</InputLabel>
          <Select value={category || '全部'} label="活动类型" onChange={handleCategoryChange}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* 活动列表 */}
      {loading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} variant="rectangular" height={100} sx={{ mb: 2 }} />)
      ) : (
        <Grid container spacing={2}>
          {events.map(event => (
            <Grid item xs={12} key={event.id}>
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardContent>
                  <Typography variant="h6">{event.title}</Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip size="small" label={event.category} color="primary" sx={{ mr: 1 }} />
                    <Chip size="small" label={`${event.current_participants}/${event.max_participants}人报名`} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    📍 {event.location || '线上'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {event.start_time ? new Date(event.start_time).toLocaleString() : '待定'}
                  </Typography>
                  {event.tags?.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {event.tags.map((tag, i) => (
                        <Chip key={i} size="small" label={tag} variant="outlined" sx={{ mr: 0.5 }} />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 分页 */}
      {total > pageSize && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={Math.ceil(total / pageSize)} 
            page={page} 
            onChange={(e, v) => setPage(v)} 
          />
        </Box>
      )}
    </Box>
  );
}
