import { Outlet, Link } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-light">

      <header className="bg-dark text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Santa Julia</h1>

        <Link
          to="/login"
          className="text-sm underline hover:text-gray-300"
        >
          Admin
        </Link>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}