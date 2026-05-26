import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 2;

  const filteredUsers =
    users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      user.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const indexOfLastUser =
    currentPage * usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage;

  const currentUsers =
    filteredUsers.slice(
      indexOfFirstUser,
      indexOfLastUser
    );

  const totalPages =
    Math.ceil(
      filteredUsers.length /
      usersPerPage
    );


  const [editingUser, setEditingUser] =
    useState(null);

  const [deleteUserId, setDeleteUserId] =
    useState(null);

  const [createError, setCreateError] =
    useState("");

  const [dashboardMessage, setDashboardMessage] =
    useState("");



  const [editForm, setEditForm] =
    useState({
      name: "",
      email: "",
      avatarUrl: "",
    });

  const [createForm, setCreateForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      let response;

      if (currentUser?.role === "admin") {

        response = await api.get(
          "/Users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data);

      } else {

        response = await api.get(
          "/Users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers([response.data]);
      }

    } catch (error) {

      console.error(error);

      if (!error.response) {

        setDashboardMessage(
          "Server unavailable. Please try again later."
        );

        return;
      }

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };

  const handleUpdateUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log(editForm);

      await api.put(
        `/Users/${id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingUser(null);

      fetchUsers();

    } catch (error) {
      console.error(error);

      setDashboardMessage(
        "Failed to update user"
      );
    }
  };

  const handleDeleteUser = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await api.delete(
        `/Users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (error) {
      console.error(error);

      alert("Delete failed");
    }
  };

  const handleToggleActive = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/Users/${id}/toggle-active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (error) {

      console.error(error);

      if (
        error.response?.data ===
        "You cannot deactivate yourself"
      ) {

        setDashboardMessage(
          "You cannot deactivate your own admin account"
        );

      } else {

        setDashboardMessage(
          "Failed to update user status"
        );

      }
    }
  };

  const handleToggleRole = async (id) => {
    try {

      const token = localStorage.getItem("token");

      await api.put(
        `/Users/${id}/toggle-role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();

    } catch (error) {
      console.error(error);

      setDashboardMessage(
        "Failed to update role"
      );
    }
  };

  const handleCreateUser = async () => {
    try {

      if (createForm.password.length < 6) {
        setCreateError(
          "Password must be at least 6 characters long"
        );

        return;
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

      if (!passwordRegex.test(createForm.password)) {

        setCreateError(
          "Password must contain at least one uppercase letter, one number and one special character"
        );

        return;
      }

      const token = localStorage.getItem("token");
      setCreateError("");

      await api.post(
        "/Auth/register",
        createForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCreateForm({
        name: "",
        email: "",
        password: "",
      });

      fetchUsers();

    } catch (error) {

      console.error(error);
      console.log(error.response?.data);

      if (
        error.response?.data ===
        "Email already exists"
      ) {

        setCreateError(
          "This email is already registered"
        );

      } else {

        setCreateError(
          "Failed to create user"
        );

      }
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Welcome, {currentUser?.name}
            </p>

            <p className="text-sm text-blue-600 mt-1">
              Role: {currentUser?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        <h2 className="text-2xl font-semibold mb-6">
          Users
        </h2>

        {
          dashboardMessage && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">

              {dashboardMessage}

            </div>
          )
        }

        {
          currentUser?.role === "admin" && (
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">

              <h3 className="text-xl font-bold mb-4">
                Create User
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                  type="text"
                  placeholder="Name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      name: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      email: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      password: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg"
                />


              </div>

              <button
                onClick={handleCreateUser}
                className="mt-4 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Create User
              </button>

              {
                createError && (
                  <p className="text-red-500 mt-4 font-medium">
                    {createError}
                  </p>
                )
              }

            </div>
          )
        }

        {
          currentUser?.role === "admin" && (
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {

                setSearch(e.target.value);

                setCurrentPage(1);

              }}
              className="w-full mb-6 p-3 border rounded-lg"
            />
          )
        }

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {
            currentUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >

                <div className="flex items-center gap-4 mb-4">

                  {
                    user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )
                  }

                  <div>

                    <h3 className="text-xl font-bold">
                      {user.name}
                    </h3>

                    <p className="text-gray-600">
                      {user.email}
                    </p>

                  </div>

                </div>


                <button
                  onClick={() => {
                    setEditingUser(user.id);

                    setEditForm({
                      name: user.name,
                      email: user.email,
                      avatarUrl: user.avatarUrl || "",
                    });
                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>

                {
                  editingUser === user.id && (
                    <div className="mt-4 space-y-3">

                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2"
                      />

                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {

                          const file = e.target.files[0];

                          if (!file) return;

                          const reader = new FileReader();

                          reader.onloadend = () => {

                            setEditForm((prev) => ({
                              ...prev,
                              avatarUrl: reader.result,
                            }));

                          };

                          reader.readAsDataURL(file);

                        }}
                        className="w-full border rounded-lg p-2"
                      />

                      {
                        editForm.avatarUrl && (
                          <img
                            src={editForm.avatarUrl}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 mx-auto"
                          />
                        )
                      }

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            handleUpdateUser(user.id)
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Save
                        </button>


                        {
                          currentUser?.role === "admin" && (
                            <button
                              onClick={() =>
                                handleToggleActive(user.id)
                              }
                              className={`px-4 py-2 rounded-lg text-white transition ${user.isActive
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-500 hover:bg-green-600"
                                }`}
                            >
                              {
                                user.isActive
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            </button>
                          )
                        }

                        {
                          currentUser?.role === "admin" && (
                            <button
                              onClick={() =>
                                setDeleteUserId(user.id)
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          )
                        }

                        {
                          currentUser?.role === "admin" && (
                            <button
                              onClick={() =>
                                handleToggleRole(user.id)
                              }
                              className={`px-4 py-2 rounded-lg text-white transition ${user.role === "admin"
                                ? "bg-purple-500 hover:bg-purple-600"
                                : "bg-indigo-500 hover:bg-indigo-600"
                                }`}
                            >
                              {
                                user.role === "admin"
                                  ? "Make User"
                                  : "Make Admin"
                              }
                            </button>
                          )
                        }

                      </div>

                    </div>
                  )
                }

                <p className="text-sm text-gray-500 mt-4">
                  Role: {user.role}
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  Role: {user.role}
                </p>

                <p
                  className={`text-sm font-medium mt-2 ${user.isActive
                    ? "text-green-600"
                    : "text-red-500"
                    }`}
                >
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </p>

              </div>
            ))
          }

        </div>

        {
          currentUser?.role === "admin" && (
            <div className="flex justify-center items-center gap-4 mt-8">

              <button
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <p>
                Page {currentPage} of {totalPages}
              </p>

              <button
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )
        }

      </div>

      {
        deleteUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

              <h2 className="text-2xl font-bold mb-4">
                Delete User
              </h2>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user?
              </p>

              <div className="flex justify-end gap-4">

                <button
                  onClick={() =>
                    setDeleteUserId(null)
                  }
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDeleteUser(deleteUserId);

                    setDeleteUserId(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Dashboard;