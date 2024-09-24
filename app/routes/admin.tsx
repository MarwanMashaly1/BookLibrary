// app/routes/admin.tsx
import { Outlet, Link, useLocation } from "@remix-run/react";

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-gray-300 text-black"
      : "text-gray-600 hover:bg-gray-400 hover:text-white";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 rounded-lg ${isActive(
                    "/admin"
                  )}`}
                >
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-2 rounded-lg ${isActive(
                    "/admin/users"
                  )}`}
                >
                  <span className="ml-3">Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/books"
                  className={`flex items-center px-4 py-2 rounded-lg ${isActive(
                    "/admin/books"
                  )}`}
                >
                  <span className="ml-3">Books</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
