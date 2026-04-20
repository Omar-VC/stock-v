import { useLocation, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebase"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
} from "lucide-react"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

export default function Sidebar({ open, setOpen }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <aside
      className={`
        fixed md:static top-0 left-0 z-50
        h-screen w-64 bg-dark text-white
        flex flex-col
        transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* HEADER */}
      <div className="p-4 font-bold text-lg border-b border-white/10">
        Santa Julia
      </div>

      {/* NAV */}
      <nav className="flex flex-col flex-1 p-4 gap-2 text-sm">

        <button
          onClick={() => goTo("/admin/dashboard")}
          className={`flex items-center gap-2 p-2 rounded text-left
            ${isActive("/admin/dashboard") ? "bg-white/10" : ""}
          `}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          onClick={() => goTo("/admin/products")}
          className={`flex items-center gap-2 p-2 rounded text-left
            ${isActive("/admin/products") ? "bg-white/10" : ""}
          `}
        >
          <Package size={18} />
          Productos
        </button>

        <button
          onClick={() => goTo("/admin/sales")}
          className={`flex items-center gap-2 p-2 rounded text-left
            ${isActive("/admin/sales") ? "bg-white/10" : ""}
          `}
        >
          <ShoppingCart size={18} />
          Ventas
        </button>

        {/* SALIR ABAJO */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded w-full"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>

      </nav>
    </aside>
  )
}