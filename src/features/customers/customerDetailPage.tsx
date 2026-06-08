import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCustomerById,
  updateCustomerBalance,
} from "../../services/customerService";
import {
  createMovement,
  getCustomerMovements,
} from "../../services/customerMovementService";

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [movements, setMovements] = useState<any[]>([]);
  const [mode, setMode] = useState<"debt" | "payment">("debt");

  const loadMovements = async () => {
    if (!id) return;

    const data = await getCustomerMovements(id);
    setMovements(data);
  };

  useEffect(() => {
    if (!id) return;

    getCustomerById(id).then(setCustomer);
    loadMovements();
  }, [id]);

  const handleDebt = async () => {
    if (!id || !amount) return;

    await createMovement({
      customerId: id,
      type: "debt",
      description,
      amount,
      createdAt: Date.now(),
    });

    const newBalance = customer.balance + amount;

    await updateCustomerBalance(id, newBalance);

    setCustomer({
      ...customer,
      balance: newBalance,
    });

    setDescription("");
    setAmount(0);

    loadMovements();

    alert("Deuda registrada");
  };

  const handlePayment = async () => {
    if (!id || !amount) return;

    await createMovement({
      customerId: id,
      type: "payment",
      description: description || "Pago",
      amount,
      createdAt: Date.now(),
    });

    const newBalance = customer.balance - amount;

    await updateCustomerBalance(id, newBalance);

    setCustomer({
      ...customer,
      balance: newBalance,
    });

    setDescription("");
    setAmount(0);

    loadMovements();

    alert("Pago registrado");
  };

  if (!customer) {
    return <div className="bg-white p-4 rounded shadow">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* DATOS CLIENTE */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{customer.name}</h2>

        <p className="text-gray-500 mt-2">Teléfono: {customer.phone || "-"}</p>

        <p className="text-xl font-bold text-green-600 mt-4">
          Saldo actual: ${customer.balance}
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode("debt")}
          className={`px-4 py-2 rounded text-white ${
            mode === "debt" ? "bg-red-500" : "bg-gray-400"
          }`}
        >
          Registrar deuda
        </button>

        <button
          onClick={() => setMode("payment")}
          className={`px-4 py-2 rounded text-white ${
            mode === "payment" ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          Registrar pago
        </button>
      </div>

      {/* FORMULARIO DEUDA */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h3 className="font-bold">
          {mode === "debt" ? "Registrar deuda" : "Registrar pago"}
        </h3>

        <input
          className="border p-2 w-full"
          placeholder="Detalle"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button
          onClick={mode === "debt" ? handleDebt : handlePayment}
          className={`text-white px-4 py-2 rounded ${
            mode === "debt" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {mode === "debt" ? "Guardar deuda" : "Guardar pago"}
        </button>
      </div>

      {/* HISTORIAL */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Historial</h3>

        {movements.length === 0 ? (
          <p className="text-gray-500">Sin movimientos</p>
        ) : (
          <div className="space-y-3">
            {movements.map((m) => (
              <div key={m.id} className="border-b pb-2">
                <p className="font-medium">{m.description}</p>

                <p className="text-sm text-gray-500">
                  {m.type === "debt" ? "Deuda" : "Pago"}
                </p>

                <p className="font-bold">${m.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
