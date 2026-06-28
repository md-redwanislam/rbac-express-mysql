import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FiShield, FiMail, FiLock } from "react-icons/fi";
import { login, clearError } from "../features/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (token) return <Navigate to="/users" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4" data-theme="dark">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              <FiShield className="text-3xl text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-base-content">RBAC Admin</h2>
            <p className="text-sm text-base-content/60">Sign in to manage access control</p>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-3 w-full">
              <FiMail className="text-base-content/40" />
              <input
                type="email"
                placeholder="Email address"
                className="grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-3 w-full">
              <FiLock className="text-base-content/40" />
              <input
                type="password"
                placeholder="Password"
                className="grow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-neutral w-full"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
