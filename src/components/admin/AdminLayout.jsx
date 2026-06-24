import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-obsidian font-body">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-6 py-8 pt-20 lg:px-8 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
