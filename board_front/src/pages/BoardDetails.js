import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import QuillEditor from "../components/QuillEditor";
import {
  Button,
  CircularProgress,
  Divider,
  List,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import QuillEditor from "../components/QuillEditor";
import AlignItemsList from "../components/AlignItemsList";
import ConfirmDialog from "../auth/sign-up/Confirm";
import { useDialog } from "../auth/sign-up/useDialog";

export default function BoardDetails() {
  // TODO: 게시물 삭제 기능 추가(20241202 kwc)
  // TODO: 게시물 삭제 시 확인창 추가(20241202 kwc)
  // TODO: 게시물 수정 시 확인창 추가(20241202 kwc)
  // TODO: 게시물 삭제 버튼 권한에 따라 보이게 처리(20241202 kwc)

  const { setPageTitle } = useOutletContext();
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [authorEmail, setAuthorEmail] = useState("");

  // const [article, setArticle] = useState({});
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const { user, clientIp } = useAuth();

  const contentsRef = useRef(null);
  const navigate = useNavigate();
  const { board_id } = useParams();
  const { isOpen, openDialog, handleConfirm, handleCancel } = useDialog();
  // const customModules = {
  //   toolbar: {
  //     container: [
  //       [{ size: ["small", false, "large", "huge"] }],
  //       [{ align: [] }],
  //       ["bold", "italic", "underline", "strike"],
  //       [{ list: "ordered" }, { list: "bullet" }],
  //       [
  //         {
  //           color: [],
  //         },
  //       ],
  //     ],
  //   },
  // };

  // const customStyle = { height: "150px" };
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
      setTitle(response.data.data[0].title || "");
      setContents(response.data.data[0].contents || "");
      setAuthorEmail(response.data.data[0].email || "");

      getArticleComments();
    } catch (error) {
      console.error("Error getting article details!!! ", error);
    }
    //  finally {
    //   setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
    // }
  };

  const getArticleComments = async () => {
    try {
      console.log(serverUrl);

      const response = await axios.get(
        `${serverUrl}/api/board/comments/${board_id}`
      );
      console.log("Article comments : ", response.data);
      setComments(response.data || []);
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

  // const handleCommentChange = (value) => {
  //   setComment(value);
  //   console.log("comment : ", comment);
  // };

  const handleCommentSubmitClick = async () => {
    if (!user) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/login");
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
    getArticleComments();
    setComment("");
  };

  const handleDeleteClick = async () => {
    const confirm = await openDialog();

    if (confirm) {
      const response = await axios.delete(`${serverUrl}/api/board/posts`, {
        data: { board_ids: [board_id] },
      });
      console.log("Post deleted!!! ", response.data);
      alert(response.data.msg);
      navigate("/articles");
    }
  };

  useEffect(() => {
    getArticleDetails();
    // getArticleComments();
  }, []);

  useEffect(() => {
    if (contentsRef.current) {
      contentsRef.current.innerHTML = ""; // 기존 내용을 초기화
      contentsRef.current.insertAdjacentHTML("beforeend", contents); // 새로운 내용을 삽입
    }
  }, [contents]);

  // if (loading) {
  //   return <CircularProgress />; // 로딩 중일 때 로딩 스피너 표시
  // }
  return (
    <>
      <Grid size={{ xs: 12, sm: 9 }}>
        {/* <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "100ch" },
            }}
            noValidate
            autoComplete="off"
          > */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{
            borderBottom: `1px solid #ccc`,
            // mb: 2,
            pt: 3,
            pb: 2,
          }}
        >
          <Stack direction={"row"}>
            <Typography component="h2" variant="h6" sx={{ pr: 1 }}>
              제목 :
            </Typography>
            <Typography component="h2" variant="h5">
              {title}
            </Typography>
          </Stack>
          <Stack direction={"row"}>
            <Typography component="h2" variant="h6" sx={{ pr: 1 }}>
              작성자 :
            </Typography>
            <Typography component="h2" variant="h6">
              {authorEmail}
            </Typography>
          </Stack>
        </Stack>

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
          <Button component={Link} to={`http://localhost:3000/articles`}>
            리스트
          </Button>
          {!user ||
            (user.email === authorEmail && (
              <Button onClick={handleModifyClick}>수정</Button>
            ))}
          {!user ||
            (user.email === authorEmail && (
              // || (user.auth_code === "T0")
              <Button onClick={handleDeleteClick}>삭제</Button>
            ))}
        </Stack>
        <ConfirmDialog
          open={isOpen}
          title="해당 게시물을 삭제하시겠어요?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
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
          <TextField
            // minRows={20}
            id="board-comment"
            variant="standard"
            sx={{
              "& .MuiInputBase-root": {
                border: "1px",
                borderTopRightRadius: "none",
                borderTopLeftRadius: "none",
                boxShadow: "none",
              },
            }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/* <QuillEditor
            html={comment}
            modules={customModules}
            setHtml={handleCommentChange}
            style={customStyle}
          /> */}
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
          <Button onClick={handleCommentSubmitClick}>작성</Button>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <Box
          sx={{
            padding: 3,
            width: { xs: "100%", sm: "100%" },
            minWidth: 320, // 반응형 너비 설정
            maxWidth: 400, // 반응형 너비 설정
            height: { xs: "auto", sm: "80vh" },
            position: { sm: "sticky" },
            top: { sm: 0 }, // sticky 위치 설정
            backgroundColor: "background.paper",
            overflowY: "auto",
            // border: "2px solid #ccc",
          }}
        >
          <Typography component="h2" variant="h6" sx={{ pb: 2 }}>
            댓글
          </Typography>
          <Divider />
          <AlignItemsList items={comments} user={user} />
          {/* {comments.length !== 0 && <AlignItemsList items={comments} />} */}

          {/* {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                borderBottom: `1px solid #ccc`,
                // borderRadius: "4px",
                minHeight: "50px",
                pb: 2,
              }}
            >
              <Typography component="h2" variant="h6" sx={{ pb: 2 }}>
                {comment.writer}
              </Typography>
              <Typography component="h2" variant="h6" sx={{ pb: 2 }}>
                {comment.comment}
              </Typography>
            </Box>
          ))} */}
        </Box>
      </Grid>
    </>
  );
}
