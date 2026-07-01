import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import {
  TextField,
  Paper,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";
// ✅ Input Component
const InputWithMic = memo(
  ({ field, label, type = "text", value, onChange, onFocus, Mic, error, helperText }) => (
    <Box sx={{ display: "flex", alignItems: "stretch", gap: 1 }}>
      <TextField
fullWidth
label={label}
type={type}
value={value||""}
onChange={onChange}
onFocus={onFocus}
size="small"

sx={{

background:"#fff",

borderRadius:2,

"& .MuiOutlinedInput-root":{

borderRadius:3

},

"& .Mui-focused fieldset":{

borderColor:"#1976D2",

borderWidth:2

}

}}

error={!!error}

helperText={helperText}

/>
      <Mic field={field} />
    </Box>
  )
);

export const UpdateRelo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateProduct, setUpdateProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [listeningField, setListeningField] = useState(null);

  const recognitionRef = useRef(null);

  const API_URL =
    "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

  // 🎤 Voice
  const startVoice = useCallback((field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      Swal.fire("Error", "Voice not supported", "error");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "ta-IN";
    recognition.start();

    setListeningField(field);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let text = event.results[0][0].transcript;

      setUpdateProduct((prev) => {
        let updated =
          field === "old_amount" || field === "new_amount"
            ? text.replace(/[^0-9]/g, "")
            : prev[field]
            ? prev[field] + " " + text
            : text;

        return { ...prev, [field]: updated };
      });
    };

    recognition.onend = () => setListeningField(null);
  }, []);

  const stopVoice = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListeningField(null);
  }, []);

  const Mic = ({ field }) => (
<IconButton
  component={motion.button}
  onClick={() => startVoice(field)}
  whileHover={{
    scale: 1.15,
    rotate: 10,
  }}
  whileTap={{
    scale: 0.9,
  }}
  sx={{
    width: 45,
    height: 45,
    borderRadius: "50%",
    background: "linear-gradient(45deg,#2196F3,#42A5F5)",
    color: "#fff",

    "&:hover": {
      background: "linear-gradient(45deg,#1565C0,#1976D2)",
    },
  }}
>
      <motion.div
        animate={{
          scale: listeningField === field ? [1, 1.3, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <MicIcon color={listeningField === field ? "error" : "primary"} />
      </motion.div>
    </IconButton>
  );

  // ✅ Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?id=eq.${id}`, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        setUpdateProduct(res.data[0]);
      } catch {
        Swal.fire("Error", "Fetch failed", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (field) => (e) => {
    stopVoice();
    setUpdateProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // ✅ VALIDATION
  const validate = () => {
    let temp = {};

    if (!updateProduct.name?.trim()) temp.name = "பெயர் தேவை";
    if (!updateProduct.place?.trim()) temp.place = "ஊர் தேவை";

    if (!updateProduct.old_amount)
      temp.old_amount = "பழைய பணம் தேவை";
    else if (isNaN(updateProduct.old_amount))
      temp.old_amount = "எண் மட்டும்";

    if (!updateProduct.new_amount)
      temp.new_amount = "புதிய பணம் தேவை";
    else if (isNaN(updateProduct.new_amount))
      temp.new_amount = "எண் மட்டும்";

    if (!updateProduct.given_amount_status)
      temp.given_amount_status = "தடவை தேர்வு செய்யவும்";
    if (!updateProduct.status)
       temp.status = "நிலை தேர்வு செய்யவும்";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ✅ UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await axios.patch(`${API_URL}?id=eq.${id}`, updateProduct, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
      });

      //await Swal.fire("Success", "Updated successfully", "success");

      //navigate("/all", { replace: true });
      await Swal.fire({

icon:"success",

title:"🎉 வெற்றிகரமாக புதுப்பிக்கப்பட்டது",

text:"மொய் தகவல் மாற்றப்பட்டது.",

showConfirmButton:false,

timer:1500,

background:"#E8F5E9",

color:"#2E7D32"

});

      setTimeout(() => {
        navigate("/all", { replace: true });
      }, 500);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!updateProduct) return <div>No data</div>;

  return (
    <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2,

    background:
      "linear-gradient(135deg,#2196F3,#9C27B0,#00BCD4)",

    backgroundSize: "400% 400%",

    animation: "gradient 12s ease infinite",

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
    mx: "auto",
    mt: 3,
    p: 3,
    borderRadius: 5,
    background:
      "linear-gradient(135deg,#ffffff,#E3F2FD,#F3E5F5,#FFF8E1)",
    boxShadow: "0 15px 40px rgba(0,0,0,.25)",
  }}
>
      <Typography
component={motion.h2}
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ duration: .5 }}
textAlign="center"
sx={{
fontWeight:"bold",
fontSize:30,
color:"#1565C0",
mb:3
}}
>

✏️ மொய் புதுப்பித்தல்

</Typography>

      <Box
        component="form"
        onSubmit={handleUpdate}
        sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <motion.div
initial={{ x: -40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
        <InputWithMic
          field="place"
          label="ஊர்"
          value={updateProduct.place}
          onFocus={stopVoice}
          onChange={handleChange("place")}
          Mic={Mic}
          error={errors.place}
          helperText={errors.place}
        />
</motion.div>
<motion.div
initial={{ x: -40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
        <InputWithMic
          field="name"
          label="பெயர்"
          value={updateProduct.name}
          onFocus={stopVoice}
          onChange={handleChange("name")}
          Mic={Mic}
          error={errors.name}
          helperText={errors.name}
        />
</motion.div>
<motion.div
initial={{ x: -40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
        <InputWithMic
          field="old_amount"
          label="பழைய பணம்"
          type="number"
          value={updateProduct.old_amount}
          onFocus={stopVoice}
          onChange={handleChange("old_amount")}
          Mic={Mic}
          error={errors.old_amount}
          helperText={errors.old_amount}
        />
</motion.div>
<motion.div
initial={{ x: -40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
        <InputWithMic
          field="new_amount"
          label="புதிய பணம்"
          type="number"
          value={updateProduct.new_amount}
          onFocus={stopVoice}
          onChange={handleChange("new_amount")}
          Mic={Mic}
          error={errors.new_amount}
          helperText={errors.new_amount}
        />
</motion.div>
        <TextField
          select
          label="தடவை"
          value={updateProduct.given_amount_status || ""}
          onChange={handleChange("given_amount_status")}
          error={!!errors.given_amount_status}
          helperText={errors.given_amount_status}
          sx={{

background:"#fff",

borderRadius:2

}}
        >
          <MenuItem value="">-- தேர்வு --</MenuItem>
          <MenuItem value="0">0</MenuItem>
          <MenuItem value="I">I</MenuItem>
          <MenuItem value="II">II</MenuItem>
          <MenuItem value="III">III</MenuItem>
          <MenuItem value="IV">IV</MenuItem>
        </TextField>
         {/* நிலை */}
                <TextField
  select
  label="மொய் நிலை"
  value={updateProduct.status || ""}
  onChange={handleChange("status")}
  error={!!errors.status}
  helperText={errors.status}
  fullWidth
  sx={{

background:"#fff",

borderRadius:2

}}
>
  <MenuItem value="">-- நிலை தேர்ந்தெடுக்கவும் --</MenuItem>
  <MenuItem value="Pending">நிலுவையில்</MenuItem>
  <MenuItem value="Completed">முடிக்கப்பட்டது</MenuItem>
</TextField>
<TextField
          label="விழா"
          value={updateProduct.function_name}
          fullWidth
          size="small"
          disabled
        />
        

        <Button
component={motion.button}

whileHover={{
scale:1.05
}}

whileTap={{
scale:.95
}}

type="submit"

variant="contained"

disabled={saving}

sx={{

mt:2,

py:1.5,

fontSize:18,

fontWeight:"bold",

borderRadius:3,

background:
"linear-gradient(90deg,#43A047,#66BB6A)",

boxShadow:
"0 10px 25px rgba(76,175,80,.4)",

"&:hover":{

background:
"linear-gradient(90deg,#2E7D32,#43A047)"

}

}}

>

{

saving

?

<CircularProgress

size={22}

sx={{
color:"#fff"
}}

/>

:

"💾 Update"

}

</Button>
      </Box>
    </Paper>
    </Box>
  );
};