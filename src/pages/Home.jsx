import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, CardMedia, Chip, Grid,
  Button, Skeleton, Divider
} from '@mui/material';
import { Event as EventIcon, Work as WorkIcon } from '@mui/icons-material';
import { eventApi, jobApi } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, jobsRes] = await Promise.all([
        eventApi.getList({ pageSize: 3 }),
        jobApi.getList({ pageSize: 3 })
      ]);
      if (eventsRes.code === 200) setEvents(eventsRes.data.list);
      if (jobsRes.code === 200) setJobs(jobsRes.data.list);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <Box>
      {/* 欢迎语 */}
      <Typography variant="h5" gutterBottom>
        欢迎来到召集吧 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        发现精彩活动，找到理想工作
      </Typography>

      {/* 推荐活动 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1 }} /> 热门活动
          </Typography>
          <Button size="small" onClick={() => navigate('/events')}>查看更多</Button>
        </Box>
        
        {loading ? (
          <Skeleton variant="rectangular" height={120} />
        ) : (
          <Grid container spacing={2}>
            {events.map(event => (
              <Grid item xs={12} key={event.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" noWrap>{event.title}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip size="small" label={event.category} color="primary" sx={{ mr: 1 }} />
                      <Chip size="small" label={`${event.current_participants}/${event.max_participants}人`} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {event.location} · {new Date(event.start_time).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 推荐职位 */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <WorkIcon sx={{ mr: 1 }} /> 热门职位
          </Typography>
          <Button size="small" onClick={() => navigate('/jobs')}>查看更多</Button>
        </Box>
        
        {loading ? (
          <Skeleton variant="rectangular" height={120} />
        ) : (
          <Grid container spacing={2}>
            {jobs.map(job => (
              <Grid item xs={12} key={job.id}>
                <Card 
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" noWrap>{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company_name} · {job.city}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip size="small" label={`${job.salary_min}-${job.salary_max}元/月`} color="success" />
                      {job.tags?.slice(0, 3).map((tag, i) => (
                        <Chip key={i} size="small" label={tag} variant="outlined" sx={{ ml: 1 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
