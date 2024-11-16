import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import Copyright from "../internals/components/Copyright";
// import ChartUserByCountry from "./ChartUserByCountry";
// import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "../components/CustomizedDataGrid";
// import HighlightedCard from './HighlightedCard';
// import PageViewsBarChart from './PageViewsBarChart';
// import SessionsChart from './SessionsChart';
// import StatCard from './StatCard';

// const data = [
//   {
//     title: 'Users',
//     value: '14k',
//     interval: 'Last 30 days',
//     trend: 'up',
//     data: [
//       200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
//       360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
//     ],
//   },
//   {
//     title: 'Conversions',
//     value: '325',
//     interval: 'Last 30 days',
//     trend: 'down',
//     data: [
//       1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
//       780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
//     ],
//   },
//   {
//     title: 'Event count',
//     value: '200k',
//     interval: 'Last 30 days',
//     trend: 'neutral',
//     data: [
//       500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
//       520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
//     ],
//   },
// ];

export default function BoardList() {
  const [boardList, setBoardList] = useState([]);

  const getBoardList = async () => {
    const resp = await axios.get("localhost:8080/api/posts"); // 2) 게시글 목록 데이터에 할당
    setBoardList(resp.data); // 3) boardList 변수에 할당
    // console.log(boardList);
  };

  useEffect(() => {
    getBoardList(); // 1) 게시글 목록 조회 함수 호출
  }, []);

  useEffect(() => {
    console.log(boardList); // 상태가 변경될 때마다 로그 출력
  }, [boardList]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Board List
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <CustomizedDataGrid rows={boardList} />
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
