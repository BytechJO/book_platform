/* eslint-disable no-undef */
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axiosInstance from "src/api/axios";
import ENDPOINTS from "src/api/endpoints";
import { formatDate, roleLabel } from "src/utils/codesUtils";
import CurveLoader from "../../components/CurveLoader";

export default function CodesDialogs({
  books,
  refetch,
  setSnackbar,
  // Generate Dialog
  openDialog,
  setOpenDialog,
  generateLoading,
  setGenerateLoading,
  generatedCodes,
  setGeneratedCodes,
  // Import Dialog
  importPreviewOpen,
  setImportPreviewOpen,
  importLoading,
  setImportLoading,
  importedCodes,
  setImportedCodes,
  // Edit Dialog
  editOpen,
  setEditOpen,
  selectedCode,
  newValidity,
  setNewValidity,
  // Delete Dialog
  deleteOpen,
  setDeleteOpen,
  deleteId,
}) {
  // Generate Handlers
  const handleGenerateCodes = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const number_of_codes = Number(formData.get("number_of_codes")) || 1;
    const allowed_role = formData.get("allowed_role");
    const validity_months = Number(formData.get("validity_months"));
    const book_id = formData.get("book_id");

    try {
      setGenerateLoading(true);
      const res = await axiosInstance.post(ENDPOINTS.Codes.Create, {
        number_of_codes,
        allowed_role,
        validity_months,
        book_id,
      });
      setGeneratedCodes(res.data.codes);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleDownloadGenerated = () => {
    if (!generatedCodes.length) return;
    const data = generatedCodes.map((c) => {
      const book = books.find((b) => b.id === c.book_id);
      return {
        "Book Name": book?.title || "—",
        Code: c.code,
        "Validity (Months)": c.validity_months,
        Role: roleLabel(c.allowed_role),
        Status: c.is_used ? "Used" : "Unused",
        Created: formatDate(c.created_at),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Generated Codes");
    XLSX.writeFile(workbook, "generated_codes.xlsx");
  };

  // Import Handlers
  const handleChangeImportedBook = (index, bookId) => {
    const updated = [...importedCodes];
    updated[index].book_id = bookId;
    setImportedCodes(updated);
  };

  const handleConfirmImport = async () => {
    try {
      setImportLoading(true);
      await axiosInstance.post(ENDPOINTS.Codes.Import, {
        codes: importedCodes,
      });
      await refetch();
      setImportPreviewOpen(false);
      setSnackbar({
        open: true,
        message: "Codes imported successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to import codes",
        severity: "error",
      });
    } finally {
      setImportLoading(false);
    }
  };

  // Edit Handlers
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(ENDPOINTS.Codes.UPDATE(selectedCode.id), {
        validity_months: Number(newValidity),
      });
      await refetch();
      setEditOpen(false);
      setSnackbar({
        open: true,
        message: "Code updated successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update code",
        severity: "error",
      });
      console.log(error);
    }
  };

  // Delete Handlers
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(ENDPOINTS.Codes.DELETE(deleteId));
      await refetch();
      setDeleteOpen(false);
      setSnackbar({
        open: true,
        message: "Code deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete code",
        severity: "error",
      });
      console.log(error);
    }
  };

  return (
    <>
      {/* Generate Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: handleGenerateCodes,
          sx: {
            width: 540,
            borderRadius: "30px",
            p: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "#2d5aa7",
            fontSize: 20,
          }}
        >
          Generate Activation Codes
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{ fontSize: 16, fontWeight: 500, mb: 1, color: "#7A869A" }}
              >
                Number of Codes *
              </Typography>
              <TextField
                name="number_of_codes"
                fullWidth
                placeholder="Enter number of codes"
                InputProps={{
                  sx: {
                    height: 56,
                    borderRadius: "12px",
                    backgroundColor: "#F9FBFF",
                  },
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 16, fontWeight: 500, mb: 1, color: "#7A869A" }}
              >
                Book name *
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="book_id"
                  required
                  defaultValue=""
                  displayEmpty
                  sx={{
                    height: 56,
                    borderRadius: "12px",
                    backgroundColor: "#F9FBFF",
                  }}
                >
                  <MenuItem value="" disabled>
                    Select book
                  </MenuItem>
                  {books.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 16, fontWeight: 500, mb: 1, color: "#7A869A" }}
              >
                Role *
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="allowed_role"
                  defaultValue="teacher"
                  displayEmpty
                  sx={{
                    height: 56,
                    borderRadius: "12px",
                    backgroundColor: "#F9FBFF",
                  }}
                >
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 16, fontWeight: 500, mb: 1, color: "#7A869A" }}
              >
                Validity Duration (Months) *
              </Typography>
              <TextField
                name="validity_months"
                type="number"
                required
                fullWidth
                placeholder="Enter number of months"
                inputProps={{ min: 1 }}
                InputProps={{
                  sx: {
                    height: 56,
                    borderRadius: "12px",
                    backgroundColor: "#F9FBFF",
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 3, pb: 5 }}>
          <LoadingButton
            type="submit"
            loading={generateLoading}
            loadingPosition="center"
            variant="contained"
            sx={{
              width: 126,
              height: 59,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              backgroundColor: "#ECECEC",
              color: "#2B5A9E",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#DCDCDC", boxShadow: "none" },
            }}
            disabled={generatedCodes.length > 0}
          >
            Generate
          </LoadingButton>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{
              width: 126,
              height: 59,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 16,
              backgroundColor: "#466FAA",
              color: "#FFFFFF",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#3D6399", boxShadow: "none" },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
        {generatedCodes.length > 0 && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography sx={{ mb: 1, color: "#7A869A" }}>
              Codes generated successfully. If you want, you can download them.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleDownloadGenerated}
              disabled={generateLoading}
            >
              Download Generated Codes
            </Button>
          </Box>
        )}
      </Dialog>

      {/* Import Preview Dialog */}
      <Dialog
        open={importPreviewOpen}
        onClose={() => setImportPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Review Imported Codes</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Book</TableCell>
                  <TableCell>Validity</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importedCodes.map((c, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: c.isDuplicate ? "#ffe6e6" : "inherit",
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          color: c.isDuplicate ? "red" : "inherit",
                          fontWeight: c.isDuplicate ? 600 : 400,
                          fontSize: 14,
                        }}
                      >
                        {c.code}
                      </Typography>
                      {c.isDuplicate && (
                        <Typography variant="caption" sx={{ color: "red" }}>
                          Duplicate
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {c.book_id ? (
                        books.find((b) => b.id === c.book_id)?.title
                      ) : (
                        <FormControl fullWidth size="small">
                          <Select
                            value={c.book_id || ""}
                            onChange={(e) =>
                              handleChangeImportedBook(index, e.target.value)
                            }
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select Book
                            </MenuItem>
                            {books.map((b) => (
                              <MenuItem key={b.id} value={b.id}>
                                {b.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>{c.validity_months}</TableCell>
                    <TableCell>{c.allowed_role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}
        >
          <Button onClick={() => setImportPreviewOpen(false)} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmImport}
            disabled={importedCodes.some((c) => !c.book_id)}
            fullWidth
          >
            Confirm Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Code</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Code: {selectedCode?.code}</Typography>
          <TextField
            fullWidth
            type="number"
            label="Validity (Months)"
            value={newValidity}
            onChange={(e) => setNewValidity(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this code?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={importLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      >
        <CurveLoader />
      </Backdrop>
    </>
  );
}
