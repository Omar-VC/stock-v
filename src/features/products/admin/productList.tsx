export default function ProductList({
  products,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Producto</th>
            <th className="p-2">Detalle</th>
            <th className="p-2">Compra</th>
            <th className="p-2">Venta</th>
            <th className="p-2">Ganancia</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: any) => {
            const gain = p.salePrice - p.costPrice

            return (
              <tr key={p.id} className="border-t">

                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.variant}</td>
                <td className="p-2">${p.costPrice}</td>

                <td className="p-2 text-primary font-bold">
                  ${p.salePrice}
                </td>

                <td className="p-2 text-green-600">
                  ${gain}
                </td>

                <td className="p-2">{p.stock}</td>

                <td className="p-2 space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-blue-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}