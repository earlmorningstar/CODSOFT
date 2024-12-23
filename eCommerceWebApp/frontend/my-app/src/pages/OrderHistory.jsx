import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import { format } from "date-fns";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Pagination,
  Backdrop,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  Inventory as PackageIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
  Cancel as CancelIcon,
  LocalShipping,
  CheckCircle,
} from "@mui/icons-material";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const statusInfo = {
    pending: {
      icon: <ClockIcon sx={{ color: "warning.main" }} />,
      text: "Order received and pending processing",
      color: "warning.light",
    },
    paid: {
      icon: <CheckIcon sx={{ color: "success.main" }} />,
      text: "Payment completed successfully",
      color: "success.light",
    },
    failed: {
      icon: <CancelIcon sx={{ color: "error.main" }} />,
      text: "Failed to make payment",
      color: "error.light",
    },
    succeeded: {
      icon: <ShippingIcon sx={{ color: "secondary.main" }} />,
      text: "Order succeded and is being processed",
      color: "secondary.light",
    },
    shipped: {
      icon: <LocalShipping sx={{ color: "info.main" }} />,
      text: "Order has been shipped",
      color: "info.light",
    },
    delivered: {
      icon: <CheckCircle sx={{ color: "success.main" }} />,
      text: "Order has been delivered",
      color: "success.light",
    },
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `/api/orders/get-orders`;

      const params = {
        page: currentPage,
      };

      //filter params
      if (filter === "recent") {
        const thirthDaysAgo = new Date();
        thirthDaysAgo.setDate(thirthDaysAgo.getDate() - 30);
        params.startDate = thirthDaysAgo.toISOString();
      } else if (filter === "processing") {
        params.status = "processing,shipped";
      } else if (filter === "completed") {
        params.status = "delivered";
      }

      const response = await api.get(url, { params });
      const { orders, pagination } = response.data.data;
      setOrders(orders);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      setError(error.response?.data?.message || "failed to fetch orders");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusInfo = (status) => {
    const normalisedStatus = status?.toLowerCase?.();
    if (!normalisedStatus || !statusInfo[normalisedStatus]) {
      console.warn(`Unknown status: ${status}`);
      return {
        icon: <CancelIcon sx={{ color: "error.main" }} />,
        text: "Unknown order status",
        color: "grey.300",
      };
    }
    return statusInfo[normalisedStatus];
  };

  const getOrderProgress = (status) => {
    const stages = ["pending", "processing", "shipped", "delivered"];
    const normalisedStatus = status?.toLowerCase();
    if (normalisedStatus === "canceled" || !stages.includes(normalisedStatus)) {
      return 0;
    }
    const currentIndex = stages.indexOf(normalisedStatus);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
    setLoading(false);
  };

  if (loading)
    return (
      <Backdrop
        open={loading}
        sx={{
          color: "#6055d8",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <section className="user-profile-main-container">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <span className="userMenu-header">My Orders</span>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filter Orders</InputLabel>
          <Select
            value={filter}
            label="Filter Orders"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Orders</MenuItem>
            <MenuItem value="recent">Last 30 Days</MenuItem>
            <MenuItem value="processing">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {orders.length === 0 ? (
        <Box textAlign="center" py={4}>
          <PackageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6">No orders found</Typography>
          <Typography color="text.secondary">
            When you place orders, they will appear here
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {orders.map((order) => {
            const statusInfoData = getStatusInfo(order.paymentStatus) || {
              icon: <CancelIcon sx={{ color: "error.main" }} />,
              text: "Unknown order status",
              color: "error.light",
            };

            return (
              <NavLink
                to={`/orders/${order.id}`}
                key={order.id}
                style={{ textDecoration: "none" }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    "&:hover": {
                      boxShadow: 3,
                      cursor: "pointer",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="start"
                        >
                          <Box>
                            <span className="order-id">
                              Order #{order.orderNumber}
                            </span>
                            <p className="order-placed-date">
                              Placed on{" "}
                              {format(new Date(order.createdAt), "PPP")}
                            </p>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              bgcolor: statusInfoData.color,
                              px: 1,
                              py: 1,
                              borderRadius: 2,
                            }}
                          >
                            {statusInfoData.icon}
                            <Typography variant="body2" fontWeight="medium">
                              {order.paymentStatus}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {order.paymentStatus !== "failed" && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2 }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mb={1}
                            >
                              <h5 className="order-status">
                                {statusInfoData.text}
                              </h5>
                              <Typography variant="body2" color="primary">
                                {getOrderProgress(order.paymentStatus)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={getOrderProgress(order.paymentStatus)}
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </NavLink>
            );
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      )}
    </section>
  );
};

export default OrderHistory;
