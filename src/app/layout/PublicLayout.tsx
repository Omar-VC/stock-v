import { Outlet, Link } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      
      <header className="border-b p-4 flex justify-between">
        <h1 className="font-bold text-xl">Santa Julia</h1>

        <Link to="/login" className="text-sm underline">
          Admin
        </Link>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}