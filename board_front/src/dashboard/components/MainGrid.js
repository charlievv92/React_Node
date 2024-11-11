import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';


export default function MainGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}

      
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >


      <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginBottom:0}}>
        예정된 작업
      <button>+</button>
      {/*버튼 누르면 Todolist목록으로 컴포넌트 바꾸도록 작업, 디자인도*/}
      </Typography>
      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
        <HighlightedCard />
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginBottom:0}}>
      게시판
      <button>+</button>
      {/*이곳은 Board */}
      </Typography>
      <Grid size={{ xs: 12, md: 12 }}>
        <SessionsChart />
      </Grid>

      <Grid size={{ lg:6 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginBottom:0}}>
        받은 쪽지함
        <button>+</button>
        </Typography>
      </Grid>
      <Grid size={{ lg:6 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 ,marginBottom:0}}>
        공지사항
        <button>+</button>
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PageViewsBarChart />
      </Grid>
      
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <CustomizedDataGrid />
        </Grid>
        {/* <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
      </Grid>
    </Box>
  );
}
