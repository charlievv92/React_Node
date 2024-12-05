import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdminHeader from "./components/AdminHeader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [selectedMenu, setSelectedMenu] = useState("유저목록");
  const [pageTitle, setPageTitle] = useState("");
  // //TODO:react-router 사용할것
  // const renderContent = () => {

  //   if (selectedMenu === '유저목록') {
  //     return <AdminUserList />;
  //   } else if (selectedMenu === '게시글') {
  //     return <AdminBoardList />;
  //   }
  //   return null;
  // };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", minHeight: "100vh" }}>
      {/* Header */}
      {/* TODO:어드민 페이지 들어갈시 오류발생.. 원인모르겠음, 어드민페이지 라우팅 처리할것(권한검증 안되어있음) */}
      <AdminHeader $onSelectMenu={setSelectedMenu} />

      {/* Content */}
      <Box sx={{ pt: 8 }}>
        <Grid container direction="column" sx={{ px: 2, mt: 4 }}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
              {selectedMenu}
            </Typography>
          </Grid>

          {/* Admin Board List */}
          <Grid
            item
            xs={12}
            sm={10} // 화면 크기에 따라 열 차지 비율
            md={10} // 중간 화면 이상에서 중앙에 위치
            sx={{ mx: "auto", width: "70%" }} // 자동 중앙 정렬, 컴포넌트 범위설정
          >
            <Outlet context={{ setPageTitle }}></Outlet>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
