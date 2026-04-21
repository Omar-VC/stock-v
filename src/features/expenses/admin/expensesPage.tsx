import { useEffect, useState } from "react"
import ExpenseForm from "./expenseForm"
import ExpenseList from "./expenseList"
import {
  getExpenses,
  deleteExpense,
} from "../../../services/expenseService"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [editingExpense, setEditingExpense] = useState<any>(null)

  const loadExpenses = async () => {
    const data = await getExpenses()
    setExpenses(data)
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteExpense(id)
    loadExpenses()
  }

  // 👉 cálculo total
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Gastos</h2>

      {/* TOTAL */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">Total gastos</p>
        <p className="text-lg font-bold">${total}</p>
      </div>

      <ExpenseForm
        onSaved={loadExpenses}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />

      <ExpenseList
        expenses={expenses}
        onDelete={handleDelete}
        onEdit={setEditingExpense}
      />
    </div>
  )
}