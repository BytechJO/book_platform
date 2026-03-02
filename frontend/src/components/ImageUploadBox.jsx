import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";

export default function ImageUploadBox({ label, preview, onFileSelect }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    onFileSelect(file);
  };

  return (
    <Box>
      <Typography sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>

      <Box
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed #2B5A9E",
          borderRadius: "12px",
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragging ? "#f3f7fd" : "#fafafa",
          transition: "0.2s ease",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        ) : (
          <Typography color="text.secondary">
            Drag & Drop image here or Click to Upload
          </Typography>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFileSelect(e.target.files[0])}
        />
      </Box>
    </Box>
  );
}