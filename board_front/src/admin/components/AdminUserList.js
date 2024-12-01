import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', 
    headerName: '이메일', 
    width: 300,
    flex: 1
  },
  {
    field: 'user_name',
    headerName: '이름',
    width: 150,
    flex: 1
  },
  {
    field: 'date_of_joining',
    headerName: '가입일',
    width: 150,
    flex: 1
  },
  {
    field: 'auth_code',
    headerName: '권한코드',
    width: 110,
    flex: 1
  },
];

const rows = [
  { id: 'reboot@naver.com', user_name: '김창섭', date_of_joining: '2014-11-11', auth_code: 'T0' },

];

export default function DataGridDemo() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}