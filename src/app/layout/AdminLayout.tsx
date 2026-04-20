import { Outlet, Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebase"

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-dark text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Panel Santa Julia</h1>

        <nav className="flex gap-4 text-sm items-center">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Productos</Link>
          <Link to="/admin/sales">Ventas</Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Salir
          </button>
        </nav>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}