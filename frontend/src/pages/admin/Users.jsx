import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  Button,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Helmet } from "react-helmet-async";
import { useGetUsers } from "../../api/users";
import IconButton from "@mui/material/IconButton";
import BlockUserIcon from "../../components/icons/BlockUserIcon";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SiteLoader from "../../components/SiteLoade";

function roleLabel(role) {
  if (!role) return "—";
  const r = role.toLowerCase();
  if (r === "student") return "Student";
  if (r === "teacher") return "Teacher";
  if (r === "admin") return "Admin";
  return role;
}

export default function Users() {
  const { users = [], loading, error, refetch } = useGetUsers();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return users;

    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);
  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);

      await axiosInstance.patch(ENDPOINTS.USERS.Status(selectedUser.id));

      refetch();

      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <SiteLoader fullScreen text="Loading Books..." />;
  }

  return (
    <>
      <Helmet>
        <title>Users - Admin Dashboard</title>
      </Helmet>

      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 3,
          pl: { md: 8 },
        }}
      >
        {/* Header */}
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 500,
            color: "#2d5aa7",
            mb: 3,
          }}
        >
          All Users
        </Typography>

        {/* Search */}
        <Box sx={{ mb: 4, maxWidth: 400 }}>
          <Typography variant="caption" sx={{ color: "#7a869a" }}>
            Search:
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
              "& .MuiTableCell-root": {
                borderBottom: "none",
                paddingTop: "18px",
                paddingBottom: "18px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          >
            <colgroup>
              <col style={{ width: "34%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "10.66%" }} />
              <col style={{ width: "10.66%" }} />
              <col style={{ width: "10.66%" }} />
            </colgroup>

            <TableHead>
              <TableRow
                sx={{
                  borderBottom: "2px solid #e0e0e0",
                }}
              >
                <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                  Role
                </TableCell>
                <TableCell sx={{ color: "#7a869a", fontSize: 16 }}>
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "#7a869a", fontSize: 16 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: "red" }}>
                    Failed to load users
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !error &&
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f9fafc",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "#333" }}>{c.full_name}</TableCell>

                    <TableCell sx={{ color: "#0073D8" }}>{c.email}</TableCell>

                    <TableCell>{roleLabel(c.role)}</TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {c.status === "active" ? "Active" : "Inactive"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: c.status === "active" ? "#C72100" : "#2e7d32",
                          "&:hover": {
                            backgroundColor:
                              c.status === "active"
                                ? "rgba(199,33,0,0.08)"
                                : "rgba(46,125,50,0.08)",
                          },
                        }}
                        onClick={() => {
                          setSelectedUser(c);
                          setConfirmOpen(true);
                        }}
                      >
                        {c.status === "active" ? (
                          <BlockUserIcon fontSize="small" />
                        ) : (
                          <CheckCircleOutlineIcon fontSize="small" />
                        )}
                      </IconButton>

                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: c.status === "active" ? "#C72100" : "#2e7d32",
                        }}
                      >
                        {c.status === "active" ? "Block" : "Activate"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle sx={{ fontWeight: 600 }}>
            Confirm Status Change
          </DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              {selectedUser?.status === "active" ? "deactivate" : "activate"}{" "}
              this user?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setConfirmOpen(false)} disabled={updating}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleToggleStatus}
              disabled={updating}
              sx={{
                backgroundColor: "#2B5A9E",
                "&:hover": { backgroundColor: "#244a86" },
              }}
            >
              {updating ? "Updating..." : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
