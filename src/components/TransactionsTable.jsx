import { useEffect, useMemo, useState } from "react";
import { getTransaction, listTransactions, softDeleteTransaction } from "../api/transactions";
import TicketModal from "./TicketModal";

export default function TransactionsTable() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null); // Page<Transaction>
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState("");

  const load = async (p = page) => {
    setLoading(true);
    setError("");
    try {
      const res = await listTransactions({ page: p, size: 7 });
      setData(res);
    } catch (e) {
      setError(e.message || "Error cargando transacciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); }, []);
  useEffect(() => { load(page); /* eslint-disable-next-line */ }, [page]);

  const filtered = useMemo(() => {
    if (!data?.content) return [];
    if (!q.trim()) return data.content;
    const qq = q.trim().toLowerCase();
    return data.content.filter(t =>
      String(t.supplierId ?? "").toLowerCase().includes(qq) ||
      String(t.cellPhone ?? "").toLowerCase().includes(qq)
    );
  }, [data, q]);

  const openTicket = async (t) => {
    try {
      // Trae más campos (transactionMessage, raw_response, etc.)
      const full = await getTransaction(t.id);
      setTicketData({
        id: full.id,
        supplierId: full.supplierId,
        cellPhone: full.cellPhone,
        value: full.value,
        status: full.status,
        transactionalId: full.transactionalId,
        transactionMessage: full.transactionMessage,
        createdAt: full.createdAt,
      });
      setTicketOpen(true);
    } catch (e) {
      // Si falla el detalle, abrimos con lo que hay
      setTicketData(t);
      setTicketOpen(true);
    }
  };

  const removeItem = async (t) => {
    if (!confirm("¿Ocultar esta transacción?")) return;
    try {
      await softDeleteTransaction(t.id);
      // Si estábamos en la última página y quedó vacía, retrocedemos
      const remaining = (data?.content?.length ?? 1) - 1;
      if (remaining <= 0 && page > 0) setPage((p) => Math.max(0, p - 1));
      else load(page);
    } catch (e) {
      alert(e.message || "No se pudo ocultar");
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold">Transacciones</h3>
        <input
          className="w-full max-w-xs rounded-xl border border-gray-300 p-2 outline-none focus:ring"
          placeholder="Buscar por proveedor o celular…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3">Fecha</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Celular</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4 text-center" colSpan={6}>Cargando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-4 text-center" colSpan={6}>Sin resultados</td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="p-3">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="p-3">{t.supplierId}</td>
                  <td className="p-3">{t.cellPhone}</td>
                  <td className="p-3">${Number(t.value ?? 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      t.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700" :
                      t.status === "FAILED" ? "bg-red-50 text-red-700" :
                      "bg-gray-50 text-gray-700"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openTicket(t)}
                        className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                        title="Ver ticket"
                      >
                        Ticket
                      </button>
                      <button
                        onClick={() => removeItem(t)}
                        className="rounded-lg border px-3 py-1 text-red-600 hover:bg-red-50"
                        title="Ocultar"
                      >
                        Ocultar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Página {page + 1} de {data ? data.totalPages : 1} — {data ? data.totalElements : 0} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page <= 0 || loading}
            className="rounded-xl border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => (data && p < data.totalPages - 1 ? p + 1 : p))}
            disabled={!data || page >= data.totalPages - 1 || loading}
            className="rounded-xl border px-3 py-1 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      <TicketModal open={ticketOpen} onClose={() => setTicketOpen(false)} ticket={ticketData} />
    </div>
  );
}
