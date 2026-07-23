import { useContext } from "react";
import { MoiContext } from "../context/MoiSearchProvider";
import SearchInput from "./SearchInput";
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
export const MoiFilterSection = () => {
  const {
    error,
    name,
    nameSearch,
    placeSearch,
    listeningField,
    setStatusFilter,
    setNameSearch,
    setPlaceSearch,
    statusFilter,
    startVoiceSearch,
    stopVoice,
  } = useContext(MoiContext);
  return (
    <div>
      {/* FILTER */}
      <Card
        elevation={5}
        sx={{
          borderRadius: 4,
          mb: 3,
          p: 1,
        }}
        style={{ color: "#1976d2", backgroundColor: "#26ccb0" }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={3}
            style={{ color: "#d21941" }}
          >
            🔍 தேடல்
          </Typography>

          <Grid container spacing={2}>
            {/* Name Search */}

            <Grid item xs={12} md={4}>
              <SearchInput
                label="பெயர் தேடல்"
                value={nameSearch}
                setValue={setNameSearch}
                field="name"
                onMicClick={startVoiceSearch}
                stopVoice={stopVoice}
                listeningField={listeningField}
              />
            </Grid>

            {/* Place Search */}

            <Grid item xs={12} md={4}>
              <SearchInput
                label="ஊர் தேடல்"
                value={placeSearch}
                setValue={setPlaceSearch}
                field="place"
                onMicClick={startVoiceSearch}
                stopVoice={stopVoice}
                listeningField={listeningField}
              />
            </Grid>

            {/* Status */}

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>நிலை</InputLabel>

                <Select
                  value={statusFilter}
                  label="நிலை"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">அனைத்தும்</MenuItem>

                  <MenuItem value="Pending">நிலுவையில்</MenuItem>

                  <MenuItem value="Completed">நிறைவு</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Button */}

            <Grid item xs={12} md={2} display="flex" alignItems="center">
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<RestartAltIcon />}
                sx={{ height: 40 }}
                onClick={() => {
                  setNameSearch("");
                  setPlaceSearch("");
                  setStatusFilter("all");
                  stopVoice();
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
