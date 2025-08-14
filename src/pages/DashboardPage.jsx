// src/pages/DashboardPage.jsx
import { useEffect, useRef, useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import TransactionModal from "../components/TransactionModal";
import TicketModal from "../components/TicketModal";

export default function DashboardPage() {
  const [openNew, setOpenNew] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  // Truco simple para refrescar la tabla desde aquí: forzamos remount con una key
  const [tableKey, setTableKey] = useState(0);
  const refreshTable = () => setTableKey((k) => k + 1);

  const onCreated = (ctx) => {
    // ctx?.ticket existe sólo si vino de /api/buy (SUCCESS).
    refreshTable();
    if (ctx?.ticket) {
      setTicketData(ctx.ticket);
      setTicketOpen(true);
    }
  };

  // Guard de login (si no hay token, a /login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Panel administrativo</h1>
          <p className="text-sm text-gray-500">Gestión de recargas y transacciones</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenNew(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Agregar nueva transacción
          </button>
        </div>
      </div>

      <TransactionsTable key={tableKey} />

      <TransactionModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        onCreated={onCreated}
      />

      <TicketModal open={ticketOpen} onClose={() => setTicketOpen(false)} ticket={ticketData} />
    </div>
  );
}
