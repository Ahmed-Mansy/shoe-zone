// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';

// const AdminUserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [editUser, setEditUser] = useState(null); // null or user object
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/users/crud/users');
//       setUsers(response.data);
//     } catch (error) {
//       toast.error("Failed to load users");
//     }
//   };

//   const handleEdit = (user) => {
//     setEditUser(user);
//     setFormData({
//       username: user.username,
//       email: user.email,
//     });
//   };
  
//   const handleUpdate = async () => {
//     try {
//       await axios.put(`http://127.0.0.1:8000/api/users/crud/users/${editUser.id}/`, formData);
//       toast.success("User updated successfully");
//       fetchUsers();
//       setEditUser(null);
//     } catch (error) {
//       toast.error("Failed to update user");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/users/crud/users/${id}/`);
//       toast.success("User deleted successfully");
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to delete user");
//     }
//   };

//   const handleToggleActive = async (user) => {
//     try {
//       await axios.patch(`http://127.0.0.1:8000/api/users/crud/users/${user.id}/`, {
//         is_active: !user.is_active,
//       });
//       toast.success(`User ${user.is_active ? 'blocked' : 'unblocked'} successfully`);
//       fetchUsers();
//     } catch (error) {
//       toast.error("Failed to update user status");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">User Management</h2>

//       {editUser && (
//         <div className="my-4 p-4 border rounded bg-gray-100">
//           <h3 className="font-bold mb-2">Edit User: {editUser.username}</h3>
//           <input
//             type="text"
//             placeholder="Username"
//             value={formData.username}
//             onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             className="border p-2 rounded w-1/2 mb-2"
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className="border p-2 rounded w-1/2 mb-2 ml-4"
//           />
//           <div className="mt-2 space-x-2">
//             <button onClick={handleUpdate} className="btn btn-primary px-4 py-1">Update</button>
//             <button onClick={() => setEditUser(null)} className="btn btn-danger px-4 py-1">Cancel</button>
//           </div>
//         </div>
//       )}

//       <table className="table-auto w-full bg-white shadow-md rounded">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Username</th>
//             <th className="p-2">Email</th>
//             <th className="p-2">Active</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.id} className="text-center border-t">
//               <td className="p-2">{user.username}</td>
//               <td className="p-2">{user.email}</td>
//               <td className="p-2">{user.is_active ? '✅' : '❌'}</td>
//               <td className="p-2 space-x-2">
//                 <button
//                   onClick={() => handleEdit(user)}
//                   className="btn btn-primary px-4 py-1 mx-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleToggleActive(user)}
//                   className={'btn btn-warning px-4 py-1 mx-2'}
//                 >   
//                   {user.is_active ? 'Block' : 'Unblock'}
//                 </button>
                
//                 <button
//                   onClick={() => handleDelete(user.id)}
//                   className=" btn btn-danger px-4 py-1 mx-2"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <ToastContainer position="top-left" autoClose={3000} />
//     </div>
//   );
// };

// export default AdminUserManagement;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    is_staff: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/crud/users');
      // const filteredUsers = response.data.filter(user => user.is_superuser===false) // without superuser
      const sortedUsers=  response.data.sort((a, b) => a.id - b.id);     
      setUsers(sortedUsers);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      is_staff: !!user.is_staff,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/users/crud/users/${editUser.id}/`, formData);
      toast.success("User updated successfully");
      fetchUsers();
      setEditUser(null);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/crud/users/${id}/`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/users/crud/users/${user.id}/`, {
        is_active: !user.is_active,
      });
      toast.success(`User ${user.is_active ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="container p-6 mb-5">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {editUser && (
        <div className="w-75 my-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Edit User: {editUser.username}</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Username"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border p-2 rounded w-1/3 mx-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 rounded w-1/3 mx-2"
            />
            <label className="flex items-center space-x-2 mx-2">
              <input
                type="checkbox"
                checked={!!formData.is_staff}
                onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
              />
              <span>Is Staff</span>
            </label>
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handleUpdate} className="btn btn-primary px-4 py-1 mx-2">Update</button>
            <button onClick={() => setEditUser(null)} className="btn btn-danger px-4 py-1 mx-2">Cancel</button>
          </div>
        </div>
      )}

      <table className="min-w-full shadow-md rounded border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Is Staff</th>
            <th className="p-3 text-center">Is Active</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t text-center hover:bg-gray-50">
              <td className="p-2 text-left">{user.username}</td>
              <td className="p-2 text-left">{user.email}</td>
              <td className="p-2">{user.is_staff ? '✅' : '❌'}</td>
              <td className="p-2">{user.is_active ? '✅' : '❌'}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="btn btn-primary px-4 py-1 mx-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(user)}
                  className="btn btn-warning px-4 py-1 mx-2"
                >
                  {user.is_active ? 'Block' : 'Unblock'}
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn-danger px-4 py-1 mx-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-left" autoClose={3000} />
    </div>
  );
};

export default AdminUserManagement;
