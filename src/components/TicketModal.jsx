export default function TicketModal({ open, onClose, ticket }) {
  if (!open || !ticket) return null;

  const printTicket = () => {
    const win = window.open("", "_blank", "width=480,height=640");
    const styles = `
      <style>
        * { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .ticket { max-width: 420px; margin: 0 auto; padding: 16px; }
        .title { font-weight: 700; font-size: 18px; margin-bottom: 8px; }
        .row { display: flex; justify-content: space-between; margin: 6px 0; }
        .muted { color: #6b7280; }
        .code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        hr { border: none; border-top: 1px dashed #e5e7eb; margin: 12px 0; }
        .footer { margin-top: 12px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    `;
    const html = `
      <div class="ticket">
        <div class="title">Ticket de Recarga</div>
        <div class="row"><span class="muted">Fecha:</span><span>${new Date(ticket.createdAt ?? Date.now()).toLocaleString()}</span></div>
        <div class="row"><span class="muted">Proveedor:</span><span>${ticket.supplierId ?? "-"}</span></div>
        <div class="row"><span class="muted">Celular:</span><span>${ticket.cellPhone ?? "-"}</span></div>
        <div class="row"><span class="muted">Valor:</span><span>$${Number(ticket.value ?? 0).toLocaleString()}</span></div>
        <div class="row"><span class="muted">Estado:</span><span>${ticket.status ?? "-"}</span></div>
        <hr/>
        <div class="row"><span class="muted">Transacción:</span><span class="code">${ticket.transactionalId ?? ticket.id ?? "-"}</span></div>
        ${ticket.transactionMessage ? `<div class="row"><span class="muted">Mensaje:</span><span>${ticket.transactionMessage}</span></div>` : ""}
        <div class="footer">Gracias por su compra</div>
      </div>
    `;
    win.document.write(`<html><head><title>Ticket</title>${styles}</head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ticket de transacción</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">✕</button>
        </div>

        <div className="space-y-2">
          <Item label="Fecha" value={new Date(ticket.createdAt ?? Date.now()).toLocaleString()} />
          <Item label="Proveedor" value={ticket.supplierId ?? "-"} />
          <Item label="Celular" value={ticket.cellPhone ?? "-"} />
          <Item label="Valor" value={`$${Number(ticket.value ?? 0).toLocaleString()}`} />
          <Item label="Estado" value={ticket.status ?? "-"} />
          <hr className="my-3" />
          <Item label="Transacción" value={ticket.transactionalId ?? ticket.id ?? "-"} mono />
          {ticket.transactionMessage ? <Item label="Mensaje" value={ticket.transactionMessage} /> : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={printTicket} className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            Imprimir
          </button>
          <button onClick={onClose} className="rounded-xl border px-4 py-2 hover:bg-gray-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function Item({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</span>
    </div>
  );
}
