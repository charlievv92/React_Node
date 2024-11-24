import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import QuillEditor from "../components/QuillEditor";
import { Button, CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BoardDetails() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  // const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const { isLoggedIn, email, clientIp } = useAuth();

  const contentsRef = useRef(null);
  const navigate = useNavigate();
  const { board_id } = useParams();

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const getArticleDetails = async () => {
    try {
      console.log(serverUrl);

      const response = await axios.get(
        `${serverUrl}/api/board/posts/${board_id}`
      );
      console.log("Article details : ", response.data);
      setTitle(response.data[0].title || "");
      setContents(response.data[0].contents || "");
      setAuthorEmail(response.data[0].email || "");
    } catch (error) {
      console.error("Error getting article details!!! ", error);
    } finally {
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
    }
  };

  const handleModifyClick = () => {
    if (email !== authorEmail) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    navigate(`/articles/modify/${board_id}`, {
      state: { title, contents, authorEmail },
    });
  };

  useEffect(() => {
    getArticleDetails();
  }, [board_id]);

  useEffect(() => {
    if (contentsRef.current) {
      contentsRef.current.innerHTML = ""; // 기존 내용을 초기화
      contentsRef.current.insertAdjacentHTML("beforeend", contents); // 새로운 내용을 삽입
    }
  }, [contents]);

  if (loading) {
    return <CircularProgress />; // 로딩 중일 때 로딩 스피너 표시
  }
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        // minHeight: "800px",
      }}
    >
      {/* cards */}

      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Board Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 9 }}>
          {/* <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100ch" },
            }}
            noValidate
            autoComplete="off"
          > */}
          <Box
            sx={{
              borderBottom: `1px solid #ccc`,
              // mb: 2,
              pt: 3,
              pb: 2,
            }}
          >
            <Typography component="h2" variant="h6">
              {title}
            </Typography>
          </Box>

          <Box
            ref={contentsRef}
            sx={{
              borderBottom: `1px solid #ccc`,
              // borderRadius: "4px",
              minHeight: "600px",
              pb: 2,
            }}
          />
          {/* </Box> */}
          <Box
            sx={{
              borderBottom: `1px solid #ccc`,
              pt: 2,
              pb: 2,
            }}
          >
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{
                width: "100%",
                // mt: 2,
                // mb: 2,
                // borderBottom: `1px solid #ccc`,
                // padding: "10px",
              }}
              spacing={2}
              // alignItems="center"
            >
              {email === authorEmail && (
                <Button onClick={handleModifyClick}>수정</Button>
              )}
              {/* <Button disabled>Disabled</Button> */}
              <Button component={Link} to={`http://localhost:3000/articles`}>
                리스트
              </Button>
            </Stack>
          </Box>
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
