import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  fetchRoles,
  fetchUserRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../features/roleSlice";

export default function Roles() {
  const dispatch = useDispatch();
  const {
    list: roles,
    userRoles,
    loading,
  } = useSelector((state) => state.roles);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchUserRoles());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingRole(null);
    setName("");
    setModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setName(role.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRole) {
        await dispatch(updateRole({ id: editingRole.id, name })).unwrap();
      } else {
        await dispatch(createRole({ name })).unwrap();
      }
      setModalOpen(false);
      dispatch(fetchRoles());
      dispatch(fetchUserRoles());
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    setSubmitting(true);
    try {
      await dispatch(deleteRole(deletingRole.id)).unwrap();
      setDeleteModalOpen(false);
      setDeletingRole(null);
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content">Roles</h2>
        <button
          className="btn btn-neutral btn-sm gap-2"
          onClick={openCreateModal}
        >
          <FiPlus /> Add Role
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-base-content/70">
                <th>#</th>
                <th>Name</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <span className="loading loading-spinner loading-md" />
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-base-content/50"
                  >
                    No roles found
                  </td>
                </tr>
              ) : (
                roles.map((role, i) => {
                  const assignedUsers = userRoles.filter(
                    (ur) => ur.role_name === role.name,
                  );
                  return (
                    <tr key={role.id} className="hover">
                      <td className="font-mono text-sm">{i + 1}</td>
                      <td className="font-medium">{role.name}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {assignedUsers.length === 0 ? (
                            <span className="text-base-content/40 text-sm">
                              —
                            </span>
                          ) : (
                            assignedUsers.map((ur) => (
                              <span
                                key={ur.user_name}
                                className="badge badge-ghost badge-sm"
                              >
                                {ur.user_name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => openEditModal(role)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => {
                              setDeletingRole(role);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      <dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setModalOpen(false)}
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-4">
            {editingRole ? "Edit Role" : "Create Role"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Role Name</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. admin, editor, viewer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-neutral"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Save"
                )}
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
          <h3 className="font-bold text-lg">Delete Role</h3>
          <p className="py-4 text-base-content/70">
            Are you sure you want to delete{" "}
            <strong>{deletingRole?.name}</strong>? This will unassign it from
            all users.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
