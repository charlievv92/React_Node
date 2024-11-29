import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import QuillEditor from "../components/QuillEditor";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function BoardWrite() {
  const { setPageTitle } = useOutletContext();
  const location = useLocation();
  const { board_id } = useParams();
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { isLoggedIn, user, clientIp } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Board Write");
  }, [setPageTitle]);

  // useEffect(() => { 테스트 필요
  //   if (!isLoggedIn) {
  //     alert("로그인이 필요합니다.");
  //     navigate("/login");
  //   }

  //   if (isEditMode && email !== authorEmail) {
  //     alert("작성자만 수정할 수 있습니다.");
  //     navigate(`/articles/${board_id}`);
  //   }
  // }, [isLoggedIn, isEditMode, email, authorEmail, navigate, board_id]);

  // TODO : (issue)게시물 데이터 서버로부터 호출했으나 데이터 출력 이슈 발생(20241129 kwc)
  // 훅의 라이프사이클 관련 이슈로 추측되어 해당 부분 수정 필요
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.REACT_APP_SERVER_URL}/api/board/posts/${board_id}`)
        .then((response) => {
          // data = response.data;
          console.log("data : ", response.data);
          setData(response.data);
          //  setTitle(data.title);
          //  setContents(data.contents);
          //  setAuthorEmail(data.email);
          //  setIsEditMode(true);
        })
        .catch((error) => {
          console.error("Error fetching data!!! ", error);
          throw error;
        });
    };

    const setData = (data) => {
      // const response = await fetchData();
      setTitle(data.title);
      setContents(data.contents);
      setAuthorEmail(data.email);
      setIsEditMode(true);
    };

    if (board_id !== undefined) {
      fetchData();
    }
  }, [board_id]);

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
        // ip 및 기타 정보 추가
        response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/board/posts`,
          {
            title: title,
            contents: contents,
            writer: user.email,
            ip_location: clientIp,
          }
        );
        // .then((response) => {
        //   console.log("Post created!!! ", response.data);
        //   navigate("/articles");
        // })
        // .catch((error) => {
        //   console.error("Error creating post!!! ", error);
        // });
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
    <>
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
              boxShadow: "none",
            },
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 2 }}>
          내용
        </Typography>
        <QuillEditor
          // ref={quillRef}
          html={contents}
          // modules={customModules}
          setHtml={handleContentsChange}
          style={{ height: "500px" }}
        />
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
        sx={{ width: "100%", mt: 4, justifyContent: "flex-end" }}
        spacing={2}
      >
        <Button onClick={handleSubmit}>작성</Button>
        {/* <Button disabled>Disabled</Button> */}
        <Button href="#text-buttons">리스트</Button>
      </Stack>
    </>
  );
}
