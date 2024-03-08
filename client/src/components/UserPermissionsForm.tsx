import React, { useState, useEffect } from "react";
import "../css/UserPermissionForm.css";
interface ProductFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialUser?: any;
}

export default function UserPermissionsForm({
  onSubmit,
  onCancel,
  initialUser,
}: ProductFormProps) {
  const [productCreatePermission, setProductCreatePermission] =
    useState<boolean>(false);
  const [productUpdatePermission, setProductUpdatePermission] =
    useState<boolean>(false);

  useEffect(() => {
    if (initialUser) {
      // Check if user has the permissions
      setProductCreatePermission(
        initialUser.permissions.includes("product.create")
      );
      setProductUpdatePermission(
        initialUser.permissions.includes("product.update")
      );
    }
  }, [initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = "PUT";
      const url = `http://localhost:8000/api/users/permissions/${initialUser.id}`;
      const updatedPermissions = [];
      if (productCreatePermission) updatedPermissions.push("product.create");
      if (productUpdatePermission) updatedPermissions.push("product.update");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          permissions: updatedPermissions,
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        onSubmit(updatedUser);
        alert("Permissions updated successfully");
      } else {
        console.error("Failed to update permissions:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="user-permissions-form">
      <span className="close" onClick={onCancel}>
        &times;
      </span>
      <h2>{initialUser ? "Update" : "Create New"} User Permissions</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={productCreatePermission}
            onChange={() =>
              setProductCreatePermission(!productCreatePermission)
            }
          />
          Product Create
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={productUpdatePermission}
            onChange={() =>
              setProductUpdatePermission(!productUpdatePermission)
            }
          />
          Product Update
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
