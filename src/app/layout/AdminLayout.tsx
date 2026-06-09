import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-light">
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
            ☰
          </button>

          <h1 className="font-bold text-dark">Panel de Administración</h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
