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
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
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
  const [actionType, setActionType] = useState("status"); // status | delete
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [editLoading, setEditLoading] = useState(false);
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);

      await axiosInstance.patch(ENDPOINTS.USERS.DELETE(selectedUser.id));

      refetch();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };
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

  const openConfirm = (user, type = "status") => {
    setSelectedUser(user);
    setActionType(type);
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
          px: { xs: 2, sm: 1, md: 1 },
          py: { xs: 2, md: 1 },
          pl: { md: 2 },
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
                            <IOSSwitch checked={c.status === "active"} />

                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 500,
                                color:
                                  c.status === "active" ? "#34C759" : "#999",
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
          <DialogTitle>
            {actionType === "delete"
              ? "Confirm Deletion"
              : "Confirm Status Change"}
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ fontSize: { xs: 14, sm: 15 }, color: "#555" }}>
              Are you sure you want to{" "}
              <strong>
                {actionType === "delete"
                  ? "delete"
                  : selectedUser?.status?.toLowerCase() === "active"
                    ? "deactivate"
                    : "activate"}
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
              onClick={
                actionType === "delete" ? handleDeleteUser : handleToggleStatus
              }
              disabled={updating}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                backgroundColor:
                  actionType === "delete" ? "#D32F2F" : "#2B5A9E",
                borderRadius: 1.5,
                px: 3,
                "&:hover": {
                  backgroundColor:
                    actionType === "delete" ? "#b71c1c" : "#244a86",
                },
              }}
            >
              {updating
                ? "Updating..."
                : actionType === "delete"
                  ? "Delete"
                  : "Confirm"}
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
          <MenuItem
            onClick={() => {
              navigate(`/admin/users/${selectedUser.id}`);
              handleClose();
            }}
          >
            <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
            View
          </MenuItem>

          <MenuItem
            onClick={() => {
              const user = selectedUser;
              handleClose();

              setSelectedUser(user);
              setEditRole(user.role);
              setEditStatus(user.status);
              setEditOpen(true);
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Edit User
          </MenuItem>

          <MenuItem
            onClick={() => {
              const user = selectedUser; // 🔥 خزنه
              handleClose();
              openConfirm(user); // 🔥 استخدمه بعد الإغلاق
            }}
            sx={{
              color: selectedUser?.status === "active" ? "#EF6C00" : "#2e7d32",
            }}
          >
            {selectedUser?.status === "active" ? (
              <>
                <BlockIcon sx={{ mr: 1, fontSize: 18 }} />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 18 }} />
                Activate
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              const user = selectedUser;
              handleClose();
              openConfirm(user, "delete"); // نستخدم نفس الديالوج
            }}
            sx={{ color: "#D32F2F" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            Delete User
          </MenuItem>
        </Menu>
        <Box
          sx={{
            mt: "auto",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: "#9ca3af",
              letterSpacing: 0.5,
            }}
          >
            alrowadpub.com
          </Typography>
        </Box>
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: "#2B5A9E" }}>
            Edit User
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={selectedUser?.avatar_url}
                  sx={{ width: 46, height: 46 }}
                >
                  {!selectedUser?.avatar_url &&
                    selectedUser?.full_name?.charAt(0)}
                </Avatar>

                <Box>
                  <Typography fontWeight={600}>
                    {selectedUser?.full_name}
                  </Typography>
                  <Typography fontSize={13} color="#7a869a">
                    {selectedUser?.email}
                  </Typography>
                </Box>
              </Box>

              <FormControl fullWidth>
                <Typography sx={{ fontSize: 13, mb: 0.5, color: "#7a869a" }}>
                  Role
                </Typography>

                <Select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                }}
              >
                <Box>
                  <Typography fontWeight={600}>User Status</Typography>
                  <Typography fontSize={13} color="#7a869a">
                    {editStatus === "active"
                      ? "User can access the platform"
                      : "User is blocked"}
                  </Typography>
                </Box>

                <IOSSwitch
                  checked={editStatus === "active"}
                  onChange={(e) =>
                    setEditStatus(e.target.checked ? "active" : "inactive")
                  }
                />
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditOpen(false)} disabled={editLoading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={editLoading}
              onClick={async () => {
                try {
                  setEditLoading(true);

                  await axiosInstance.put(
                    ENDPOINTS.USERS.UPDATE(selectedUser.id),
                    {
                      role: editRole,
                      status: editStatus,
                    },
                  );

                  refetch();
                  setEditOpen(false);
                } catch (err) {
                  console.error(err);
                } finally {
                  setEditLoading(false);
                }
              }}
              sx={{
                backgroundColor: "#2B5A9E",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
              }}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

import { styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 40,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#34C759", // 🔥 نفس لون الآيفون
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 22,
    backgroundColor: "#E5E5EA", // 🔥 رمادي فاتح مثل iOS
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 300,
    }),
  },
}));
