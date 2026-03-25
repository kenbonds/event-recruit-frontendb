import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, Grid, TextField,
  Button, Pagination, Skeleton, InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { jobApi } from '../api';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize };
      if (keyword) params.keyword = keyword;
      if (city) params.city = city;
      
      const res = await jobApi.getList(params);
      if (res.code === 200) {
        setJobs(res.data.list);
        setTotal(res.data.total);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    fetchJobs();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>职位列表</Typography>
      
      {/* 搜索 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="搜索职位"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          placeholder="城市"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>搜索</Button>
      </Box>

      {/* 职位列表 */}
      {loading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2 }} />)
      ) : (
        <Grid container spacing={2}>
          {jobs.map(job => (
            <Grid item xs={12} key={job.id}>
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company_name} {job.certify_status ? '✓' : ''}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${job.salary_min}-${job.salary_max}元/月`} 
                      color="success" 
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Chip size="small" label={job.city} variant="outlined" sx={{ mr: 1 }} />
                    <Chip size="small" label={`浏览 ${job.view_count}`} variant="outlined" sx={{ mr: 1 }} />
                    <Chip size="small" label={`投递 ${job.apply_count}`} variant="outlined" />
                  </Box>
                  {job.tags?.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {job.tags.slice(0, 5).map((tag, i) => (
                        <Chip key={i} size="small" label={tag} sx={{ mr: 0.5 }} />
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
