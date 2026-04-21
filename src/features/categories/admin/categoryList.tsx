import { deleteCategory } from "../../../services/categoryService"

export default function CategoryList({ categories, onDeleted }: any) {
  if (!categories.length) return <p>No hay categorías</p>

  const handleDelete = async (id: string) => {
    await deleteCategory(id)
    onDeleted()
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((c: any) => (
        <div
          key={c.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <p>{c.name}</p>

          <button
            onClick={() => handleDelete(c.id)}
            className="text-red-500"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}