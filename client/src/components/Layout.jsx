import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiUsers, FiShield, FiKey, FiLogOut, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { logout } from "../features/authSlice";

const navItems = [
  { to: "/users", label: "Users", icon: FiUsers },
  { to: "/roles", label: "Roles", icon: FiShield },
  { to: "/permissions", label: "Permissions", icon: FiKey },
];

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => navigate("/login"));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
          <FiShield className="text-2xl text-gray-300" />
          <span className="text-xl font-bold tracking-wide">RBAC Panel</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? "bg-[var(--sidebar-active)] text-white"
                  : "text-gray-400 hover:bg-[var(--sidebar-hover)] hover:text-white"
                }`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
              text-gray-400 hover:bg-[var(--sidebar-hover)] hover:text-white transition-colors"
          >
            {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="text-gray-300 font-medium truncate">{user?.name || "User"}</p>
              <p className="truncate">{user?.email || ""}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b border-base-300 bg-base-100">
          <button
            className="lg:hidden btn btn-ghost btn-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="text-xl" />
          </button>
          <h1 className="text-lg font-semibold text-base-content">Dashboard</h1>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-base-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
