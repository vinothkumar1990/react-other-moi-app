import React, {
  useEffect,
  useState,
  useRef
} from "react";

import {
  TextField,
  Paper,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import Swal from "sweetalert2";

import { outgoing_api } from "../utils/outgoing-api";

import { motion } from "framer-motion";

// DATE PICKER
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

export const UpdateDonationOutgoing = () => {
  const username = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const { id } = useParams();

  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [listeningField, setListeningField] =
    useState(null);

  const recognitionRef = useRef(null);

  // 🎤 Voice
  const startListening = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire(
        "Error",
        "Speech not supported",
        "error"
      );
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "ta-IN";

    recognition.interimResults = false;

    recognitionRef.current = recognition;

    setListeningField(field);

    recognition.start();

    recognition.onresult = (event) => {
      let text =
        event.results[0][0].transcript;

      // amount only numbers
      if (field === "amount") {
        text = text.replace(
          /[^0-9]/g,
          ""
        );
      }

      setUpdateProduct((prev) => ({
        ...prev,
        [field]: text
      }));
    };

    recognition.onend = () => {
      setListeningField(null);

      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setListeningField(null);

      Swal.fire(
        "Error",
        "Voice failed",
        "error"
      );
    };
  };

  // 📥 Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          await outgoing_api.get(
            `/donation_outgoing?select=*&id=eq.${id}`
          );

        const data = res.data[0];

        setUpdateProduct({
          ...data,

          // convert date
          date: data?.date
            ? dayjs(data.date)
            : null
        });
      } catch (error) {
        console.log(error);

        Swal.fire(
          "Error!",
          "Fetch failed",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✏️ Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct((prev) => ({
      ...prev,
      [name]: value
    }));

    // clear error
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // ✅ Validation
  const validate = () => {
    let temp = {};

    if (
      !updateProduct.name ||
      !updateProduct.name.trim()
    ) {
      temp.name =
        "செலவு தலைப்பு அவசியம்";
    }

    if (!updateProduct.amount) {
      temp.amount =
        "தொகை அவசியம்";
    } else if (
      isNaN(updateProduct.amount)
    ) {
      temp.amount =
        "எண் மட்டும் உள்ளிடவும்";
    } else if (
      Number(updateProduct.amount) <= 0
    ) {
      temp.amount =
        "0 விட அதிகமாக இருக்க வேண்டும்";
    }

    if (
      !updateProduct.type ||
      !updateProduct.type.trim()
    ) {
      temp.type =
        "வகை தேர்வு செய்யவும்";
    }

    if (!updateProduct.date) {
      temp.date =
        "தேதி தேர்வு செய்யவும்";
    }

    setErrors(temp);

    return (
      Object.keys(temp).length === 0
    );
  };

  // 💾 UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      await outgoing_api.patch(
        `/donation_outgoing?id=eq.${id}`,
        {
          ...updateProduct,

          name:
            updateProduct.name.trim(),

          description:
            updateProduct.description?.trim() ||
            "",

          amount: Number(
            updateProduct.amount
          ),

          // convert date
          date:
            updateProduct.date.format(
              "YYYY-MM-DD"
            ),

          created_by:
            username?.name || ""
        }
      );

      await Swal.fire(
        "Success!",
        "வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
        "success"
      );

      navigate(
        "/donation/outgoings"
      );
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error!",
        "Update failed",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // NO DATA
  if (!updateProduct) {
    return <div>No data</div>;
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 500,
          width: "95%",
          mx: "auto",
          mt: 3,
          p: {
            xs: 2,
            sm: 3
          },
          borderRadius: 3
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
        >
          செலவு திருத்தம்
        </Typography>

        <Box
          component="form"
          onSubmit={handleUpdate}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          

          {/* NAME */}
          <Box
            sx={{
              display: "flex",
              gap: 1
            }}
          >
            <TextField
              name="name"
              value={
                updateProduct.name ||
                ""
              }
              label="செலவு தலைப்பு"
              fullWidth
              onChange={
                handleChange
              }
              error={
                !!errors.name
              }
              helperText={
                errors.name
              }
            />

            <IconButton
              onClick={() =>
                startListening(
                  "name"
                )
              }
            >
              <motion.div
                animate={{
                  scale:
                    listeningField ===
                    "name"
                      ? [
                          1,
                          1.3,
                          1
                        ]
                      : 1
                }}
                transition={{
                  repeat:
                    Infinity,
                  duration: 1
                }}
              >
                <MicIcon
                  color={
                    listeningField ===
                    "name"
                      ? "error"
                      : "primary"
                  }
                />
              </motion.div>
            </IconButton>
          </Box>

          {/* AMOUNT */}
          <TextField
            name="amount"
            value={
              updateProduct.amount ||
              ""
            }
            label="செலவு தொகை"
            type="number"
            fullWidth
            onChange={
              handleChange
            }
            error={
              !!errors.amount
            }
            helperText={
              errors.amount
            }
          />
          {/* DATE */}
          <DatePicker
            label="தேதி"
            value={updateProduct.date}
            onChange={(newValue) => {
              setUpdateProduct(
                (prev) => ({
                  ...prev,
                  date: newValue
                })
              );
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                error:
                  !!errors.date,
                helperText:
                  errors.date
              }
            }}
          />
          
          {/* TYPE */}
          <TextField
            select
            name="type"
            value={
              updateProduct.type ||
              ""
            }
            label="செலவு வகை"
            fullWidth
            onChange={
              handleChange
            }
            error={
              !!errors.type
            }
            helperText={
              errors.type
            }
          >
            <MenuItem value="">
              -- Select Type --
            </MenuItem>

            <MenuItem value="நன்கொடை">
                          நன்கொடை செலவு
                        </MenuItem>
            
                        
            
                        <MenuItem value="பொது">
                          பொது செலவு
                        </MenuItem>
            
            <MenuItem value="-">
              -
            </MenuItem>
          </TextField>

          {/* DESCRIPTION */}
          <Box
            sx={{
              display: "flex",
              gap: 1
            }}
          >
            <TextField
              name="description"
              value={
                updateProduct.description ||
                ""
              }
              label="செலவு விளக்கம்"
              multiline
              rows={3}
              fullWidth
              onChange={
                handleChange
              }
            />

            <IconButton
              onClick={() =>
                startListening(
                  "description"
                )
              }
            >
              <motion.div
                animate={{
                  scale:
                    listeningField ===
                    "description"
                      ? [
                          1,
                          1.3,
                          1
                        ]
                      : 1
                }}
                transition={{
                  repeat:
                    Infinity,
                  duration: 1
                }}
              >
                <MicIcon
                  color={
                    listeningField ===
                    "description"
                      ? "error"
                      : "primary"
                  }
                />
              </motion.div>
            </IconButton>
          </Box>

          {/* USER */}
          <TextField
            value={
              username?.name ||
              ""
            }
            fullWidth
            disabled
          />

          {/* BUTTON */}
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={20} />
            ) : (
              "Update"
            )}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}; 