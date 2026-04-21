import { useState } from "react"
import { createCategory } from "../../../services/categoryService"

export default function CategoryForm({ onCreated }: any) {
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    await createCategory(name)

    setName("")
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        placeholder="Nueva categoría"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 flex-1"
      />

      <button className="bg-primary text-white px-4 rounded">
        Agregar
      </button>
    </form>
  )
}