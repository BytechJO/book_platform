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
  FormControl,
  Select,
  MenuItem,
  Switch,
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
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
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
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flex: 1 }}
          >
            <Avatar src={user.avatar_url || ""} sx={{ width: 36, height: 36 }}>
              {!user.avatar_url && user.full_name?.charAt(0)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
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
                  color: "#555",
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Stack>

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const { users = [], loading, error, refetch } = useGetUsers();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const open = Boolean(anchorEl);

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  const filtered = useMemo(() => {
    let result = [...users];

    // 🔍 Search
    if (search) {
      result = result.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.role?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 👤 Role filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role?.toLowerCase() === roleFilter);
    }

    // 🟢 Status filter
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status?.toLowerCase() === statusFilter);
    }

    return result;
  }, [search, users, roleFilter, statusFilter]);
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
    return <CurveLoader />;
  }

  const EmptyState = ({ message }) => (
    <TableRow>
      <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#7a869a" }}>
        {message}
      </TableCell>
    </TableRow>
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginatedUsers = filtered.slice((page - 1) * perPage, page * perPage);
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
          width: "95%",
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 4,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 700,
              color: "#2B5A9E",
            }}
          >
            All Users
          </Typography>

          <Typography sx={{ fontSize: 14, color: "#7a869a" }}>
            Manage and explore your users
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // موبايل تحت بعض
              sm: "1fr 1fr", // تابلت
              md: "2fr 1fr 1fr 1fr",
            },
            gap: 2,
            mb: 3,
            alignItems: "end",
          }}
        >
          {/* Search */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Search
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
              }}
            />
          </Box>

          {/* Role */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Role
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <Typography variant="caption" sx={{ color: "#7a869a" }}>
              Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              sx={{
                height: 40,
                textTransform: "none",
                borderRadius: "6px",
                color: "#577DAE",
                borderColor: "#dfe3e8",
                "&:hover": {
                  backgroundColor: "#eef3fb",
                  borderColor: "#2B5A9E",
                },
              }}
            >
              ↻ Clear Filters
            </Button>
          </Box>
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
              backgroundColor: "#fff",
              borderRadius: "12px",
              p: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                <col style={{ width: "25%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
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
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
                    Joined On
                  </TableCell>
                  <TableCell sx={{ color: "#7a869a", fontSize: 15 }}>
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
                  paginatedUsers.map((c) => {
                    const isActive = c.status === "active";
                    return (
                      <TableRow
                        key={c.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafc" },
                        }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Avatar
                              src={c.avatar_url || ""}
                              sx={{ width: 32, height: 32 }}
                            >
                              {!c.avatar_url && c.full_name?.charAt(0)}
                            </Avatar>

                            <Typography sx={{ fontSize: 14 }}>
                              {c.full_name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#555", fontSize: 14 }}>
                          {c.email}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={roleLabel(c.role)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: 12,
                              borderRadius: "20px",
                              px: 1,
                              backgroundColor:
                                c.role === "student"
                                  ? "rgba(33,150,243,0.1)"
                                  : c.role === "teacher"
                                    ? "rgba(156,39,176,0.1)"
                                    : "rgba(76,175,80,0.1)",
                              color:
                                c.role === "student"
                                  ? "#2196F3"
                                  : c.role === "teacher"
                                    ? "#9C27B0"
                                    : "#4CAF50",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Switch
                              checked={c.status === "active"}
                              size="small"
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#2e7d32",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#2e7d32",
                                  },
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 500,
                                color:
                                  c.status === "active" ? "#2e7d32" : "#888",
                              }}
                            >
                              {c.status === "active" ? "Active" : "Inactive"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 14, color: "#555" }}>
                          {new Date(c.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleClick(e, c)}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                pt: 2,
                borderTop: "1px solid #eee",
              }}
            >
              {/* Left */}
              <Typography sx={{ fontSize: 12, color: "#777" }}>
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
                users
              </Typography>

              {/* Pagination */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Previous */}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  sx={{ minWidth: 32 }}
                >
                  {"<"}
                </Button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      size="small"
                      variant={p === page ? "contained" : "outlined"}
                      onClick={() => setPage(p)}
                      sx={{
                        minWidth: 32,
                        backgroundColor: p === page ? "#2B5A9E" : "transparent",
                        color: p === page ? "#fff" : "#2B5A9E",
                        borderColor: "#dfe3e8",
                      }}
                    >
                      {p}
                    </Button>
                  ),
                )}

                {/* Next */}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  sx={{ minWidth: 32 }}
                >
                  {">"}
                </Button>
              </Box>

              {/* Per Page */}
              <FormControl size="small">
                <Select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(e.target.value);
                    setPage(1); // 🔥 يرجع لأول صفحة
                  }}
                  sx={{
                    fontSize: 12,
                    borderRadius: "6px",
                    height: 32,
                  }}
                >
                  <MenuItem value={6}>6 per page</MenuItem>
                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={15}>15 per page</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: "10px",
              minWidth: 180,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
            View Details
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit User
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{ color: "#EF6C00" }}>
            <BlockIcon sx={{ mr: 1, fontSize: 18 }} />
            Deactivate
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{ color: "#D32F2F" }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete User
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
