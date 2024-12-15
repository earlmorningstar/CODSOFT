import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading....</p>;
  if (!loading && orders.length === 0) {
    return <p>You have no orders yet.</p>;
  }
  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id}>
          <p>Order ID: {order._id}</p>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Status: {order.paymentStatus}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.products._id}>
                {item.product.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
