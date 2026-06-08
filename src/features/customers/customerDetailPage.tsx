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

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const loadData = async () => {
    if (!id) return;

    const [c, m] = await Promise.all([
      getCustomerById(id),
      getCustomerMovements(id),
    ]);

    setCustomer(c);
    setMovements(m);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handlePayment = async () => {
    if (!id || !amount || !customer) return;

    await createMovement({
      customerId: id,
      type: "payment",
      description: description || "Pago",
      amount,
      createdAt: Date.now(),
    });

    const newBalance = customer.balance - amount;

    await updateCustomerBalance(id, newBalance);

    setCustomer({ ...customer, balance: newBalance });

    setAmount(0);
    setDescription("");
    loadData();
  };

  if (!customer) {
    return <div className="bg-white p-4 rounded shadow">Cargando...</div>;
  }

  const handleClearMovements = async () => {
    if (!id) return;
    if (!confirm("¿Borrar todo el historial de este cliente?")) return;

    const data = await getCustomerMovements(id);

    await Promise.all(
      data.map((m: any) => deleteDoc(doc(db, "customerMovements", m.id))),
    );

    loadData();
  };

  const handleResetBalance = async () => {
    if (!id || !customer) return;

    const adjustment = -customer.balance; // deja en 0

    await createMovement({
      customerId: id,
      type: "adjustment",
      description: "Ajuste de cuenta",
      amount: adjustment,
      createdAt: Date.now(),
    });

    await updateCustomerBalance(id, 0);

    setCustomer({
      ...customer,
      balance: 0,
    });

    loadData();
  };

  return (
    <div className="space-y-6">
      {/* DATOS CLIENTE */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{customer.name}</h2>
        <p className="text-gray-500 mt-2">{customer.phone || "-"}</p>

        <p
          className={`text-xl font-bold mt-4 ${
            customer.balance > 0
              ? "text-red-600"
              : customer.balance < 0
                ? "text-green-600"
                : "text-gray-700"
          }`}
        >
          {customer.balance > 0 && `Debe: $${customer.balance}`}
          {customer.balance < 0 && `A favor: $${Math.abs(customer.balance)}`}
          {customer.balance === 0 && "Saldo al día: $0"}
        </p>

        <button
          onClick={handleResetBalance}
          className="mt-3 bg-gray-700 text-white px-3 py-1 rounded"
        >
          Ajustar a cero
        </button>
      </div>

      {/* FORM SOLO PAGO */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h3 className="font-bold">Registrar pago</h3>

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
          onClick={handlePayment}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar pago
        </button>
      </div>

      {/* HISTORIAL */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-4">Historial</h3>

        <button
          onClick={handleClearMovements}
          className="text-xs bg-red-500 text-white px-3 py-1 rounded"
        >
          Limpiar historial
        </button>

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
