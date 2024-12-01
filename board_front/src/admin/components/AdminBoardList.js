import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import CustomizedDataGrid from "../../components/CustomizedDataGrid";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminBoardList() {

  const [boardList, setBoardList] = useState([]);

  const getBoardList = async () => {
    const resp = await axios.get("http://localhost:8000/api/board/posts"); // 2) 게시글 목록 데이터에 할당
    setBoardList(resp.data); // 3) boardList 변수에 할당
    // console.log(boardList);
  };

  useEffect(() => {
    getBoardList(); // 1) 게시글 목록 조회 함수 호출
  }, []);

  // useEffect(() => {
  //   console.log(boardList); // 상태가 변경될 때마다 로그 출력
  // }, [boardList]);

  return (
    <Box sx={{ width: "100%"}}>
      {/* cards */}

      
      <Grid container columns={12}>
        <Stack
          direction="column"
          sx={{
            width: "100%",
            mt: 4,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
          spacing={2}
        >

        </Stack>
        <Grid item xs={12}>
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
