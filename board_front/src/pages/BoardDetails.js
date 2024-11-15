import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
// import QuillEditor from "../components/QuillEditor";
import { Button, CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

export default function BoardDetails() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();
  const { board_id } = useParams();

  // TODO: 게시물 상세 조회시 데이터 보이지 않는 문제 해결(20241115 kwc)
  const getArticleDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/posts/${board_id}`
      );
      console.log("Article details : ", response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error("Error getting article details!!! ", error);
    } finally {
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
    }
  };

  useEffect(() => {
    getArticleDetails();
  }, [board_id]);
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/posts", {
        title: title,
        content: content,
      });
      console.log("title : ", title);
      console.log("content : ", content);
      console.log("Post created!!! ", response.data);
      navigate("/boardList");
    } catch (error) {
      console.error("Error creating post!!! ", error);
    }
  };

  if (loading) {
    return <CircularProgress />; // 로딩 중일 때 로딩 스피너 표시
  }
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}

      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Board Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 12 }}>
          {/* <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100ch" },
            }}
            noValidate
            autoComplete="off"
          > */}
          <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
            제목
          </Typography>
          <TextField
            // minRows={20}
            id="board-title"
            variant="standard"
            fullWidth
            disabled={true}
            sx={{
              "& .MuiInputBase-root": {
                border: "1px",
                borderTopRightRadius: "none",
                borderTopLeftRadius: "none",
              },
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
            내용
          </Typography>
          {/* <QuillEditor value={content} onChange={handleContentChange} /> */}
          {/* <TextField
            // minRows={20}
            id="board-content"
            variant="standard"
            fullWidth
            multiline
            rows={26}
            value={content}
            disabled={true}
            sx={{
              "& .MuiInputBase-root": { minHeight: "550px" },
            }}
          /> */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
              minHeight: "200px",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/* </Box> */}
        </Grid>

        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ width: "100%", mt: 4 }}
          spacing={2}
        >
          <Button onClick={handleSubmit}>작성</Button>
          {/* <Button disabled>Disabled</Button> */}
          <Button href="#text-buttons">리스트</Button>
        </Stack>

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
