import { Outlet, Link } from "react-router-dom"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #ffb2f1, #feebb9, #fedcc7)"
      }}
    >

      <header
        style={{ background: "#2e1f21" }}
        className="text-white p-4 flex justify-between items-center"
      >
        <h1 className="text-xl font-bold">Santa Julia</h1>

        <Link
          to="/login"
          className="text-sm underline hover:text-gray-300"
        >
          Admin
        </Link>
      </header>

      <main className="p-6 max-w-6xl mx-auto flex-1">
        <Outlet />
      </main>

    </div>
  )
}