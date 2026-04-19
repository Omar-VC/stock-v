import { Outlet, Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebase"
import { useNavigate } from "react-router-dom"

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
//donde tengo que poner el boton de salir? 
  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-black text-white p-4 flex gap-4">
        <h1 className="font-bold">Santa Julia</h1>

        <nav className="flex gap-4">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/products">Productos</Link>
          <Link to="/admin/sales">Ventas</Link>
        </nav>
        <button onClick={handleSignOut} className="text-white hover:text-gray-300">
          Salir
        </button>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}