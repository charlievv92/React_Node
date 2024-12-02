import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, ButtonGroup } from '@mui/material';
import BoardList from '../../pages/BoardList';



/*
const rows = [
  { id: 'reboot@naver.com', user_name: '김창섭', date_of_joining: '2014-11-11', auth_code: 'T0', deleted: '삭제됨' },

];
*/
export default function DataGridDemo() {

  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const getUserList = async () => {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/board/posts`);

    const formatted = response.data.map((user, index) => ({
      id: user.email,
      user_name: user.user_name,
      date_of_joining: user.date_of_joining,
      auth_code: user.auth_code==='N0' ? '일반회원' : '관리자',
      deleted: user.is_deleted ? '삭제됨' : '정상',
    }));

    setRows(formatted);
  };
  
  React.useEffect(() => {
    getUserList();
  }, []);
  
  const handleSelectionChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  const submitUserInfoChange = async(action) => {

    var message ='';
    if(action==='delete'){
      message = selectedRows.length+'명의 계정을 삭제할까요?';
    }else if(action==='restore'){
      message = selectedRows.length+'명의 계정을 복구할까요?';
    }else if(action==='updateAuth'){
      message = selectedRows.length+'명의 계정 권한을 변경할까요?';
    }

    if (selectedRows.length === 0) {
      alert("선택된 유저가 없습니다.");
      return;
    } else {
      if(!window.confirm(message)){
        return;
      };
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/userUpdateByAdmin`, {
        action, // 'delete', 'restore', 'updateAuth' 
        selectedUsers: selectedRows,
      });
      console.log("응답:", response.data);

      getUserList();
      alert("변경 사항이 적용되었습니다.");
    } catch (error) {
      console.error("요청 실패:", error);
      alert("변경에 실패했습니다.");
    }

  }

  return (
    <>
      <Box
        sx={{
          display: "flex", 
          justifyContent: "flex-end", 
        }}
      >
        <ButtonGroup size='small' variant="contained" aria-label="Basic button group" sx={{ mb:2, justifyContent: "flex-end"}}>
          <Button onClick={()=>submitUserInfoChange('delete')} sx={{backgroundColor:'red'}}>계정삭제</Button>
          <Button onClick={()=>submitUserInfoChange('restore')}>계정복구</Button>
          <Button onClick={()=>submitUserInfoChange('updateAuth')}>권한변경</Button>
        </ButtonGroup>
      </Box>

      <BoardList/>
      
     </>
  );
}