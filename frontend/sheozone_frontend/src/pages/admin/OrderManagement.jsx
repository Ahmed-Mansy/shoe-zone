import { useEffect, useState } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/orders/crud/orders/"
      );
      const sortedres = res.data.sort((a, b) => a.id - b.id);
      setOrders(Array.isArray(sortedres) ? sortedres : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/orders/crud/orders/${id}/`, {
        status,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/crud/orders/${id}/`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const statuses = ["all", "pending", "shipped", "delivered"];

  return (
    // <div className="container p-4  ">
    //   <h2 className="text-xl font-bold mb-4">Order Management</h2>

    //   {/* Status Tabs */}
    //   <div className="container text-center">
    //     <div className="btn-group mb-2 mt-4 w-50 shadow">
    //       {statuses.map((status) => (
    //         <button
    //           key={status}
    //           onClick={() => setSelectedStatus(status)}
    //           className={`btn ${
    //             selectedStatus === status ? "btn-primary" : "bg-white border"
    //           }`}>
    //           {status.charAt(0).toUpperCase() + status.slice(1)}
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Orders Table */}
    //   <div className=" container d-flex align-items-center justify-content-center ">
    //     <table className="w-75 border m-5 rounded-lg shadow-lg p-4 text-center">
    //       <thead>
    //         <tr className="border">
    //           <th>ID</th>
    //           <th>User</th>
    //           <th>Status</th>
    //           <th>Total</th>
    //           <th>Change</th>
    //           <th>Delete</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {filteredOrders.map((order) => (
    //           <tr key={order.id} className="border">
    //             <td>{order.id}</td>
    //             <td>{order.user}</td>
    //             <td>{order.status}</td>
    //             <td>${order.total_price}</td>
    //             <td>
    //               <select
    //                 value={order.status}
    //                 onChange={(e) => updateStatus(order.id, e.target.value)}>
    //                 <option value="pending">Pending</option>
    //                 <option value="shipped">Shipped</option>
    //                 <option value="delivered">Delivered</option>
    //               </select>
    //             </td>
    //             <td>
    //               <button
    //                 onClick={() => deleteOrder(order.id)}
    //                 className="btn btn-danger">
    //                 Delete
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    <div className="wrapper py-8">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      {/* Status Tabs */}
      <div className="text-center">
        <div className="inline-flex mb-4 mt-4 w-1/2 shadow rounded overflow-hidden">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex-1 px-4 py-2 text-sm font-semibold cursor-pointer ${
                selectedStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex items-center justify-center mt-6">
        <table className="w-3/4 border rounded-lg shadow-lg p-4 text-center bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 border">ID</th>
              <th className="py-3 border">User</th>
              <th className="py-3 border">Status</th>
              <th className="py-3 border">Total</th>
              <th className="py-3 border">Change</th>
              <th className="py-3 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border">
                <td className="py-2 border">{order.id}</td>
                <td className="py-2 border">{order.user}</td>
                <td className="py-2 border">{order.status}</td>
                <td className="py-2 border">${order.total_price}</td>
                <td className="py-2 border">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="py-2 border">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
