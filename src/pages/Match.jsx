import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, Tabs, Tab,
  LinearProgress, Alert, Button, Skeleton
} from '@mui/material';
import { Work as WorkIcon, People as PeopleIcon } from '@mui/icons-material';
import { matchApi, jobApi } from '../api';

export default function Match() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [recommendJobs, setRecommendJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取推荐职位
      const recommendRes = await matchApi.getRecommendJobs();
      if (recommendRes.code === 200) {
        setRecommendJobs(recommendRes.data);
      }

      // 获取所有职位（用于查看候选人）
      const jobsRes = await jobApi.getList({ pageSize: 10 });
      if (jobsRes.code === 200) {
        setJobs(jobsRes.data.list);
        
        // 获取每个职位的候选人
        const candidatesData = {};
        for (const job of jobsRes.data.list.slice(0, 3)) {
          try {
            const res = await matchApi.getCandidates(job.id);
            if (res.code === 200) {
              candidatesData[job.id] = res.data;
            }
          } catch (e) {}
        }
        setCandidates(candidatesData);
      }
    } catch (e) {
      setError('获取数据失败，请稍后重试');
    }
    setLoading(false);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>智能匹配</Typography>
      
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab icon={<WorkIcon />} label="推荐职位" />
        <Tab icon={<PeopleIcon />} label="候选人" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* 推荐职位 Tab */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            根据您的技能标签，为您推荐最匹配的职位
          </Typography>
          
          {loading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2 }} />)
          ) : recommendJobs.length === 0 ? (
            <Alert severity="info">暂无推荐职位，请完善个人资料中的技能标签</Alert>
          ) : (
            recommendJobs.map(job => (
              <Card 
                key={job.id} 
                sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company_name} · {job.city}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={`匹配度 ${job.match_score}%`} 
                        color={getMatchColor(job.match_score)}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={job.match_score} 
                    color={getMatchColor(job.match_score)}
                    sx={{ mt: 1, mb: 1, height: 6, borderRadius: 3 }}
                  />
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip size="small" label={`${job.salary_min}-${job.salary_max}元/月`} sx={{ mr: 1 }} />
                    {job.tags?.slice(0, 4).map((tag, i) => (
                      <Chip key={i} size="small" label={tag} variant="outlined" sx={{ mr: 0.5 }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* 候选人 Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            查看您发布的职位匹配的候选人
          </Typography>
          
          {loading ? (
            [...Array(2)].map((_, i) => <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2 }} />)
          ) : jobs.length === 0 ? (
            <Alert severity="info">暂无职位数据</Alert>
          ) : (
            jobs.slice(0, 3).map(job => (
              <Card key={job.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    匹配候选人
                  </Typography>
                  
                  {candidates[job.id]?.length > 0 ? (
                    candidates[job.id].slice(0, 5).map(candidate => (
                      <Card key={candidate.id} variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1">{candidate.nickname}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {candidate.school} · {candidate.education} · {candidate.city}
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {candidate.tags?.slice(0, 3).map((tag, i) => (
                                  <Chip key={i} size="small" label={tag} variant="outlined" sx={{ mr: 0.5 }} />
                                ))}
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip 
                                label={`${candidate.match_score}%`} 
                                color={getMatchColor(candidate.match_score)}
                                size="small"
                              />
                              <Typography variant="caption" display="block" color="text.secondary">
                                活跃度: {candidate.activity_score}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      暂无匹配候选人
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
