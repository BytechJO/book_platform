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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Helmet } from "react-helmet-async";
import { useGetUsers } from "../../api/users";
import IconButton from "@mui/material/IconButton";
import BlockUserIcon from "../../components/icons/BlockUserIcon";
import axiosInstance from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CurveLoader from "../../components/CurveLoader";

function roleLabel(role) {
  if (!role) return "—";
  const r = role.toLowerCase();
  if (r === "student") return "Student";
  if (r === "teacher") return "Teacher";
  if (r === "admin") return "Admin";
  return role;
}

function UserCard({ user, onToggle }) {
  const isActive = user.status === "active";

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e8eaf0",
        borderRadius: 2,
        mb: 2,
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        {/* Name & Email */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1.5}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#333",
                fontSize: 16,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.full_name}
            </Typography>
            <Typography
              sx={{
                color: "#0073D8",
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mt: 0.25,
              }}
            >
              {user.email}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => onToggle(user)}
            sx={{
              color: isActive ? "#C72100" : "#2e7d32",
              backgroundColor: isActive
                ? "rgba(199,33,0,0.06)"
                : "rgba(46,125,50,0.06)",
              ml: 1,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: isActive
                  ? "rgba(199,33,0,0.12)"
                  : "rgba(46,125,50,0.12)",
              },
            }}
          >
            {isActive ? (
              <BlockUserIcon fontSize="small" />
            ) : (
              <CheckCircleOutlineIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        {/* Role & Status Chips */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={roleLabel(user.role)}
            size="small"
            sx={{
              fontWeight: 500,
              fontSize: 12,
              backgroundColor: "#EEF2F9",
              color: "#2d5aa7",
              height: 26,
            }}
          />
          <Chip
            label={isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontWeight: 500,
              fontSize: 12,
              backgroundColor: isActive
                ? "rgba(46,125,50,0.08)"
                : "rgba(0,0,0,0.06)",
              color: isActive ? "#2e7d32" : "#888",
              height: 26,
            }}
          />
          <Typography
            sx={{
              ml: "auto",
              fontSize: 11,
              fontWeight: 600,
              color: isActive ? "#C72100" : "#2e7d32",
            }}
          >
            {isActive ? "Block" : "Activate"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Users() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const openConfirm = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  if (loading) {
    return <CurveLoader/>;
  }

  const EmptyState = ({ message }) => (
    <TableRow>
      <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#7a869a" }}>
        {message}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Helmet>
        <title>Users - Admin Dashboard</title>
      </Helmet>

      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, md: 3 },
          pl: { md: 8 },
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Typography
          sx={{
            fontSize: { xs: 22, sm: 26, md: 28 },
            fontWeight: 500,
            color: "#2d5aa7",
            mb: { xs: 2, md: 3 },
          }}
        >
          All Users
        </Typography>

        {/* Search */}
        <Box sx={{ mb: { xs: 2, md: 4 }, maxWidth: { xs: "100%", sm: 400 } }}>
          <Typography
            variant="caption"
            sx={{ color: "#7a869a", mb: 0.5, display: "block" }}
          >
            Search:
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email, or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1.5,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: 1.5,
                },
              },
            }}
          />
        </Box>

        {/* Results count */}
        {!loading && !error && filtered.length > 0 && (
          <Typography
            variant="body2"
            sx={{ color: "#7a869a", mb: { xs: 1.5, md: 2 } }}
          >
            {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
          </Typography>
        )}

        {/* Desktop Table */}
        {!isMobile && (
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
              boxShadow: "none",
              overflowX: "auto",
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
                <TableRow sx={{ borderBottom: "2px solid #e0e0e0" }}>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#7a869a", fontSize: 15 }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {error && <EmptyState message="Failed to load users" />}
                {!error && filtered.length === 0 && (
                  <EmptyState message="No users found" />
                )}

                {!error &&
                  filtered.map((c) => {
                    const isActive = c.status === "active";
                    return (
                      <TableRow
                        key={c.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafc" },
                        }}
                      >
                        <TableCell sx={{ color: "#333", fontSize: 14 }}>
                          {c.full_name}
                        </TableCell>
                        <TableCell sx={{ color: "#0073D8", fontSize: 14 }}>
                          {c.email}
                        </TableCell>
                        <TableCell sx={{ fontSize: 14 }}>
                          {roleLabel(c.role)}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                            {isActive ? "Active" : "Inactive"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            sx={{
                              color: isActive ? "#C72100" : "#2e7d32",
                              "&:hover": {
                                backgroundColor: isActive
                                  ? "rgba(199,33,0,0.08)"
                                  : "rgba(46,125,50,0.08)",
                              },
                            }}
                            onClick={() => openConfirm(c)}
                          >
                            {isActive ? (
                              <BlockUserIcon fontSize="small" />
                            ) : (
                              <CheckCircleOutlineIcon fontSize="small" />
                            )}
                          </IconButton>
                          <Typography
                            sx={{
                              fontSize: 11,
                              fontWeight: 500,
                              color: isActive ? "#C72100" : "#2e7d32",
                            }}
                          >
                            {isActive ? "Block" : "Activate"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <Box>
            {error && (
              <Typography sx={{ textAlign: "center", color: "red", py: 6 }}>
                Failed to load users
              </Typography>
            )}

            {!error && filtered.length === 0 && (
              <Typography sx={{ textAlign: "center", color: "#7a869a", py: 6 }}>
                No users found
              </Typography>
            )}

            {!error &&
              filtered.map((user) => (
                <UserCard key={user.id} user={user} onToggle={openConfirm} />
              ))}
          </Box>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 2.5,
              mx: 2,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: 18, sm: 20 } }}>
            Confirm Status Change
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ fontSize: { xs: 14, sm: 15 }, color: "#555" }}>
              Are you sure you want to{" "}
              <strong>
                {selectedUser?.status === "active" ? "deactivate" : "activate"}
              </strong>{" "}
              user{" "}
              <strong style={{ color: "#2d5aa7" }}>
                {selectedUser?.full_name}
              </strong>
              ?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setConfirmOpen(false)}
              disabled={updating}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "#555",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleToggleStatus}
              disabled={updating}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                backgroundColor: "#2B5A9E",
                borderRadius: 1.5,
                px: 3,
                "&:hover": { backgroundColor: "#244a86" },
                "&:disabled": {
                  backgroundColor: "#a0b4d4",
                },
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
