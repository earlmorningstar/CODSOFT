import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import api from "../utils/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Backdrop,
  Alert,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  Cancel,
} from "@mui/icons-material";
import { format } from "date-fns";
import { IoChevronBackOutline } from "react-icons/io5";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`api/orders/${orderId}`);
        setOrders(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "shipped":
        return <LocalShipping sx={{ color: "info.main" }} />;
      case "delivered":
        return <CheckCircle sx={{ color: "success.main" }} />;
      case "pending":
        return <Schedule sx={{ color: "warning.main" }} />;
      case "failed":
        return <Cancel sx={{ color: "error.main" }} />;
      default:
        return <Schedule sx={{ color: "warning.main" }} />;
    }
  };

  if (loading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#6055d8", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Order not found
      </Alert>
    );
  }

  return (
    <section>
      <div className="usermenuPages-title-container">
        <NavLink to="/order">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>
      <p className="userMenu-header" id="order-txt-cntr">
        Order Details
      </p>

      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <span className="order-id">Order #{order.orderNumber}</span>
            <p className="order-placed-date">
              Placed on {format(new Date(order.createdAt), "PPP")}
            </p>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: "right" } }}>
            <Chip
              icon={getStatusIcon(order.paymentStatus)}
              label={order.paymentStatus}
              color={
                order.paymentStatus === "delivered" ? "success" : "primary"
              }
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Divider sx={{ my: 2 }} />
              {order.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          style={{ width: "100%", borderRadius: "4px" }}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/150"
                          alt={item.product.title}
                          style={{ width: "100%", borderRadius: "4px" }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        {item.product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal</Typography>
                <Typography>${order.totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  ${order.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};

export default OrderDetailsPage;
