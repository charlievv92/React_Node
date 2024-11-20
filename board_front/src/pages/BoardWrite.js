import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import QuillEditor from "../components/QuillEditor";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BoardWrite() {
  const location = useLocation();
  const { board_id } = useParams();
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { isLoggedIn, email } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }

    if (isEditMode && email !== authorEmail) {
      alert("작성자만 수정할 수 있습니다.");
      navigate(`/articles/${board_id}`);
    }
  }, [isLoggedIn, isEditMode, email, authorEmail, navigate, board_id]);

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title || "");
      setContents(location.state.contents || "");
      setAuthorEmail(location.state.authorEmail || "");
      setIsEditMode(true);
    }
  }, [location.state]);

  // TODO: 게시물 작성 유효성 검사 기능 추가(20241113 kwc)
  const handleContentsChange = (value) => {
    setContents(value);
    console.log("contents : ", contents);
  };

  const contentsCheck = () => {
    const parser = new DOMParser(); // HTML 문자열을 파싱하는 객체 생성 -> quill.js를 사용하면서 필요
    const doc = parser.parseFromString(contents, "text/html");
    const textContent = doc.body.textContent || "";
    if (textContent.trim() === "") {
      alert("내용을 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!contentsCheck()) {
      return;
    }
    let response = {};
    try {
      if (isEditMode) {
        response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/board/posts`,
          {
            board_id: board_id,
            title: title,
            contents: contents,
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/board/posts`,
          {
            title: title,
            contents: contents,
          }
        );
      }

      console.log("title : ", title);
      console.log("contents : ", contents);
      console.log("Post created!!! ", response.data);
      navigate("/articles");
    } catch (error) {
      console.error("Error creating post!!! ", error);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}

      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Board Write
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
          <QuillEditor value={contents} onChange={handleContentsChange} />
          {/* <TextField
            // minRows={20}
            id="board-contents"
            variant="outlined"
            fullWidth
            multiline
            rows={26}
            sx={{
              "& .MuiInputBase-root": { minHeight: "550px" },
            }}
          /> */}
          {/* </Box> */}
        </Grid>

        <Stack
          direction="row"
          justifycontents="flex-end"
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
