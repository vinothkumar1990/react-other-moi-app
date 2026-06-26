import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const SUPABASE_URL =
  "https://ievyooeawrzhkemxfswj.supabase.co/rest/v1/mois";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlldnlvb2Vhd3J6aGtlbXhmc3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY5OTUsImV4cCI6MjA3Nzc2Mjk5NX0.ctG8m56crGR4hFDxdsBmjh5l7OUvqNq57jj29O1SmQI";

const DataMigration = () => {
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || "{}"
  );

  const [loading, setLoading] = useState(false);

  const uploadData = async (rows) => {
    try {
      const formattedRows = rows
        .filter((row) => row.name)
        .map((row) => ({
          name: row.name?.toString().trim() || "",
          place: row.place?.toString().trim() || "",
          old_amount: Number(row.old_amount || 0),
          new_amount: Number(row.new_amount || 0),
          given_amount_status:
            row.given_amount_status?.toString().trim() || "",
          function_name:
            row.function_name ||
            loggedInUser?.function_name ||
            "",
          status: row.status || "Pending",
        }));

      if (formattedRows.length === 0) {
        throw new Error("No valid records found");
      }

      const response = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(formattedRows),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: `${formattedRows.length} records uploaded successfully`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setLoading(true);

    try {
      const fileExtension = file.name
        .split(".")
        .pop()
        .toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            await uploadData(results.data);
          },
          error: (error) => {
            setLoading(false);

            Swal.fire({
              icon: "error",
              title: "CSV Error",
              text: error.message,
            });
          },
        });

        return;
      }

      if (
        fileExtension === "xlsx" ||
        fileExtension === "xls"
      ) {
        const data = await file.arrayBuffer();

        const workbook = XLSX.read(data);

        const firstSheet =
          workbook.Sheets[workbook.SheetNames[0]];

        const jsonData =
          XLSX.utils.sheet_to_json(firstSheet);

        await uploadData(jsonData);

        return;
      }

      throw new Error(
        "Only CSV, XLSX and XLS files are allowed"
      );
    } catch (error) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Fade in timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            borderRadius: "25px",
            backdropFilter: "blur(12px)",
            background:
              "rgba(255,255,255,0.15)",
            border:
              "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              mb: 2,
              animation:
                "bounce 2s infinite",
              "@keyframes bounce": {
                "0%,100%": {
                  transform:
                    "translateY(0px)",
                },
                "50%": {
                  transform:
                    "translateY(-10px)",
                },
              },
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 70,
                color: "#fff",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Moi Bulk Upload
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              mb: 4,
            }}
          >
            Upload CSV, XLSX or XLS files
          </Typography>

          <Button
            component="label"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              height: 60,
              borderRadius: "15px",
              fontSize: "16px",
              fontWeight: "bold",
              background:
                "linear-gradient(45deg,#00c6ff,#0072ff)",
              transition: "0.3s",
              "&:hover": {
                transform:
                  "translateY(-3px)",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.3)",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: "#fff",
                    mr: 1,
                  }}
                />
                Uploading...
              </>
            ) : (
              <>
                <CloudUploadIcon
                  sx={{ mr: 1 }}
                />
                Upload CSV / Excel
              </>
            )}

            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>

          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 3,
              opacity: 0.7,
            }}
          >
            Supported Formats:
            CSV, XLSX, XLS
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default DataMigration;