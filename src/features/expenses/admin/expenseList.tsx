export default function ExpenseList({ expenses, onDelete, onEdit }: any) {
  if (!expenses.length) return <p>No hay gastos cargados</p>

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((e: any) => (
        <div
          key={e.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{e.description}</p>
            <p className="text-sm text-gray-500">{e.category}</p>
            <p className="text-sm text-gray-500">{e.date}</p>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-bold">${e.amount}</p>

            <button
              onClick={() => onEdit(e)}
              className="text-blue-500"
            >
              Editar
            </button>

            <button
              onClick={() => onDelete(e.id)}
              className="text-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}