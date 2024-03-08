import { useEffect, useState } from "react";
import Table from "../components/Table";
import UserPermissionsForm from "../components/UserPermissionsForm";
import { useNavigate } from "react-router-dom";
import { User } from "../types/user";

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [showUserPermissionsForm, setShowUserPermissionsForm] = useState(false);
  const [initialUser, setInitialUser] = useState<any>();
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:8000/api/users/me", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => {
          alert(error.message);
        });
    }

    fetch("http://localhost:8000/api/users", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.roles !== "super admin") {
      console.log(currentUser?.roles);
      navigate("/");
    }
  }, [currentUser, navigate]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "roles",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: (_column: any, row: any) => (
        <ul>
          {row.permissions.map((permission: any, index: number) => (
            <li key={index}>{permission}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_column: any, row: any) => (
        <>
          <button onClick={() => handleOpenPermissionsForm(row)}>
            Update permissions
          </button>
        </>
      ),
    },
  ];

  const handleOpenPermissionsForm = (row: any) => {
    setShowUserPermissionsForm(true);
    setInitialUser(row);
  };

  const handlePermissionsUpdate = (updatedUser: any) => {
    const updatedUsers = users.map((user) => {
      if (user.id === updatedUser.id) {
        return updatedUser;
      } else {
        return user;
      }
    });
    setUsers(updatedUsers);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Super Admin Page</h1>
      <button onClick={() => navigate("/")} style={{ marginBottom: "10px" }}>
        Back to home page
      </button>
      {showUserPermissionsForm && (
        <UserPermissionsForm
          onSubmit={handlePermissionsUpdate}
          onCancel={() => setShowUserPermissionsForm(false)}
          initialUser={initialUser}
        />
      )}
      <Table columns={columns} data={users} />
    </div>
  );
}
