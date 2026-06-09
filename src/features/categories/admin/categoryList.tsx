import { deleteCategory } from "../../../services/categoryService";

export default function CategoryList({ categories, onDeleted }: any) {
  if (!categories.length) {
    return (
      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-500">
          No hay categorías
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    onDeleted();
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">

      <div className="bg-secondary px-4 py-3 border-b">
        <h3 className="font-bold text-dark">
          Categorías registradas
        </h3>
      </div>

      <div className="divide-y">
        {categories.map((c: any) => (
          <div
            key={c.id}
            className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
          >
            <p className="font-medium text-dark">
              {c.name}
            </p>

            <button
              onClick={() => handleDelete(c.id)}
              className="font-medium text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}