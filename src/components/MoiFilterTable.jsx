import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useContext } from "react";
import { MoiContext } from "../context/MoiSearchProvider";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  TextField,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MicIcon from "@mui/icons-material/Mic";

export const MoiFilterTable = () => {
  const {
    rows,
    functionFilteredRows,
    statusFilteredRows,
    finalFilteredRows,
    statusFilter,
    columns,
  } = useContext(MoiContext);
  const paginationModel = { page: 0, pageSize: 20 };
  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        borderRadius: 4,
        overflow: "hidden",
        p: 1,
      }}
    >
      <DataGrid
        rows={finalFilteredRows}
        columns={columns}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        disableRowSelectionOnClick
        autoHeight
        rowHeight={55}
        sx={{
          borderRadius: 3,

          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#e21d79",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
          },

          "& .MuiDataGrid-menuIcon button": {
            color: "#fff",
          },

          "& .MuiDataGrid-sortIcon": {
            color: "#fff",
          },

          "& .MuiDataGrid-iconSeparator": {
            color: "#fff",
          },

          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#f7bfb7",
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#f8e6b3",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#E3F2FD",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#2094e7",
          },
        }}
      />
    </Paper>
  );
};
