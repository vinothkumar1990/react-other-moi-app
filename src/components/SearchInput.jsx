import React, { memo } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";

const SearchInput = memo(
  ({
    label,
    value,
    setValue,
    field,
    onMicClick,
    stopVoice,
    listeningField,
  }) => {
    const isListening = listeningField === field;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label={label}
          value={value}
          onChange={(e) => {
            stopVoice();
            setValue(e.target.value);
          }}
          onFocus={stopVoice}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          onClick={() => onMicClick(field)}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            width: 40,
            height: 40,
            bgcolor: isListening ? "#ffe6e6" : "#e3f2fd",
          }}
        >
          <motion.div
            animate={{
              scale: isListening ? [1, 1.3, 1] : 1,
            }}
            transition={{
              repeat: isListening ? Infinity : 0,
              duration: 1,
            }}
          >
            <MicIcon color={isListening ? "error" : "primary"} />
          </motion.div>
        </IconButton>
      </Box>
    );
  },
);

export default SearchInput;
