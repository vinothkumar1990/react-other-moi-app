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
export const MoiFilterContent = () => {
  const {
    totalRecords,
    completedCount,
    pendingCount,
    newAmount,
    oldAmount,
    totalAmount,
    totalPendingAmount,
    totalCompletedAmount,
  } = useContext(MoiContext);
  return (
    <div>
      <Box
        sx={{
          background: "linear-gradient(90deg,#1565c0,#42a5f5)",
          color: "#fff",
          p: 3,
          borderRadius: 3,
          mb: 3,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          style={{ color: "white", textAlign: "center" }}
        >
          மொய் பதிவுகளை தேடவும் மற்றும் நிர்வகிக்கவும்
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Records */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#E3F2FD",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#1baa33" }}
              >
                📋 மொத்த மொய்
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalRecords}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#E8F5E9",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#1baa33" }}
              >
                ✅ நிறைவு
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="success.main">
                {completedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#FFF8E1",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#d21919" }}
              >
                ⏳ நிலுவையில்
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* old Amount */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#F3E5F5",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#d21919" }}
              >
                💰 பழைய மொத்த தொகை
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="secondary">
                ₹ {oldAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* new Amount */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#F3E5F5",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#1baa33" }}
              >
                💰 புதிய மொத்த தொகை
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="secondary">
                ₹ {newAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#F3E5F5",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#1baa33" }}
              >
                💰 மொத்த தொகை
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="secondary">
                ₹ {totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* pending Amount */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#F3E5F5",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#d21919" }}
              >
                💰 நிலுவையில் உள்ள மொத்த தொகை
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="secondary">
                ₹ {totalPendingAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Completed Amount */}

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={4}
            sx={{
              borderRadius: 3,
              background: "#F3E5F5",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight="bold"
                style={{ color: "#1baa33" }}
              >
                💰 நிறைவு செய்த மொத்த தொகை
              </Typography>

              <Typography variant="h4" fontWeight="bold" color="secondary">
                ₹ {totalCompletedAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
