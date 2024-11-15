import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "../internals/data/gridData";
import { useNavigate } from "react-router-dom";

export default function CustomizedDataGrid({ rows }) {
  const navigate = useNavigate();

  const handleRowClick = (params) => {
    console.log(params.row);
    navigate(`/articles/${params.row.board_id}`);
  };

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      rows={rows}
      getRowId={(rows) => rows.board_id}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      onRowClick={handleRowClick}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
