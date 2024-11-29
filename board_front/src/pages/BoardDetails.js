import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import QuillEditor from "../components/QuillEditor";
import { Button, CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import QuillEditor from "../components/QuillEditor";

export default function BoardDetails() {
  const { setPageTitle } = useOutletContext();
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [authorEmail, setAuthorEmail] = useState("");

  // const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const { isLoggedIn, user, clientIp } = useAuth();

  const contentsRef = useRef(null);
  const navigate = useNavigate();
  const { board_id } = useParams();
  const customModules = {
    toolbar: {
      container: [
        [{ size: ["small", false, "large", "huge"] }],
        [{ align: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [
          {
            color: [],
          },
        ],
      ],
    },
  };

  const customStyle = { height: "150px" };
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    setPageTitle("Board Details");
  }, [setPageTitle]);

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

  const getArticleComments = async () => {
    try {
      console.log(serverUrl);

      const response = await axios.get(
        `${serverUrl}/api/board/comments/${board_id}`
      );
      console.log("Article comments : ", response.data);
      setComments(response.data || []);
      // setContents(response.data[0].contents || "");
      // setAuthorEmail(response.data[0].email || "");
    } catch (error) {
      console.error("Error getting article details!!! ", error);
    } finally {
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
    }
  };

  const handleModifyClick = () => {
    if (user.email !== authorEmail) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    navigate(`/articles/modify/${board_id}`);
  };

  const handleCommentChange = (value) => {
    setComment(value);
    console.log("comment : ", comment);
  };

  const handleSubmitClick = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/loginpage");
      return;
    }
    const response = await axios.post(`${serverUrl}/api/board/comments`, {
      board_id: board_id,
      writer: user.email,
      comment: comment,
      ip_location: clientIp,
    });

    console.log("comment : ", comment);
    console.log("Post created!!! ", response.data);
  };

  useEffect(() => {
    getArticleDetails();
    getArticleComments();
  }, []);

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
          minHeight: "350px",
          pb: 2,
        }}
      />

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          width: "100%",
          pt: 2,
          pb: 2,
          borderBottom: `1px solid #ccc`,
          // mt: 2,
          // mb: 2,
          // borderBottom: `1px solid #ccc`,
          // padding: "10px",
        }}
        spacing={2}
        // alignItems="center"
      >
        {user.email === authorEmail && (
          <Button onClick={handleModifyClick}>수정</Button>
        )}
        <Button component={Link} to={`http://localhost:3000/articles`}>
          리스트
        </Button>
      </Stack>
      <Box
        sx={{
          // mb: 2,
          pt: 3,
          pb: 2,
        }}
      >
        <Typography component="h2" variant="h6" sx={{ pb: 2 }}>
          댓글
        </Typography>
        <QuillEditor
          value={comment}
          modules={customModules}
          onChange={handleCommentChange}
          style={customStyle}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          width: "100%",
          pt: 2,
          pb: 2,
          borderBottom: `1px solid #ccc`,
          // mt: 2,
          // mb: 2,
          // borderBottom: `1px solid #ccc`,
          // padding: "10px",
        }}
        spacing={2}
        // alignItems="center"
      >
        <Button onClick={handleSubmitClick}>작성</Button>
      </Stack>
    </Grid>
  );
}
