import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../features/permissionSlice";

export default function Permissions() {
  const dispatch = useDispatch();
  const { list: permissions, loading } = useSelector((state) => state.permissions);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState(null);
  const [deletingPerm, setDeletingPerm] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingPerm(null);
    setName("");
    setModalOpen(true);
  };

  const openEditModal = (perm) => {
    setEditingPerm(perm);
    setName(perm.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPerm) {
        await dispatch(updatePermission({ id: editingPerm.id, name })).unwrap();
      } else {
        await dispatch(createPermission({ name })).unwrap();
      }
      setModalOpen(false);
      dispatch(fetchPermissions());
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deletingPerm) return;
    setSubmitting(true);
    try {
      await dispatch(deletePermission(deletingPerm.id)).unwrap();
      setDeleteModalOpen(false);
      setDeletingPerm(null);
    } catch {
      // error handled by slice
    }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-base-content">Permissions</h2>
        <button className="btn btn-neutral btn-sm gap-2" onClick={openCreateModal}>
          <FiPlus /> Add Permission
        </button>
      </div>

      <div className="card bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-base-content/70">
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <span className="loading loading-spinner loading-md" />
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-base-content/50">
                    No permissions found
                  </td>
                </tr>
              ) : (
                permissions.map((perm, i) => (
                  <tr key={perm.id} className="hover">
                    <td className="font-mono text-sm">{i + 1}</td>
                    <td className="font-medium">{perm.name}</td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => openEditModal(perm)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => {
                            setDeletingPerm(perm);
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

      {/* Create/Edit Permission Modal */}
      <dialog className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setModalOpen(false)}
          >
            <FiX />
          </button>
          <h3 className="font-bold text-lg mb-4">
            {editingPerm ? "Edit Permission" : "Create Permission"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label"><span className="label-text">Permission Name</span></div>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. view_user, create_role"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
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
          <h3 className="font-bold text-lg">Delete Permission</h3>
          <p className="py-4 text-base-content/70">
            Are you sure you want to delete <strong>{deletingPerm?.name}</strong>? This will unassign it from all roles and users.
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
    </div>
  );
}
