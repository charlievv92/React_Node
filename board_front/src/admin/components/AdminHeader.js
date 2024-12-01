import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const navItems = ['유저목록', '게시글', '관리자모드 종료'];

function DrawerAppBar({ $onSelectMenu }) {

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{
         backgroundColor: 'black',
         position: 'fixed', // 상단 고정
         top: 0,
         zIndex: 1201, // 다른 콘텐츠 위에 표시되도록 z-index 설정
        }}>
        <Toolbar>
          {/* 제목 */}
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            관리자 페이지 입니다
          </Typography>
          {/* 각 메뉴 부분 */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, mx:5 }}>{/* mx: 좌측여백 mr은우측 */}
            {navItems.map((item) => (
              <Button 
                key={item} 
                sx={{ color: '#fff' , mx:1}}
                onClick={() =>
                  item === '관리자모드 종료'
                    ? navigate('/') // 메인 페이지로 이동
                    : $onSelectMenu(item) // 선택 메뉴 상태 변경
                }
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;