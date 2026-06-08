import { useNavigate } from "react-router-dom";

export default function CustomerList({ customers, onDelete }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Teléfono</th>
            <th className="p-2 text-left">Saldo</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c: any) => (
            <tr key={c.id} className="border-b">
              <td
                className="p-2 text-blue-600 cursor-pointer"
                onClick={() => navigate(`/admin/customers/${c.id}`)}
              >
                {c.name}
              </td>

              <td className="p-2">{c.phone}</td>

              <td className="p-2">${c.balance}</td>

              <td className="p-2">
                <button onClick={() => onDelete(c.id)} className="text-red-500">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
