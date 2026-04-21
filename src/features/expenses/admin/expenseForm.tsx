import { useState, useEffect } from "react"
import { createExpense, updateExpense } from "../../../services/expenseService"

export default function ExpenseForm({
  onSaved,
  editingExpense,
  setEditingExpense,
}: any) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  })

  useEffect(() => {
    if (editingExpense) {
      setForm({
        description: editingExpense.description || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "",
        date: editingExpense.date || "",
      })
    }
  }, [editingExpense])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const data = {
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      createdAt: new Date().toISOString(),
    }

    if (editingExpense?.id) {
      await updateExpense(editingExpense.id, data)
      setEditingExpense(null)
    } else {
      await createExpense(data)
    }

    setForm({
      description: "",
      amount: "",
      category: "",
      date: "",
    })

    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <input
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Monto"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="p-2 border rounded"
      />

      <input
        placeholder="Categoría"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="p-2 border rounded"
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded"
      >
        {editingExpense ? "Actualizar" : "Guardar"}
      </button>
    </form>
  )
}