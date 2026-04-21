import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"

import AdminLayout from "./layout/AdminLayout"
import PublicLayout from "./layout/PublicLayout"

import Login from "../features/auth/login"
import Dashboard from "../features/dashboard/dashboardPage"
import ProductsPage from "../features/products/admin/productsPage"
import CatalogPage from "../features/products/public/catalogPage"
import SalesPage from "../features/sales/salesPage"
import ExpensesPage from "../features/expenses/admin/expensesPage" // 👈 NUEVO

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "expenses", // 👈 NUEVO
        element: <ExpensesPage />,
      },
    ],
  },
])