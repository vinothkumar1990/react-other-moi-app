import React from "react";
import {
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";

import { useContext } from "react";
import { MoiContext } from "../context/MoiProvider";

import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";
export const NewMoiForm = () => {
  const {
    newProduct,
    setNewProduct,
    errors,
    setErrors,
    loading,
    setLoading,
    listeningField,
    recognitionRef,
    startVoice,
    stopVoice,
    MicInside,
    handleChange,
    handleAdd,
    InputWithMic,
    validate,
    loggedInUser,
  } = useContext(MoiContext);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#2196F3,#9C27B0,#00BCD4)",
        backgroundSize: "400% 400%",
        animation: "gradient 10s ease infinite",
        p: 2,

        "@keyframes gradient": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        elevation={12}
        sx={{
          maxWidth: 500,
          width: "95%",
          margin: "20px auto",
          p: 3,
          borderRadius: 5,
          background: "linear-gradient(135deg,#ffffff,#E3F2FD,#F3E5F5,#FFF8E1)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          component={motion.h2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          align="center"
          sx={{
            fontWeight: "bold",
            fontSize: 28,
            color: "#1565C0",
            mb: 3,
          }}
        >
          புதிய மொய் பதிவு..
        </Typography>

        <Grid
          component="form"
          onSubmit={handleAdd}
          sx={{ display: "grid", gap: 2, mt: 2 }}
        >
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="name"
              label="பெயர்"
              value={newProduct.name}
              onFocus={stopVoice}
              onChange={handleChange("name")}
              MicInside={MicInside}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="place"
              label="ஊர்"
              value={newProduct.place}
              onFocus={stopVoice}
              onChange={handleChange("place")}
              MicInside={MicInside}
              error={!!errors.place}
              helperText={errors.place}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="old_amount"
              label="பழைய பணம்"
              type="number"
              value={newProduct.old_amount}
              onFocus={stopVoice}
              onChange={handleChange("old_amount")}
              MicInside={MicInside}
              error={!!errors.old_amount}
              helperText={errors.old_amount}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <InputWithMic
              field="new_amount"
              label="புதிய பணம்"
              type="number"
              value={newProduct.new_amount}
              onFocus={stopVoice}
              onChange={handleChange("new_amount")}
              MicInside={MicInside}
              error={!!errors.new_amount}
              helperText={errors.new_amount}
              sx={{
                background: "#fff",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },

                "& .Mui-focused fieldset": {
                  borderColor: "#1976d2",
                  borderWidth: 2,
                },
              }}
            />
          </motion.div>
          <TextField
            select
            label="தடவை"
            value={newProduct.given_amount_status}
            onChange={handleChange("given_amount_status")}
            error={!!errors.given_amount_status}
            helperText={errors.given_amount_status}
            fullWidth
            size="small"
          >
            <MenuItem value="">-- தேர்வு --</MenuItem>
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="I">I</MenuItem>
            <MenuItem value="II">II</MenuItem>
            <MenuItem value="III">III</MenuItem>
            <MenuItem value="IV">IV</MenuItem>
          </TextField>

          <TextField
            label="விழா"
            value={newProduct.function_name}
            fullWidth
            size="small"
            disabled
          />

          <Button
            component={motion.button}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: 18,
              fontWeight: "bold",
              borderRadius: 3,

              background: "linear-gradient(90deg,#4CAF50,#66BB6A)",

              boxShadow: "0 8px 20px rgba(76,175,80,.4)",

              "&:hover": {
                background: "linear-gradient(90deg,#43A047,#2E7D32)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "#f0dddd",
                }}
              />
            ) : (
              "➕ Add Record"
            )}
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
};
