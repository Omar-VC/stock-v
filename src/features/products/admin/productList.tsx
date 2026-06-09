export default function ProductList({
  products,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">

      <div className="bg-secondary px-4 py-3 border-b">
        <h3 className="font-bold text-dark">
          Productos registrados
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left hidden md:table-cell">Categoría</th>
              <th className="p-2 text-left hidden md:table-cell">Detalle</th>
              <th className="p-2 text-left hidden md:table-cell">Compra</th>
              <th className="p-2 text-left">Venta</th>
              <th className="p-2 text-left hidden md:table-cell">Ganancia</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any) => {
              const gain = p.salePrice - p.costPrice

              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">

                  <td className="p-2 font-medium text-dark">
                    {p.name}
                  </td>

                  <td className="p-2 text-gray-600 hidden md:table-cell">
                    {p.category || "-"}
                  </td>

                  <td className="p-2 text-gray-700 hidden md:table-cell">
                    {p.variant || "-"}
                  </td>

                  <td className="p-2 hidden md:table-cell">
                    ${p.costPrice}
                  </td>

                  <td className="p-2 font-bold text-green-700">
                    ${p.salePrice}
                  </td>

                  <td className="p-2 text-green-600 hidden md:table-cell">
                    ${gain}
                  </td>

                  <td className="p-2 font-semibold">
                    {p.stock === 0 ? (
                      <span className="text-red-700 font-bold">0</span>
                    ) : (
                      <span className={p.stock <= 5 ? "text-red-600" : "text-dark"}>
                        {p.stock}
                      </span>
                    )}
                  </td>

                  <td className="p-2">
                    <div className="flex flex-col gap-1 md:flex-row md:gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-left md:text-center text-dark font-medium hover:text-primaryHover"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-left md:text-center text-red-600 font-medium hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>

                </tr>
              )
            })}
          </tbody>

        </table>
      </div>

    </div>
  )
}