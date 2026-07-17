import React from "react";
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

export const SearchMoiFilter = () => {
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
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
            <Typography variant="subtitle1" color="text.secondary">
              💰 நிறைவு செய்த மொத்த தொகை
            </Typography>

            <Typography variant="h4" fontWeight="bold" color="secondary">
              ₹ {totalCompletedAmount.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
