import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  assignRoleToUser,
  unassignRoleFromUser,
  assignPermissionToUser,
  unassignPermissionFromUser,
} from "../features/userSlice";
import { fetchRoles } from "../features/roleSlice";
import { fetchPermissions } from "../features/permissionSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);
  const { list: allRoles } = useSelector((state) => state.roles);
  const { list: allPermissions } = useSelector((state) => state.permissions);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [permsModalOpen, setPermsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [managingUser, setManagingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "" });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, name: form.name, email: form.email })).unwrap();
      } else {
        await dispatch(createUser(form)).unwrap();
      }
      setModalOpen(false);
      dispatch(fetchUsers());
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      await dispatch(deleteUser(deletingUser.id)).unwrap();
      setDeleteModalOpen(false);
      setDeletingUser(null);
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  const openRolesModal = (user) => {
    setManagingUser(user);
    setRolesModalOpen(true);
  };

  const openPermsModal = (user) => {
    setManagingUser(user);
    setPermsModalOpen(true);
  };

  const handleToggleRole = async (roleId, isAssigned) => {
    if (!managingUser) return;
    try {
      if (isAssigned) {
        await dispatch(unassignRoleFromUser({ userId: managingUser.id, roleId })).unwrap();
      } else {
        await dispatch(assignRoleToUser({ userId: managingUser.id, roleId })).unwrap();
      }
      dispatch(fetchUsers());
    } catch {
      // error handled by slice
    }
  };

  const handleTogglePermission = async (permissionId, isAssigned) => {
    if (!managingUser) return;
    try {
      if (isAssigned) {
        await dispatch(unassignPermissionFromUser({ userId: managingUser.id, permissionId })).unwrap();
      } else {
        await dispatch(assignPermissionToUser({ userId: managingUser.id, permissionId })).unwrap();
      }
      dispatch(fetchUsers());
    } catch {
      // error handled by slice
    }
  };

  const currentUserRoles = managingUser
    ? users.find((u) => u.id === managingUser.id)?.roles || []
    : [];
  const currentUserPerms = managingUser
    ? users.find((u) => u.id === managingUser.id)?.permissions || []
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content">Users</h2>
        <button className="btn btn-neutral btn-sm gap-2" onClick={openCreateModal}>
          <FiPlus /> Add User
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-base-content/70">
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <span className="loading loading-spinner loading-md" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/50">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id} className="hover">
                    <td className="font-mono text-sm">{i + 1}</td>
                    <td className="font-medium">{user.name}</td>
                    <td className="text-sm text-base-content/70">{user.email}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length > 0 ? (
                          user.roles.map((role) => (
                            <span key={role.id} className="badge badge-ghost badge-sm">
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-base-content/40">None</span>
                        )}
                        <button
                          className="badge badge-outline badge-sm cursor-pointer hover:badge-neutral"
                          onClick={() => openRolesModal(user)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions?.length > 0 ? (
                          user.permissions.map((perm) => (
                            <span key={perm.id} className="badge badge-ghost badge-sm">
                              {perm.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-base-content/40">None</span>
                        )}
                        <button
                          className="badge badge-outline badge-sm cursor-pointer hover:badge-neutral"
                          onClick={() => openPermsModal(user)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => openEditModal(user)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => {
                            setDeletingUser(user);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      <dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setModalOpen(false)}
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-4">
            {editingUser ? "Edit User" : "Create User"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Name</span></div>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Email</span></div>
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            {!editingUser && (
              <label className="form-control w-full">
                <div className="label"><span className="label-text">Password</span></div>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </label>
            )}
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-neutral" disabled={submitting}>
                {submitting ? <span className="loading loading-spinner loading-sm" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete User</h3>
          <p className="py-4 text-base-content/70">
            Are you sure you want to delete <strong>{deletingUser?.name}</strong>? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDelete} disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Manage Roles Modal */}
      <dialog className={`modal ${rolesModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setRolesModalOpen(false)}
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-1">Manage Roles</h3>
          <p className="text-sm text-base-content/60 mb-4">
            Toggle roles for <strong>{managingUser?.name}</strong>
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allRoles.length === 0 ? (
              <p className="text-sm text-base-content/50">No roles available</p>
            ) : (
              allRoles.map((role) => {
                const isAssigned = currentUserRoles.some((r) => r.id === role.id);
                return (
                  <label
                    key={role.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
                  >
                    <span className="text-sm font-medium">{role.name}</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={isAssigned}
                      onChange={() => handleToggleRole(role.id, isAssigned)}
                    />
                  </label>
                );
              })
            )}
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setRolesModalOpen(false)}>
              Done
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setRolesModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Manage Permissions Modal */}
      <dialog className={`modal ${permsModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setPermsModalOpen(false)}
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-1">Manage Permissions</h3>
          <p className="text-sm text-base-content/60 mb-4">
            Toggle permissions for <strong>{managingUser?.name}</strong>
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allPermissions.length === 0 ? (
              <p className="text-sm text-base-content/50">No permissions available</p>
            ) : (
              allPermissions.map((perm) => {
                const isAssigned = currentUserPerms.some((p) => p.id === perm.id);
                return (
                  <label
                    key={perm.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
                  >
                    <span className="text-sm font-medium">{perm.name}</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      checked={isAssigned}
                      onChange={() => handleTogglePermission(perm.id, isAssigned)}
                    />
                  </label>
                );
              })
            )}
          </div>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setPermsModalOpen(false)}>
              Done
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setPermsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
